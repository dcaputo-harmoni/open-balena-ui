import * as React from 'react';
import { Box, Card, CardActions, Button, Typography } from '@material-ui/core';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import KeyIcon from '@mui/icons-material/Key';
import { makeStyles } from '@material-ui/core/styles';

import publishArticleImage from './banner_illustration.svg';

const useStyles = makeStyles(theme => ({
    root: {
        background: '#2196f3',
        color: '#fff',
        padding: 20,
        marginTop: theme.spacing(2),
        marginBottom: '1em',
    },
    media: {
        background: `url(${publishArticleImage}) top right / cover`,
        marginLeft: 'auto',
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

const Banner = () => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <Box display="flex">
                <Box flex="1">
                    <Typography variant="h5" component="h2" gutterBottom>
                        Welcome to Open Balena Admin
                    </Typography>
                    <Box maxWidth="40em">
                        <Typography variant="body1" component="p" gutterBottom>
                            An open source management tool for your Open Balena instance
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
                <Box
                    display={{ xs: 'none', sm: 'none', md: 'block' }}
                    className={classes.media}
                    width="16em"
                    height="9em"
                    overflow="hidden"
                />
            </Box>
        </Card>
    );
};

export default Banner;