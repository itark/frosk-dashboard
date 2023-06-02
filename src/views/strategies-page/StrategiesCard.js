import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  CardContent,
  Grid,
  Typography,
  ListItemIcon,
  MenuItem,
  Tooltip,
  useMediaQuery
} from '@mui/material';

import { AccountCircle, Send } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import ReactImageFallback from "react-image-fallback";

import MainCard from 'ui-component/cards/MainCard';
import { Container } from '../../ui-component/frosk/cards/Container';
import { TradesTable } from '../../ui-component/frosk/cards/TradesTable';
import ColumnBox from '../../ui-component/frosk/ColumnBox';
import { useTheme } from '@mui/material/styles';

import { gridSpacing } from 'store/constant';
import config from 'config';
import generic from 'assets/images/generic.svg';
import Kmd from  "cryptocurrency-icons/svg/color/kmd.svg"

const StrategiesCard = ( {featuredStrategies}) => {
  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 20,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              typography: 'h5',
              //color: 'black'
            }}
          > 
          {(cell.getValue())}
          </Box>
        ), 
      },
      {
        accessorKey: 'securityName',
        header: 'Security',
        size: 30,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              typography: 'h5',
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
        header: 'Return',
        size: 5,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },
      {
        accessorKey: 'sqn',
        header: 'SQN',
        size: 2,
      }, 
      {
        accessorKey: 'expectancy',
        header: 'Expectancy',
        size: 2,
      },       
      {
        accessorKey: 'profitableTradesRatio',
        header: 'Profitable ratio',
        size: 2,
      },   
      {
        accessorKey: 'maxDD',
        header: 'Max drawdown',
        size: 2,
      }, 
      {
        accessorKey: 'numberofTrades',
        header: 'Trades',
        size: 2,
      },
      {
        accessorKey: 'period',
        header: 'Period',
        size: 70,
      },
      {
        accessorKey: 'latestTrade',
        header: 'Latest trade',
        size: 50,
      }, 
      {
        accessorKey: 'isOpen',
        header: 'Open',
        size: 2,
      },   
    ],
    [],
  );

  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const virtualizerInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [strategies, setStrategies] = useState();
  const [expanded, setExpanded] = useState(false);
  const [columnPinning, setColumnPinning] = useState({});

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

  const openCoinbase = (securityName) => {
    window.open('https://www.coinbase.com/advanced-trade/'+securityName, '_blank');
  }

  return (
    <>
        <MainCard contentSX={{ height: 900 }} >
          <CardContent>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <MaterialReactTable
                    hoveredRow
                    columns={columns}
                    data={featuredStrategies}
                    renderTopToolbar={(table) => <Box sx={{
                      p: '20rem'
                    }}>Custom Top Toolbar</Box>}
                    displayColumnDefOptions={{
                      'mrt-row-actions': {
                        header: 'Actions', //change header text
                        size: 1, //make actions column wider
                      },
                      'mrt-row-expand': {
                        header: 'Expand', //change header text
                        size: 1, //make actions column wider
                      },
                    }}
                    enableColumnFilterModes
                    enableGlobalFilterModes
                    enablePagination={false}
                    enableRowVirtualization
                    enableRowActions
                    enableColumnResizing
                    initialState={{ sorting: [{ id: 'totalProfit', desc: false }],
                                    density: 'compact', 
                                    showColumnFilters: true ,
                                      columnFilters: [{
                                        id: 'sqn',
                                        value: [2,4]
                                      }, 
                                    //{
                                    //   id: 'expectancy',
                                    //   value: [2, 3]
                                    // }
                                  ]
                                  }}
                    enableExpandAll={false}                              
                    renderDetailPanel={({ row }) => (
                      <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>  
                          { row.getIsExpanded() ? <Container securityName={row.original.securityName} initSelectedStrategy={row.original.name+'Strategy'} disableStrategySelect={true}/>: null}    
                        </Grid>
                      </Grid>
                    )}   
                    renderRowActionMenuItems={({ row }) => [
                      <MenuItem
                        key={0}
                        onClick={() => {
                          openStrategy(row.original);
                        }}             
                        sx={{ m: 0 }}
                      >
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        View Strategy
                      </MenuItem>,
                      <MenuItem
                        key={1}
                        onClick={() => {
                          openCoinbase(row.original.securityName);
                         }}
                        sx={{ m: 0 }}
                      >
                        <ListItemIcon>
                          <Send />
                        </ListItemIcon>
                        View Coinbase
                      </MenuItem>,
                    ]}                                     
                    onSortingChange={setSorting}
                    state={{ isLoading, sorting, columnPinning }}
                    rowNumberMode="static"
                    virtualizerInstanceRef={virtualizerInstanceRef} //optional
                    virtualizerProps={{ overscan: 20 }} //optionally customize the virtualizer
                  />
                </Grid>
            </Grid>
          </CardContent>
        </MainCard> 

    </>
  );
};

export default StrategiesCard;
