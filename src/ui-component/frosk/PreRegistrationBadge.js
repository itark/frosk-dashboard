import { Tooltip } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

/**
 * Marks a row/value that belongs to a strategy still accumulating forward data
 * for a pre-registered test (see ~/itark/PREREG_*.md on the backend). Shown
 * rather than hidden — an explicit, informed choice to accept the peeking risk
 * the pre-registration warns against, in exchange for visibility.
 */
const PreRegistrationBadge = () => (
    <Tooltip title="Pre-registered test in progress — not yet validated. Shown for visibility only; do not treat as a verdict until the data gate is met.">
        <WarningAmberRoundedIcon fontSize="small" color="warning" sx={{ verticalAlign: 'middle', ml: 0.5 }} />
    </Tooltip>
);

export default PreRegistrationBadge;
