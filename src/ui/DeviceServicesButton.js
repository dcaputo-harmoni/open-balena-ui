import React from "react";
import { 
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    TextField,
    FunctionField,
    ChipField,
    useDataProvider,
    useNotify,
} from 'react-admin';
import {
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import { Form } from 'react-final-form';
import dateFormat from 'dateformat';

export const DeviceServicesButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const handleSubmit = async values => {
        setOpen(false);
    };
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = () => {
        dataProvider.getList('image install', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { 'device': props.record.id }
        }).then((imageInstalls) => {
            if (imageInstalls.data.length > 0) {
                setOpen(true);
            } else {
                notify("No services are installed on this device")
            }
        });
    }

    return (
    <> 
        <Button aria-label="services" onClick={() => handleClick()} startIcon={<ListIcon/>} {...props}>
            {props.label} 
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">
        <DialogTitle id="form-dialog-title">
                <Grid container style={{ justifyContent: "space-between" }}>
                    Device Services
                    <IconButton aria-label="close" onClick={handleSubmit}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </DialogTitle>
        </DialogTitle>
        <DialogContent>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                            <ReferenceManyField source="id" reference="image install" target="device" filter={{"is provided by-release": props.record['is running-release']}}>
                                <Datagrid>
                                    <ReferenceField label="Image" source="installs-image" reference="image" target="id" link={false}>
                                        <ReferenceField label="Image" source="is a build of-service" reference="service" target="id" link={(record, reference) => `/${reference}/${record['is a build of-service']}`}>
                                            <ChipField source="service name" />
                                        </ReferenceField>
                                    </ReferenceField>
                                    <TextField label="Status" source="status" />
                                    <FunctionField label="Install Date" render={record => `${dateFormat((new Date(record['install date'])), "dd-mmm-yy h:MM:ss TT Z")}`} />
                                </Datagrid>
                            </ReferenceManyField>
                    </form>
                )}
            />
        </DialogContent>        
    </Dialog>
    </>
  )
}

export default DeviceServicesButton;