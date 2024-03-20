import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import dateFormat from 'dateformat';
import * as React from 'react';
import { FunctionField, ReferenceField, TextField, useRecordContext } from 'react-admin';
import DeviceServices from '../../ui/DeviceServices';
import SemVerTextField from '../../ui/SemVerTextField';

const styles = {
  outerTable: {
    '& td': {
      borderBottom: 'none',
      width: '50%',
      padding: '0px',
      verticalAlign: 'top',
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },
  innerTable: {
    'marginBottom': '20px',
    '& td': {
      borderBottom: 'none',
      width: '25%',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  headerRow: {
    'borderBottom': '2px #cccccc solid',
    '& td': {
      fontSize: '12pt',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  },
  dataRow: {
    '& td': {
      paddingTop: '10px',
      paddingBottom: '0px',
    },
  },
  labelCell: {
    fontWeight: 'bold',
  },
  valueCell: {
    textAlign: 'right',
  },
};

const toTitleCase = (str) => {
  return str
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(' ');
};

const Summary = () => {
  const record = useRecordContext();

  return (
    <Table sx={styles.outerTable}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Table sx={styles.innerTable}>
              <TableBody>
                <TableRow sx={styles.headerRow}>
                  <TableCell colSpan={4}> Device Status </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Device State</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='status' />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Fleet</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <ReferenceField source='belongs to-application' reference='application' target='id'>
                      <TextField source='app name' />
                    </ReferenceField>
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Release Revision</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <ReferenceField source='is running-release' reference='release' target='id'>
                      <SemVerTextField />
                    </ReferenceField>
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Target Revision</TableCell>
                  <TableCell sx={styles.valueCell}>
                    {record['should be running-release'] ? (
                      <ReferenceField source='should be running-release' reference='release' target='id'>
                        <SemVerTextField />
                      </ReferenceField>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>OS</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField
                      render={(record) =>
                        `${record['os version'] ? record['os version'] : ''}${record['os variant'] ? '-' + record['os variant'] : ''}`
                      }
                    />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Supervisor</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='supervisor version' />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Connectivity</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${toTitleCase(record['api heartbeat state'])}`} />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>As of</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField
                      render={(record) =>
                        `${dateFormat(new Date(record['last connectivity event']), 'dd-mmm-yy h:MM:ss TT Z')}`
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>VPN State</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField
                      render={(record) => `${record['is connected to vpn'] ? 'Connected' : 'Disconnected'}`}
                    />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>As of</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField
                      render={(record) => `${dateFormat(new Date(record['last vpn event']), 'dd-mmm-yy h:MM:ss TT Z')}`}
                    />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Public Address</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='public address' />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>VPN Address</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='vpn address' />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>IP Address</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='ip address' />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Mac Addresses</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='mac address' />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Memory Usage</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['memory usage'])}mb`} />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Total Memory</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['memory total'])}mb`} />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>Storage Usage</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['storage usage'])}mb`} />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Total Storage</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['storage total'])}mb`} />
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>CPU Usage</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['cpu usage'])}%`} />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>CPU Temp</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${Math.round(record['cpu temp'])}`} />
                    &deg;C
                  </TableCell>
                </TableRow>
                <TableRow sx={styles.dataRow}>
                  <TableCell sx={styles.labelCell}>CPU ID</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <TextField source='cpu id' />
                  </TableCell>
                  <TableCell sx={styles.labelCell}>Undervolted</TableCell>
                  <TableCell sx={styles.valueCell}>
                    <FunctionField render={(record) => `${record['is undervolted'] === 1 ? 'Yes' : 'No'}`} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
          <TableCell>
            <Table sx={styles.innerTable}>
              <TableBody>
                <TableRow sx={styles.headerRow}>
                  <TableCell colSpan={4}> Device Services </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <DeviceServices />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default Summary;
