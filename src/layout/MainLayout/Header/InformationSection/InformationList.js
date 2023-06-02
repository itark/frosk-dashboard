// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from '@mui/material';

// assets
import { IconBuildingStore, IconMailbox } from '@tabler/icons';
import User1 from 'assets/images/users/user-round.svg';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));


const InformationList = () => {
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: 28
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemText primary="Strategies"/>
                </ListItem>
            </ListItemWrapper>
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar alt="John Doe" src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary="Return" />
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Return (in percentage) criterion (includes trading costs), returned in decimal format.</Typography>
                    </Grid>
                </Grid>
            </ListItemWrapper>           
            <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.success.dark,
                                backgroundColor: theme.palette.success.light,
                                border: 'none',
                                borderColor: theme.palette.success.main
                            }}
                        >
                            <IconBuildingStore stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">System Quality Number</Typography>} />
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">SQN has been designed to assist traders in determining the strengths, desirability, quality etc of a trading system. The idea behind SQN is to use it to find good quality strategies. And a good quality strategy is seen as one that is both tradable (is it easy, or is it difficult to trade?) and efficient (does it make good money when a money management strategy is applied?).
                            The idea is that the higher the number, the more quality, or more desirable, a strategy is.</Typography>
                        <Typography variant="subtitle2">
                            In order to assess whether our trading system is profitable or not, Van Tharp proposes the following scale:
                        </Typography>
                        <Typography variant="subtitle2">1.6 – 1.9 Good. Below average</Typography>
                        <Typography variant="subtitle2">2.0 – 2.4 On average</Typography>
                        <Typography variant="subtitle2">2.5 – 2.9 Okay.</Typography>
                        <Typography variant="subtitle2">3.0 – 5.0 Excellent.</Typography>
                        <Typography variant="subtitle2"> 5.1 – 6.9 Brutal.</Typography>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.light,
                                border: 'none',
                                borderColor: theme.palette.primary.main
                            }}
                        >
                            <IconMailbox stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Expectancy</Typography>} />
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Expectancy criterion (Kelly Criterion).
                            Measures the positive or negative expectancy. The higher the positive number,
                            the better a winning expectation. A negative number means there is only
                            losing expectations.
                        </Typography>
                    </Grid>
                </Grid>
            </ListItemWrapper>
        </List>
    );
};

export default InformationList;
