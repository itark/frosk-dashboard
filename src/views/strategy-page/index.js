import {
    Box,
    CardContent,
    Grid,
    Typography,
    ListItemIcon,
    MenuItem,
    useMediaQuery
  } from '@mui/material';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import MainCard from 'ui-component/cards/MainCard';
import { Container } from '../../ui-component/frosk/cards/Container';
import { TradesTable } from '../../ui-component/frosk/TradesTable';
import { gridSpacing } from 'store/constant';  


// ==============================|| SAMPLE PAGE ||============================== //

const StrategyPage = ({row}) => {

    const [strategies, setStrategies] = useState();
    const [expanded, setExpanded] = useState(false);


    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    }));

    const handleExpandClick = () => {
        setExpanded(!expanded);
      };  

    const [searchParams] = useSearchParams();
    console.log(searchParams.entries());

    for (const entry of searchParams.entries()) {
        console.log(entry);
      }

    <MainCard title="StrategyPage Card">
        <Typography variant="body2">
            Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
            ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
            reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
            qui officiate descent molls anim id est labours.
        </Typography>

        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>  
                { row.original.securityName ? <Container featuredStrategy={row.original} securityName={row.original.securityName} strategies={strategies} initStrategy={row.original.name}/>: null}    
            </Grid>
            <Grid item xs={12}>  
                <Typography variant="h5">Trades {row.original.name} | {row.original.securityName} </Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                <ExpandMoreIcon />
                </ExpandMore>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {row.original.trades ? <TradesTable trades={row.original.trades} />:null }
                </Collapse>   
            </Grid>
        </Grid>
    </MainCard>
};

export default StrategyPage;
