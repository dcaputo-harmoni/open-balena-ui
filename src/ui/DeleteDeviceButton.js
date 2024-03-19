import React from 'react';
import { useNotify, useRedirect } from 'react-admin';
import { Button, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Form } from 'react-final-form';
import { useDeleteDevice, useDeleteDeviceBulk } from '../lib/device';

export const DeleteDeviceButton = ({ basepath, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const redirect = useRedirect();
  const deleteDevice = useDeleteDevice();
  const deleteDeviceBulk = useDeleteDeviceBulk();

  const handleSubmit = async (values) => {
    if (props.selectedIds) {
      await deleteDeviceBulk(props.selectedIds);
    } else {
      await deleteDevice(props.record);
    }
    setOpen(false);
    notify('Device(s) successfully deleted');
    redirect(props.redirect, basepath);
  };

  return (
    <>
      <Tooltip title='Delete'>
        <Button
          onClick={() => setOpen(true)}
          variant={props.variant || 'contained'}
          color='inherit'
          size={props.size}
          sx={props.sx}
        >
          <DeleteIcon sx={{ mr: '4px' }} size={props.size} /> {props.children}
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'> Delete Device(s) </DialogTitle>
        <DialogContent>
          Note: this action will be irreversible
          <br />
          <br />
          <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit}>
                <Button variant='contained' color='primary' type='submit' disabled={submitting}>
                  Confirm Delete
                </Button>
              </form>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteDeviceButton;
