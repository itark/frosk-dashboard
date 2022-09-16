import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

//table
import { gridSpacing } from 'store/constant';
import PopularCard from './PopularCard';
import SecuritiesCard from './SecuritiesCard';
import AdvancedTable from './AdvancedTable';
import { ReactChartContainer } from './ReactChartContainer';

const FroskPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [securities, setSecurities] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    
    useEffect(() => {
    fetch("http://localhost:8080/frosk-analyzer/metadata")
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
        }
        )
    }, [])

    return (
        <MainCard title="Frosk Card">
           <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
                <Grid item lg={12}  md={4} xs={10}>
                    <SecuritiesCard securities={securities}></SecuritiesCard>
                </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                <ReactChartContainer></ReactChartContainer>
            </Grid> */}
          </Grid>
        </MainCard>
    );

};
export default FroskPage;
