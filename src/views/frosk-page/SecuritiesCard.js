import React, { useEffect, useMemo, useRef, useState } from 'react';
import  {  MaterialReactTable, useMaterialReactTable,  MRT_ToggleFiltersButton }  from 'material-react-table';
import {
  Grid,
  Box,
  lighten,
} from '@mui/material';
import { Container } from '../../ui-component/frosk/cards/Container';
import { gridSpacing } from 'store/constant';

const SecuritiesCard = ( {securities}) => {
  console.log('securities',securities);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Namn',
        size: 50,
      },
      // {
      //   accessorKey: 'bestStrategy',
      //   header: 'Best strategy',
      //   size: 50,
      // },
      // {
      //   accessorKey: 'oneDayPercent',
      //   header: '1d',
      //   size: 5,
      //   Cell: ({ cell }) =>
      //    <ColumnBox cell={cell}></ColumnBox>
      // },
      // {
      //   accessorKey: 'oneWeekPercent',
      //   header: '1w',
      //   size: 5,
      //   Cell: ({ cell }) =>
      //     <ColumnBox cell={cell}></ColumnBox>      
      // },
      // {
      //   accessorKey: 'oneMonthPercent',
      //   header: '1m',
      //   size: 5,
      //   Cell: ({ cell }) =>
      //     <ColumnBox cell={cell}></ColumnBox>
      // },
      // {
      //   accessorKey: 'threeMonthPercent',
      //   header: '3m',
      //   size: 5,
      //   Cell: ({ cell }) =>
      //     <ColumnBox cell={cell}></ColumnBox>
      // },
      // {
      //   accessorKey: 'sixMonthPercent',
      //   header: '6m',
      //   size: 5,
      //   Cell: ({ cell }) =>
      //     <ColumnBox cell={cell}></ColumnBox>
      // }
    ],
    [],
  );

  const [security, setSecurity] = useState();
  const [data, setData] = useState([]);
  const [initSelectedStrategy, setInitSelectedStrategy] = useState();
  const [sorting, setSorting] = useState([]);
  const rowVirtualizerInstanceRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(securities);
    }
  }, [securities]);

  // useEffect(() => {
  //   //scroll to the top of the table when the sorting changes
  //   try {
  //     rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [sorting]);

  const table = useMaterialReactTable({
    columns,
    data,
    defaultDisplayColumn: { enableResizing: true },
    enableRowVirtualization: true,
    enablePagination: false,
    enableGlobalFilterModes: true,
    initialState: { showColumnFilters: true},
    onSortingChange: setSorting,
    enableBottomToolbar: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        setSecurity(row.original.name);
        setInitSelectedStrategy(row.original.bestStrategy)
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),
    state: { sorting},
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer  
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            justifyContent: 'space-between',
          })}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MRT_ToggleFiltersButton table={table} />
          </Box>
        </Box>
      );
    },
  });  
  
  return <Grid container spacing={gridSpacing}>
            <Grid item xs={2}  md={2} lg={2}>
              <MaterialReactTable table={table} />
            </Grid>
            <Grid item xs={10}  md={10} lg={10} sx={{ pt: '16px !important' }}>
              {security ? <Container securityName={security} initSelectedStrategy={initSelectedStrategy} disableStrategySelect={false} /> : null}
            </Grid>
      </Grid>
  ;

};

export default SecuritiesCard;
