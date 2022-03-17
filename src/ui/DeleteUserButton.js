import React from "react";
import { useNotify, useDataProvider, useRedirect } from 'react-admin';
import Button from '@material-ui/core/Button'; 
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';

const deleteUser = async (userId, dataProvider) => {
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
                filter: { [x.field]: userId }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        return await dataProvider.delete( 'user', { id: userId } );
}

export const DeleteUserButton = (props) => {
    const [open, setOpen] = React.useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const handleSubmit = async values => {
        if (props.selectedIds) {
            await Promise.all(props.selectedIds.map(id => deleteUser(id, dataProvider)));
        } else {
            await deleteUser(props.record.id, dataProvider);
        }
        setOpen(false);
        notify('User(s) successfully deleted');
        redirect(props.redirect, props.basePath);    
    };
    
    return (
        <> 
        <Button variant="contained" aria-label="delete" onClick={() => setOpen(true)} { ...props }>
            <DeleteIcon style={{ marginRight: '4px' }} size={props.size}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title"> Delete User(s) </DialogTitle>
        <DialogContent>
            Note: this action will be irreversible<br/><br/>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                            Confirm Delete
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