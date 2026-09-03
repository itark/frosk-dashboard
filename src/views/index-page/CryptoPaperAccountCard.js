import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import SignalStrengthBadge from '../../ui-component/frosk/SignalStrengthBadge';
import StrategyQualityBadge from '../../ui-component/frosk/StrategyQualityBadge';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.secondary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.secondary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const fmtEur = (v) => (v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—');

const OpenPositionsTable = ({ positions }) => {
    const columns = useMemo(
        () => [
            { accessorKey: 'ticker', header: 'Ticker', size: 100 },
            {
                accessorKey: 'strategyName',
                header: 'Strategy',
                size: 160,
                Cell: ({ cell, row }) => (
                    <>
                        {cell.getValue()}
                        <StrategyQualityBadge
                            winRate={row.original.historicalWinRate}
                            sqn={row.original.historicalSqn}
                            trades={row.original.historicalTrades}
                        />
                    </>
                )
            },
            {
                accessorKey: 'eurAmount',
                header: 'EUR',
                size: 90,
                Cell: ({ cell, row }) => (
                    <>
                        {fmtEur(cell.getValue())}
                        <SignalStrengthBadge strength={row.original.signalStrength} />
                    </>
                )
            },
            {
                accessorKey: 'filledPrice',
                header: 'Entry price',
                size: 100,
                Cell: ({ cell }) => {
                    const v = cell.getValue();
                    return v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';
                }
            },
            { accessorKey: 'createdAt', header: 'Opened', size: 150 }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: positions,
        enableTopToolbar: false,
        initialState: { sorting: [{ id: 'createdAt', desc: true }] }
    });

    return <MaterialReactTable table={table} />;
};

const CryptoPaperAccountCard = () => {
    const theme = useTheme();
    const { source, apiUrl } = useDataSource();
    const [account, setAccount] = useState(null);

    useEffect(() => {
        setAccount(null);
        fetch(apiUrl('/crypto/paper-account'))
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setAccount(data))
            .catch(() => setAccount(null));
    }, [source, apiUrl]);

    const pnlPercent = account?.realizedPnlPercent != null ? Number(account.realizedPnlPercent) : null;
    const positions = account?.openPositions ?? [];

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
                                        backgroundColor: theme.palette.secondary[800],
                                        color: '#fff'
                                    }}
                                >
                                    <SavingsOutlinedIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        Paper Account
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'secondary.light', mt: 0.25 }}>
                                        {account
                                            ? `Equity ${fmtEur(account.equityEur)} EUR · ${account.openPositionsCount} open`
                                            : 'Loading…'}
                                    </Typography>
                                }
                            />
                            {pnlPercent !== null && (
                                <Typography variant="h3" sx={{ color: '#fff' }}>
                                    {pnlPercent >= 0 ? '+' : ''}
                                    {pnlPercent.toFixed(2)}%
                                </Typography>
                            )}
                        </ListItem>
                    </List>

                    {account && (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: 'secondary.light' }}>
                                    Init capital
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                                    {fmtEur(account.initCapitalEur)} EUR
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: 'secondary.light' }}>
                                    Cash
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                                    {fmtEur(account.cashEur)} EUR
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" sx={{ color: 'secondary.light' }}>
                                    Realized PnL
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                                    {fmtEur(account.realizedPnlEur)} EUR
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>

                <Grid item>
                    {positions.length > 0 ? (
                        <OpenPositionsTable positions={positions} />
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'secondary.light' }}>
                                Inga öppna paper-positioner
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default CryptoPaperAccountCard;
