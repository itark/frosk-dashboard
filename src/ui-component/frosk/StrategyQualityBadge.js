import { Tooltip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Same bar as PortfolioService.passesQualityGate on the backend (frosk.portfolio.min.sqn / min.win.rate).
const MIN_SQN = 1.0;
const MIN_WIN_RATE = 40.0;
// Below this many historical trades, SQN/win-rate are noise, not signal.
const MIN_SAMPLE_TRADES = 5;

const fmt = (v, digits = 2) => (v != null ? Number(v).toFixed(digits) : '—');

/**
 * Historical-quality dot for a (strategy, security) pair — deliberately a
 * different shape from SignalStrengthBadge (a pill) so the two are never
 * confused: this one is about the strategy's *track record* on this
 * instrument, not about how strong today's specific entry conditions look.
 * Sourced from FeaturedStrategy, the same numbers already shown in the
 * "Top Intraday Strategies" table — real backtest history, not a heuristic.
 */
const StrategyQualityBadge = ({ winRate, sqn, trades }) => {
    const n = trades != null ? Number(trades) : null;

    if (n == null || n < MIN_SAMPLE_TRADES) {
        return (
            <Tooltip title={`Too few historical trades (${n ?? 0}) to judge quality — data still accumulating.`}>
                <FiberManualRecordIcon sx={{ fontSize: 10, ml: 0.75, color: 'grey.400', verticalAlign: 'middle' }} />
            </Tooltip>
        );
    }

    const passes = sqn != null && winRate != null && Number(sqn) >= MIN_SQN && Number(winRate) >= MIN_WIN_RATE;

    return (
        <Tooltip
            title={`Historical: win rate ${fmt(winRate, 1)}%, SQN ${fmt(sqn)}, ${n} trades (this strategy + security). ${
                passes ? 'Passes' : 'Below'
            } the portfolio quality bar (SQN ≥ ${MIN_SQN}, win rate ≥ ${MIN_WIN_RATE}%).`}
        >
            <FiberManualRecordIcon
                sx={{ fontSize: 10, ml: 0.75, color: passes ? 'success.main' : 'error.main', verticalAlign: 'middle' }}
            />
        </Tooltip>
    );
};

export default StrategyQualityBadge;
