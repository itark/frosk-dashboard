import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

//table
import { gridSpacing } from 'store/constant';
import SecuritiesCard from './SecuritiesCard';
import config from 'config';


const FroskPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [securities, setSecurities] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    
    useEffect(() => {
        fetch(config.baseApi+"/metadata")
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setLoading(false);
                setSecurities(result);
            },
            (error) => {
                setIsLoaded(true);
                setLoading(false);
                setError(error);

                console.error(error);
            }
            )
    }, [])

    return (
        <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
                <Grid item lg={12}  md={4} xs={10}>
                    {securities ? <SecuritiesCard securities={securities}></SecuritiesCard>: null}
                </Grid>
            </Grid>
        </Grid>
    );

};

export default FroskPage;
