import { useNavigate } from 'react-router-dom';
import React, { useMemo,  Box, useEffect, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import generic from 'assets/images/generic.svg';
import ReactImageFallback from "react-image-fallback";
import ColumnBox from '../ColumnBox';

export const OpenSmartSignalsTable = ({smartSignals}) => {
  const [data, setData] = useState();

  console.log('smartSignals',smartSignals);

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
    ],
    [],
  );

  useEffect(() => {
      setData(smartSignals);
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


  return (
    <>
    {data ? <MaterialReactTable
      muiTableBodyRowProps={({ row }) => ({
        onClick: (event) => {
          openStrategy(row.original);
        },
        sx: {
          cursor: 'grab', //you might want to change the cursor too when adding an onClick
        },
      })}
      columns={columns}
      data={data}
      enableBottomToolbar={true}
      enableTopToolbar={false}
    />:null }
    </>
  );
};

export default OpenSmartSignalsTable;
