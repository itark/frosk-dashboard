import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import config from 'config';
import PortfolioDashboard from 'views/index-page/PortfolioDashboard';
import PortfolioSummary from 'views/index-page/PortfolioSummary';

const IntradayPortfolioCard = () => {
    const [history, setHistory] = useState([]);
    const [portfolio, setPortfolio] = useState(null);

    useEffect(() => {
        fetch(config.baseApi + '/portfolio/intraday/history')
            .then((res) => {
                if (!res.ok) return [];
                return res.json();
            })
            .then((items) => {
                setHistory(Array.isArray(items) ? items : []);
            })
            .catch(() => setHistory([]));

        fetch(config.baseApi + '/portfolio/intraday')
            .then((res) => {
                if (!res.ok) return null;
                return res.json();
            })
            .then((data) => {
                if (data && data.positions) setPortfolio(data);
            })
            .catch(() => {});
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <PortfolioDashboard history={history} initialPortfolio={portfolio} />
            </Grid>
            <Grid item xs={12}>
                <PortfolioSummary history={history} />
            </Grid>
        </Grid>
    );
};

export default IntradayPortfolioCard;
