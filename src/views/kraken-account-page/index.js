import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import LiveKrakenAccountCard from './LiveKrakenAccountCard';
import CryptoPaperAccountCard from 'views/index-page/CryptoPaperAccountCard';
import StrategyLifecyclePanel from './StrategyLifecyclePanel';

const POLL_MS = 30_000;

/**
 * "Kraken Konto" — the real Kraken Futures account (left, GET
 * /kraken/live-account) next to the paper-trading simulation (right, the same
 * /crypto/paper-account the Intraday page's Paper Account card reads), so a
 * paper simulation that has drifted from what the exchange actually reports
 * is visible at a glance.
 *
 * Only reachable when the Kraken Futures source is selected — see
 * menu-items/other.js (`sources: ['kraken-futures']`) and NavGroup, which hide
 * the menu entry otherwise; MainRoutes.js registers the path unconditionally,
 * so this still renders if visited directly on another source, just against
 * whichever backend `apiUrl` resolves to for that source.
 *
 * `refreshKey` is bumped every 30s and handed to both columns so they refetch
 * together — polling from here (not inside each card) keeps the two accounts
 * in sync for an apples-to-apples comparison.
 *
 * Below them, StrategyLifecyclePanel (PAPER → SHADOW → LIVE promotion) polls on
 * its own 60s cadence — its data changes far slower than account balances.
 */
const KrakenAccountPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setRefreshKey((k) => k + 1), POLL_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={6}>
                <LiveKrakenAccountCard refreshKey={refreshKey} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <CryptoPaperAccountCard title="Paper trading (simulerat)" refreshKey={refreshKey} />
            </Grid>
            <Grid item xs={12}>
                <StrategyLifecyclePanel />
            </Grid>
        </Grid>
    );
};

export default KrakenAccountPage;
