import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import TopWinnersTodayTable from 'ui-component/frosk/cards/TopWinnersTodayTable';

// assets
import TrendingUpTwoToneIcon from '@mui/icons-material/TrendingUpTwoTone';

// styles
const CardWrapper = styled(MainCard)(() => ({
    '&:after': {
        content: '""',
        position: 'relative'
    },
    '&:before': {
        content: '""',
        position: 'relative'
    }
}));

const TopWinnersTodayCard = ({ isLoading }) => {
    const theme = useTheme();
    const [topWinners, setTopWinners] = useState([]);
    const { source, apiUrl } = useDataSource();

    useEffect(() => {
        fetch(apiUrl('/topWinnersToday?limit=10'))
            .then((response) => response.json())
            .then((response) => {
                console.log('topWinnersToday', response);
                setTopWinners(response);
            })
            .catch((err) => console.error('topWinnersToday fetch failed', err));
    }, [source, apiUrl]);

    return (
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
                                        backgroundColor: theme.palette.success.light,
                                        color: theme.palette.success.dark
                                    }}
                                >
                                    <TrendingUpTwoToneIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={<Typography variant="h4">Today&apos;s Winners</Typography>}
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500], mt: 0.5 }}>
                                        Top 10 securities by latest-session percentage gain.
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
                <Grid item>
                    {topWinners.length > 0 ? <TopWinnersTodayTable topWinners={topWinners} /> : null}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default TopWinnersTodayCard;
