import {
    useLocation,
  } from "react-router-dom";


// material-ui
import { Typography,Grid } from '@mui/material';

import { Container } from '../../ui-component/frosk/cards/Container';
import { TradesTable } from '../../ui-component/frosk/TradesTable';
import ColumnBox from '../../ui-component/frosk/ColumnBox';


import { gridSpacing } from 'store/constant';
import { ConstructionOutlined } from "@mui/icons-material";


const ContainerPage = ( ) => {
    const location = useLocation();

    const initSelectedStrategy = location.state.name;
    const securityName = location.state.securityName;


    return (
 
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Container  securityName={securityName} initSelectedStrategy={initSelectedStrategy} disableStrategySelect={true}/>
            </Grid>


        </Grid>

    )
};

export default ContainerPage;
