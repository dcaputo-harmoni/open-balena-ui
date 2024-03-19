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

const FleetEnvVarTitle = ({ record }) => {
  return <span>Fleet Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const FleetEnvVarList = (props) => {
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

export const FleetEnvVarCreate = (props) => (
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

export const FleetEnvVarEdit = (props) => (
  <Edit title={<FleetEnvVarTitle />} {...props}>
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

const fleetEnvVar = {
  list: FleetEnvVarList,
  create: FleetEnvVarCreate,
  edit: FleetEnvVarEdit,
};

export default fleetEnvVar;
