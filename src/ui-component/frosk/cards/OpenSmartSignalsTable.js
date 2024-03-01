import { useNavigate } from 'react-router-dom';
import React, { useMemo,  Box, useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const OpenSmartSignalsTable = ({smartSignals}) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'latestTrade',
        header: 'Date',
        size: 10,
      },  
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 50,
      },
      {
        accessorKey: 'securityName',
        header: 'Security'
      },
      {
        accessorKey: 'totalProfit',
        header: 'Total profit',
        size: 5,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },
      {
        accessorKey: 'close',
        header: 'Current price',
        size: 5
      },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(smartSignals);
    }
  }, [smartSignals]);

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

export default OpenSmartSignalsTable;
