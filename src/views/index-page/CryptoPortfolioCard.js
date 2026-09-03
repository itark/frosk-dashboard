import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ColumnBox from 'ui-component/frosk/ColumnBox';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const CryptoPositionsTable = ({ positions }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'unrealizedPnlPercent',
                header: 'PnL%',
                size: 80,
                Cell: ({ cell }) => <ColumnBox cell={cell} />
            },
            { accessorKey: 'ticker', header: 'Ticker', size: 100 },
            { accessorKey: 'strategyName', header: 'Strategy', size: 140 },
            { accessorKey: 'entryDateTime', header: 'Entry time', size: 130 },
            {
                accessorKey: 'entryPrice',
                header: 'Entry',
                size: 100,
                Cell: ({ cell }) => {
                    const v = cell.getValue();
                    return v != null ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';
                }
            },
            {
                accessorKey: 'currentPrice',
                header: 'Current',
                size: 100,
                Cell: ({ cell }) => {
                    const v = cell.getValue();
                    return v != null ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';
                }
            }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: positions,
        enableTopToolbar: false,
        initialState: { sorting: [{ id: 'unrealizedPnlPercent', desc: true }] }
    });

    return <MaterialReactTable table={table} />;
};

const CryptoPortfolioCard = () => {
    const theme = useTheme();
    const { source, apiUrl } = useDataSource();
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        setPositions([]);
        fetch(apiUrl('/crypto/portfolio'))
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setPositions(Array.isArray(data) ? data : []))
            .catch(() => setPositions([]));
    }, [source, apiUrl]);

    const avgPnl =
        positions.length > 0
            ? positions.reduce((s, p) => s + (p.unrealizedPnlPercent ?? 0), 0) / positions.length
            : null;

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
                                        backgroundColor: theme.palette.primary[800],
                                        color: '#fff'
                                    }}
                                >
                                    <AccountBalanceWalletOutlinedIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        Crypto Portfolio
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {positions.length} open position{positions.length !== 1 ? 's' : ''}
                                    </Typography>
                                }
                            />
                            {avgPnl !== null && (
                                <Typography variant="h3" sx={{ color: '#fff' }}>
                                    {avgPnl >= 0 ? '+' : ''}
                                    {avgPnl.toFixed(2)}%
                                </Typography>
                            )}
                        </ListItem>
                    </List>
                </Box>

                <Grid item>
                    {positions.length > 0 ? (
                        <CryptoPositionsTable positions={positions} />
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'primary.light' }}>
                                Inga öppna positioner
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default CryptoPortfolioCard;
