import { Box } from '@mui/material';
import React from 'react';

const Row = ({ children, sx }) => {
  return (
    <Box
      className='row'
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'auto',
        gap: '30px',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default Row;
