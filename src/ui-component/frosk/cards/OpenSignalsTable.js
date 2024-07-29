import { useNavigate } from 'react-router-dom';
import React, { useMemo,  Box, useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const OpenSignalsTable = ({openSignals}) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'totalProfit',
        header: 'Profit',
        size: 2,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },  
      {
        accessorKey: 'openTradeDate',
        header: 'Open date',
        size: 2,
      },  
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 2,
      },
      {
        accessorKey: 'securityName',
        header: 'Security',
        size: 2,
      },
      {
        accessorKey: 'openPrice',
        header: 'Open price',
        size: 2,
      },
      {
        accessorKey: 'closePrice',
        header: 'Current price',
        size: 2,
      },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(openSignals);
    }
  }, [openSignals]);

  const useNavigateParam = () => {
    const navigate = useNavigate();
    return (pathname, id) =>
      navigate({ pathname, id}, {
        state: id
      });
  };
  const navigateParam = useNavigateParam();

  const openStrategy = (row) => {
    navigateParam('/container-page', row);
  }

  const table = useMaterialReactTable({
    columns,
    data, 
    enableTopToolbar:false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        openStrategy(row.original);
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),

  });
  return <MaterialReactTable table={table} />;
};

export default OpenSignalsTable;
