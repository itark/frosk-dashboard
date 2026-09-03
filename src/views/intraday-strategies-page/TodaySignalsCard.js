import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import PreRegistrationBadge from '../../ui-component/frosk/PreRegistrationBadge';
import SignalStrengthBadge from '../../ui-component/frosk/SignalStrengthBadge';
import StrategyQualityBadge from '../../ui-component/frosk/StrategyQualityBadge';

import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';

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

const TodaySignalsCard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [signals, setSignals] = useState([]);
    const { source, apiUrl } = useDataSource();

    useEffect(() => {
        fetch(apiUrl("/intradayTodaySignals"))
            .then(response => response.json())
            .then((response) => {
                setSignals(response);
            })
    }, [source, apiUrl]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'date',
                header: 'Time',
                size: 15,
                sortingFn: (rowA, rowB) => {
                    const a = new Date(rowA.original.date);
                    const b = new Date(rowB.original.date);
                    return a - b;
                },
            },
            {
                accessorKey: 'securityName',
                header: 'Security',
                size: 10,
            },
            {
                accessorKey: 'strategyName',
                header: 'Strategy',
                size: 10,
                Cell: ({ cell, row }) => (
                    <>
                        {cell.getValue()}
                        {row.original.preRegistrationPending && <PreRegistrationBadge />}
                        <SignalStrengthBadge strength={row.original.signalStrength} />
                        <StrategyQualityBadge
                            winRate={row.original.historicalWinRate}
                            sqn={row.original.historicalSqn}
                            trades={row.original.historicalTrades}
                        />
                    </>
                ),
            },
            {
                accessorKey: 'type',
                header: 'Signal',
                size: 5,
                Cell: ({ cell }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: cell.getValue() === 'BUY'
                                ? theme.palette.success.dark
                                : theme.palette.error.dark
                        }}
                    >
                        {cell.getValue()}
                    </Typography>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Open Price',
                size: 10,
            },
            {
                accessorKey: 'currentPrice',
                header: 'Current Price',
                size: 10,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: signals,
        enableTopToolbar: false,
        initialState: {
            density: 'compact',
            sorting: [{ id: 'date', desc: true }],
        },
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
                                        backgroundColor: theme.palette.primary.light,
                                        color: theme.palette.primary.dark
                                    }}
                                >
                                    <NotificationsTwoToneIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={<Typography variant="h4">Today's Signals</Typography>}
                                secondary={
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: theme.palette.grey[500],
                                            mt: 0.5
                                        }}
                                    >
                                        Buy/sell signals fired today.
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
                <Grid item>
                    {signals.length > 0 ? <MaterialReactTable table={table} /> : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="textSecondary">No signals today.</Typography>
                        </Box>
                    )}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default TodaySignalsCard;
