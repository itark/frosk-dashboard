import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import config from 'config';
import topData from './chart-data/top-chart';

const status = [
    {
        value: 'today',
        label: 'Idag'
    },
    {
        value: 'month',
        label: 'Denna månad'
    },
    {
        value: 'year',
        label: 'Detta år'
    }
];


// ==============================|| COPY FROM DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TopStrategyPerformanceBarChart = ({ isLoading }) => {
    const [value, setValue] = useState('today');

    useEffect(() => {
        const data = [];
        fetch(config.baseApi+"/topStrategies")
        .then(response => response.json())
        .then((response) => {
                console.log('response',response)
                for (let i = 0; i < response.length; i++) {
                    data.push(  {
                      x: response[i].name,
                      y: response[i].totalProfit
                    })
                }  
                const newChartData = {
                    ...topData.options,
                    series: [{data}],
                }   
                ApexCharts.exec(`top-chart`, 'updateOptions', newChartData);
        })
    }, []);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    {/* <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Strategy Average Performance</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h3">2.05%</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-select-currency"
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
                        <Chart {...topData} />
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

TopStrategyPerformanceBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TopStrategyPerformanceBarChart;
