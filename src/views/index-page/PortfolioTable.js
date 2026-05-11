import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import { Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from 'ui-component/frosk/ColumnBox';

const PortfolioTable = ({ positions }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'unrealizedPnlPercent',
                header: 'Total return',
                size: 2,
                Cell: ({ cell }) => <ColumnBox cell={cell} />
            },
            {
                accessorKey: 'securityName',
                header: 'Security',
                size: 2
            },
            {
                accessorKey: 'securityDesc',
                header: 'Description',
                size: 2
            },
            {
                accessorKey: 'strategyName',
                header: 'Strategy',
                size: 2
            },
            {
                accessorKey: 'entryDate',
                header: 'Entry date',
                size: 2
            },
            {
                accessorKey: 'entryPrice',
                header: 'Entry',
                size: 2
            },
            {
                accessorKey: 'latestPrice',
                header: 'Latest',
                size: 2
            },
            {
                accessorKey: 'pnlDelta',
                header: 'Since prev.',
                size: 2,
                Cell: ({ cell, row }) => {
                    if (row.original.isNew) {
                        return <Chip label="NEW" size="small" color="success" />;
                    }
                    const val = cell.getValue();
                    if (val === null) return '-';
                    return (
                        <Typography
                            variant="body2"
                            sx={{
                                color: val >= 0 ? theme.palette.success.dark : theme.palette.error.dark,
                                fontWeight: 500
                            }}
                        >
                            {val > 0 ? '+' : ''}{val.toFixed(2)}%
                        </Typography>
                    );
                }
            }
        ],
        []
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setData(positions);
        }
    }, [positions]);

    const useNavigateParam = () => {
        const navigate = useNavigate();
        return (pathname, id) =>
            navigate({ pathname, id }, { state: id });
    };
    const navigateParam = useNavigateParam();

    const openStrategy = (row) => {
        navigateParam('/container-page', { name: row.strategyName, securityName: row.securityName });
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableTopToolbar: false,
        initialState: {
            sorting: [{ id: 'entryDate', desc: true }]
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                openStrategy(row.original);
            },
            sx: {
                cursor: 'pointer'
            }
        })
    });

    return <MaterialReactTable table={table} />;
};

export default PortfolioTable;
