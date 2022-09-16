import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { makeData } from './makeData';
import ChartContainer from './ChartContainer';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const SecuritiesTable = ( {securities}) => {
  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'securityName',
        header: 'Namn',
        size: 50,
      }
    ],
    [],
    //end
  );

  //optionally access the underlying virtualizer instance
  const virtualizerInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);

  const [test, setTest] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //setData(makeData(10_000));
      console.log('SecuritiesTable useEffect 1, test=', test);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('SecuritiesTable useEffect 2, test=', test);
    if (virtualizerInstanceRef.current) {
      //scroll to the top of the table when the sorting changes
      virtualizerInstanceRef.current.scrollToIndex(0);
    }
  }, [sorting]);

  return (
    <>
    <MaterialReactTable
      muiTableBodyRowProps={({ row }) => ({
        onClick: (event) => {
         // console.info(event, row.id);
          console.log('onClick, row.original.securityName',row.original.securityName)
         // console.log('onClick, row',row)
          setTest(row.original.securityName);

        },
        sx: {
          cursor: 'pointer', //you might want to change the cursor too when adding an onClick
        },
      })}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      columns={columns}
      data={securities}
      editingMode="modal" //default
      enableColumnOrdering
      enableEditing
      //onEditingRowSave={handleSaveRowEdits}
      enableBottomToolbar={false}
      enableGlobalFilterModes
      enablePagination={false}
      //enableRowNumbers
      enableRowVirtualization
      initialState={{ density: 'compact' }}
      muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
      onSortingChange={setSorting}
      state={{ isLoading, sorting }}
      virtualizerInstanceRef={virtualizerInstanceRef} //optional
      virtualizerProps={{ overscan: 20 }} //optionally customize the virtualizer
    />
    </>
  );
};

export default SecuritiesTable;
