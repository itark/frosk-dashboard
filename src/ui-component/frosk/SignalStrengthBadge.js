import { Chip, Tooltip } from '@mui/material';

const TIER_INFO = {
    STRONG: {
        color: 'success',
        tooltip: 'Signal strength: STRONG — two or more bonus conditions cleared with margin. Position sized up (crypto.signal.strength.strong.multiplier).'
    },
    ELEVATED: {
        color: 'info',
        tooltip: 'Signal strength: ELEVATED — one bonus condition cleared with margin. Position sized up (crypto.signal.strength.elevated.multiplier).'
    }
};

/**
 * Rule-based signal-strength tier (see ISignalStrength on the backend) shown
 * next to a paper position's EUR amount — explains why that amount is bigger
 * than the base 5%-of-equity size. Quiet for BASE/missing: most strategies are
 * currently neutralized (always BASE) pending backtest validation, and showing
 * "BASE" on every row would read as a bug rather than as "nothing special here".
 */
const SignalStrengthBadge = ({ strength }) => {
    const info = TIER_INFO[strength];
    if (!info) return null;

    return (
        <Tooltip title={info.tooltip}>
            <Chip label={strength} color={info.color} size="small" sx={{ ml: 0.5, height: 20, fontSize: '0.7rem' }} />
        </Tooltip>
    );
};

export default SignalStrengthBadge;
