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

const Fleets = (props) => {
    let { value } = props;
    if (value[0]) {
        value.push(value[0]);
        value.push(value[0]);    
    }
    console.dir(props);
    return (
        <Card>
        <CardHeader title="Fleets" sx={{height: '20px', color: 'white', backgroundColor: '#2196f3'}}/>
        <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Grid container spacing={3}>
            {value.map(function(app, index){
                console.dir(app);
                return (
                    <Grid item xs="auto">
                        <Card sx={{ minWidth: 200, minHeight: 225  }}>
                            <CardHeader title={app['app name']} sx={{height: '15px', fontWeight: 'bold', backgroundColor: '#eeeeee'}} titleTypographyProps={{variant:'inherit' }}/>
                            <CardContent>
                                <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none", paddingLeft: "0px", paddingRight: "0px", paddingTop: "2px", paddingBottom: "2px"}}}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Org</TableCell>
                                            <TableCell align="right">{app['organization']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Online</TableCell>
                                            <TableCell align="right">1/1 devices</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bold'}}>Type</TableCell>
                                            <TableCell align="right">{app['is for-device type']}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">
                                                <Button size="small" href="/#/application">Add Device</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardActions>
                                <Button size="small" href="/#/application">Details</Button>
                                <Button size="small" href="/#/application%20environment%20variable">Env Vars</Button>
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