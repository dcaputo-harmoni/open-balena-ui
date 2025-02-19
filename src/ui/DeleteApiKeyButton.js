import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useNotify, useRecordContext, useUnselectAll, useRefresh } from 'react-admin';
import { Form } from 'react-final-form';
import { useDeleteApiKey, useDeleteApiKeyBulk } from '../lib/apiKey';

export const DeleteApiKeyButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll('api key');
  const deleteApiKey = useDeleteApiKey();
  const deleteApiKeyBulk = useDeleteApiKeyBulk();
  const record = useRecordContext();

  const handleSubmit = async (values) => {
    try {
      if (props.selectedIds) {
        await deleteApiKeyBulk(props.selectedIds);
        unselectAll();
      }
      else {
        await deleteApiKey(record);
      }
      notify('API Key(s) successfully deleted', {type: 'success'});
    }
    catch (e) {
      notify('Failed to delete API Key(s): ' + e.message, {type: 'error'});
    }
    setOpen(false);
    refresh();
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
        <DialogTitle id='form-dialog-title'> Delete API Key(s) </DialogTitle>
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

export default DeleteApiKeyButton;
