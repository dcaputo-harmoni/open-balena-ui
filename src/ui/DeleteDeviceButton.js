import React from "react";
import { useNotify, useDataProvider, useRedirect } from 'react-admin';
import Button from '@material-ui/core/Button'; 
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';

const deleteDevice = async (device, dataProvider) => {
    let relatedIndirectLookups = [
        { resource: "device service environment variable", field: "service install", viaResource: "service install", viaField: "device", localField: "id"},
        { resource: "api key", field: "actor", viaResource: "actor", viaField: "id", localField: "actor"},
    ];
    let relatedLookups = [
        { resource: "device tag", field: "device", localField: "id" },
        { resource: "device config variable", field: "device", localField: "id" },
        { resource: "device environment variable", field: "device", localField: "id" },
        { resource: "service install", field: "device", localField: "id" },
        { resource: "image install", field: "device", localField: "id" },
        { resource: "gateway download", field: "is downloaded by-device", localField: "id" },
        { resource: "actor", field: "id", localField: "actor" },
    ];
    await Promise.all(relatedIndirectLookups.map( x => {
        return dataProvider.getList(x.viaResource, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [x.viaField]: device[x.localField] }
        }).then((existingIndirectMappings) => {
            return Promise.all(existingIndirectMappings.data.map( y => {
                return dataProvider.getList(x.resource, {
                    pagination: { page: 1 , perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { [x.field]: y.id }
                }).then((existingMappings) => {
                    console.log("existingMappings");
                    console.dir(existingMappings);   
                    if (existingMappings.data.length > 0) {
                        dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(z => z.id) } );
                    }
                })
            }))
        })
    }));
    await Promise.all(relatedLookups.map( x => {
        return dataProvider.getList(x.resource, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [x.field]: device[x.localField] }
        }).then((existingMappings) => {
        if (existingMappings.data.length > 0) {
            dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
        }})
    }));
    return await dataProvider.delete( 'device', { id: device['id'] } );
}

export const DeleteDeviceButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const redirect = useRedirect();
    const handleSubmit = async values => {
        if (props.selectedIds) {
            await Promise.all(props.selectedIds.map(id => deleteDevice(id, dataProvider)));
        } else {
            await deleteDevice(props.record, dataProvider);
        }
        setOpen(false);
        notify('Device(s) successfully deleted');
        redirect(props.redirect, basePath);    
    };
    
    return (
        <> 
        <Button aria-label="delete" onClick={() => setOpen(true)} variant={props.variant || "contained"} fontSize={props.size} color={props.color} >
            <DeleteIcon style={{ marginRight: '4px' }} size={props.size}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title"> Delete Device(s) </DialogTitle>
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

export default DeleteDeviceButton;