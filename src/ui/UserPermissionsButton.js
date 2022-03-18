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

const decode = {
    "actor eq @__ACTOR_ID": "self",
    "id eq @__ACTOR_ID": "self",
    "is_of__actor eq @__ACTOR_ID": "self",
    "application/canAccess()": "accessible",
};

export const UserPermissionsButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const [allPermissions, setAllPermissions] = React.useState([]);
    const [selectedPermissions, setSelectedPermissions] = React.useState([]);
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const handleSubmit = async values => {
        console.dir(props.record.id);
        console.dir(selectedPermissions);
        setOpen(false);
        redirect(props.redirect, basePath);    
    };
    const loadDialog = (props) => {
        dataProvider.getList('permission', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { }
        }).then((permissions) => {
            let permissionOpts = [];
            permissions.data.forEach(x => {
                const arr = x.name.split(".");
                console.dir(arr);
                var resource = arr[0] === 'resin' ? arr[1] : arr[0];
                var type = (arr[0] === 'resin' ? arr[2].split('?')[0] : (arr[1] ? arr[1].split('?')[0] : "all")) || "all";
                var opts = (arr[0] === 'resin' ? arr[2].split('?')[1] : (arr[1] ? arr[1].split('?')[1] : undefined));
                var resourceIdx = permissionOpts.findIndex(x => x.label === resource);
                if (resourceIdx === -1) {
                    permissionOpts.push({label: resource, options: [{label: type + (opts ? ` (${opts})` : ``), value: x.id}]});
                } else {
                    permissionOpts[resourceIdx].options.push({label: type + (opts ? ` (${opts})` : ``), value: x.id});
                }
            });
            console.dir(permissionOpts);
            setAllPermissions(permissionOpts);
        });
        dataProvider.getList('user-has-permission', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { 'user': props.record.id }
        }).then((userPermissions) => {
            setSelectedPermissions(userPermissions.data.map(x => x.permission));
        });
        setOpen(true);
    }

    const classes = useStyles();
    
    return (
        <> 
        <Button variant="outlined" color="primary" aria-label="permissions" onClick={() => loadDialog(props)} { ...props }>
            <ListIcon style={{ marginRight: '4px' }} {...props}/> { props.children }
        </Button> 
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
            style={{width: "100%", maxWidth: "none"}}
            className={classes.root}
        >
        <DialogTitle id="form-dialog-title"> User Permissions </DialogTitle>
        <DialogContent className={classes.dialogContent}>
            <Form
                onSubmit={handleSubmit}
                render={({handleSubmit, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        <DualListBox
                            options={allPermissions}
                            selected={selectedPermissions}
                            onChange={setSelectedPermissions}
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
                            Modify Permissions
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

export default UserPermissionsButton;