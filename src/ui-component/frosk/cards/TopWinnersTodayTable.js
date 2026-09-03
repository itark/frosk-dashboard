import { useNavigate } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const TopWinnersTodayTable = ({ topWinners }) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'changePercent',
        header: 'Change',
        size: 5,
        Cell: ({ cell }) => <ColumnBox cell={cell}></ColumnBox>,
      },
      {
        accessorKey: 'name',
        header: 'Security',
        size: 10,
      },
      {
        accessorKey: 'description',
        header: 'Name',
        size: 20,
      },
      {
        accessorKey: 'close',
        header: 'Close',
        size: 5,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      },
      {
        accessorKey: 'change',
        header: 'Change (abs)',
        size: 5,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 5,
      },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(topWinners);
    }
  }, [topWinners]);

  const useNavigateParam = () => {
    const navigate = useNavigate();
    return (pathname, id) =>
      navigate({ pathname, id }, {
        state: id,
      });
  };
  const navigateParam = useNavigateParam();

  const openSecurity = (row) => {
    // Winners are price moves, not strategy results. Open the security chart with a
    // generic default strategy; the container's strategy selector stays enabled.
    navigateParam('/container-page', { securityName: row.name, name: 'SimpleMovingMomentum' });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableTopToolbar: false,
    initialState: { density: 'compact' },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        openSecurity(row.original);
      },
      sx: {
        cursor: 'pointer',
      },
    }),
  });
  return <MaterialReactTable table={table} />;
};

export default TopWinnersTodayTable;
