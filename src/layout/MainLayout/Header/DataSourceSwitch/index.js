import { Box, Typography, Chip } from '@mui/material';
import { useDataSource } from 'store/DataSourceContext';
import { IconChartBar, IconCurrencyBitcoin, IconChartCandle } from '@tabler/icons';

const SOURCES = [
    {
        key: 'equity',
        label: 'OMX',
        chip: 'YAHOO',
        Icon: IconChartBar,
        activeColor: '#66bb6a',
        chipBg: 'rgba(46,125,50,0.15)',
        chipBorder: 'rgba(46,125,50,0.3)'
    },
    {
        key: 'crypto',
        label: 'Coinbase',
        chip: 'COINBASE',
        Icon: IconCurrencyBitcoin,
        activeColor: '#ffb74d',
        chipBg: 'rgba(230,81,0,0.15)',
        chipBorder: 'rgba(230,81,0,0.3)'
    },
    {
        key: 'kraken-futures',
        label: 'Kraken',
        chip: 'KRAKEN FUTURES',
        Icon: IconChartCandle,
        activeColor: '#7e57c2',
        chipBg: 'rgba(94,53,177,0.15)',
        chipBorder: 'rgba(94,53,177,0.3)'
    }
];

const DataSourceSwitch = () => {
    const { source, setSource } = useDataSource();
    const active = SOURCES.find((s) => s.key === source) || SOURCES[0];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: 2 }}>
            {SOURCES.map((s) => {
                const isActive = source === s.key;
                return (
                    <Box
                        key={s.key}
                        onClick={() => setSource(s.key)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: isActive ? s.activeColor : 'transparent',
                            backgroundColor: isActive
                                ? s.chipBg
                                : 'transparent',
                            opacity: isActive ? 1 : 0.45,
                            transition: 'all 0.2s',
                            userSelect: 'none',
                            '&:hover': { opacity: 1 }
                        }}
                    >
                        <s.Icon size={16} color={isActive ? s.activeColor : '#78909c'} />
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: isActive ? s.activeColor : '#78909c',
                                transition: 'color 0.2s'
                            }}
                        >
                            {s.label}
                        </Typography>
                    </Box>
                );
            })}

            <Chip
                label={active.chip}
                size="small"
                sx={{
                    ml: 1,
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.5px',
                    height: 22,
                    backgroundColor: active.chipBg,
                    color: active.activeColor,
                    border: '1px solid',
                    borderColor: active.chipBorder,
                    transition: 'all 0.3s'
                }}
            />
        </Box>
    );
};

export default DataSourceSwitch;
