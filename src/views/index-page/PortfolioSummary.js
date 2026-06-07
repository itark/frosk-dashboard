import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

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

const PortfolioSummary = ({ history }) => {
    const theme = useTheme();

    if (!Array.isArray(history) || history.length === 0) return null;

    const sorted = [...history].reverse();
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const pnlChange = last.totalPnlPercent - first.totalPnlPercent;
    const posChange = last.openPositionCount - first.openPositionCount;

    const series = [
        {
            name: 'PnL %',
            type: 'area',
            data: sorted.map((h) => ({ x: h.snapshotDate, y: h.totalPnlPercent }))
        },
        {
            name: 'Positions',
            type: 'line',
            data: sorted.map((h) => ({ x: h.snapshotDate, y: h.openPositionCount }))
        }
    ];

    const options = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            background: 'transparent'
        },
        theme: { mode: 'dark' },
        stroke: {
            width: [2, 2],
            curve: 'smooth'
        },
        fill: {
            type: ['gradient', 'none'],
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1
            }
        },
        colors: ['#fff', theme.palette.primary[200]],
        xaxis: {
            type: 'category',
            labels: {
                style: { colors: theme.palette.primary.light },
                rotate: -45,
                rotateAlways: sorted.length > 5
            }
        },
        yaxis: [
            {
                title: { text: 'PnL %', style: { color: '#fff' } },
                labels: {
                    style: { colors: '#fff' },
                    formatter: (val) => val.toFixed(1) + '%'
                }
            },
            {
                opposite: true,
                title: { text: 'Positions', style: { color: theme.palette.primary[200] } },
                labels: {
                    style: { colors: theme.palette.primary[200] },
                    formatter: (val) => Math.round(val).toString()
                }
            }
        ],
        tooltip: {
            theme: 'dark',
            shared: true,
            y: {
                formatter: (val, { seriesIndex }) =>
                    seriesIndex === 0 ? val.toFixed(2) + '%' : Math.round(val) + ' positions'
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
                                    <TimelineOutlinedIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        Portfolio Progress
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {first.snapshotDate} — {last.snapshotDate} ({history.length} snapshots)
                                    </Typography>
                                }
                            />
                            <Box display="flex" gap={3} alignItems="center">
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>
                                        PnL change
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{ color: pnlChange >= 0 ? theme.palette.success.light : theme.palette.error.light }}
                                    >
                                        {pnlChange > 0 ? '+' : ''}{pnlChange.toFixed(2)}%
                                    </Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="caption" sx={{ color: 'primary.light' }}>
                                        Positions
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {posChange > 0 ? '+' : ''}{posChange}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    </List>
                </Box>

                <Box sx={{ px: 2, pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Start PnL</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>{first.totalPnlPercent.toFixed(2)}%</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Current PnL</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>{last.totalPnlPercent.toFixed(2)}%</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Peak PnL</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>
                                    {Math.max(...history.map((h) => h.totalPnlPercent)).toFixed(2)}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Low PnL</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>
                                    {Math.min(...history.map((h) => h.totalPnlPercent)).toFixed(2)}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Start pos.</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>{first.openPositionCount}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Box sx={{ backgroundColor: theme.palette.primary[800], borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'primary.light' }}>Current pos.</Typography>
                                <Typography variant="h4" sx={{ color: '#fff' }}>{last.openPositionCount}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ px: 1, pb: 1 }}>
                    <Chart options={options} series={series} type="line" height={300} />
                </Box>
            </CardWrapper>
        </MainCard>
    );
};

export default PortfolioSummary;
