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
    "application/canAccess()": "app accessible",
    "device/any(d:d/actor eq @__ACTOR_ID)": "device accessible",
    "device/canAccess()": "device accessible",
    "describes__device/canAccess()": "device accessible",
    "service_install/canAccess()": "service accessible",
    "service_install/any(si:si/device/any(d:d/actor eq @__ACTOR_ID))": "service accessible",
    "service/canAccess()": "service accessible",
    "image/any(i:i/is_a_build_of__service/any(s:s/application/any(a:a/depends_on__application/any(da:da/owns__device/any(d:d/actor eq @__ACTOR_ID)) or a/owns__device/any(d:d/is_managed_by__device/any(md:md/actor eq @__ACTOR_ID)))))": "image accessible",
    "device/any(d:d/actor eq @__ACTOR_ID or d/is_managed_by__device/any(md:md/actor eq @__ACTOR_ID)) and installs__image/any(i:i/image__is_part_of__release/any(ipr:ipr/is_part_of__release/any(r:r/belongs_to__application/any(a:a/owns__device/any(d:d/actor eq @__ACTOR_ID) or a/is_public eq true or a/is_host eq true))))": "device accessible",
    "image/canAccess()": "image accessible",
    "device/any(d:d/actor eq @__ACTOR_ID or d/belongs_to__application/any(a:a/depends_on__application/any(da:da/owns__device/any(d:d/actor eq @__ACTOR_ID))))": "device accessible",
    "is_part_of__release/canAccess()": "release accessible",
    "release_image/canAccess()": "release accessible",
    "release/canAccess()": "release accessible",
    "user/any(u:u/actor eq @__ACTOR_ID)": "user accessible",
    "application/canAccess() or service_install/canAccess()": "app accessible",
    "service_type eq 'vpn'": "vpn",
    "should_be_running_on__device/canAccess() or belongs_to__application/canAccess()": "device or app accessible",
    "device/any(d:d/actor eq @__ACTOR_ID or d/is_managed_by__device/any(md:md/actor eq @__ACTOR_ID))": "device accessible",
    "image_install/canAccess() or image__is_part_of__release/canAccess()": "image accessible",
    "owns__device/canAccess() or depends_on__application/canAccess(1) or ((is_host eq true or is_public eq true) and is_for__device_type/any(dt:dt/describes__device/canAccess()))": "device accessible",
    "belongs_to__application/any(a:a/actor eq @__ACTOR_ID)": "app accessible",
    "is_managed_by__device/canAccess(1) or belongs_to__application/any(a:a/depends_on__application/any(da:da/owns__device/any(d:d/actor eq @__ACTOR_ID)))": "app accessible",
    "belongs_to__application/any(a:a/depends_on__application/any(da:da/owns__device/any(d:d/actor eq @__ACTOR_ID)))": "app accessible"
};

export const UserPermissionsButton = ({basePath, ...props}) => {
    const [open, setOpen] = React.useState(false);
    const [allPermissions, setAllPermissions] = React.useState([]);
    const [selectedPermissions, setSelectedPermissions] = React.useState([]);
    const [originalPermissions, setOriginalPermissions] = React.useState([]);
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const handleSubmit = async values => {
        console.dir(props.record.id);
        console.dir(selectedPermissions);

        let createIds = selectedPermissions.filter(value => !originalPermissions.includes(value));
        let deleteIds = originalPermissions.filter(value => !selectedPermissions.includes(value));
        await Promise.all(createIds.map(insertId => 
            dataProvider.create('user-has-permission', {data: { user: props.record.id, permission: insertId }})
        ));
        await Promise.all(deleteIds.map(deleteId => 
            dataProvider.delete('user-has-permission', { id: deleteId })
        ));
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
                var resource = arr[0] === 'resin' ? arr[1] : arr[0];
                var type = (arr[0] === 'resin' ? arr[2].split('?')[0] : (arr[1] ? arr[1].split('?')[0] : "full")) || "full";
                var opts = (arr[0] === 'resin' ? arr[2].split('?')[1] : (arr[1] ? arr[1].split('?')[1] : undefined));
                opts = decode[opts] ? decode[opts] : opts;
                var resourceIdx = permissionOpts.findIndex(x => x.label === resource);
                if (resourceIdx === -1) {
                    permissionOpts.push({label: resource, options: [{label: type + (opts ? ` (${opts})` : ``), value: x.id}]});
                } else {
                    permissionOpts[resourceIdx].options.push({label: type + (opts ? ` (${opts})` : ``), value: x.id});
                }
            });
            setAllPermissions(permissionOpts);
        });
        dataProvider.getList('user-has-permission', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { 'user': props.record.id }
        }).then((userPermissions) => {
            const permissionIds = userPermissions.data.map(x => x.permission);
            setSelectedPermissions(permissionIds);
            setOriginalPermissions(permissionIds);
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