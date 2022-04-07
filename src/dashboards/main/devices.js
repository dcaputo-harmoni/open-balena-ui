import * as React from 'react';
import {
    Grid,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from '@mui/material';
import {
    ShowButton,
    EditButton,
} from 'react-admin';
import { tableCellClasses } from "@mui/material/TableCell";
import EnvVarButton from '../../ui/EnvVarButton';
import DeviceConnectButton from '../../ui/DeviceConnectButton';
import GrainIcon from '@mui/icons-material/Grain';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

const Devices = props => {
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
                                            <TableCell colSpan={2}><Chip icon={<GrainIcon/>} label={record['applicationName']} variant="outlined" style={{width:"100%", justifyContent: 'space-between', paddingLeft: "5px"}}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}><Chip icon={<DeveloperBoardIcon/>} label={record['deviceTypeName']} variant="outlined" style={{width:"100%", justifyContent: 'space-between', paddingLeft: "5px"}}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                                            <TableCell align="right">{record['api heartbeat state'] === 'online' ? "Online" : "Offline"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>OS</TableCell>
                                            <TableCell align="right">{record['os version'] ? record['os version'].split(' ')[1] : "n/a"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardActions sx={{ paddingTop: "4px", paddingBottom: "4px", justifyContent: "center" }}>
                                <DeviceConnectButton record={record} label="" style={{color: "black", minWidth: "40px", marginRight: "7px"}}/>
                                <ShowButton record={record} basePath="/device" label="" color="default" style={{minWidth: "40px"}}/>
                                <EditButton record={record} basePath="/device" label="" color="default" style={{minWidth: "40px"}}/>
                                <EnvVarButton resource="device" record={record} label="" style={{color: "black", minWidth: "40px"}}/>
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