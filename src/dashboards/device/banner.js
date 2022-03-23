import * as React from 'react';
import { Card, Box, CardActions, Button, Typography, LinearProgress } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { 
    TextField,
    ReferenceField,
} from 'react-admin'

const styles = {
    bannerCard: {
        background: '#2196f3',
        color: '#ffffff',
        padding: '1.5em',
        marginTop: 0,
        marginBottom: '1em',
    },
    actionCard: {
        padding: 0,
        flexWrap: 'wrap',
        '& a': {
            marginTop: '2em',
            marginLeft: '0.25em !important',
            marginRight: '2em',
        },
    }
}

const LinearProgressWithLabel = (props) => {
    return (
        <Box sx={{ minWidth: '20em', maxWidth: '20em', mb: 2.75, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ minWidth: '3em', maxWidth: '3em'}}>
                {props.label}
            </Box>
            <Box sx={{ minWidth: '12em', maxWidth: '12em', mr: 1, ml: 2 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: '3em', maxWidth: '3em' }}>
                {props.displayValue ? (props.displayValue + props.displayUnits) : Math.round(props.value) + '%'}
            </Box>
        </Box>
    );
}

const Banner = (props) => {
    if (props.loading) return null;
    console.dir(props);
    return (
        <Card sx={styles.bannerCard}>
            <Box display="flex">
                <Box flex="1">
                    <Typography variant="h5" component="h2" gutterBottom>
                        Device {props.record['device name']}
                    </Typography>
                    <Box maxWidth="40em">
                        <Typography variant="body1" component="p" gutterBottom>
                            <b>UUID:</b> {props.record.uuid}
                            <br/>
                            <b>Fleet:</b>&nbsp;
                            <ReferenceField source="belongs to-application" reference="application" target="id" {...props} link={false}>
                                <TextField source="app name" style={{fontSize: "12pt"}}/>
                            </ReferenceField>
                        </Typography>
                    </Box>
                    <CardActions sx={styles.actionCard}>
                        <Button variant="contained" href="#/organization" style={{ minWidth: '140px'}} startIcon={<LightModeIcon />}>
                            Blink
                        </Button>
                        <Button variant="contained" href="#/user" style={{ minWidth: '140px'}} startIcon={<RestartAltIcon />}>
                            Reboot
                        </Button>
                        <Button variant="contained" href="#/api%20key" style={{ minWidth: '140px'}} startIcon={<PowerSettingsNewIcon />}>
                            Shutdown
                        </Button>
                    </CardActions>
                </Box>
                <Box display='block' height="9.5em" overflow="hidden">
                    <LinearProgressWithLabel label="CPU" value={props.record['cpu usage']} />
                    <LinearProgressWithLabel label="SD" value={props.record['storage usage']/props.record['storage total'] * 100} />
                    <LinearProgressWithLabel label="RAM" value={props.record['memory usage']/props.record['memory total'] * 100} />
                    <LinearProgressWithLabel label="Temp" value={(props.record['cpu temp']/90)*100} displayValue={props.record['cpu temp']} displayUnits="&deg;C"/>
                </Box>
            </Box>
        </Card>
    );
};

export default Banner;