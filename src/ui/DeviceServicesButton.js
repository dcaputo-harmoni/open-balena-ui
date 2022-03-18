import React from "react";
import { 
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    TextField,
    FunctionField,
    ChipField,
} from 'react-admin';
import Button from '@material-ui/core/Button'; 
import ListIcon from '@mui/icons-material/List';
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';
import dateFormat from 'dateformat';

export const DeviceServicesButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const handleSubmit = async values => {
        setOpen(false);
    };
    return (
    <> 
        <Button variant="outlined" color="primary" aria-label="services" onClick={() => setOpen(true)}>
            <ListIcon style={{ marginRight: '4px' }} /> Services 
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title"> Device Services </DialogTitle>
        <DialogContent>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                            <ReferenceManyField source="id" reference="image install" target="device" filter={{"is provided by-release": props.record['is running-release']}}>
                                <Datagrid>
                                    <ReferenceManyField label="Image" source="installs-image" reference="image" target="id">
                                        <SingleFieldList>
                                            <ReferenceField label="Image" source="is a build of-service" reference="service" target="id">
                                                <ChipField source="service name" />
                                            </ReferenceField>
                                        </SingleFieldList>
                                    </ReferenceManyField>
                                    <TextField label="Status" source="status" />
                                    <FunctionField label="Install Date" render={record => `${dateFormat((new Date(record['install date'])), "dd-mmm-yy h:MM:ss TT Z")}`} />
                                </Datagrid>
                            </ReferenceManyField>
                        <Button variant="contained" color="primary" type="submit" style={{ margin: '16px' }}>
                            Close
                        </Button>
                    </form>
                )}
            />
        </DialogContent>        
    </Dialog>
    </>
  )
}

export default DeviceServicesButton;