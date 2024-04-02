import React from 'react';
import { Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ConnectIcon from '@mui/icons-material/Sensors';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import DeviceConnect from './DeviceConnect';
import { useRecordContext } from 'react-admin';

const styles = {
  dialog: {
    'width': '100%',
    'maxWidth': 'none',
    '& .MuiPaper-root': {
      maxWidth: 'none',
      width: '100%',
      height: '80vh',
    },
  },
  dialogContent: {
    maxWidth: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
};

export class Iframe extends React.Component {
  render() {
    return (
      <div>
        <iframe
          id={this.props.id}
          title={this.props.title}
          src={this.props.src}
          height={this.props.height}
          width={this.props.width}
          style={{ position: 'relative', minHeight: this.props.minHeight }}
        />
      </div>
    );
  }
}

export const DeviceConnectButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const record = useRecordContext() || props.record;
  const connectIcon = props.connectIcon || <ConnectIcon />;
  const connectIconTooltip = props.connectIconTooltip || 'Connect';

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={connectIconTooltip}>
        <Button aria-label='connect' onClick={() => setOpen(true)} {...props}>
          {connectIcon}
          {props.label ? <span sx={{ pl: '4px' }}>{props.label}</span> : ''}
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} sx={styles.dialog}>
        <DialogTitle id='form-dialog-title'>
          <Grid container sx={{ justifyContent: 'space-between' }}>
            {record['device name']} ({record['uuid'].substring(0, 8)})
            <IconButton onClick={() => setOpen(false)} size='large'>
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <DeviceConnect {...props} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceConnectButton;
