import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  CardContent,
  Grid,
} from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import { Container } from '../../ui-component/frosk/cards/Container';
import ColumnBox from '../../ui-component/frosk/ColumnBox';
import { gridSpacing } from 'store/constant';
import config from 'config';

const SecuritiesCard = ( {securities}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Namn',
        size: 50,
      },
      {
        accessorKey: 'oneDayPercent',
        header: '1d',
        size: 5,
        Cell: ({ cell }) =>
         <ColumnBox cell={cell}></ColumnBox>
      },
      {
        accessorKey: 'oneWeekPercent',
        header: '1w',
        size: 5,
        Cell: ({ cell }) =>
          <ColumnBox cell={cell}></ColumnBox>      
      },
      {
        accessorKey: 'oneMonthPercent',
        header: '1m',
        size: 5,
        Cell: ({ cell }) =>
          <ColumnBox cell={cell}></ColumnBox>
      },
      {
        accessorKey: 'threeMonthPercent',
        header: '3m',
        size: 5,
        Cell: ({ cell }) =>
          <ColumnBox cell={cell}></ColumnBox>
      },
      {
        accessorKey: 'sixMonthPercent',
        header: '6m',
        size: 5,
        Cell: ({ cell }) =>
          <ColumnBox cell={cell}></ColumnBox>
      }
    ],
    [],
  );

  //optionally access the underlying virtualizer instance
  const virtualizerInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [security, setSecurity] = useState();
  const [strategies, setStrategies] = useState();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false);
    }
    getStrategies();
  }, []);

  useEffect(() => {
    if (virtualizerInstanceRef.current) {
      //scroll to the top of the table when the sorting changes
      virtualizerInstanceRef.current.scrollToIndex(0);
    }
  }, [sorting]);

  const getStrategies = () => {
    const strats = [];
    fetch(config.baseApi+"/strategies")
      .then((response) => response.json())
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          strats.push(  {
            value: response[i],
            label: response[i]
          })
        }
        setStrategies(strats);
      });
  }

  return (
    <>
        <MainCard >
          <CardContent>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={2}>
                  <MaterialReactTable
                    muiTableBodyRowProps={({ row }) => ({
                      onClick: (event) => {
                        setSecurity(row.original.name);
                      },
                      sx: {
                        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
                      },
                    })}
                    columns={columns}
                    data={securities}
                    //optionally override the default column widths
                    defaultColumn={{
                      maxSize: 400,
                      minSize: 100,
                      size: 180, //default size is usually 180
                    }}
                    enableColumnResizing
                    columnResizeMode="onChange" //default is "onEnd"                   
                    enableColumnOrdering
                    enableBottomToolbar={false}
                    enableGlobalFilterModes
                    enablePagination={false}
                    enableRowVirtualization
                    initialState={{ density: 'compact' }}
                    muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
                    onSortingChange={setSorting}
                    state={{ isLoading, sorting }}
                    virtualizerInstanceRef={virtualizerInstanceRef} //optional
                    virtualizerProps={{ overscan: 20 }} //optionally customize the virtualizer
                  />
                </Grid>
                <Grid item xs={10} sx={{ pt: '16px !important' }}>
                  { security ? <Container securityName={security} strategies={strategies}/>: null}    
                </Grid>
            </Grid>
          </CardContent>
        </MainCard>  
    </>
  );
};

export default SecuritiesCard;
