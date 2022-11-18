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
        fetch(config.baseApi+"/longtrades")
            .then(response => response.json())
            .then(
            (response) => {
                setIsLoaded(true);
                setLoading(false);
                setLongtrades(response);
            },
            (error) => {
                setIsLoaded(true);
                setLoading(false);
                setError(error);
            }
            )
    }, [])

    useEffect(() => {
        fetch(config.baseApi+"/featuredStrategies")
            .then(response => response.json())
            .then(
            (response) => {
                setIsLoaded(true);
                setLoading(false);
               // console.log('response',response)
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
        <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
                <Grid item lg={12}  md={4} xs={10}>
                    {longtrades ? <SignalsCard featuredStrategies={featuredStrategies}></SignalsCard>: null}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SignalPage;
