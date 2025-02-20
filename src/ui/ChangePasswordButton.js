import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import * as bcrypt from 'bcryptjs';
import React from 'react';
import { PasswordInput, useDataProvider, useNotify, useRecordContext, SimpleForm } from 'react-admin';
import PasswordChecklist from 'react-password-checklist';
import Row from '../ui/Row';

const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds).replace('2a', '2b');
};

export const ChangePasswordButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const [new_password, setPassword] = React.useState('');
  const [password_valid, setPasswordValid] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const record = useRecordContext();

  const handleSubmit = async (values) => {
    const hashedPassword = hashPassword(values.new_password);
    dataProvider
      .update('user', {
        id: record.id,
        data: { password: hashedPassword },
      })
      .then((data) => {
        setOpen(false);
        notify('Password successfully changed', { type: 'success' });
      });
  };

  return (
    <>
      <Button
        onClick={() => {
          setPassword('');
          setOpen(true);
        }}
        color='inherit'
        variant='outlined'
        size={props.size}
        sx={{ ...props.sx, mb: '20px' }}
      >
        <LockIcon style={{ marginRight: '4px' }} /> Change Password
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Change Password</DialogTitle>

        <DialogContent>
          <SimpleForm onSubmit={handleSubmit} toolbar={false} mode='onBlur' reValidateMode='onBlur'>
            <Row>
              <PasswordInput
                variant='outlined'
                size='large'
                name='new_password'
                source='new_password'
                placeholder='Enter new password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant='contained'
                color='primary'
                type='submit'
                sx={{ ml: '20px', mt: '19px' }}
                disabled={!password_valid}
              >
                <SaveIcon sx={{ mr: '8px' }} /> Save
              </Button>
            </Row>
            <PasswordChecklist
              rules={['minLength', 'specialChar', 'number', 'capitalAndLowercase']}
              minLength={8}
              value={new_password}
              onChange={setPasswordValid}
            />
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePasswordButton;
