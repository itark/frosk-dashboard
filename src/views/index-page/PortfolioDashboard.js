import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Grid, Avatar, Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography, Select, MenuItem } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import config from 'config';
import PortfolioTable from './PortfolioTable';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

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

const PortfolioDashboard = ({ history, basePath = '/portfolio', initialPortfolio }) => {
    const theme = useTheme();
    const [selectedId, setSelectedId] = useState(null);
    const [currentPortfolio, setCurrentPortfolio] = useState(null);
    const [previousPortfolio, setPreviousPortfolio] = useState(null);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        if (initialPortfolio && !currentPortfolio) {
            setCurrentPortfolio(initialPortfolio);
            setPositions(initialPortfolio.positions.map((p) => ({ ...p, isNew: false, pnlDelta: null })));
        }
    }, [initialPortfolio]);

    useEffect(() => {
        if (Array.isArray(history) && history.length > 0 && selectedId === null) {
            setSelectedId(history[0].id);
        }
    }, [history, selectedId]);

    useEffect(() => {
        if (initialPortfolio) return;
        if (selectedId === null || !Array.isArray(history) || history.length === 0) return;

        const idx = history.findIndex((h) => h.id === selectedId);
        const selected = history[idx];
        const previous = idx + 1 < history.length ? history[idx + 1] : null;

        const fetches = [fetch(config.baseApi + basePath + '/' + selected.id).then((r) => r.json())];
        if (previous) {
            fetches.push(fetch(config.baseApi + basePath + '/' + previous.id).then((r) => r.json()));
        }

        Promise.all(fetches).then(([curr, prev]) => {
            setCurrentPortfolio(curr);
            setPreviousPortfolio(prev || null);

            const previousPositionMap = prev
                ? new Map(prev.positions.map((p) => [p.securityName, p]))
                : new Map();

            const enriched = curr.positions.map((p) => {
                const prevPos = previousPositionMap.get(p.securityName);
                return {
                    ...p,
                    isNew: !prevPos,
                    pnlDelta: prevPos ? p.unrealizedPnlPercent - prevPos.unrealizedPnlPercent : null
                };
            });
            setPositions(enriched);
        });
    }, [selectedId, history]);

    const removedPositions = currentPortfolio && previousPortfolio
        ? previousPortfolio.positions.filter(
              (p) => !currentPortfolio.positions.some((c) => c.securityName === p.securityName)
          )
        : [];

    const newCount = positions.filter((p) => p.isNew).length;

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
                                        Portfolio
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {currentPortfolio
                                            ? `${currentPortfolio.openPositionCount} positions`
                                            : Array.isArray(history) && history.length === 0
                                                ? 'No portfolio data'
                                                : 'Loading...'}
                                    </Typography>
                                }
                            />
                            {history.length > 0 && (
                                <Select
                                    value={selectedId || ''}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    size="small"
                                    sx={{
                                        color: '#fff',
                                        mr: 2,
                                        minWidth: 200,
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.primary[200]
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#fff'
                                        },
                                        '.MuiSvgIcon-root': {
                                            color: '#fff'
                                        }
                                    }}
                                >
                                    {history.map((h) => (
                                        <MenuItem key={h.id} value={h.id}>
                                            {h.snapshotDate} ({h.openPositionCount} pos)
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                            {currentPortfolio && (
                                <Box display="flex" gap={1} alignItems="center">
                                    <Typography variant="h3" sx={{ color: '#fff' }}>
                                        {currentPortfolio.totalPnlPercent.toFixed(2)}%
                                    </Typography>
                                </Box>
                            )}
                        </ListItem>
                    </List>
                </Box>

                {(newCount > 0 || removedPositions.length > 0) && (
                    <Box sx={{ px: 2, pb: 1 }}>
                        {newCount > 0 && (
                            <Chip
                                label={`+${newCount} new`}
                                size="small"
                                sx={{ backgroundColor: theme.palette.success.dark, color: '#fff', mr: 1 }}
                            />
                        )}
                        {removedPositions.length > 0 && (
                            <Chip
                                label={`-${removedPositions.length} removed`}
                                size="small"
                                sx={{ backgroundColor: theme.palette.error.dark, color: '#fff', mr: 1 }}
                            />
                        )}
                        {previousPortfolio && (
                            <Chip
                                label={`PnL Δ ${(currentPortfolio.totalPnlPercent - previousPortfolio.totalPnlPercent).toFixed(2)}%`}
                                size="small"
                                sx={{
                                    backgroundColor:
                                        currentPortfolio.totalPnlPercent - previousPortfolio.totalPnlPercent >= 0
                                            ? theme.palette.success.dark
                                            : theme.palette.error.dark,
                                    color: '#fff'
                                }}
                            />
                        )}
                    </Box>
                )}

                <Grid item>
                    {positions.length > 0 && <PortfolioTable positions={positions} />}
                </Grid>
            </CardWrapper>
        </MainCard>
    );
};

export default PortfolioDashboard;
