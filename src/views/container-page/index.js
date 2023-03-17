import { useLocation } from "react-router-dom";
import { Grid } from '@mui/material';
import { Container } from '../../ui-component/frosk/cards/Container';
import { gridSpacing } from 'store/constant';

const ContainerPage = ( ) => {
    const location = useLocation();
    const initSelectedStrategy = location.state.name + 'Strategy';
    const securityName = location.state.securityName;

    console.log('initSelectedStrategy',initSelectedStrategy)

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Container  securityName={securityName} initSelectedStrategy={initSelectedStrategy} disableStrategySelect={true}/>
            </Grid>
        </Grid>
    )
};

export default ContainerPage;
