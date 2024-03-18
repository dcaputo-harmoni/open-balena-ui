import React from "react";
import { PasswordInput, useNotify, useDataProvider } from 'react-admin';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'; 
import SaveIcon from '@mui/icons-material/Save';
import { Form } from 'react-final-form';
import { useForm } from 'react-hook-form';
import * as bcrypt from "bcryptjs";

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds).replace('2a','2b');
}

export const ChangePasswordButton = ({basePath, ...props}) => {
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
        <Button onClick={() => setOpen(true)} variant={props.variant || "contained"} color="inherit" size={props.size} sx={{...props.sx, mb: "20px"}}>
            <LockIcon style={{ marginRight: '4px' }}/> Change Password 
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
                        <PasswordInput label="Password" variant="filled" name="password"/>
                        <Button variant={props.variant || "contained"} color="inherit" type="submit" size={props.size} sx={{...props.sx, ml: "20px", mt: "15px"}} disabled={submitting || pristine}>
                            <SaveIcon sx={{ mr: '8px' }}/> Save
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