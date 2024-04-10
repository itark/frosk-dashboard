import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import config from 'config';
import TopFeaturedStrategiesTable from 'ui-component/frosk/cards/TopFeaturedStrategiesTable';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const TopFeaturedStrategyCard = ({ isLoading }) => {
    const theme = useTheme();
    const [topFeaturedStrategies, setTopFeaturedStrategies] = useState([]);

    useEffect(() => {
        fetch(config.baseApi+"/topFeaturedStrategies")
        .then(response => response.json())
        .then((response) => {
                //console.log('topFeaturedStrategies',response);
                setTopFeaturedStrategies(response);
        })
    }, []);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item>
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
                                                    backgroundColor: theme.palette.warning.light,
                                                    color: theme.palette.warning.dark
                                                }}
                                            >
                                                <StorefrontTwoToneIcon fontSize="inherit" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={<Typography variant="h4">
                                                    Top Featured Strategies
                                                    </Typography>}
                                            secondary={
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color: theme.palette.grey[500],
                                                        mt: 0.5
                                                    }}
                                                >
                                                   Strategy on Security with highest total profit.
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                            <Grid container alignContent="center" justifyContent="space-between">
                                <Grid item>
                                    {topFeaturedStrategies.length > 0 ?  <TopFeaturedStrategiesTable topFeaturedStrategies={topFeaturedStrategies}/> :null}
                                </Grid>
                            </Grid>
                        </CardWrapper>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default TopFeaturedStrategyCard;
