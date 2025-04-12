import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { Container } from '../../ui-component/frosk/cards/Container';

const IndexPage = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Container securityName='^VIX' securityDesc='CBOE Volatility Index' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^GSPC' securityDesc='S&P 500' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                 </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^IXIC' securityDesc='NASDAQ Composite' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='^DJI' securityDesc='Dow Jones Industrial Average' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='CL=F' securityDesc='Crude Oil' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='BZ=F' securityDesc='Brent Crude Oil' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Container securityName='GC=F' securityDesc='Gold' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid>
                    {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Container securityName='BZ=F' securityDesc='Brent Crude Oil' initSelectedStrategy='SimpleMovingMomentumStrategy' disableStrategySelect={false}/>
                    </Grid> */}
                </Grid>
            </Grid>



        </Grid>
    );
};

export default IndexPage;
