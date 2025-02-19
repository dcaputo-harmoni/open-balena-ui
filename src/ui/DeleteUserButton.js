import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useNotify, useRecordContext, useRedirect } from 'react-admin';
import { Form } from 'react-final-form';
import { useDeleteUser, useDeleteUserBulk } from '../lib/user';

export const DeleteUserButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const redirect = useRedirect();
  const deleteUser = useDeleteUser();
  const deleteUserBulk = useDeleteUserBulk();
  const record = useRecordContext();

  const handleSubmit = async (values) => {
    if (props.selectedIds) {
      await deleteUserBulk(props.selectedIds);
    } else {
      await deleteUser(record);
    }
    setOpen(false);
    notify('User(s) successfully deleted', {type: 'success'});
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
        <DialogTitle id='form-dialog-title'> Delete User(s) </DialogTitle>
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

export default DeleteUserButton;
