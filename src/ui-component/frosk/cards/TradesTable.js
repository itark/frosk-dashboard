import React, { useMemo, useEffect, useState  } from 'react';
import  { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const TradesTable = ({trades}) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'dateReadable',
        header: 'Date',
        size: 10,
      },   
      {
        accessorKey: 'type',
        header: 'Type',
        size: 10,
      }, 
      {
        accessorKey: 'price',
        header: 'Price',
        size: 5,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 5,
      },   
      {
        accessorKey: 'grossProfit',
        header: 'Profit',
        size: 10,
      },  
      {
        accessorKey: 'pnl',
        header: 'P/L',
        size: 10,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>          
      },       
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(trades);
    }
  }, [trades]);

  const table = useMaterialReactTable({
    columns,
    data, 
    enableTopToolbar:false,
    initialState: { density: 'compact', sorting: [{ id: 'dateReadable', desc: false }]},
  });
  return <MaterialReactTable table={table} />;


  // return (
  //   <MaterialReactTable
  //     columns={columns}
  //     data={trades}
  //     enableColumnFilterModes={false}
  //     enableColumnOrdering
  //     enablePinning
  //     enableMultiSort
  //     positionToolbarAlertBanner="bottom"
  //     initialState={{ density: 'compact', 
  //             showColumnFilters: false ,
  //             sorting: [{ id: 'dateReadable', desc: false }],
  //   }}
  //     muiTableBodyRowProps={{ hover: false }}
  //   />
  // );
};

export default TradesTable;
