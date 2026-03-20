import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { Container } from '../../ui-component/frosk/cards/Container';
import TotalGrowthRadialChart from 'views/dashboard/Default/TotalGrowthRadialChart';
import config from 'config';
import HedgeIndexDashboard from 'views/dashboard/Default/HedgeIndexDashboard';

const IndexPage = () => {
    const [isLoading, setLoading] = useState(true);

    return (
        <Grid container spacing={gridSpacing}>

             <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        VIX Strong Buy
                        <TotalGrowthRadialChart isLoading={isLoading} value={78}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        DJI Strong Sell
                        <TotalGrowthRadialChart isLoading={isLoading} value={23}/>
                    </Grid>
                 </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <HedgeIndexDashboard />
                    </Grid>
                </Grid>
            </Grid> 
   
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Container securityName='^VIX'  initSelectedStrategy='VIXStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^GSPC' initSelectedStrategy='SP500Strategy' disableStrategySelect={false}/>
                    </Grid>
                 </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^IXIC' initSelectedStrategy='NasdaqVsSPStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^DJI' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='CL=F' initSelectedStrategy='CrudeOilStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='BZ=F' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Container securityName='GC=F' initSelectedStrategy='GoldStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='BZ=F' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
};

export default IndexPage;
