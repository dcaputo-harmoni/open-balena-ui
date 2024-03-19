import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { TextInput, useDataProvider, useRecordContext } from 'react-admin';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

const StyledDualListBox = styled(DualListBox)({
  'fontSize': '12pt',
  'fontStyle': 'italic',
  '& .rdl-move': {
    border: 'none',
  },
  '& .rdl-control': {
    fontSize: '11pt',
  },
});

export const ManageRoles = (props) => {
  const [loaded, setLoaded] = React.useState({ all: false, selected: false });
  const [allRoles, setAllRoles] = React.useState([]);
  const [selectedRoles, setSelectedRoles] = React.useState([]);
  const dataProvider = useDataProvider();
  const record = useRecordContext();

  React.useEffect(() => {
    if (!loaded.all) {
      dataProvider
        .getList('role', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        })
        .then((roles) => {
          const roleOpts = roles.data.map((x) => ({ label: x.name, value: x.id }));
          setAllRoles(roleOpts);
        });
      loaded.all = true;
      setLoaded(loaded);
    }
    if (!loaded.selected && record) {
      dataProvider
        .getList(props.reference, {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'id', order: 'ASC' },
          filter: { [props.target]: record.id },
        })
        .then((existingMappings) => {
          const selectedIds = existingMappings.data.map((x) => x.role);
          setSelectedRoles(selectedIds);
        });
      loaded.selected = true;
      setLoaded(loaded);
    }
  }, [props, dataProvider, setLoaded, loaded, setAllRoles, setSelectedRoles]);

  if (!loaded) return null;

  return (
    <Box sx={{ width: '800px' }}>
      <Typography variant='subtitle1'>Roles:</Typography>
      <StyledDualListBox
        options={allRoles}
        selected={selectedRoles}
        onChange={setSelectedRoles}
        showHeaderLabels='true'
        icons={{
          moveLeft: <KeyboardArrowLeftIcon />,
          moveAllLeft: <KeyboardDoubleArrowLeftIcon />,
          moveRight: <KeyboardArrowRightIcon />,
          moveAllRight: <KeyboardDoubleArrowRightIcon />,
        }}
      />
      <TextInput
        source={props.source}
        format={() => selectedRoles}
        onChange={(record[props.source] = selectedRoles)}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default ManageRoles;
