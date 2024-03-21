import LightModeIcon from '@mui/icons-material/LightMode';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Button, Card, CardActions, LinearProgress, Typography } from '@mui/material';
import * as React from 'react';
import { FunctionField, ReferenceField, TextField, useAuthProvider, useNotify, useRecordContext } from 'react-admin';
import { OnlineField } from '../../components/device';
import utf8decode from '../../lib/utf8decode';

const styles = {
  bannerCard: {
    padding: '1em',
    marginTop: 0,
    paddingBottom: '2em',
  },
  actionCard: {
    'padding': 0,
    'flexWrap': 'wrap',
    '& button': {
      marginTop: '2em',
      marginLeft: '0.25em !important',
      marginRight: '1em',
    },
  },
};

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ minWidth: '20em', maxWidth: '20em', mb: 2.75, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: '3em', maxWidth: '3em' }}>{props.label}</Box>
      <Box sx={{ minWidth: '12em', maxWidth: '12em', mr: 1, ml: 2 }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: '3em', maxWidth: '3em' }}>
        {props.displayValue ? props.displayValue + props.displayUnits : Math.round(props.value) + '%'}
      </Box>
    </Box>
  );
};

const Banner = () => {
  const authProvider = useAuthProvider();
  const notify = useNotify();
  const record = useRecordContext();

  const invokeSupervisor = (device, command) => {
    const session = authProvider.getSession();
    return fetch(`${process.env.REACT_APP_OPEN_BALENA_API_URL}/supervisor/v1/${command}`, {
      method: 'POST',
      body: JSON.stringify({ uuid: device.uuid }),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwt}`,
      }),
      insecureHTTPParser: true,
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.body
          .getReader()
          .read()
          .then((streamData) => {
            const result = utf8decode(streamData.value);
            if (result === 'OK') notify(`Successfully executed command ${command} on device ${device['device name']}`);
          });
      })
      .catch(() => {
        notify(`Error: Could not execute command ${command} on device ${device['device name']}`);
      });
  };

  if (!record) return null;

  return (
    <Card sx={styles.bannerCard}>
      <Box display='flex'>
        <Box flex='1'>
          <Typography variant='h5' component='h2' gutterBottom>
            {record['device name']}
          </Typography>

          <Box maxWidth='40em'>
            <p style={{ marginBottom: '5px' }}>
              <b>Fleet: </b>
              <ReferenceField source='belongs to-application' reference='application' target='id'>
                <TextField source='app name' style={{ fontSize: '12pt' }} />
              </ReferenceField>
            </p>

            <p style={{ margin: 0 }}>
              <b>Status: </b>
              <OnlineField source='api heartbeat state' />
            </p>
          </Box>

          <CardActions sx={styles.actionCard}>
            <FunctionField
              render={(record) => {
                const isOffline = record['api heartbeat state'] !== 'online';

                return (
                  <>
                    <Button
                      variant='outlined'
                      size='medium'
                      onClick={() => invokeSupervisor(record, 'blink')}
                      startIcon={<LightModeIcon />}
                      disabled={isOffline}
                    >
                      Blink
                    </Button>
                    <Button
                      variant='outlined'
                      size='medium'
                      onClick={() => invokeSupervisor(record, 'reboot')}
                      startIcon={<RestartAltIcon />}
                      disabled={isOffline}
                    >
                      Reboot
                    </Button>
                    <Button
                      variant='outlined'
                      size='medium'
                      onClick={() => invokeSupervisor(record, 'shutdown')}
                      startIcon={<PowerSettingsNewIcon />}
                      disabled={isOffline}
                    >
                      Shutdown
                    </Button>
                  </>
                );
              }}
            />
          </CardActions>
        </Box>

        <Box display='block' height='10em' overflow='hidden'>
          <LinearProgressWithLabel label='CPU' value={isFinite(record['cpu usage']) ? record['cpu usage'] : 0} />

          <LinearProgressWithLabel
            label='Temp'
            value={isFinite(record['cpu temp']) ? (record['cpu temp'] / 90) * 100 : 0}
            displayValue={isFinite(record['cpu temp']) ? record['cpu temp'] : 0}
            displayUnits='&deg;C'
          />

          <LinearProgressWithLabel
            label='SD'
            value={
              isFinite(record['storage usage'] / record['storage total'])
                ? (record['storage usage'] / record['storage total']) * 100
                : 0
            }
          />

          <LinearProgressWithLabel
            label='RAM'
            value={
              isFinite(record['memory usage'] / record['memory total'])
                ? (record['memory usage'] / record['memory total']) * 100
                : 0
            }
          />
        </Box>
      </Box>
    </Card>
  );
};

export default Banner;
