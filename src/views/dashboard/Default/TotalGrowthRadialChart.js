import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// third-party
import ReactApexChart from 'react-apexcharts';

// const status = [
//     { value: 'today', label: 'Today' },
//     { value: 'month', label: 'This Month' },
//     { value: 'year', label: 'This Year' }
// ];

const TotalGrowthRadialChart = ({ isLoading, value}) => {
    //const [value, setValue] = useState('today');
    //const [seriesValue, setSeriesValue] = useState(76); // example value
    const [seriesValue, setSeriesValue] = useState(value); // example value
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { primary } = theme.palette.text;
    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;

    const chartOptions = {
        chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: { enabled: true }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    strokeWidth: '97%',
                    margin: 5,
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        color: '#444',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        offsetY: -2,
                        fontSize: '22px',
                        color: primaryDark
                    }
                }
            }
        },
        grid: {
            padding: { top: -10 }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        },
        labels: ['Average Results']
    };

    return (
        <>
            {isLoading ? (
                null
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        {/* <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Technical indication</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">${seriesValue}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-period"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid> 
                        </Grid> */}

                        <Grid item xs={12}>
                            <ReactApexChart options={chartOptions} series={[seriesValue]} type="radialBar" height={350} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthRadialChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthRadialChart;
