import React from "react";
import { useRedirect, useDataProvider } from 'react-admin';
import Button from '@material-ui/core/Button'; 
import ListIcon from '@mui/icons-material/List';
import Dialog from '@material-ui/core/Dialog'; 
import DialogTitle from '@material-ui/core/DialogTitle'; 
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'react-final-form';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const useStyles = makeStyles({
    root: {
        "& .MuiPaper-root": {
            maxWidth: 'none',
            width: '50%'
        }
    },
    dialogContent: {
        minHeight: '40vh',
        maxHeight: '40vh',
        maxWidth: 'none',
    },
    dualListBox: {
        fontSize: '14pt',
        "& .rdl-move": {
            border: 'none'
        },
        "& .rdl-control": {
            fontSize: '12pt',
    },
    }
});

const mappings = {
    user: {
        resource: "user-has-role",
        field: "user"
    },
    apiKey: {
        resource: "api key-has-role",
        field: "api key",
    }
}

export const ManageRolesButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const [allRoles, setAllRoles] = React.useState([]);
    const [selectedRoles, setSelectedRoles] = React.useState([]);
    const [originalRoles, setOriginalRoles] = React.useState([]);
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const handleSubmit = async values => {
        let createRoleIds = selectedRoles.filter(value => !originalRoles.find(x => x.role === value));
        let deleteRoles = originalRoles.filter(value => !selectedRoles.includes(value.role));
        await Promise.all(createRoleIds.map(insertId => 
            dataProvider.create(mappings[props.type].resource, {data: { [mappings[props.type].field]: props.record.id, role: insertId }})
        ));
        await Promise.all(deleteRoles.map(deleteRole => 
            dataProvider.delete(mappings[props.type].resource, { id: deleteRole.id })
        ));
        setOpen(false);
        redirect(props.redirect, basePath);    
    };
    const loadDialog = (props) => {
        dataProvider.getList('role', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { }
        }).then((roles) => {
            const roleOpts = roles.data.map(x => ({label: x.name, value: x.id}));
            setAllRoles(roleOpts);
        });
        dataProvider.getList(mappings[props.type].resource, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [mappings[props.type].field]: props.record.id }
        }).then((roles) => {
            setSelectedRoles(roles.data.map(x => x.role));
            setOriginalRoles(roles.data);
        });
        setOpen(true);
    }

    const classes = useStyles();
    
    return (
        <> 
        <Button variant="outlined" color="primary" aria-label="roles" onClick={() => loadDialog(props)} { ...props }>
            <ListIcon style={{ marginRight: '4px' }} {...props}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
            style={{width: "100%", maxWidth: "none"}}
            className={classes.root}
        >
        <DialogTitle id="form-dialog-title"> Manage Roles </DialogTitle>
        <DialogContent className={classes.dialogContent}>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <DualListBox
                            options={allRoles}
                            selected={selectedRoles}
                            onChange={setSelectedRoles}
                            showHeaderLabels="true"
                            className={classes.dualListBox}
                            icons={{
                                moveLeft: <KeyboardArrowLeftIcon/>,
                                moveAllLeft: <KeyboardDoubleArrowLeftIcon/>,
                                moveRight: <KeyboardArrowRightIcon/>,
                                moveAllRight: <KeyboardDoubleArrowRightIcon/>,
                            }}
                        />
                        <br/>
                        <div>
                            <div style={{float: "left"}}>
                        <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        </div>
                        <div style={{float: "right"}}>
                        <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                            Modify Roles
                        </Button>
                        </div>
                        </div>
                    </form>
                )}
            />
        </DialogContent>        
        </Dialog>
        </>        
    );
}

export default ManageRolesButton;