import * as React from 'react';
import {
    Grid, 
    Typography,
    Button,
    Card,
    CardHeader,
    CardActions,
    CardContent,
} from '@mui/material';

const Devices = (props) => {
    let { value } = props;
    if (value[0]) {
        value.push(value[0]);
        value.push(value[0]);    
    }
    console.dir(props);
    return (
        <Card>
        <CardHeader title="Devices" sx={{height: '20px', color: 'white', backgroundColor: '#2196f3'}}/>
        <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Grid container spacing={3}>
            {value.map(function(app, index){
                console.dir(app);
                return (
                    <Grid item xs="auto">
                        <Card sx={{ minWidth: 200, minHeight: 225  }}>
                            <CardHeader title={app['device name']} sx={{height: '15px', fontWeight: 'bold', backgroundColor: '#eeeeee'}} titleTypographyProps={{variant:'inherit' }}/>
                            <CardContent>
                                <Typography sx={{ fontSize: 12 }}>
                                    Testing...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" href="/#/device">Details</Button>
                                <Button size="small" href="/#/device%20environment%20variable">Env Vars</Button>
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