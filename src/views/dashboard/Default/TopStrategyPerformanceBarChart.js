import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import {styled, useTheme } from '@mui/material/styles';
import { Box,Avatar, List, Grid,  ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import config from 'config';
import topData from './chart-data/top-chart';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';


const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));


// ==============================|| COPY FROM DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TopStrategyPerformanceBarChart = ({ isLoading }) => {
    const theme = useTheme();
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
                    <Grid item xs={12}>
                       <CardWrapper border={false} content={false}>         
      
                        {/* <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle1">Strategy Average Performance</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> */}

                        <Box sx={{ p: 2 }}>
                                <List sx={{ py: 0 }}>
                                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.warning.light,
                                                    color: theme.palette.warning.dark
                                                }}
                                            >
                                                <StorefrontTwoToneIcon fontSize="inherit" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={<Typography variant="h4">
                                                    Strategy Average Performance
                                                    </Typography>}
                                            secondary={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color: theme.palette.grey[500],
                                                        mt: 0.5
                                                    }}
                                                >
                                                   Average profit per available strategy.
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Box>

                        </CardWrapper>
                    </Grid>
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
