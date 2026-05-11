import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import config from 'config';
import PortfolioDashboard from 'views/index-page/PortfolioDashboard';
import PortfolioSummary from 'views/index-page/PortfolioSummary';

const PortfolioPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch(config.baseApi + '/portfolio/history')
            .then((res) => res.json())
            .then((items) => {
                setHistory(items.filter((h) => h.openPositionCount > 0));
            });
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <PortfolioDashboard history={history} />
            </Grid>
            <Grid item xs={12}>
                <PortfolioSummary history={history} />
            </Grid>
        </Grid>
    );
};

export default PortfolioPage;
