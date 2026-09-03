import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import TopIntradayStrategiesTable from './TopIntradayStrategiesTable';

import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    '&:after': {
        content: '""',
        position: 'relative',
    },
    '&:before': {
        content: '""',
        position: 'relative',
    }
}));

const TopIntradayStrategiesCard = ({ isLoading }) => {
    const theme = useTheme();
    const [topFeaturedStrategies, setTopFeaturedStrategies] = useState([]);
    const { source, apiUrl } = useDataSource();

    useEffect(() => {
        fetch(apiUrl("/topFeaturedStrategies"))
            .then(response => response.json())
            .then((response) => {
                setTopFeaturedStrategies(response);
            })
    }, [source, apiUrl]);

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
                                            backgroundColor: theme.palette.warning.light,
                                            color: theme.palette.warning.dark
                                        }}
                                    >
                                        <AccessTimeTwoToneIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h4">
                                            Top Intraday Strategies
                                            </Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                           OMX30 Intraday Momentum — highest total profit.
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                    <Grid item>
                        {topFeaturedStrategies.length > 0 ? <TopIntradayStrategiesTable topFeaturedStrategies={topFeaturedStrategies} /> : null}
                    </Grid>
                </CardWrapper>
            </MainCard>
        </>
    );
};

export default TopIntradayStrategiesCard;
