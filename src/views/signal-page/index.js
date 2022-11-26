// material-ui
import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import SignalsCard from './SignalsCard';
import config from 'config';

const SignalPage = () => {
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
                console.log('featuredStrategies',featuredStrategies)
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
                    {featuredStrategies ? <SignalsCard featuredStrategies={featuredStrategies}></SignalsCard>: null}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SignalPage;
