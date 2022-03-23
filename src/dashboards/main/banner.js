import * as React from 'react';
import { Box, Card, CardActions, Button, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import KeyIcon from '@mui/icons-material/Key';

import publishArticleImage from './banner_illustration.svg';

const styles = {
    bannerCard: {
        background: '#2196f3',
        color: '#ffffff',
        padding: '1.5em',
        marginTop: 0,
        marginBottom: '1em',
    },
    mediaBox: {
        background: `url(${publishArticleImage}) top right / cover`,
        marginLeft: 'auto',
    },
    actionCard: {
        padding: 0,
        flexWrap: 'wrap',
        '& a': {
            marginTop: '2em',
            marginLeft: '0.25em !important',
            marginRight: '2em',
        },
    },
}

const Banner = () => {
    return (
        <Card sx={styles.bannerCard}>
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
                    <CardActions sx={styles.actionCard}>
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
                    display="block"
                    sx={styles.mediaBox}
                    width="16em"
                    height="9em"
                    overflow="hidden"
                />
            </Box>
        </Card>
    );
};

export default Banner;