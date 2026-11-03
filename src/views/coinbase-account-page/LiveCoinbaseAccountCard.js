import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';

/**
 * The REAL Coinbase (Advanced Trade) account — reads GET /coinbase/live-account
 * on the crypto backend (:8081), which wraps Coinbase's /accounts,
 * /orders/historical/batch and /orders/historical/fills endpoints.
 *
 * Sits in the left column of the Coinbase Konto page opposite the simulated
 * paper account, so a paper simulation that has drifted from what the exchange
 * actually reports is visible side by side. Mirrors LiveKrakenAccountCard, with
 * one structural difference: Coinbase spot has no leveraged positions, so where
 * Kraken shows "open positions" this shows "holdings" — every non-zero currency
 * balance, each marked to EUR via that currency's own {currency}-EUR product.
 *
 * Read-only: no endpoint touched here can place or cancel an order. The backend
 * never 4xx/5xx — a missing API credential arrives as `available: false` with an
 * `error` string, which is rendered in place of the tables.
 *
 * `refreshKey` is bumped by the parent page every 30s to trigger a refetch.
 */

// Mirrors the CardWrapper in LiveKrakenAccountCard (primary/blue), so the two
// "real account" cards read as siblings across the Kraken and Coinbase pages.
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

const fmtEur = (v, d = 2) =>
    v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—';

const fmtQty = (v) => (v != null ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—');

const HoldingsTable = ({ holdings }) => {
    const columns = useMemo(
        () => [
            { accessorKey: 'currency', header: 'Valuta', size: 90 },
            { accessorKey: 'availableBalance', header: 'Tillgängligt', size: 110, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'hold', header: 'Reserverat', size: 100, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'type', header: 'Typ', size: 90 },
            { accessorKey: 'eurPrice', header: 'Pris (EUR)', size: 100, Cell: ({ cell }) => fmtEur(cell.getValue(), 4) },
            { accessorKey: 'valueEur', header: 'Värde (EUR)', size: 110, Cell: ({ cell }) => fmtEur(cell.getValue()) }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: holdings,
        enableTopToolbar: false,
        enablePagination: false,
        enableBottomToolbar: false,
        initialState: { density: 'compact' }
    });

    return <MaterialReactTable table={table} />;
};

const OrdersTable = ({ orders }) => {
    const columns = useMemo(
        () => [
            { accessorKey: 'productId', header: 'Produkt', size: 110 },
            { accessorKey: 'side', header: 'Sida', size: 70, Cell: ({ cell }) => (cell.getValue() || '—').toUpperCase() },
            { accessorKey: 'orderType', header: 'Typ', size: 80 },
            {
                accessorKey: 'limitPrice',
                header: 'Pris',
                size: 90,
                Cell: ({ cell, row }) => fmtEur(cell.getValue() ?? row.original.averageFilledPrice, 4)
            },
            { accessorKey: 'filledSize', header: 'Fylld', size: 90, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'status', header: 'Status', size: 90 },
            { accessorKey: 'createdAt', header: 'Lagd', size: 130 }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: orders,
        enableTopToolbar: false,
        enablePagination: false,
        enableBottomToolbar: false,
        initialState: { density: 'compact' }
    });

    return <MaterialReactTable table={table} />;
};

const FillsTable = ({ fills }) => {
    const columns = useMemo(
        () => [
            { accessorKey: 'tradeTime', header: 'Tid', size: 130 },
            { accessorKey: 'productId', header: 'Produkt', size: 110 },
            {
                accessorKey: 'side',
                header: 'Sida',
                size: 70,
                Cell: ({ cell }) => {
                    const side = cell.getValue();
                    return (
                        <Chip
                            label={(side || '—').toUpperCase()}
                            size="small"
                            color={side === 'SELL' ? 'error' : 'success'}
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                    );
                }
            },
            { accessorKey: 'size', header: 'Antal', size: 90, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'price', header: 'Pris', size: 90, Cell: ({ cell }) => fmtEur(cell.getValue(), 4) },
            { accessorKey: 'liquidityIndicator', header: 'Typ', size: 90 }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: fills,
        enableTopToolbar: false,
        initialState: { density: 'compact', pagination: { pageIndex: 0, pageSize: 10 } }
    });

    return <MaterialReactTable table={table} />;
};

const SectionTitle = ({ children, count }) => (
    <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        {children}
        {count != null && (
            <Typography component="span" variant="caption" sx={{ ml: 0.75, color: 'grey.600' }}>
                ({count})
            </Typography>
        )}
    </Typography>
);

const LiveCoinbaseAccountCard = ({ refreshKey = 0 }) => {
    const theme = useTheme();
    const { source, apiUrl } = useDataSource();
    const [account, setAccount] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        // Only the first load blanks the card; a 30s refresh keeps the previous
        // snapshot on screen so the tables do not flicker.
        if (refreshKey === 0) setLoading(true);

        fetch(apiUrl('/coinbase/live-account'))
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                setAccount(data);
                setFetchError(null);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setFetchError(`Kunde inte nå /coinbase/live-account — ${err.message}`);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [source, apiUrl, refreshKey]);

    const holdings = account?.holdings ?? [];
    const orders = account?.openOrders ?? [];
    const fills = account?.recentFills ?? [];
    const error = fetchError || (account && account.available === false ? account.error : null);

    return (
        <MainCard
            title="Live Coinbase"
            darkTitle
            secondary={
                <Chip
                    label={account?.fetchedAt ? `UPPDATERAD ${account.fetchedAt}` : 'HÄMTAR…'}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 22,
                        backgroundColor: 'rgba(33,150,243,0.15)',
                        color: theme.palette.primary.dark,
                        border: '1px solid',
                        borderColor: 'rgba(33,150,243,0.3)'
                    }}
                />
            }
        >
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
                                    <AccountBalanceOutlinedIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        Coinbase (riktigt konto)
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {loading
                                            ? 'Hämtar…'
                                            : error
                                            ? 'Ingen kontakt med Coinbase'
                                            : `${holdings.length} innehav · ${orders.length} ordrar`}
                                    </Typography>
                                }
                            />
                            {account?.totalValueEur != null && !error && (
                                <Typography variant="h3" sx={{ color: '#fff' }}>
                                    {fmtEur(account.totalValueEur)} EUR
                                </Typography>
                            )}
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>

            {error ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.600' }}>
                        API-nyckel läses från frosk-analyzers konfiguration för crypto-profilen.
                    </Typography>
                </Box>
            ) : (
                <>
                    <SectionTitle count={holdings.length}>Innehav</SectionTitle>
                    {holdings.length > 0 ? (
                        <HoldingsTable holdings={holdings} />
                    ) : (
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {loading ? 'Hämtar…' : 'Inga innehav på Coinbase'}
                        </Typography>
                    )}

                    <SectionTitle count={orders.length}>Öppna ordrar</SectionTitle>
                    {orders.length > 0 ? (
                        <OrdersTable orders={orders} />
                    ) : (
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {loading ? 'Hämtar…' : 'Inga öppna ordrar'}
                        </Typography>
                    )}

                    <SectionTitle count={fills.length}>Avslut senaste 7 dagarna</SectionTitle>
                    {fills.length > 0 ? (
                        <FillsTable fills={fills} />
                    ) : (
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {loading ? 'Hämtar…' : 'Inga avslut de senaste 7 dagarna'}
                        </Typography>
                    )}
                </>
            )}
        </MainCard>
    );
};

export default LiveCoinbaseAccountCard;
