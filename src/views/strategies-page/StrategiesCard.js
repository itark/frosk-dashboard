import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ColumnBox from '../../ui-component/frosk/ColumnBox';
import { Container } from '../../ui-component/frosk/cards/Container';
import { gridSpacing } from 'store/constant';
import ReactImageFallback from "react-image-fallback";
import generic from 'assets/images/generic.svg';

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleFiltersButton,
} from 'material-react-table';

//Material UI Imports
import {
  Box,
  Grid,
  ListItemIcon,
  MenuItem,
  lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

const StrategiesCard = ({featuredStrategies}) => {
  console.log('featuredStrategies',featuredStrategies);
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
          accessorKey: 'name',
          filterVariant: 'autocomplete',
          header: 'Strategy',
          size: 10,
        },
        {
          accessorKey: 'securityName',
          header: 'Security',
          size: 10,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
            <ReactImageFallback
                src={row.original.icon}
                fallbackImage={generic}
                initialImage={generic}
            />
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          ),
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
            header: 'Win ratio',
            Cell: ({ cell }) =>
              cell.getValue() + '%' ,
            filterVariant: 'range-slider',
            filterFn: 'betweenInclusive', // default (or between)
            muiFilterSliderProps: {
              //no need to specify min/max/step if using faceted values
              marks: true,
              max: 100, //custom max (as opposed to faceted max)
              min: 0, //custom min (as opposed to faceted min)
              step: 10,
            },  
          },              
          {
            accessorKey: 'maxDD',
            header: 'Max DD',
            Cell: ({ cell }) =>
              cell.getValue() + '%' ,
            filterVariant: 'range-slider',
            filterFn: 'betweenInclusive', // default (or between)
            muiFilterSliderProps: {
              //no need to specify min/max/step if using faceted values
              marks: true,
              max: 100, //custom max (as opposed to faceted max)
              min: 0, //custom min (as opposed to faceted min)
              step: 10,
            },  
          },  

          {
            accessorKey: 'numberofTrades',
            header: 'Trades',
            Cell: ({ cell }) =>
              cell.getValue(),
            filterVariant: 'range-slider',
            filterFn: 'betweenInclusive', // default (or between)
            muiFilterSliderProps: {
              //no need to specify min/max/step if using faceted values
              marks: true,
              max: 50, //custom max (as opposed to faceted max)
              min: 0, //custom min (as opposed to faceted min)
              step: 1,
            },  
          }, 
          {
            accessorKey: 'period',
            header: 'Period',
            size: 50,
          },
          {
            accessorKey: 'latestTrade',
            header: 'Latest',
            size: 20,
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
    data,
    enableGlobalFilterModes: true,
    enableGrouping: true,
    enableRowActions: true,
    enableExpandAll: false,
    enablePagination: false,
    initialState: { showColumnFilters: true, sorting: [{ id: 'totalProfit', desc: true },{ id: 'sqn', desc: true }],},
    //muiTableContainerProps: { sx: { height: '80%', width: '100%' } },
    renderDetailPanel:({ row }) => (
      <Grid container spacing={gridSpacing}>
        <Grid item xs={11}>  
          { row.getIsExpanded() ? <Container securityName={row.original.securityName} securityDesc={row.original.securityDesc} initSelectedStrategy={row.original.name+'Strategy'} disableStrategySelect={true}/>: null}    
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

};

export default StrategiesCard;
