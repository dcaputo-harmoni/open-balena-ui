import React from "react";
import { useDataProvider, TextInput } from 'react-admin';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const StyledDualListBox = styled(DualListBox)({
    fontSize: '12pt',
    fontStyle: 'italic',
    '& .rdl-move': {
      border: 'none',
    },
    '& .rdl-control': {
      fontSize: '11pt',
    },
  });

export const ManageOrganizations = ({basePath, ...props}) => {

    const [loaded, setLoaded] = React.useState({all: false, selected: false});
    const [allOrganizations, setAllOrganizations] = React.useState([]);
    const [selectedOrganizations, setSelectedOrganizations] = React.useState([]);
    const dataProvider = useDataProvider();

    React.useEffect(() => {
        if (!loaded.all) {
            dataProvider.getList('organization', {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { }
            }).then((organizations) => {
                const organizationOpts = organizations.data.map(x => ({label: x.name, value: x.id}));
                setAllOrganizations(organizationOpts);
            });
            loaded.all = true
            setLoaded(loaded);
        }
        if (!loaded.selected && props.record) {
            dataProvider.getList(props.reference, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [props.target]: props.record.id }
            }).then((existingMappings) => {
                const selectedIds = existingMappings.data.map(x => x['is member of-organization']);
                setSelectedOrganizations(selectedIds);
            })
            loaded.selected = true;
            setLoaded(loaded);
        }
    }, [props, dataProvider, setLoaded, loaded, setAllOrganizations, setSelectedOrganizations]);

    if (!loaded) return null;

    return (
        <Box sx={{width: "800px"}}>
            <Typography variant="subtitle1">Organizations:</Typography>
            <StyledDualListBox
                options={allOrganizations}
                selected={selectedOrganizations}
                onChange={setSelectedOrganizations}
                showHeaderLabels="true"
                icons={{
                    moveLeft: <KeyboardArrowLeftIcon/>,
                    moveAllLeft: <KeyboardDoubleArrowLeftIcon/>,
                    moveRight: <KeyboardArrowRightIcon/>,
                    moveAllRight: <KeyboardDoubleArrowRightIcon/>,
                }}
            />
            <TextInput 
                source={props.source} 
                format={() => selectedOrganizations} 
                onChange={props.record[props.source] = selectedOrganizations} 
                style={{display: "none"}}
            />
        </Box>
    );
}

export default ManageOrganizations;