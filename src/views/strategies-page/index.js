// material-ui
import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid, Tooltip } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import StrategiesCard from './StrategiesCard';
import config from 'config';
import MainCard from 'ui-component/cards/MainCard';

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
                //console.log('response',response);
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
            <MainCard>
                <Grid item>
                    {featuredStrategies ? <StrategiesCard featuredStrategies={featuredStrategies}></StrategiesCard>: null}
                </Grid>
            </MainCard>
    );


};

export default StrategiesPage;
