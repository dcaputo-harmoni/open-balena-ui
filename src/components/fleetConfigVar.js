import * as React from 'react';
import {
  Create,
  Edit,
  TextField,
  Datagrid,
  ReferenceField,
  ChipField,
  List,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  EditButton,
  DeleteButton,
  Toolbar,
  required,
} from 'react-admin';
import { TrimField } from '../ui/TrimField';

const FleetConfigVarTitle = ({ record }) => {
  return <span>Fleet Config Variable {record ? `"${record.name}"` : ''}</span>;
};

export const FleetConfigVarList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Fleet' source='application' reference='application' target='id'>
          <ChipField source='app name' />
        </ReferenceField>
        <TextField label='Name' source='name' />
        <TrimField label='Value' source='value' />
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' style={{ color: 'black' }} size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const FleetConfigVarCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <ReferenceInput
        source='application'
        reference='application'
        target='id'
        perPage={1000}
        sort={{ field: 'app name', order: 'ASC' }}
      >
        <SelectInput optionText='app name' optionValue='id' validate={required()} />
      </ReferenceInput>
      <TextInput label='Name' source='name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Create>
);

export const FleetConfigVarEdit = (props) => (
  <Edit title={<FleetConfigVarTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput
        source='application'
        reference='application'
        target='id'
        perPage={1000}
        sort={{ field: 'app name', order: 'ASC' }}
      >
        <SelectInput optionText='app name' optionValue='id' validate={required()} />
      </ReferenceInput>
      <TextInput label='Name' source='name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Edit>
);

const fleetConfigVar = {
  list: FleetConfigVarList,
  create: FleetConfigVarCreate,
  edit: FleetConfigVarEdit,
};

export default fleetConfigVar;
