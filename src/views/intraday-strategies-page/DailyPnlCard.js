import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import PreRegistrationBadge from '../../ui-component/frosk/PreRegistrationBadge';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

function aggregateByDay(tickers) {
    const dayMap = {};
    for (const ticker of tickers) {
        for (const trade of ticker.trades || []) {
            const date = (trade.sellTime || '').split(' ')[0];
            if (!date) continue;
            if (!dayMap[date]) {
                dayMap[date] = { date, trades: 0, wins: 0, losses: 0, pnl: 0, hasPending: false };
            }
            dayMap[date].trades += 1;
            dayMap[date].pnl += trade.pnlPercent;
            if (trade.pnlPercent > 0) dayMap[date].wins += 1;
            else if (trade.pnlPercent < 0) dayMap[date].losses += 1;
            if (ticker.preRegistrationPending) dayMap[date].hasPending = true;
        }
    }
    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
}

const DailyPnlCard = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [paper, setPaper] = useState(null);
    const { source, apiUrl } = useDataSource();

    useEffect(() => {
        fetch(apiUrl('/intraday/pnl'))
            .then((res) => {
                if (!res.ok) return [];
                return res.json();
            })
            .then((items) => setData(Array.isArray(items) ? items : []))
            .catch(() => setData([]));
    }, [source, apiUrl]);

    // Coinbase: what the paper account actually traded (EUR, net of fees, sized positions).
    // /intraday/pnl sums the percentage of every signal with equal weight, which ignores
    // position sizing and the signals the paper engine skipped, and so overstates both
    // gains and losses. Any other source, or an unreachable endpoint, keeps the signal view.
    useEffect(() => {
        if (source !== 'crypto') {
            setPaper(null);
            return;
        }
        fetch(apiUrl('/crypto/paper-daily-pnl?days=365'))
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => setPaper(json && Array.isArray(json.days) ? json : null))
            .catch(() => setPaper(null));
    }, [source, apiUrl]);

    const paperMode = paper !== null && paper.days.length > 0;
    const unit = paperMode ? ' €' : '%';
    const fmtVal = (val, digits) => val.toFixed(digits) + unit;

    const daily = useMemo(
        () =>
            paperMode
                ? paper.days.map((d) => ({
                      date: d.date,
                      trades: d.trades,
                      wins: d.wins,
                      losses: d.losses,
                      pnl: Number(d.pnlEur),
                      pctOfCapital: d.pnlPctOfCapital != null ? Number(d.pnlPctOfCapital) : null,
                      avgTradePct: d.avgTradePct != null ? Number(d.avgTradePct) : null,
                      hasPending: false
                  }))
                : aggregateByDay(data),
        [data, paper, paperMode]
    );

    const cumulative = useMemo(() => {
        let sum = 0;
        return daily.map((d) => {
            sum += d.pnl;
            return { ...d, cumPnl: sum };
        });
    }, [daily]);

    const totalPnl = cumulative.length > 0 ? cumulative[cumulative.length - 1].cumPnl : 0;
    const totalPctOfCapital = paperMode && paper.windowPnlPctOfCapital != null ? Number(paper.windowPnlPctOfCapital) : null;
    const winDays = daily.filter((d) => d.pnl > 0).length;
    const lossDays = daily.filter((d) => d.pnl < 0).length;
    const anyPending = daily.some((d) => d.hasPending);

    const series = [
        {
            name: paperMode ? 'Daily P&L €' : 'Daily P&L %',
            type: 'bar',
            data: cumulative.map((d) => ({ x: d.date, y: parseFloat(d.pnl.toFixed(2)) }))
        },
        {
            name: paperMode ? 'Cumulative P&L €' : 'Cumulative P&L %',
            type: 'line',
            data: cumulative.map((d) => ({ x: d.date, y: parseFloat(d.cumPnl.toFixed(2)) }))
        }
    ];

    const chartOptions = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            background: 'transparent'
        },
        theme: { mode: 'dark' },
        stroke: {
            width: [0, 3],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [
                        { from: -100000, to: -0.001, color: theme.palette.error.main },
                        { from: -0.001, to: 100000, color: theme.palette.success.main }
                    ]
                }
            }
        },
        colors: [undefined, '#fff'],
        xaxis: {
            type: 'category',
            labels: {
                style: { colors: theme.palette.primary.light },
                rotate: -45,
                rotateAlways: daily.length > 7
            }
        },
        yaxis: [
            {
                title: { text: paperMode ? 'Daily P&L €' : 'Daily P&L %', style: { color: '#fff' } },
                labels: {
                    style: { colors: '#fff' },
                    formatter: (val) => fmtVal(val, 1)
                }
            },
            {
                opposite: true,
                title: { text: paperMode ? 'Cumulative €' : 'Cumulative %', style: { color: theme.palette.primary[200] } },
                labels: {
                    style: { colors: theme.palette.primary[200] },
                    formatter: (val) => fmtVal(val, 1)
                }
            }
        ],
        tooltip: {
            theme: 'dark',
            shared: true,
            y: {
                formatter: (val) => fmtVal(val, 2)
            }
        },
        grid: {
            borderColor: theme.palette.primary[800],
            strokeDashArray: 4
        },
        legend: {
            labels: { colors: '#fff' },
            position: 'top'
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                size: 15,
                Cell: ({ cell, row }) => (
                    <>
                        {cell.getValue()}
                        {row.original.hasPending && <PreRegistrationBadge />}
                    </>
                ),
            },
            {
                accessorKey: 'trades',
                header: 'Trades',
                size: 10,
            },
            {
                accessorKey: 'wins',
                header: 'Wins',
                size: 10,
            },
            {
                accessorKey: 'losses',
                header: 'Losses',
                size: 10,
            },
            {
                accessorKey: 'pnl',
                header: paperMode ? 'P&L €' : 'P&L %',
                size: 10,
                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: cell.getValue() >= 0 ? theme.palette.success.main : theme.palette.error.main
                        }}
                    >
                        {cell.getValue() >= 0 ? '+' : ''}{cell.getValue().toFixed(2)}{unit}
                    </Typography>
                ),
            },
            ...(paperMode
                ? [
                      {
                          accessorKey: 'pctOfCapital',
                          header: '% of capital',
                          size: 10,
                          Cell: ({ cell }) => {
                              const v = cell.getValue();
                              return v == null ? '-' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
                          },
                      },
                      {
                          accessorKey: 'avgTradePct',
                          header: 'Avg trade %',
                          size: 10,
                          Cell: ({ cell }) => {
                              const v = cell.getValue();
                              return v == null ? '-' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
                          },
                      },
                  ]
                : []),
        ],
        [theme.palette.success.main, theme.palette.error.main, paperMode, unit],
    );

    const table = useMaterialReactTable({
        columns,
        data: daily,
        enableTopToolbar: false,
        initialState: {
            density: 'compact',
            sorting: [{ id: 'date', desc: true }],
        },
    });

    if (data.length === 0 && !paperMode) return null;

    return (
        <MainCard>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor: theme.palette.primary[800],
                                        color: '#fff'
                                    }}
                                >
                                    <BarChartTwoToneIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        Daily P&L
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {paperMode
                                            ? `Paper account, net of fees (${daily.length} trading days)`
                                            : `Signal results per day, not real P&L (${daily.length} trading days)`}
                                    </Typography>
                                }
                            />
                            <Box display="flex" gap={3} alignItems="center">
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>
                                        Total P&L{anyPending && <PreRegistrationBadge />}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{ color: totalPnl >= 0 ? theme.palette.success.light : theme.palette.error.light }}
                                    >
                                        {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}{unit}
                                    </Typography>
                                    {totalPctOfCapital !== null && (
                                        <Typography variant="caption" sx={{ color: 'primary.light' }}>
                                            {totalPctOfCapital >= 0 ? '+' : ''}{totalPctOfCapital.toFixed(2)}% of capital
                                        </Typography>
                                    )}
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>Win days</Typography>
                                    <Typography variant="h4" sx={{ color: theme.palette.success.light }}>{winDays}</Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>Loss days</Typography>
                                    <Typography variant="h4" sx={{ color: theme.palette.error.light }}>{lossDays}</Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    </List>
                </Box>

                <Box sx={{ px: 1, pb: 1 }}>
                    <Chart options={chartOptions} series={series} type="line" height={300} />
                </Box>
            </CardWrapper>

            {/* "Stängda round-trips idag" disabled 2026-09-17 — overlapped with
                Today's Signals (also since removed) and pushed this table, the
                one that actually belongs directly under the graph, further down. */}
            <Grid item sx={{ mt: 2 }}>
                <MaterialReactTable table={table} />
            </Grid>
        </MainCard>
    );
};

export default DailyPnlCard;
