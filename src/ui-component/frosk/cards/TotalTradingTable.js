import React, { useMemo, useEffect, useState  } from 'react';
import  { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const TotalTradingTable = ({tradingAccounts}) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        size: 10,
      },  
      {
        accessorKey: 'inherentExitrule',
        header: 'Common exit rule',
        size: 5,
      },  
      {
        accessorKey: 'accountValue',
        header: 'Account value',
        size: 10,
      }, 
      {
        accessorKey: 'initTotalValue',
        header: 'Initial total value',
        size: 5,
      },
      {
        accessorKey: 'positionValue',
        header: 'Position value',
        size: 5,
      },   
      {
        accessorKey: 'totalReturnPercentage',
        header: 'Return',
        size: 10,
        Cell: ({ cell }) =>
          <ColumnBox cell={cell}></ColumnBox>        
      },  
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(tradingAccounts);
    }
  }, [tradingAccounts]);

  const table = useMaterialReactTable({
    columns,
    data, 
    enableTopToolbar:false,
    initialState: { density: 'compact', 
                    sorting: [{ id: 'type', desc: false }],
                   // pagination: { pageSize: 30 }
                  },
  });
  return <MaterialReactTable table={table} />;

};

export default TotalTradingTable;
