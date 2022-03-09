import React from "react";
import { PasswordInput, useNotify, useUpdate, useDataProvider } from 'react-admin';
import { withStyles } from '@material-ui/core' 
import MuiButton from '@material-ui/core/Button'; 
import LockIcon from '@material-ui/icons/Lock'; 
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';
import { useForm } from 'react-final-form';
import Save from '@material-ui/icons/Save';
import * as bcrypt from "bcryptjs";

const Button = withStyles({ 
   root: { 
      margin: '16px 0px'
   }
})(MuiButton); 

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds).replace('2a','2b');
}

export const ChangePasswordButton = (props) => {
    const [open, setOpen] = React.useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const form = useForm();
    const handleSubmit = async values => {
        const hashedPassword = hashPassword(values.password);
        dataProvider.update( 'user',
            {
                id: props.record.id,
                data: { password: hashedPassword }
            }
        ).then(
            (data) => {
                setOpen(false);
                notify('Password successfully changed');
                form.change('password', hashedPassword);
        });
    };
    
    return (
    <> 
        <Button variant="outlined" color="primary" aria-label="create" onClick={() => setOpen(true)}>
            <LockIcon style={{ marginRight: '4px' }} /> Change Password 
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        <DialogContent>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <PasswordInput
                            label="Password"
                            variant="filled"
                            name="password"
                        />
                        <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>
                            <Save style={{ marginRight: '8px' }}/> Save
                        </Button>
                    </form>
                )}
            />
        </DialogContent>        
    </Dialog>
    </>
  )
}

export default ChangePasswordButton;