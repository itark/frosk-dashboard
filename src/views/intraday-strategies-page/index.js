import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import ActiveSignalsCard from './ActiveSignalsCard';
import TodaySignalsCard from './TodaySignalsCard';
import TopIntradayStrategiesCard from './TopIntradayStrategiesCard';
import IntradayPortfolioCard from './IntradayPortfolioCard';
import DailyPnlCard from './DailyPnlCard';
import CryptoPaperAccountCard from 'views/index-page/CryptoPaperAccountCard';
import { useDataSource } from 'store/DataSourceContext';

const IntradayStrategiesPage = () => {
    const { isCrypto } = useDataSource();

    return (
        <Grid container spacing={gridSpacing}>
            {isCrypto && (
                <Grid item xs={12}>
                    <CryptoPaperAccountCard />
                </Grid>
            )}
            <Grid item xs={12}>
                <ActiveSignalsCard />
            </Grid>
            <Grid item xs={12}>
                <TodaySignalsCard />
            </Grid>
            <Grid item xs={12}>
                <DailyPnlCard />
            </Grid>
            <Grid item xs={12}>
                <TopIntradayStrategiesCard />
            </Grid>
            <Grid item xs={12}>
                <IntradayPortfolioCard />
            </Grid>
        </Grid>
    );
};

export default IntradayStrategiesPage;
