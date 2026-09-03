import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import PortfolioDashboard from 'views/index-page/PortfolioDashboard';
import PortfolioSummary from 'views/index-page/PortfolioSummary';
import CryptoPortfolioCard from 'views/index-page/CryptoPortfolioCard';
import { useDataSource } from 'store/DataSourceContext';

const PortfolioPage = () => {
    const [history, setHistory] = useState([]);
    const [initialPortfolio, setInitialPortfolio] = useState(null);
    const { source, isCrypto, apiUrl } = useDataSource();

    // Crypto has no daily portfolio (frosk.buildportfolio=false) — its positions
    // live in the intraday portfolio built by the 15m pipeline. Equity uses the
    // daily portfolio. Pick the matching endpoints per data source.
    useEffect(() => {
        setHistory([]);
        setInitialPortfolio(null);

        const historyPath = isCrypto ? '/portfolio/intraday/history' : '/portfolio/history';
        fetch(apiUrl(historyPath))
            .then((res) => (res.ok ? res.json() : []))
            .then((items) => {
                const list = Array.isArray(items) ? items : [];
                // Equity: hide empty snapshots. Intraday positions close within
                // hours, so crypto snapshots are kept even with 0 open positions
                // (their value is in realized day-PnL).
                setHistory(isCrypto ? list : list.filter((h) => h.openPositionCount > 0));
            })
            .catch(() => setHistory([]));

        if (isCrypto) {
            fetch(apiUrl('/portfolio/intraday'))
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => setInitialPortfolio(data && data.positions ? data : null))
                .catch(() => setInitialPortfolio(null));
        }
    }, [source, isCrypto, apiUrl]);

    return (
        <Grid container spacing={gridSpacing}>
            {isCrypto && (
                <Grid item xs={12}>
                    <CryptoPortfolioCard />
                </Grid>
            )}
            <Grid item xs={12}>
                <PortfolioDashboard
                    key={source}
                    history={history}
                    initialPortfolio={initialPortfolio}
                    basePath={isCrypto ? '/portfolio/intraday' : '/portfolio'}
                />
            </Grid>
            <Grid item xs={12}>
                <PortfolioSummary history={history} />
            </Grid>
        </Grid>
    );
};

export default PortfolioPage;
