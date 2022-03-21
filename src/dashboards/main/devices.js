import * as React from 'react';
import {
    Grid,
    Button,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import DeviceConnectButton from '../../ui/DeviceConnectButton';

const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

const Devices = (props) => {
    let { value } = props;
    return (
        <Card>
        <CardHeader title="Devices" sx={{height: '20px', color: 'white', backgroundColor: '#2196f3'}}/>
        <CardContent sx={{ minHeight: 225, maxHeight: 225, overflow: 'auto' }}>
        <Grid container spacing={3}>
            {value.map((record, index) => {
                return (
                    <Grid item key={index} xs="auto">
                        <Card sx={{ minWidth: 200, maxWidth: 200, minHeight: 225, maxHeight: 225  }}>
                            <CardHeader title={record['device name']} sx={{height: '15px', fontWeight: 'bold', backgroundColor: '#eeeeee'}} titleTypographyProps={{variant:'inherit' }}/>
                            <CardContent sx={{ paddingTop: "4px", paddingBottom: "4px" }}>
                                <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none", paddingLeft: "0px", paddingRight: "0px", paddingTop: "2px", paddingBottom: "2px"}}}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Fleet</TableCell>
                                            <TableCell align="right">{truncate(record['applicationName'], 12)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                                            <TableCell align="right">{record['status'] == null ? "Offline" : record['status']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>OS Ver</TableCell>
                                            <TableCell align="right">{record['os version'] ? record['os version'].split(' ')[1] : "n/a"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Type</TableCell>
                                            <TableCell align="right">{truncate(record['deviceTypeName'], 12)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">
                                                <DeviceConnectButton variant="outlined" color="primary" size="small" record={record} label="Connect"></DeviceConnectButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardActions sx={{ paddingTop: "4px", paddingBottom: "4px", justifyContent: "center" }}>
                                <Button size="small" href={`/#/device/${record['id']}`}>Details</Button>
                                <Button size="small" href={`/#/device%20environment%20variable?filter={"device":${record["id"]}}`}>Env Vars</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )
            })}
        </Grid>
        </CardContent>
        </Card>
    );
};

export default Devices;