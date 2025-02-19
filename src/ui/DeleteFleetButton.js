import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useNotify, useRecordContext, useRedirect } from 'react-admin';
import { Form } from 'react-final-form';
import { useDeleteFleet, useDeleteFleetBulk } from '../lib/fleet';

export const DeleteFleetButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const redirect = useRedirect();
  const deleteFleet = useDeleteFleet();
  const deleteFleetBulk = useDeleteFleetBulk();
  const record = useRecordContext();

  const handleSubmit = async (values) => {
    if (props.selectedIds) {
      await deleteFleetBulk(props.selectedIds);
    } else {
      await deleteFleet(record);
    }
    setOpen(false);
    notify('Fleet(s) successfully deleted', {type: 'success'});
    redirect(props.redirect);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={props.variant || 'contained'}
        color='error'
        size={props.size}
        sx={props.sx}
      >
        <DeleteIcon sx={{ mr: '4px' }} size={props.size} /> {props.children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'> Delete Fleet(s) </DialogTitle>
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

export default DeleteFleetButton;
