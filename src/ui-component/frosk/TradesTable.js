import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import ColumnBox from '../../ui-component/frosk/ColumnBox';

export const TradesTable = ({trades}) => {

  const columns = useMemo(
    () => [
      {
        accessorKey: 'dateReadable',
        header: 'Date',
        size: 10,
      },   
      {
        accessorKey: 'price',
        header: 'Price',
        size: 10,
      },  
      {
        accessorKey: 'type',
        header: 'Type',
        size: 10,
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

  return (
    <MaterialReactTable
      columns={columns}
      data={trades}
      enableColumnFilterModes={false}
      enableColumnOrdering
      enablePinning
      enableMultiSort
      positionToolbarAlertBanner="bottom"
      initialState={{ density: 'compact', 
              showColumnFilters: false ,
              sorting: [{ id: 'dateReadable', desc: false }],
    }}
      muiTableBodyRowProps={{ hover: false }}
    />
  );
};

export default TradesTable;
