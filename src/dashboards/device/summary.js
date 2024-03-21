import { Box, Card } from '@mui/material';
import React from 'react';
import { useRecordContext } from 'react-admin';
import DeviceServices from '../../ui/DeviceServices';

const Summary = () => {
  const record = useRecordContext();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card sx={{ padding: '15px', flex: 1, marginRight: '30px' }}>Testing</Card>

        <Card sx={{ padding: '15px', width: '55%' }}>
          <DeviceServices />
        </Card>
      </Box>
    </>
  );
};

export default Summary;
