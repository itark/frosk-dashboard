import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    LinearProgress,
    Radio,
    RadioGroup,
    Tooltip,
    Typography
} from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';

/**
 * Strategy lifecycle panel on the Coinbase Konto page: one card per registered
 * strategy with its mode, the promotion metrics, progress towards the hard
 * criteria, and the promote / rollback buttons. Mirrors
 * kraken-account-page/StrategyLifecyclePanel.js exactly, with PnL shown in EUR
 * (Coinbase trades against EUR, Kraken Futures against USD) and no per-trade
 * market-regime breakdown (not instrumented for Coinbase paper orders yet).
 *
 * Reads  GET  /coinbase/strategy/readiness            (all strategies, polled every 60s)
 * Writes POST /coinbase/strategy/{name}/promote       {targetMode: SHADOW|LIVE}
 *        POST /coinbase/strategy/{name}/demote        {targetMode: PAPER}
 *
 * The backend is the authority on the criteria — the buttons only mirror
 * `readyForPromotion`, and a refused promotion comes back as 422 with the
 * blockers, which the dialog shows.
 *
 * Only rendered for the crypto (Coinbase) source; the endpoints do not exist
 * on the other backends.
 */

const POLL_MS = 60000;

const MODE_STYLE = {
    PAPER: { label: 'PAPER', color: 'default' },
    SHADOW: { label: 'SHADOW', color: 'warning' },
    LIVE: { label: 'LIVE', color: 'success' },
    DISABLED: { label: 'DISABLED', color: 'default', variant: 'outlined' }
};

// "CryptoEMACrossShortIntradayStrategy" → "EMACrossShort"
const shortName = (name) => name.replace(/^Crypto/, '').replace(/IntradayStrategy$/, '');

const fmt = (v, d = 2) => (v == null ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
const fmtPct = (v) => (v == null ? '—' : `${(Number(v) * 100).toFixed(0)} %`);

const Metric = ({ label, value, color }) => (
    <Grid item xs={4}>
        <Typography variant="caption" sx={{ color: 'grey.600' }}>
            {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ color }}>
            {value}
        </Typography>
    </Grid>
);

/**
 * Progress towards one criterion. `inverse` is for the drawdown ceiling: the
 * bar fills as drawdown approaches the limit and turns red past it.
 */
const Criterion = ({ label, value, target, inverse = false, suffix = '' }) => {
    const v = value == null ? 0 : Number(value);
    const pct = Math.min(100, target > 0 ? (v / target) * 100 : 0);
    const met = inverse ? value != null && v < target : v >= target;
    return (
        <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">{label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: met ? 'success.dark' : 'grey.700' }}>
                    {value == null ? '—' : inverse ? fmt(v) : v}
                    {suffix} / {inverse ? `< ${target}` : target}
                    {suffix}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={pct}
                // No data yet is neutral, not a breach — only a measured drawdown over the limit is red.
                color={met ? 'success' : inverse && value != null ? 'error' : 'primary'}
                sx={{ height: 6, borderRadius: 3 }}
            />
        </Box>
    );
};

