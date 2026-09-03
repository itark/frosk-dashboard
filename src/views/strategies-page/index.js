// material-ui
import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid, Tooltip } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import StrategiesCard from './StrategiesCard';
import { useDataSource } from 'store/DataSourceContext';
import MainCard from 'ui-component/cards/MainCard';

const StrategiesPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [longtrades, setLongtrades] = useState([]);
    const [featuredStrategies, setFeaturedStrategies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { source, apiUrl } = useDataSource();

    useEffect(() => {
        fetch(apiUrl("/featuredStrategies"))
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
    }, [source, apiUrl])


    return (
            <MainCard>
                <Grid item>
                    {featuredStrategies ? <StrategiesCard featuredStrategies={featuredStrategies}></StrategiesCard>: null}
                </Grid>
            </MainCard>
    );


};

export default StrategiesPage;
