import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  CardContent,
  Grid,
  Avatar,
  Typography,
} from '@mui/material';

import ReactImageFallback from "react-image-fallback";

import MainCard from 'ui-component/cards/MainCard';
import { Container } from '../../ui-component/frosk/cards/Container';
import ColumnBox from '../../ui-component/frosk/ColumnBox';

import { gridSpacing } from 'store/constant';
import config from 'config';
import generic from 'assets/images/generic.svg';
import Kmd from  "cryptocurrency-icons/svg/color/kmd.svg"


const SignalsCard = ( {featuredStrategies}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 20,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        accessorKey: 'securityName',
        header: 'Security',
        size: 30,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          > 
          <ReactImageFallback
              src={row.original.icon}
              fallbackImage={generic}
              initialImage={generic}
          />
          {(cell.getValue())}
          </Box>
        ), 
      },
      {
        accessorKey: 'totalProfit',
        header: 'Total profit',
        size: 5,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },
      {
        accessorKey: 'period',
        header: 'Period',
        size: 50,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        accessorKey: 'latestTrade',
        header: 'Latest trade',
        size: 20,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      }, 
      {
        accessorKey: 'numberOfTicks',
        header: 'Bars',
        size: 5,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      },  
      {
        accessorKey: 'numberofTrades',
        header: 'Trades',
        size: 5,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      }, 
      {
        accessorKey: 'isOpen',
        header: 'Open',
        size: 2,
        muiTableHeadCellProps: {
          align: 'left',
        },
        muiTableBodyCellProps: {
          align: 'left',
        },
      },                             
    ],
    [],
  );

  //optionally access the underlying virtualizer instance
  const virtualizerInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
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
                <Grid item xs={12}>
                  <MaterialReactTable
                    columns={columns}
                    data={featuredStrategies}
                    enableColumnFilterModes
                    enableColumnResizing
                    columnResizeMode="onChange" //default is "onEnd"                   
                    enableColumnOrdering
                    enableBottomToolbar={false}
                    enableGlobalFilterModes
                    enablePagination={false}
                    enableRowVirtualization
                    initialState={{ density: 'compact', 
                                    showColumnFilters: true ,
                                    sorting: [{ id: 'securityName', desc: true }],
                                  }}
                    renderDetailPanel={({ row }) => (
                        <Grid item xs={12}>
                          { row.original.securityName ? <Container securityName={row.original.securityName} strategies={strategies} initStrategy={row.original.name}/>: null}    
                        </Grid>
                    )}                    
                    onSortingChange={setSorting}
                    state={{ isLoading, sorting }}
                    virtualizerInstanceRef={virtualizerInstanceRef} //optional
                    virtualizerProps={{ overscan: 20 }} //optionally customize the virtualizer
                    renderTopToolbarCustomActions={() => (
                      <Typography color="success.dark" component="span" variant="h3">
                        Fiat: EUR
                      </Typography>
                    )}
                  />
                </Grid>
            </Grid>
          </CardContent>
        </MainCard>  
    </>
  );
};

export default SignalsCard;
