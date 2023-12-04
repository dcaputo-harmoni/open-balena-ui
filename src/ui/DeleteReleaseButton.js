import React from "react";
import { useNotify, useRedirect } from 'react-admin';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Form } from 'react-final-form';
import { useDeleteRelease, useDeleteReleaseBulk } from "../lib/release";

export const DeleteReleaseButton = ({basePath, selectedIds, record, context, ...props}) => {
    
    const [open, setOpen] = React.useState(false);
    const notify = useNotify();
    const redirect = useRedirect();
    const deleteRelease = useDeleteRelease();
    const deleteReleaseBulk = useDeleteReleaseBulk();
    const [disabled, setDisabled] = React.useState(true);

    const handleSubmit = async values => {
        if (selectedIds) {
            await deleteReleaseBulk(selectedIds);
        } else {
            await deleteRelease(record);
        }
        setOpen(false);
        notify('Release(s) successfully deleted');
        redirect(props.redirect, basePath);    
    };

    React.useEffect(() => {
        const canDeleteRelease = async (releaseId) => {
            console.log({context, releaseId});
            let releaseLookups = [
                { resource: "device", field: "#is running-release,should be running-release,should be operated by-release@eq"},
                { resource: "application", field: "should be running-release" },
            ];
            let count = 0;
            await Promise.all(releaseLookups.map(lookup => {
                return context.getList(lookup.resource, {
                    pagination: { page: 1 , perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { [lookup.field]: releaseId }
                }).then((result) => {
                    count += result.data.length;
                });    
            }))
            return count === 0;
        }        
        if (selectedIds) {
            Promise.all(selectedIds.map((id) => canDeleteRelease(id))).then((canDeleteResults) => setDisabled(!canDeleteResults.every((canDelete) => canDelete)));
        } else if (record) {
            canDeleteRelease(record.id).then((canDelete) => setDisabled(!canDelete));
        }
    }, [selectedIds, record, context]);

    
    return (
        <>
        <Button onClick={() => setOpen(true)} variant={props.variant || "contained"} color="inherit" size={props.size} sx={props.sx} disabled={disabled}>
            <DeleteIcon sx={{ mr: '4px' }} size={props.size}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title"> Delete Release(s) </DialogTitle>
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

export default DeleteReleaseButton;