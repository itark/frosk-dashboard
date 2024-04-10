import { useNavigate } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ColumnBox from '../ColumnBox';

export const TopFeaturedStrategiesTable = ({topFeaturedStrategies}) => {
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 20,
      },
      {
        accessorKey: 'securityName',
        header: 'Security',
        size: 5,
      },
      {
        accessorKey: 'totalProfit',
        header: 'Profit',
        size: 5,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },
      {
        accessorKey: 'totalGrossReturn',
        header: 'Return',
        size: 5,
        Cell: ({ cell }) => {
          return <div>{cell.getValue()} EUR</div>;
        },
      },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(topFeaturedStrategies);
    }
  }, [topFeaturedStrategies]);


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

export default TopFeaturedStrategiesTable;
