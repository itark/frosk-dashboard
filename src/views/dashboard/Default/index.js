import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

import StrategyPerformanceChartCard from './StrategyPerformanceChartCard';
import TopStrategyPerformanceBarChart from './TopStrategyPerformanceBarChart';
import TopStrategyPerformanceQualityBarChart from './TopStrategyPerformanceQualityBarChart';
import TopFeaturedStrategyCard from './TopFeaturedStrategyCard';
import OpenSmartSignalsCard from './OpenSmartSignalsCard';
import OpenSignalsCard from './OpenSignalsCard';
import { gridSpacing } from 'store/constant';

import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalTradingCard2 from './TotalTradingCard2';
import PopularCard from './PopularCard';
import ClosedSmartSignalsCard from './ClosedSmartSignalsCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ pt: '16px !important' }}>
                        <StrategyPerformanceChartCard />
                    </Grid>
                </Grid>
            </Grid> */}

            <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                        <TotalTradingCard2 isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                       <TopFeaturedStrategyCard isLoading={isLoading} />   
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                        <OpenSmartSignalsCard isLoading={isLoading} />
                    </Grid> 
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                        <ClosedSmartSignalsCard isLoading={isLoading} />
                    </Grid> 
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <OpenSignalsCard isLoading={isLoading} />
                    </Grid>   
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TopStrategyPerformanceBarChart isLoading={isLoading} />
                    </Grid>                    
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TopStrategyPerformanceQualityBarChart isLoading={isLoading} />
                    </Grid>                    
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
