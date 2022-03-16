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
import AddIcon from '@mui/icons-material/Add';

const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

const Fleets = (props) => {
    let { value } = props;
    if (value[0]) {
        value.push(value[0]);
        value.push(value[0]);    
    }
    //console.dir(props);
    return (
        <Card>
        <CardHeader title="Fleets" sx={{height: '20px', color: 'white', backgroundColor: '#2196f3'}}/>
        <CardContent sx={{ minHeight: 225, maxHeight: 225, overflow: 'auto' }}>
        <Grid container spacing={3}>
            {value.map((record, index) => {
                //console.dir(app);
                return (
                    <Grid item xs="auto">
                        <Card sx={{ minWidth: 200, maxWidth: 200, minHeight: 225, maxHeight: 225  }}>
                            <CardHeader title={record['app name']} sx={{height: '15px', fontWeight: 'bold', backgroundColor: '#eeeeee'}} titleTypographyProps={{variant:'inherit' }}/>
                            <CardContent sx={{ paddingTop: "4px", paddingBottom: "4px" }}>
                                <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none", paddingLeft: "0px", paddingRight: "0px", paddingTop: "2px", paddingBottom: "2px"}}}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Org</TableCell>
                                            <TableCell align="right">{record['organizationName']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Devices</TableCell>
                                            <TableCell align="right">{record['numDevices']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Online</TableCell>
                                            <TableCell align="right">{record['numOnlineDevices']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Type</TableCell>
                                            <TableCell align="right">{truncate(record['deviceTypeName'], 10)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">
                                                <Button variant="outlined" color="primary" size="small" href={`/#/device/create?source={"belongs to-application": ${record['id']}}`}>
                                                    <AddIcon style={{marginRight: "4px"}}/> Add Device
                                                    </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardActions sx={{ paddingTop: "4px", paddingBottom: "4px", justifyContent: "center" }}>
                                <Button size="small" href={`/#/application/${record['id']}`}>Details</Button>
                                <Button size="small" href={`/#/application%20environment%20variable?filter={"application":${record["id"]}}`}>Env Vars</Button>
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

export default Fleets;