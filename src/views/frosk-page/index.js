import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

//table
import { gridSpacing } from 'store/constant';
import SecuritiesCard from './SecuritiesCard';
import config from 'config';

const FroskPage = () => {
    const [securities, setSecurities] = useState([]);
    
    useEffect(() => {
        fetch(config.baseApi+"/metadata")
            .then(res => res.json())
            .then(
            (result) => {
                setSecurities(result);
            },
            (error) => {
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
