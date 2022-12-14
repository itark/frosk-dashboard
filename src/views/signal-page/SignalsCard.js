import { Link, useNavigate, createSearchParams } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  CardContent,
  Grid,
  Typography,
  ListItemIcon,
  MenuItem,
  useMediaQuery
} from '@mui/material';

import { AccountCircle, Send } from '@mui/icons-material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import ReactImageFallback from "react-image-fallback";

import MainCard from 'ui-component/cards/MainCard';
import { Container } from '../../ui-component/frosk/cards/Container';
import { TradesTable } from '../../ui-component/frosk/TradesTable';
import ColumnBox from '../../ui-component/frosk/ColumnBox';
import { useTheme } from '@mui/material/styles';

import { gridSpacing } from 'store/constant';
import config from 'config';
import generic from 'assets/images/generic.svg';
import Kmd from  "cryptocurrency-icons/svg/color/kmd.svg"


const CardWrapper = styled(MainCard)(({ theme }) => ({
  //height: 900,
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: '50%',
      top: -85,
      right: -95,
      [theme.breakpoints.down('sm')]: {
          top: -105,
          right: -140
      }
  },
  '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: theme.palette.secondary[800],
      borderRadius: '50%',
      top: -125,
      right: -15,
      opacity: 0.5,
      [theme.breakpoints.down('sm')]: {
          top: -155,
          right: -70
      }
  }
}));



const SignalsCard = ( {featuredStrategies}) => {
  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Strategy',
        size: 50,
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
        header: 'Total profit',
        size: 5,
        Cell: ({ cell }) =>
        <ColumnBox cell={cell}></ColumnBox>  
      },
      {
        accessorKey: 'period',
        header: 'Period',
        size: 80,
      },
      {
        accessorKey: 'latestTrade',
        header: 'Latest trade',
        size: 30,
      }, 
      {
        accessorKey: 'numberOfTicks',
        header: 'Bars',
        size: 2,
      },  
      {
        accessorKey: 'numberofTrades',
        header: 'Trades',
        size: 2,
      },
      {
        accessorKey: 'averageTickProfit',
        header: 'Avg. tickprofit',
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
      // if (isDesktop) {
      //   setColumnPinning({
      //     left: ['mrt-row-expand', 'mrt-row-numbers', 'columnInstanceAPI'],
      //     right: ['link'],
      //   });
      // } else {
      //   setColumnPinning({});
      // }
    }
  }, [isDesktop]);



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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };  

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

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


  //https://ultimatecourses.com/blog/navigate-to-url-query-strings-search-params-react-router
  const useNavigateSearch = () => {
    const navigate = useNavigate();
    return (pathname, params) =>
      navigate({ pathname, search: `?${createSearchParams(params)}` });
  };
  const navigateSearch = useNavigateSearch();
  const goToStrategy = () => {
    navigateSearch('/strategy-page', { sort: 'date', order: 'newest' });
  }


  return (
    <>
        <MainCard contentSX={{ height: 900 }} >
          <CardContent>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <MaterialReactTable
                    columns={columns}
                    data={featuredStrategies}
                    displayColumnDefOptions={{
                      'mrt-row-numbers': {
                        size: 10,
                      },
                      'mrt-row-expand': {
                        size: 10,
                      },
                    }}                    
                    enableColumnFilterModes
                    enablePinning
                    positionToolbarAlertBanner="bottom"
                    enableBottomToolbar={false}
                    enableGlobalFilterModes
                    enablePagination={false}
                    enableRowVirtualization
                    enableRowActions
                    initialState={{ sorting: [{ id: 'totalProfit', desc: false }],
                                    density: 'compact', 
                                    showColumnFilters: true ,
                                  }}
                    renderDetailPanel={({ row }) => (
                      <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>  
                          { row.original.securityName ? <Container featuredStrategy={row.original} securityName={row.original.securityName} strategies={strategies} initStrategy={row.original.name}/>: null}    
                        </Grid>
                        <Grid item xs={12}>  
                          <Typography variant="h5">Trades {row.original.name} | {row.original.securityName} </Typography>
                          <ExpandMore
                              expand={expanded}
                              onClick={handleExpandClick}
                              aria-expanded={expanded}
                              aria-label="show more">
                            <ExpandMoreIcon />
                          </ExpandMore>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                              {row.original.trades ? <TradesTable trades={row.original.trades} />:null }
                            </Collapse>   
                        </Grid>
                      </Grid>
                    )}   
                    renderRowActionMenuItems={({ closeMenu, row }) => [
                      <MenuItem
                        key={0}
                        // onClick={() => {
                        //   closeMenu();
                        // }}
                        onClick={goToStrategy}                        
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
                          // Send email logic...
                          closeMenu();
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
                    //onColumnPinningChange={setColumnPinning}
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

export default SignalsCard;
