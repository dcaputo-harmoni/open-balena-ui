import { Box, LinearProgress } from '@mui/material';
import * as React from 'react';
import { useRecordContext } from 'react-admin';

const LinearProgressWithLabel = (props) => {
  return (
    <Box
      sx={{mb: 2.75, mx: '10px', display: 'flex', alignItems: 'center' }}
      style={props.style}
    >
      <Box sx={{ flex: 1, minWidth: '3em' }}>{props.label}</Box>
      <Box sx={{ flex: 10, minWidth: '12em', mr: 1, ml: 2 }}>
        <LinearProgress variant='determinate' color='secondary' {...props} />
      </Box>
      <Box sx={{ flex: 1, minWidth: '3em' }}>
        {props.displayValue ? props.displayValue + props.displayUnits : Math.round(props.value) + '%'}
      </Box>
    </Box>
  );
};

const UsageWidget = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <>
      <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{flex: 1, margin: '10px 0'}}>
          <LinearProgressWithLabel label='CPU' value={isFinite(record['cpu usage']) ? record['cpu usage'] : 0} />

          <LinearProgressWithLabel
            style={{ marginBottom: '0' }}
            label='Temp'
            value={isFinite(record['cpu temp']) ? (record['cpu temp'] / 90) * 100 : 0}
            displayValue={isFinite(record['cpu temp']) ? record['cpu temp'] : 0}
            displayUnits='&#x2103;'
          />
        </div>

        <div style={{flex: 1, margin: '10px 0'}}>
          <LinearProgressWithLabel
            label='SD'
            value={
              isFinite(record['storage usage'] / record['storage total'])
                ? (record['storage usage'] / record['storage total']) * 100
                : 0
            }
          />

          <LinearProgressWithLabel
            style={{ marginBottom: '0' }}
            label='RAM'
            value={
              isFinite(record['memory usage'] / record['memory total'])
                ? (record['memory usage'] / record['memory total']) * 100
                : 0
            }
          />
        </div>
      </Box>
    </>
  );
};

export default UsageWidget;
