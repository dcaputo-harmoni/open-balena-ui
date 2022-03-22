import React from "react";
import { useDataProvider, TextInput } from 'react-admin';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { makeStyles } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const useStyles = makeStyles({
    dualListBox: {
        fontSize: '12pt',
        fontStyle: 'italic',
        "& .rdl-move": {
            border: 'none'
        },
        "& .rdl-control": {
            fontSize: '11pt',
    },
    }
});

export const ManageRoles = ({basePath, ...props}) => {

    const [loaded, setLoaded] = React.useState({all: false, selected: false});
    const [allRoles, setAllRoles] = React.useState([]);
    const [selectedRoles, setSelectedRoles] = React.useState([]);
    const dataProvider = useDataProvider();
    const classes = useStyles();

    React.useEffect(() => {
        if (!loaded.all) {
            dataProvider.getList('role', {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { }
            }).then((roles) => {
                const roleOpts = roles.data.map(x => ({label: x.name, value: x.id}));
                setAllRoles(roleOpts);
            });
            loaded.all = true
            setLoaded(loaded);
        }
        if (!loaded.selected && props.initialValues) {
            setSelectedRoles(props.initialValues);
            loaded.selected = true;
            setLoaded(loaded);
        }
    }, [props, dataProvider, setLoaded, loaded, setAllRoles, setSelectedRoles]);

    if (!loaded) return null;

    return (
        <Box sx={{width: "800px"}}>
            <Typography variant="subtitle1">Roles:</Typography>
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
            <TextInput 
                source={props.source} 
                format={() => selectedRoles} 
                onChange={props.record[props.source] = selectedRoles} 
                style={{display: "none"}}
            />
        </Box>
    );
}

export default ManageRoles;