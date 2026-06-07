import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import config from 'config';
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
                dayMap[date] = { date, trades: 0, wins: 0, losses: 0, pnl: 0 };
            }
            dayMap[date].trades += 1;
            dayMap[date].pnl += trade.pnlPercent;
            if (trade.pnlPercent > 0) dayMap[date].wins += 1;
            else if (trade.pnlPercent < 0) dayMap[date].losses += 1;
        }
    }
    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
}

const DailyPnlCard = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(config.baseApi + '/intraday/pnl')
            .then((res) => {
                if (!res.ok) return [];
                return res.json();
            })
            .then((items) => setData(Array.isArray(items) ? items : []))
            .catch(() => setData([]));
    }, []);

    const daily = useMemo(() => aggregateByDay(data), [data]);

    const cumulative = useMemo(() => {
        let sum = 0;
        return daily.map((d) => {
            sum += d.pnl;
            return { ...d, cumPnl: sum };
        });
    }, [daily]);

    const totalPnl = cumulative.length > 0 ? cumulative[cumulative.length - 1].cumPnl : 0;
    const winDays = daily.filter((d) => d.pnl > 0).length;
    const lossDays = daily.filter((d) => d.pnl < 0).length;

    const series = [
        {
            name: 'Daily P&L %',
            type: 'bar',
            data: cumulative.map((d) => ({ x: d.date, y: parseFloat(d.pnl.toFixed(2)) }))
        },
        {
            name: 'Cumulative P&L %',
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
                title: { text: 'Daily P&L %', style: { color: '#fff' } },
                labels: {
                    style: { colors: '#fff' },
                    formatter: (val) => val.toFixed(1) + '%'
                }
            },
            {
                opposite: true,
                title: { text: 'Cumulative %', style: { color: theme.palette.primary[200] } },
                labels: {
                    style: { colors: theme.palette.primary[200] },
                    formatter: (val) => val.toFixed(1) + '%'
                }
            }
        ],
        tooltip: {
            theme: 'dark',
            shared: true,
            y: {
                formatter: (val) => val.toFixed(2) + '%'
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
                header: 'P&L %',
                size: 10,
                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: cell.getValue() >= 0 ? theme.palette.success.main : theme.palette.error.main
                        }}
                    >
                        {cell.getValue() >= 0 ? '+' : ''}{cell.getValue().toFixed(2)}%
                    </Typography>
                ),
            },
        ],
        [theme.palette.success.main, theme.palette.error.main],
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

    if (data.length === 0) return null;

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
                                        Signal results per day ({daily.length} trading days)
                                    </Typography>
                                }
                            />
                            <Box display="flex" gap={3} alignItems="center">
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>Total P&L</Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{ color: totalPnl >= 0 ? theme.palette.success.light : theme.palette.error.light }}
                                    >
                                        {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}%
                                    </Typography>
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

            <Grid item>
                <MaterialReactTable table={table} />
            </Grid>
        </MainCard>
    );
};

export default DailyPnlCard;
