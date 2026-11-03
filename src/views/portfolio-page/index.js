import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import PortfolioDashboard from 'views/index-page/PortfolioDashboard';
import PortfolioSummary from 'views/index-page/PortfolioSummary';
import CryptoPortfolioCard from 'views/index-page/CryptoPortfolioCard';
import { useDataSource } from 'store/DataSourceContext';

// Crypto has no daily portfolio (frosk.buildportfolio=false) — its positions
// live in the intraday portfolio, which the Intraday page already shows in
// full (IntradayPortfolioCard, same /portfolio/intraday* endpoints). Rendering
// PortfolioDashboard/PortfolioSummary here too for crypto would just duplicate
// that page, so this page shows CryptoPortfolioCard (the live, all-strategies
// view) for crypto, and the daily PortfolioDashboard/PortfolioSummary for
// equity, which is genuinely different data (the daily book, not intraday).
const PortfolioPage = () => {
    const [history, setHistory] = useState([]);
    const { source, isCrypto, apiUrl } = useDataSource();

    useEffect(() => {
        if (isCrypto) {
            setHistory([]);
            return;
        }
        fetch(apiUrl('/portfolio/history'))
            .then((res) => (res.ok ? res.json() : []))
            .then((items) => {
                const list = Array.isArray(items) ? items : [];
                setHistory(list.filter((h) => h.openPositionCount > 0));
            })
            .catch(() => setHistory([]));
    }, [source, isCrypto, apiUrl]);

    return (
        <Grid container spacing={gridSpacing}>
            {isCrypto ? (
                <Grid item xs={12}>
                    <CryptoPortfolioCard />
                </Grid>
            ) : (
                <>
                    <Grid item xs={12}>
                        <PortfolioDashboard key={source} history={history} />
                    </Grid>
                    <Grid item xs={12}>
                        <PortfolioSummary history={history} />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default PortfolioPage;
