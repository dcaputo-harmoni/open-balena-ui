import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import React from 'react';
import { useNotify, useRecordContext, useUnselectAll, useRefresh } from 'react-admin';
import { Form } from 'react-final-form';
import { useDeleteDevice, useDeleteDeviceBulk } from '../lib/device';

export const DeleteDeviceButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll('device');
  const deleteDevice = useDeleteDevice();
  const deleteDeviceBulk = useDeleteDeviceBulk();
  const record = useRecordContext();

  const handleSubmit = async (values) => {
    try {
      if (props.selectedIds) {
        await deleteDeviceBulk(props.selectedIds);
        unselectAll();
      }
      else {
        await deleteDevice(record);
      }
    } catch (e) {
      notify('Failed to delete device(s): ' + e.message, {type: 'error'});
    }
    setOpen(false);
    notify('Device(s) successfully deleted', {type: 'success'});
    refresh();
  };

  return (
    <>
      <Tooltip title='Delete'>
        <Button
          onClick={() => setOpen(true)}
          variant={props.variant || 'contained'}
          color='error'
          size={props.size}
          sx={props.sx}
        >
          <DeleteIcon sx={{ mr: '4px' }} /> {props.children}
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
