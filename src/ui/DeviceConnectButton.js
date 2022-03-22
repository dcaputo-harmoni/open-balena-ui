import React from "react";
import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ConnectIcon from '@mui/icons-material/Sensors';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@material-ui/core/styles';
import DeviceConnect from './DeviceConnect';

const useStyles = makeStyles({
    root: {
        "& .MuiPaper-root": {
            maxWidth: 'none',
            width: '100%'
        }
    },
    dialogContent: {
        minHeight: '80vh',
        maxHeight: '80vh',
        maxWidth: 'none',
    }, 
});

export class Iframe extends React.Component {
    render () {
        return(
            <div>
                <iframe id={this.props.id} title={this.props.title} src={this.props.src} height={this.props.height} width={this.props.width} style={{ position: "relative", minHeight: this.props.minHeight }}/>         
            </div>
        )
    }
}

export const DeviceConnectButton = ({basePath, ...props}) => {

    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    }

    return (
    <> 
        <Button aria-label="connect" onClick={() => setOpen(true)} {...props}>
        <ConnectIcon/>{props.label ? <span style={{paddingLeft: "4px"}}>{props.label}</span> : ""}
        </Button> 
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            style={{width: "100%", maxWidth: "none"}}
            className={classes.root}
        >
            <DialogTitle id="form-dialog-title">
                <Grid container style={{ justifyContent: "space-between" }}>
                    Connect
                    <IconButton aria-label="close" onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <DeviceConnect {...props}/>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default DeviceConnectButton;