import { Box, LinearProgress } from '@mui/material';
import * as React from 'react';
import { useRecordContext } from 'react-admin';

const LinearProgressWithLabel = (props) => {
  return (
    <Box
      sx={{ minWidth: '20em', maxWidth: '20em', mb: 2.75, display: 'flex', alignItems: 'center' }}
      style={props.style}
    >
      <Box sx={{ minWidth: '3em', maxWidth: '3em' }}>{props.label}</Box>
      <Box sx={{ minWidth: '12em', maxWidth: '12em', mr: 1, ml: 2 }}>
        <LinearProgress variant='determinate' color='secondary' {...props} />
      </Box>
      <Box sx={{ minWidth: '3em', maxWidth: '3em' }}>
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
      <Box style={{ display: 'flex' }}>
        <div>
          <LinearProgressWithLabel label='CPU' value={isFinite(record['cpu usage']) ? record['cpu usage'] : 0} />

          <LinearProgressWithLabel
            style={{ marginBottom: '0' }}
            label='Temp'
            value={isFinite(record['cpu temp']) ? (record['cpu temp'] / 90) * 100 : 0}
            displayValue={isFinite(record['cpu temp']) ? record['cpu temp'] : 0}
            displayUnits='&deg;C'
          />
        </div>

        <div>
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
