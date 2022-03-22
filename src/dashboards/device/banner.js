import * as React from 'react';
import { Card, Box, CardActions, Button, Typography } from '@material-ui/core';
import LightModeIcon from '@mui/icons-material/LightMode';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { makeStyles } from '@material-ui/core/styles';
import { 
    TextField,
    ReferenceField,
} from 'react-admin'

const useStyles = makeStyles(theme => ({
    root: {
        background: '#2196f3',
        color: '#fff',
        padding: 20,
        marginTop: theme.spacing(2),
        marginBottom: '1em',
    },
    actions: {
        padding: 0,
        flexWrap: 'wrap',
        '& a': {
            marginTop: '2em',
            marginLeft: '0.25em !important',
            marginRight: '2em',
        },
    },
}));

const Banner = (props) => {
    const classes = useStyles();
    if (props.loading) return null;
    return (
        <Card className={classes.root}>
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
                    <CardActions className={classes.actions}>
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
            </Box>
        </Card>
    );
};

export default Banner;