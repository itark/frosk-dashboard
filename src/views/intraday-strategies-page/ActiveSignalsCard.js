import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import MainCard from 'ui-component/cards/MainCard';
import config from 'config';
import ColumnBox from '../../ui-component/frosk/ColumnBox';

import TrendingUpTwoToneIcon from '@mui/icons-material/TrendingUpTwoTone';

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

const ActiveSignalsCard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        let cancelled = false;
        fetch(config.baseApi + "/intradayOpenPositions")
            .then(response => response.json())
            .then((response) => {
                if (!cancelled) setPositions(response);
            })
            .catch(err => console.error('intradayOpenPositions fetch failed', err));
        return () => { cancelled = true; };
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'securityName',
                header: 'Security',
                size: 10,
            },
            {
                accessorKey: 'strategyName',
                header: 'Strategy',
                size: 10,
            },
            {
                accessorKey: 'entryPrice',
                header: 'Entry Price',
                size: 10,
            },
            {
                accessorKey: 'entryTime',
                header: 'Entry Time',
                size: 15,
            },
            {
                accessorKey: 'currentPrice',
                header: 'Current Price',
                size: 10,
            },
            {
                accessorKey: 'unrealizedPnl',
                header: 'Unrealized P/L',
                size: 10,
                Cell: ({ cell }) => <ColumnBox cell={cell}></ColumnBox>
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: positions,
        enableTopToolbar: false,
        initialState: { density: 'compact' },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                navigate('/container-page', {
                    state: { name: 'OMX30IntradayMomentum', securityName: row.original.securityName }
                });
            },
            sx: { cursor: 'pointer' },
        }),
    });

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
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={<Typography variant="h4">Active Signals</Typography>}
                                secondary={
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: theme.palette.grey[500],
                                            mt: 0.5
                                        }}
                                    >
                                        Open intraday positions right now.
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
                <Grid item>
                    {positions.length > 0 ? <MaterialReactTable table={table} /> : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="textSecondary">No open positions.</Typography>
                        </Box>
                    )}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default ActiveSignalsCard;
