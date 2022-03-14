import React from "react";
import { useDataProvider, useRedirect } from 'react-admin';
import Button from '@material-ui/core/Button'; 
import ListIcon from '@mui/icons-material/List';
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';

export const DeleteUserButton = (props) => {
    const [open, setOpen] = React.useState(false);
    const dataProvider = useDataProvider();
    const redirect = useRedirect();
    const handleSubmit = async values => {
        console.dir(props.record.id);
        setOpen(false);
        redirect(props.redirect, props.basePath);    
    };
    
    return (
        <> 
        <Button variant="outlined" color="primary" aria-label="permissions" onClick={() => setOpen(true)} { ...props }>
            <ListIcon style={{ marginRight: '4px' }} {...props}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title"> User Permissions </DialogTitle>
        <DialogContent>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                            Modify Permissions
                        </Button>
                    </form>
                )}
            />
        </DialogContent>        
        </Dialog>
        </>        
    );
}

export default DeleteUserButton;