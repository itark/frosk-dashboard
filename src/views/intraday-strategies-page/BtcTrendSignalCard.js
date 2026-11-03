import { useState, useEffect, useMemo } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { Avatar, Box, Chip, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { useDataSource } from 'store/DataSourceContext';

/**
 * Daily BTC trend signal — reads GET /crypto/btc-trend-signal on the crypto
 * backend (:8081). The signal is EMA10/EMA20 crossover on daily BTC-EUR with an
 * ADX(14) > 20 trend filter; the user acts on it manually via Avanza.
 *
 * Below the signal stats it plots the last 90 daily bars from
 * GET /crypto/btc-trend-chart: BTC-EUR close with its EMA10/EMA20, and ADX(14)
 * on a secondary axis. The plot is banded per contiguous signal run
 * (green LONG / red SHORT / grey NEUTRAL), every LONG/SHORT entry is marked
 * with an arrow, and each run is scored (entry→exit % move, inverted for
 * SHORT) with a running total above the chart.
 *
 * The per-bar signal is taken from the point's `signal` field when the backend
 * sends it, and otherwise derived on the client from ema10/ema20/adx with the
 * same EMA10>EMA20 & ADX>threshold rule — so the card is fully dynamic even
 * against an older backend build.
 *
 * Only rendered when the crypto data source is selected (see the parent page).
 */
const CHART_DAYS = 90;
const DEFAULT_ADX_THRESHOLD = 20;
const EMA_FAST_COLOR = '#ff9800'; // orange — EMA10
const EMA_SLOW_COLOR = '#f44336'; // red — EMA20
const fmt = (v, d = 2) => (v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—');
const fmtPct = (v) => (v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`);
const dayMs = (d) => new Date(`${d}T00:00:00Z`).getTime();

// EMA10>EMA20 & ADX>threshold → LONG; EMA10<EMA20 & ADX>threshold → SHORT;
// otherwise NEUTRAL. Mirrors CryptoBtcTrendSignalService.classify() on the backend.
const classifySignal = (ema10, ema20, adx, threshold) => {
    if (ema10 == null || ema20 == null || adx == null) return 'NEUTRAL';
    if (Number(adx) < threshold) return 'NEUTRAL';
    return Number(ema10) > Number(ema20) ? 'LONG' : 'SHORT';
};

// Guarantees every point carries a `signal`, computing it client-side when the
// backend did not include the field.
const normalizeChart = (points, threshold) => {
    if (!Array.isArray(points)) return [];
    return points.map((p) => ({
        ...p,
        signal:
            p.signal === 'LONG' || p.signal === 'SHORT' || p.signal === 'NEUTRAL'
                ? p.signal
                : classifySignal(p.ema10, p.ema20, p.adx, threshold)
    }));
};

// Contiguous runs of the same signal, for the background bands.
const signalSegments = (points) => {
    const segs = [];
    points.forEach((p, i) => {
        const last = segs[segs.length - 1];
        if (last && last.signal === p.signal) last.to = i;
        else segs.push({ signal: p.signal, from: i, to: i });
    });
    return segs;
};

/**
 * Walks the per-bar signal and pairs each contiguous LONG/SHORT run into a
 * trade. The leading run is skipped — its entry lies before the window, so its
 * return is unknowable. The last run may still be open (exit = last bar).
 */
const buildTrades = (points) => {
    if (!Array.isArray(points) || points.length < 2) return [];
    const runs = [];
    let cur = null;
    for (let i = 1; i < points.length; i += 1) {
        const s = points[i].signal;
        const prev = points[i - 1].signal;
        if (s === prev) continue;
        if (cur) {
            cur.exit = points[i - 1];
            runs.push(cur);
            cur = null;
        }
        if (s === 'LONG' || s === 'SHORT') cur = { signal: s, entry: points[i] };
    }
    if (cur) {
        cur.exit = points[points.length - 1];
        cur.open = true;
        runs.push(cur);
    }
    return runs.map((t) => {
        const e = Number(t.entry.close);
        const x = Number(t.exit.close);
        const pct = t.signal === 'LONG' ? ((x - e) / e) * 100 : ((e - x) / e) * 100;
        return { ...t, pct };
    });
};

// Backend serializes LocalDate as an ISO string ("2026-08-21"); tolerate the
// Jackson array form ([2026, 8, 21]) too, just in case.
const fmtDate = (d) => {
    if (!d) return null;
    if (Array.isArray(d)) {
        const [y, m, day] = d;
        return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return String(d);
};

const BtcTrendSignalCard = () => {
    const theme = useTheme();
    const { source, apiUrl } = useDataSource();
    const [signal, setSignal] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [chart, setChart] = useState([]);
    const [chartLoaded, setChartLoaded] = useState(false);

    useEffect(() => {
        setSignal(null);
        setLoaded(false);
        fetch(apiUrl('/crypto/btc-trend-signal'))
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setSignal(data);
                setLoaded(true);
            })
            .catch(() => {
                setSignal(null);
                setLoaded(true);
            });
    }, [source, apiUrl]);

    useEffect(() => {
        setChart([]);
        setChartLoaded(false);
        fetch(apiUrl(`/crypto/btc-trend-chart?days=${CHART_DAYS}`))
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                setChart(Array.isArray(data) ? data : []);
                setChartLoaded(true);
            })
            .catch(() => {
                setChart([]);
                setChartLoaded(true);
            });
    }, [source, apiUrl]);

    const sig = signal?.signal ?? 'NEUTRAL';
    const palette = {
        LONG: theme.palette.success.main,
        SHORT: theme.palette.error.main,
        NEUTRAL: theme.palette.grey[500]
    };
    const label = { LONG: 'LONG', SHORT: 'SHORT', NEUTRAL: 'NEUTRAL' }[sig] ?? 'NEUTRAL';
    const color = palette[sig] ?? theme.palette.grey[500];

    const priceBlue = theme.palette.primary.main;
    const adxColor = theme.palette.grey[500];
    const greenC = theme.palette.success.main;
    const redC = theme.palette.error.main;
    const greyC = theme.palette.grey[500];

    const adxThreshold = signal?.adxThreshold ?? DEFAULT_ADX_THRESHOLD;

    // Every point carries a `signal` — from the backend, or derived here.
    const points = useMemo(() => normalizeChart(chart, adxThreshold), [chart, adxThreshold]);

    const series = useMemo(
        () => [
            { name: 'BTC-EUR', type: 'area', data: points.map((p) => ({ x: p.date, y: p.close })) },
            { name: 'EMA10', type: 'line', data: points.map((p) => ({ x: p.date, y: p.ema10 })) },
            { name: 'EMA20', type: 'line', data: points.map((p) => ({ x: p.date, y: p.ema20 })) },
            { name: 'ADX(14)', type: 'line', data: points.map((p) => ({ x: p.date, y: p.adx })) }
        ],
        [points]
    );

    const trades = useMemo(() => buildTrades(points), [points]);

    const bands = useMemo(() => {
        const fillFor = { LONG: greenC, SHORT: redC, NEUTRAL: greyC };
        const n = points.length;
        return signalSegments(points).map((seg) => ({
            x: dayMs(points[seg.from].date),
            // extend to the next segment's start so bands touch and single-bar runs still show
            x2: dayMs(points[Math.min(seg.to + 1, n - 1)].date),
            fillColor: fillFor[seg.signal] ?? greyC,
            opacity: seg.signal === 'NEUTRAL' ? 0.06 : 0.1,
            borderColor: 'transparent'
        }));
    }, [points, greenC, redC, greyC]);

    const summary = useMemo(() => {
        const total = trades.reduce((s, t) => s + t.pct, 0);
        const open = trades.filter((t) => t.open).length;
        return { count: trades.length, open, total };
    }, [trades]);

    const annotationPoints = useMemo(() => {
        const pts = [];
        trades.forEach((t) => {
            const isLong = t.signal === 'LONG';
            const entryC = isLong ? greenC : redC;
            pts.push({
                x: dayMs(t.entry.date),
                y: Number(t.entry.close),
                marker: { size: 5, fillColor: entryC, strokeColor: '#fff', strokeWidth: 1, shape: 'circle' },
                label: {
                    text: isLong ? '▲' : '▼',
                    borderWidth: 0,
                    offsetY: isLong ? 16 : -4,
                    style: { background: 'transparent', color: entryC, fontSize: '13px', fontWeight: 700 }
                }
            });
            const win = t.pct >= 0;
            pts.push({
                x: dayMs(t.exit.date),
                y: Number(t.exit.close),
                marker: {
                    size: t.open ? 5 : 3,
                    fillColor: win ? greenC : redC,
                    strokeColor: '#fff',
                    strokeWidth: 1,
                    shape: t.open ? 'circle' : 'square'
                },
                label: {
                    text: `${fmtPct(t.pct)}${t.open ? ' •' : ''}`,
                    borderColor: win ? greenC : redC,
                    offsetY: -8,
                    style: {
                        background: win ? greenC : redC,
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: { left: 5, right: 5, top: 2, bottom: 2 }
                    }
                }
            });
        });
        return pts;
    }, [trades, greenC, redC]);

    const options = useMemo(
        () => ({
            chart: { type: 'line', height: 300, toolbar: { show: false }, background: 'transparent', animations: { enabled: false } },
            theme: { mode: theme.palette.mode },
            colors: [priceBlue, EMA_FAST_COLOR, EMA_SLOW_COLOR, adxColor],
            stroke: { width: [2, 1.5, 1.5, 1], curve: 'smooth', dashArray: [0, 0, 0, 4] },
            fill: { type: ['gradient', 'solid', 'solid', 'solid'], gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
            dataLabels: { enabled: false },
            markers: { size: 0 },
            xaxis: { type: 'datetime', labels: { style: { colors: theme.palette.text.secondary } } },
            yaxis: [
                {
                    seriesName: 'BTC-EUR',
                    title: { text: 'BTC-EUR', style: { color: theme.palette.text.secondary } },
                    labels: {
                        style: { colors: theme.palette.text.secondary },
                        formatter: (v) => (v != null ? Math.round(v).toLocaleString('en-US') : v)
                    }
                },
                { seriesName: 'BTC-EUR', show: false },
                { seriesName: 'BTC-EUR', show: false },
                {
                    seriesName: 'ADX(14)',
                    opposite: true,
                    min: 0,
                    max: 60,
                    tickAmount: 3,
                    title: { text: 'ADX', style: { color: theme.palette.text.secondary } },
                    labels: {
                        style: { colors: theme.palette.text.secondary },
                        formatter: (v) => (v != null ? v.toFixed(0) : v)
                    }
                }
            ],
            annotations: {
                xaxis: bands,
                yaxis: [
                    {
                        y: adxThreshold,
                        yAxisIndex: 3,
                        strokeDashArray: 3,
                        borderColor: adxColor,
                        label: {
                            text: `ADX ${fmt(adxThreshold, 0)}`,
                            style: { fontSize: '10px', color: theme.palette.text.secondary, background: 'transparent' }
                        }
                    }
                ],
                points: annotationPoints
            },
            legend: { labels: { colors: theme.palette.text.secondary }, position: 'top' },
            grid: { borderColor: alpha(theme.palette.text.secondary, 0.15), strokeDashArray: 4 },
            tooltip: {
                theme: theme.palette.mode,
                shared: true,
                x: { format: 'yyyy-MM-dd' },
                y: {
                    formatter: (v, { seriesIndex }) =>
                        v == null ? '—' : seriesIndex === 3 ? v.toFixed(1) : Math.round(v).toLocaleString('en-US')
                }
            }
        }),
        [theme, adxThreshold, priceBlue, adxColor, annotationPoints, bands]
    );

    const hasChart = chartLoaded && points.length > 0;

    return (
        <MainCard>
            <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                        <ListItemAvatar>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.largeAvatar,
                                    backgroundColor: color,
                                    color: '#fff'
                                }}
                            >
                                <ShowChartTwoToneIcon fontSize="inherit" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                            primary={
                                <Typography variant="h4">BTC Trend&nbsp;Follower</Typography>
                            }
                            secondary={
                                <Typography variant="subtitle2" sx={{ mt: 0.25 }}>
                                    Daglig BTC-EUR · EMA10/EMA20 + ADX(14)
                                    {signal?.asOfDate ? ` · per ${fmtDate(signal.asOfDate)}` : ''}
                                </Typography>
                            }
                        />
                        <Chip
                            label={label}
                            sx={{
                                fontWeight: 700,
                                fontSize: '1rem',
                                px: 1,
                                color: '#fff',
                                backgroundColor: color
                            }}
                        />
                    </ListItem>
                </List>

                {!loaded && (
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Laddar…
                    </Typography>
                )}

                {loaded && !signal?.dataAvailable && (
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Otillräcklig daglig BTC-EUR-historik för en signal ännu.
                    </Typography>
                )}

                {loaded && signal?.dataAvailable && (
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Avanza-instrument
                            </Typography>
                            <Typography variant="h5" sx={{ color }}>
                                {signal.avanzaInstrument}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                EMA10
                            </Typography>
                            <Typography variant="h5">{fmt(signal.ema10)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                EMA20
                            </Typography>
                            <Typography variant="h5">{fmt(signal.ema20)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                ADX(14)
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color:
                                        signal.adx != null && signal.adx < signal.adxThreshold
                                            ? theme.palette.grey[500]
                                            : theme.palette.text.primary
                                }}
                            >
                                {fmt(signal.adx)}{' '}
                                <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                                    / {fmt(signal.adxThreshold, 0)}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Dagar sedan signalbyte
                            </Typography>
                            <Typography variant="h5">
                                {signal.daysSinceSignalChange}
                                {signal.lastSignalChangeDate ? (
                                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                                        {' '}
                                        (sedan {fmtDate(signal.lastSignalChangeDate)})
                                    </Typography>
                                ) : null}
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ mt: 2 }}>
                    {!chartLoaded && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Laddar graf…
                        </Typography>
                    )}

                    {chartLoaded && points.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Ingen grafdata tillgänglig.
                        </Typography>
                    )}

                    {hasChart && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'baseline',
                                    gap: 0.75,
                                    mb: 1
                                }}
                            >
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Senaste {CHART_DAYS} dagar:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {summary.count} affär{summary.count === 1 ? '' : 'er'}
                                    {summary.open > 0 ? ` (${summary.open} öppen)` : ''}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    · total avkastning
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700, color: summary.total >= 0 ? greenC : redC }}
                                >
                                    {fmtPct(summary.total)}
                                </Typography>
                                {summary.open > 0 && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        (öppen affär medräknad orealiserad)
                                    </Typography>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    px: 1,
                                    pt: 1,
                                    border: `1px solid ${alpha(theme.palette.text.secondary, 0.15)}`
                                }}
                            >
                                <Chart options={options} series={series} type="line" height={300} width="100%" />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.75, px: 0.5 }}>
                                {[
                                    ['LONG', greenC],
                                    ['SHORT', redC],
                                    ['NEUTRAL', greyC]
                                ].map(([name, c]) => (
                                    <Box key={name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: 0.5, backgroundColor: alpha(c, 0.5) }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            {name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </MainCard>
    );
};

export default BtcTrendSignalCard;
