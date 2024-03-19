import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import GrainIcon from '@mui/icons-material/Grain';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import * as React from 'react';
import { EditButton, ResourceContextProvider, ShowButton } from 'react-admin';
import DeviceConnectButton from '../../ui/DeviceConnectButton';
import EnvVarButton from '../../ui/EnvVarButton';

const Devices = (props) => {
  let { value } = props;

  return (
    <ResourceContextProvider value='device'>
      <Card sx={{ flex: '1', dispay: 'flex', flexDirection: 'column' }}>
        <CardHeader title='Devices' sx={{ color: 'white', backgroundColor: '#2196f3' }} />
        <CardContent sx={{ minHeight: 225, overflow: 'auto', flex: '1', dispay: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={3} sx={{ flex: '1' }}>
            {value.map((record, index) => {
              return (
                <Grid item key={index} xs='auto'>
                  <Card sx={{ minWidth: 200, maxWidth: 200, minHeight: 225, maxHeight: 225 }}>
                    <CardHeader
                      title={record['device name']}
                      sx={{ fontWeight: 'bold', backgroundColor: '#eeeeee' }}
                      titleTypographyProps={{ variant: 'inherit' }}
                    />
                    <CardContent sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                      <Table
                        sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: 'none',
                            paddingLeft: '0px',
                            paddingRight: '0px',
                            paddingTop: '2px',
                            paddingBottom: '2px',
                          },
                        }}
                      >
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Chip
                                icon={<GrainIcon />}
                                label={record['applicationName']}
                                variant='outlined'
                                style={{ width: '100%', justifyContent: 'space-between', paddingLeft: '5px' }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Chip
                                icon={<DeveloperBoardIcon />}
                                label={record['deviceTypeName']}
                                variant='outlined'
                                style={{ width: '100%', justifyContent: 'space-between', paddingLeft: '5px' }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align='right'>
                              {record['api heartbeat state'] === 'online' ? 'Online' : 'Offline'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>OS</TableCell>
                            <TableCell align='right'>
                              {record['os version'] ? record['os version'].split(' ')[1] : 'n/a'}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardActions sx={{ paddingTop: '4px', paddingBottom: '4px', justifyContent: 'center' }}>
                      <DeviceConnectButton record={record} label='' style={{ minWidth: '40px', marginRight: '7px' }} />
                      <ShowButton record={record} label='' style={{ minWidth: '40px' }} />
                      <EditButton record={record} label='' style={{ minWidth: '40px' }} />
                      <EnvVarButton resource='device' record={record} label='' style={{ minWidth: '40px' }} />
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </ResourceContextProvider>
  );
};

export default Devices;
