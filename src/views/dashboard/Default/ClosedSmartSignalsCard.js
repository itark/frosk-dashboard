import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import config from 'config';
import OpenSmartSignalsTable from 'ui-component/frosk/cards/OpenSmartSignalsTable';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ClosedSmartSignalsTable from 'ui-component/frosk/cards/ClosedSmartSignalsTable';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'relative',
        // width: 210,
        // height: 210,
        // background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        // borderRadius: '50%',
        // top: -30,
        // right: -180
    },
    '&:before': {
        content: '""',
        position: 'relative',
        // width: 210,
        // height: 210,
        // background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        // borderRadius: '50%',
        // top: -160,
        // right: -130
    }
}));

const ClosedSmartSignalsCard = ({ isLoading }) => {
    const theme = useTheme();
    const [smartSignals, setSmartSignals] = useState([]);

    useEffect(() => {
        fetch(config.baseApi+"/smartSignals?open=false")
        .then(response => response.json())
        .then((result) => {
            //console.log('smartSignals?open=false',result);
            setSmartSignals(result);
        })
    }, []);

    return (
        <>
            <MainCard>

                        <CardWrapper border={false} content={false}>
                            <Box sx={{ p: 2 }}>
                                <List sx={{ py: 0 }}>
                                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: theme.palette.primary[800],
                                                    color: '#fff'
                                                }}
                                            >
                                                <TableChartOutlinedIcon fontSize="inherit" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={
                                                <Typography variant="h4" sx={{ color: '#fff' }}>
                                                    Smart Signals - Closed
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                                    Smart closed signals.
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                                <Grid item>
                                    {smartSignals.length > 0 ?  <ClosedSmartSignalsTable smartSignals={smartSignals}/> :null}
                                </Grid>
                         </CardWrapper>

            </MainCard>
        </>
    );
};

export default ClosedSmartSignalsCard;
