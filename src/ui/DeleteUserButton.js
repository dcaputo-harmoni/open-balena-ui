import React from "react";
import { useNotify, useDataProvider, useRedirect, useRefresh } from 'react-admin';
import { withStyles } from '@material-ui/core' 
import MuiButton from '@material-ui/core/Button'; 
import LockIcon from '@material-ui/icons/Lock'; 
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';
import Save from '@material-ui/icons/Save';

const Button = withStyles({ 
   root: { 
      margin: '16px 0px'
   }
})(MuiButton); 

export const DeleteUserButton = (props) => {
    const [open, setOpen] = React.useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const handleSubmit = async values => {
        let relatedLookups = [
            { resource: "user-has-permission", field: "user" },
            { resource: "user-has-public key", field: "user" },
            { resource: "user-has-role", field: "user" },
            { resource: "organization membership", field: "user" },
        ];
        await Promise.all(relatedLookups.map( x => {
            return dataProvider.getList(x.resource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.field]: props.record.id }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        dataProvider.delete( 'user', { id: props.record.id } ).then((data) => {
                setOpen(false);
                notify('User successfully deleted');
                redirect(props.redirect, props.basePath);
        });    
    };
    
    return (
    <> 
        <Button variant="outlined" color="primary" aria-label="delete" onClick={() => setOpen(true)}>
            <LockIcon style={{ marginRight: '4px' }} /> Delete User 
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Delete User</DialogTitle>
        <DialogContent>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                            <Save style={{ marginRight: '8px' }}/> Confirm Delete
                        </Button>
                    </form>
                )}
            />
        </DialogContent>        
    </Dialog>
    </>
  )
}

export default DeleteUserButton;