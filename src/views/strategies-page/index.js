// material-ui
import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid, Tooltip } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import StrategiesCard from './StrategiesCard';
import config from 'config';

const StrategiesPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [longtrades, setLongtrades] = useState([]);
    const [featuredStrategies, setFeaturedStrategies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch(config.baseApi+"/featuredStrategies")
            .then(response => response.json())
            .then(
            (response) => {
                setIsLoaded(true);
                setLoading(false);
                setFeaturedStrategies(response);
            },
            (error) => {
                setIsLoaded(true);
                setLoading(false);
                setError(error);
            }
            )
    }, [])


    return (
        <Grid item>
            <Grid container spacing={gridSpacing}>
                <Grid item>
                    {featuredStrategies ? <StrategiesCard featuredStrategies={featuredStrategies}></StrategiesCard>: null}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default StrategiesPage;
