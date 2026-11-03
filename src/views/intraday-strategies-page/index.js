import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import ActiveSignalsCard from './ActiveSignalsCard';
import TopIntradayStrategiesCard from './TopIntradayStrategiesCard';
import IntradayPortfolioCard from './IntradayPortfolioCard';
import DailyPnlCard from './DailyPnlCard';
import CryptoPaperAccountCard from 'views/index-page/CryptoPaperAccountCard';
import BtcTrendSignalCard from './BtcTrendSignalCard';
import { useDataSource } from 'store/DataSourceContext';

const IntradayStrategiesPage = () => {
    const { isCrypto, source } = useDataSource();

    return (
        <Grid container spacing={gridSpacing}>
            {source === 'crypto' && (
                <Grid item xs={12}>
                    <BtcTrendSignalCard />
                </Grid>
            )}
            {isCrypto && (
                <Grid item xs={12}>
                    <CryptoPaperAccountCard />
                </Grid>
            )}
            <Grid item xs={12}>
                <ActiveSignalsCard />
            </Grid>
            {/* TodaySignalsCard disabled 2026-09-17 — overlapped with the "Stängda
                round-trips idag" table already nested inside DailyPnlCard below. */}
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