const StrategyCard = ({ s, onPromote, onDemote }) => {
    const theme = useTheme();
    const mode = MODE_STYLE[s.mode] || MODE_STYLE.PAPER;
    const pnlColor = (Number(s.totalPnlEur) || 0) >= 0 ? theme.palette.success.dark : theme.palette.error.dark;

    return (
        <MainCard
            content={false}
            sx={{
                height: '100%',
                borderColor: s.mode === 'LIVE' ? theme.palette.success.main : s.mode === 'SHADOW' ? theme.palette.warning.main : undefined,
                borderWidth: s.mode === 'LIVE' || s.mode === 'SHADOW' ? 2 : 1
            }}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Tooltip title={s.strategyName}>
                        <Typography variant="h4">{shortName(s.strategyName)}</Typography>
                    </Tooltip>
                    <Chip label={mode.label} color={mode.color} variant={mode.variant || 'filled'} size="small" sx={{ fontWeight: 700 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', minHeight: 24, mb: 1 }}>
                    {!s.enabledByConfig && <Chip label="Avstängd i config" size="small" variant="outlined" color="error" />}
                    {s.preRegistrationPending && <Chip label="Pre-registrerat test" size="small" variant="outlined" color="secondary" />}
                    {s.modeChangedAt && (
                        <Typography variant="caption" sx={{ color: 'grey.600', alignSelf: 'center' }}>
                            mode sedan {s.modeChangedAt}
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={1}>
                    <Metric label="Trades" value={s.closedTrades} />
                    <Metric label="Dagar" value={s.daysRunning} />
                    <Metric label="Max DD" value={s.maxDrawdownPct == null ? '—' : `${fmt(s.maxDrawdownPct)} %`} />
                    <Metric label="Sharpe (per trade)" value={fmt(s.sharpeRatio)} />
                    <Metric label="Win rate" value={fmtPct(s.winRate)} />
                    <Metric label="R:R" value={fmt(s.avgRR)} />
                </Grid>
                <Typography variant="caption" sx={{ color: 'grey.600' }}>
                    Netto PnL (paper): <b style={{ color: pnlColor }}>{fmt(s.totalPnlEur)} EUR</b>
                </Typography>

                <Box sx={{ mt: 1.5 }}>
                    <Criterion label="Avslutade trades" value={s.closedTrades} target={s.minClosedTrades} />
                    <Criterion label="Dagar i drift" value={s.daysRunning} target={s.minDaysRunning} />
                    <Criterion label="Max drawdown" value={s.maxDrawdownPct} target={Number(s.maxAllowedDrawdownPct)} inverse suffix=" %" />
                </Box>

                {s.blockers?.length > 0 && s.mode === 'PAPER' && (
                    <Box component="ul" sx={{ pl: 2, my: 1 }}>
                        {s.blockers.map((b) => (
                            <Typography key={b} component="li" variant="caption" sx={{ color: 'grey.700' }}>
                                {b}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                    {s.mode === 'PAPER' && s.readyForPromotion && (
                        <Button variant="contained" size="small" onClick={() => onPromote(s, null)}>
                            Sätt i produktion
                        </Button>
                    )}
                    {s.mode === 'SHADOW' && (
                        <Button variant="contained" color="success" size="small" onClick={() => onPromote(s, 'LIVE')}>
                            Aktivera live
                        </Button>
                    )}
                    {(s.mode === 'SHADOW' || s.mode === 'LIVE') && (
                        <Button variant="outlined" color="warning" size="small" onClick={() => onDemote(s, 'PAPER')}>
                            Pausa → PAPER
                        </Button>
                    )}
                    {s.mode === 'DISABLED' && (
                        <Button variant="outlined" size="small" onClick={() => onDemote(s, 'PAPER')}>
                            Återaktivera som PAPER
                        </Button>
                    )}
                </Box>
            </Box>
        </MainCard>
    );
};

/**
 * One dialog for every mode change. `fixedTarget` is set for single-choice
 * actions (Aktivera live, Pausa); null lets the user pick SHADOW or LIVE.
 */
const ModeChangeDialog = ({ action, liveTradingEnabled, onClose, onConfirm }) => {
    const [target, setTarget] = useState('SHADOW');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTarget(action?.fixedTarget || 'SHADOW');
        setError(null);
        setBusy(false);
    }, [action]);

    if (!action) return null;
    const { strategy, kind, fixedTarget } = action;
    const chosen = fixedTarget || target;
    const goesLive = kind === 'promote';

    const confirm = async () => {
        setBusy(true);
        setError(null);
        const err = await onConfirm(strategy.strategyName, kind, chosen);
        setBusy(false);
        if (err) setError(err);
        else onClose();
    };

    return (
        <Dialog open onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontSize: '1.1rem' }}>
                {goesLive ? 'Sätt i produktion' : 'Ändra mode'} — {shortName(strategy.strategyName)}
            </DialogTitle>
            <DialogContent>
                {kind === 'promote' && !fixedTarget && (
                    <RadioGroup value={target} onChange={(e) => setTarget(e.target.value)}>
                        <FormControlLabel
                            value="SHADOW"
                            control={<Radio />}
                            label={
                                <span>
                                    <b>SHADOW</b> — riktig order <i>och</i> paper-order för varje signal, för jämförelse
                                </span>
                            }
                        />
                        <FormControlLabel
                            value="LIVE"
                            control={<Radio />}
                            label={
                                <span>
                                    <b>LIVE</b> — enbart riktiga orders
                                </span>
                            }
                        />
                    </RadioGroup>
                )}

                <Typography variant="body2" sx={{ mt: 1 }}>
                    {strategy.mode} → <b>{chosen}</b>
                </Typography>

                {goesLive && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Nya signaler från den här strategin skickar <b>riktiga orders med riktiga pengar</b> till Coinbase.
                        {chosen === 'LIVE' && ' Paper-kontot följer inte längre strategin.'}
                    </Alert>
                )}
                {goesLive && !liveTradingEnabled && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        Huvudbrytaren <code>crypto.live.trading.enabled</code> är av, så inga riktiga orders skickas förrän den slås
                        på.
                        {chosen === 'LIVE' && ' En LIVE-strategi gör då ingenting alls, inte ens paper.'}
                    </Alert>
                )}
                {kind === 'demote' && (strategy.mode === 'LIVE' || strategy.mode === 'SHADOW') && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Nya signaler går bara till paper. Redan öppna riktiga positioner stängs fortfarande av sina exit-signaler.
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {Array.isArray(error) ? (
                            <Box component="ul" sx={{ m: 0, pl: 2 }}>
                                {error.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </Box>
                        ) : (
                            error
                        )}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={busy}>
                    Avbryt
                </Button>
                <Button
                    variant="contained"
                    color={goesLive ? (chosen === 'LIVE' ? 'success' : 'warning') : 'primary'}
                    onClick={confirm}
                    disabled={busy}
                >
                    {busy ? 'Skickar…' : `Bekräfta ${chosen}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const StrategyLifecyclePanel = () => {
    const { source, apiUrl } = useDataSource();
    const isCoinbase = source === 'crypto';
    const [strategies, setStrategies] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [action, setAction] = useState(null);

    const load = useCallback(() => {
        fetch(apiUrl('/coinbase/strategy/readiness'))
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setStrategies(data);
                setLoadError(null);
            })
            .catch((err) => setLoadError(`Kunde inte hämta /coinbase/strategy/readiness — ${err.message}`));
    }, [apiUrl]);

    useEffect(() => {
        if (!isCoinbase) return undefined;
        load();
        const timer = setInterval(load, POLL_MS);
        return () => clearInterval(timer);
    }, [isCoinbase, load]);

    /** Returns null on success, or an error (string, or the 422 blocker list) for the dialog. */
    const changeMode = async (strategyName, kind, targetMode) => {
        try {
            const res = await fetch(apiUrl(`/coinbase/strategy/${encodeURIComponent(strategyName)}/${kind}`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetMode })
            });
            const body = await res.json().catch(() => ({}));
            if (res.status === 422) return body.blockers?.length ? body.blockers : 'Promotionskriterierna är inte uppfyllda';
            if (!res.ok) return body.error || `HTTP ${res.status}`;
            load();
            return null;
        } catch (err) {
            return err.message;
        }
    };

    if (!isCoinbase) return null;

    const liveTradingEnabled = strategies?.[0]?.liveTradingEnabled ?? false;
    const anyReal = strategies?.some((s) => s.mode === 'SHADOW' || s.mode === 'LIVE');

    return (
        <MainCard
            title="Strategier — livscykel"
            darkTitle
            secondary={
                <Chip
                    label={liveTradingEnabled ? 'LIVE TRADING PÅ' : 'LIVE TRADING AV'}
                    size="small"
                    color={liveTradingEnabled ? 'success' : 'default'}
                    sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                />
            }
        >
            {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {loadError}
                </Alert>
            )}
            {anyReal && !liveTradingEnabled && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Huvudbrytaren <code>crypto.live.trading.enabled</code> är av. SHADOW-strategier skickar bara paper-orders, och
                    LIVE-strategier handlar inte alls förrän den slås på.
                </Alert>
            )}
            {strategies == null && !loadError && <Typography variant="body2">Hämtar…</Typography>}
            <Grid container spacing={2}>
                {(strategies || []).map((s) => (
                    <Grid item xs={12} sm={6} lg={4} key={s.strategyName}>
                        <StrategyCard
                            s={s}
                            onPromote={(strategy, fixedTarget) => setAction({ strategy, kind: 'promote', fixedTarget })}
                            onDemote={(strategy, fixedTarget) => setAction({ strategy, kind: 'demote', fixedTarget })}
                        />
                    </Grid>
                ))}
            </Grid>
            <ModeChangeDialog
                action={action}
                liveTradingEnabled={liveTradingEnabled}
                onClose={() => setAction(null)}
                onConfirm={changeMode}
            />
        </MainCard>
    );
};

export default StrategyLifecyclePanel;
