import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ColumnBox from '../../ui-component/frosk/ColumnBox';
import { Container } from '../../ui-component/frosk/cards/Container';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';

//Material UI Imports
import {
  Box,
  Grid,
  CardContent,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

const StrategiesCard3 = ({featuredStrategies}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(featuredStrategies);
    }
  }, [featuredStrategies]);

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

  const columns = useMemo(
    () => [
          {
            accessorKey: 'name', //accessorFn used to join multiple data into a single cell
            header: 'Strategy',
            size: 20,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
              {/* <ReactImageFallback
                  src={row.original.icon}
                  fallbackImage={generic}
                  initialImage={generic}
              /> */}
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'securityName', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Security',
            size: 30,
          },
          {
            accessorKey: 'totalProfit',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            //filterFn: 'between',
            header: 'Total profit',
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
            header: 'Exp',
            size: 2,
          },
          {
            accessorKey: 'profitableTradesRatio',
            header: 'Ratio',
            size: 2,
          },   
          {
            accessorKey: 'maxDD',
            header: 'MaxDD',
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
            header: 'Latest',
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

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableRowActions: true,
    enableRowSelection: false,
    enableExpandAll: false,
    // initialState: {
    //   showColumnFilters: true,
    //   showGlobalFilter: true,
    //   // columnPinning: {
    //   //   left: ['mrt-row-expand', 'mrt-row-select'],
    //   //   right: ['mrt-row-actions'],
    //   // },
    //  // columnPinning: { left: ['name' ], right: ['isOpen', 'mrt-row-actions'] },
    // },
    initialState: { pagination: { pageSize: 25, pageIndex: 2 },  
                    sorting: [{ id: 'totalProfit', desc: true },{ id: 'sqn', desc: true }],
                    //grouping: ['name'],
                  },
    // paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiTableContainerProps: { sx: { height: '80%', width: '100%' } },
    renderDetailPanel:({ row }) => (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={11}>  
          { row.getIsExpanded() ? <Container securityName={row.original.securityName} initSelectedStrategy={row.original.name+'Strategy'} disableStrategySelect={true}/>: null}    
        </Grid>
      </Grid>
    ),
    renderRowActionMenuItems: ({ row }) => [
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
    ],                                    
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
            {/* import MRT sub-components */}
            {/* <MRT_GlobalFilterTextField table={table} /> */}
            <MRT_ToggleFiltersButton table={table} />
          </Box>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;

  // return (
  //   <>
  //       <MainCard contentSX={{ height: 900 }} >
  //         <CardContent>
  //             <Grid container spacing={gridSpacing}>
  //               <Grid item xs={12}>
  //                  <MaterialReactTable table={table}/>
  //               </Grid>
  //           </Grid>
  //         </CardContent>
  //       </MainCard> 
  //   </>
  // );

};

export default StrategiesCard3;
