import * as React from 'react';
import { Card, Box, CardActions, Button, Typography } from '@material-ui/core';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import KeyIcon from '@mui/icons-material/Key';
import { makeStyles } from '@material-ui/core/styles';

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
                            UUID {props.record.uuid}
                        </Typography>
                    </Box>
                    <CardActions className={classes.actions}>
                        <Button variant="contained" href="#/organization" style={{ minWidth: '120px'}} startIcon={<CorporateFareIcon />}>
                            Orgs
                        </Button>
                        <Button variant="contained" href="#/user" style={{ minWidth: '120px'}} startIcon={<PersonIcon />}>
                            Users
                        </Button>
                        <Button variant="contained" href="#/api%20key" style={{ minWidth: '120px'}} startIcon={<KeyIcon />}>
                            API Keys
                        </Button>
                    </CardActions>
                </Box>
            </Box>
        </Card>
    );
};

export default Banner;