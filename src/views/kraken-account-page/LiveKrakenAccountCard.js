import { useState, useEffect, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';

/**
 * The REAL Kraken Futures account — reads GET /kraken/live-account on the
 * kraken-futures backend (:8082), which wraps Kraken's /accounts,
 * /openpositions, /openorders and /fills endpoints.
 *
 * Sits in the left column of the Kraken Konto page opposite the simulated
 * paper account, so a paper simulation that has drifted from what the exchange
 * actually reports is visible side by side.
 *
 * Read-only: no endpoint touched here can place or cancel an order. The backend
 * never 4xx/5xx — a missing API credential arrives as `available: false` with an
 * `error` string, which is rendered in place of the tables.
 *
 * `refreshKey` is bumped by the parent page every 30s to trigger a refetch.
 */

// Mirrors the CardWrapper in CryptoPaperAccountCard (the paper column) but in
// primary/blue rather than secondary/purple, so the two columns read as
// siblings while staying instantly distinguishable.
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

const fmtUsd = (v, d = 2) =>
    v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—';

const fmtSigned = (v, d = 2) => {
    if (v == null) return '—';
    const n = Number(v);
    return `${n >= 0 ? '+' : ''}${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
};

const fmtQty = (v) => (v != null ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—');

/** Signed USD amount, green above zero and red below — used in the position/fill tables. */
const SignedCell = ({ value, suffix = '' }) => {
    const theme = useTheme();
    if (value == null) return <>—</>;
    const n = Number(value);
    return (
        <Box component="span" sx={{ color: n >= 0 ? theme.palette.success.dark : theme.palette.error.dark, fontWeight: 500 }}>
            {fmtSigned(n)}
            {suffix}
        </Box>
    );
};

/**
 * The account whose numbers head the card: Kraken's flex (multi-collateral)
 * account when present — that is where a PF_* perpetual is actually
 * collateralised — otherwise whichever account holds the most value.
 */
const primaryAccount = (accounts) => {
    if (!accounts || accounts.length === 0) return null;
    const flex = accounts.find((a) => a.name === 'flex' || /multicollateral/i.test(a.type || ''));
    if (flex) return flex;
    return accounts.reduce((best, a) => ((Number(a.balanceValue) || 0) > (Number(best.balanceValue) || 0) ? a : best), accounts[0]);
};

const PositionsTable = ({ positions }) => {
    const columns = useMemo(
        () => [
            { accessorKey: 'symbol', header: 'Symbol', size: 110 },
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
                            color={side === 'short' ? 'error' : 'success'}
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                    );
                }
            },
            { accessorKey: 'size', header: 'Kontrakt', size: 90, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'entryPrice', header: 'Entry', size: 90, Cell: ({ cell }) => fmtUsd(cell.getValue(), 4) },
            { accessorKey: 'markPrice', header: 'Mark', size: 90, Cell: ({ cell }) => fmtUsd(cell.getValue(), 4) },
            { accessorKey: 'notionalUsd', header: 'Exponering', size: 100, Cell: ({ cell }) => fmtUsd(cell.getValue()) },
            {
                accessorKey: 'unrealizedPnlUsd',
                header: 'Orealiserat',
                size: 110,
                Cell: ({ cell, row }) => (
                    <>
                        <SignedCell value={cell.getValue()} />
                        {row.original.unrealizedPnlPct != null && (
                            <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                                ({fmtSigned(row.original.unrealizedPnlPct)}%)
                            </Typography>
                        )}
                    </>
                )
            },
            {
                accessorKey: 'unrealizedFunding',
                header: 'Funding',
                size: 90,
                Cell: ({ cell }) => <SignedCell value={cell.getValue()} />
            },
            { accessorKey: 'openedAt', header: 'Öppnad', size: 130 }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: positions,
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
            { accessorKey: 'symbol', header: 'Symbol', size: 110 },
            { accessorKey: 'side', header: 'Sida', size: 70, Cell: ({ cell }) => (cell.getValue() || '—').toUpperCase() },
            { accessorKey: 'orderType', header: 'Typ', size: 80 },
            {
                accessorKey: 'limitPrice',
                header: 'Pris',
                size: 90,
                Cell: ({ cell, row }) => fmtUsd(cell.getValue() ?? row.original.stopPrice, 4)
            },
            { accessorKey: 'unfilledSize', header: 'Kvar', size: 80, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'filledSize', header: 'Fylld', size: 80, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            {
                accessorKey: 'reduceOnly',
                header: 'Reduce only',
                size: 90,
                Cell: ({ cell }) => (cell.getValue() ? 'Ja' : 'Nej')
            },
            { accessorKey: 'receivedAt', header: 'Lagd', size: 130 }
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
            { accessorKey: 'filledAt', header: 'Tid', size: 130 },
            { accessorKey: 'symbol', header: 'Symbol', size: 110 },
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
                            color={side === 'sell' ? 'error' : 'success'}
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                    );
                }
            },
            { accessorKey: 'size', header: 'Kontrakt', size: 90, Cell: ({ cell }) => fmtQty(cell.getValue()) },
            { accessorKey: 'price', header: 'Pris', size: 90, Cell: ({ cell }) => fmtUsd(cell.getValue(), 4) },
            { accessorKey: 'fillType', header: 'Typ', size: 90 }
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

/** Caption + value pair in the dark header block. */
const Metric = ({ label, value, color }) => (
    <Grid item xs={6} sm={4}>
        <Typography variant="caption" sx={{ color: 'primary.light' }}>
            {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: color || '#fff' }}>
            {value}
        </Typography>
    </Grid>
);

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

const LiveKrakenAccountCard = ({ refreshKey = 0 }) => {
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

        fetch(apiUrl('/kraken/live-account'))
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
                setFetchError(`Kunde inte nå /kraken/live-account — ${err.message}`);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [source, apiUrl, refreshKey]);

    const acct = primaryAccount(account?.accounts);
    const positions = account?.openPositions ?? [];
    const orders = account?.openOrders ?? [];
    const fills = account?.recentFills ?? [];
    const error = fetchError || (account && account.available === false ? account.error : null);

    // Sum of the marked-to-market position PnL — the exchange's own `pnl` field on
    // the account is preferred when present, this is the fallback.
    const unrealized =
        acct?.pnl ??
        (positions.length > 0
            ? positions.reduce((sum, p) => sum + (Number(p.unrealizedPnlUsd) || 0), 0)
            : null);

    return (
        <MainCard
            title="Live Kraken"
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
                                        Kraken Pro (riktigt konto)
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {loading
                                            ? 'Hämtar…'
                                            : error
                                            ? 'Ingen kontakt med Kraken'
                                            : `Portfölj ${fmtUsd(acct?.portfolioValue)} USD · ${positions.length} öppna · ${orders.length} ordrar`}
                                    </Typography>
                                }
                            />
                            {unrealized != null && !error && (
                                <Typography
                                    variant="h3"
                                    sx={{ color: Number(unrealized) >= 0 ? theme.palette.success.light : theme.palette.error.light }}
                                >
                                    {fmtSigned(unrealized)}
                                </Typography>
                            )}
                        </ListItem>
                    </List>

                    {acct && !error && (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Metric label="Balance" value={`${fmtUsd(acct.balanceValue)} USD`} />
                            <Metric label="Portfolio value" value={`${fmtUsd(acct.portfolioValue)} USD`} />
                            <Metric label="Collateral" value={`${fmtUsd(acct.collateralValue)} USD`} />
                            <Metric label="Available margin" value={`${fmtUsd(acct.availableMargin)} USD`} />
                            <Metric label="Initial margin" value={`${fmtUsd(acct.initialMargin)} USD`} />
                            <Metric
                                label="Orealiserat"
                                value={`${fmtSigned(acct.pnl)} USD`}
                                color={(Number(acct.pnl) || 0) >= 0 ? theme.palette.success.light : theme.palette.error.light}
                            />
                        </Grid>
                    )}
                </Box>
            </CardWrapper>

            {error ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.600' }}>
                        API-nyckel och secret läses från ~/.frosk/kraken-credentials.properties i frosk-analyzer.
                    </Typography>
                </Box>
            ) : (
                <>
                    <SectionTitle count={positions.length}>Öppna positioner</SectionTitle>
                    {positions.length > 0 ? (
                        <PositionsTable positions={positions} />
                    ) : (
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {loading ? 'Hämtar…' : 'Inga öppna positioner på Kraken'}
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

export default LiveKrakenAccountCard;
