import { Box } from '@mui/material';


const ColumnBox = ({cell}) => {
    return (
      <Box
      sx={(theme) => ({
        backgroundColor:
          cell.getValue() < 0
            ? theme.palette.error.dark
            : cell.getValue() >= 0
            ? theme.palette.success.dark
            : theme.palette.success.dark,
        borderRadius: '0.25rem',
        color: '#fff',
        maxWidth: '9ch',
        p: '0.25rem',
      })}
      >
      {(cell.getValue()*100)?.toLocaleString?.('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%
    </Box> 
    )
  }
  export default ColumnBox;
