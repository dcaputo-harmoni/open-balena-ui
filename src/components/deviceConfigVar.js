import * as React from 'react';
import {
  ChipField,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  required,
} from 'react-admin';
import { TrimField } from '../ui/TrimField';

const DeviceConfigVarTitle = ({ record }) => {
  return <span>Device Config Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceConfigVarList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Device' source='device' reference='device' target='id'>
          <ChipField source='uuid' />
        </ReferenceField>
        <TextField label='Name' source='name' />
        <TrimField label='Value' source='value' />
        <ReferenceField label='Fleet' source='device' reference='device' target='id' link={false}>
          <ReferenceField
            source='belongs to-application'
            reference='application'
            target='id'
            link={(record, reference) => `/${reference}/${record['belongs to-application']}`}
          >
            <ChipField source='app name' />
          </ReferenceField>
        </ReferenceField>
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const DeviceConfigVarCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <ReferenceInput
        source='device'
        reference='device'
        target='id'
        perPage={1000}
        sort={{ field: 'device name', order: 'ASC' }}
      >
        <SelectInput optionText='device name' optionValue='id' validate={required()} />
      </ReferenceInput>
      <TextInput label='Name' source='name' />
      <TextInput label='Value' source='value' />
    </SimpleForm>
  </Create>
);

export const DeviceConfigVarEdit = (props) => (
  <Edit title={<DeviceConfigVarTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput
        source='device'
        reference='device'
        target='id'
        perPage={1000}
        sort={{ field: 'device name', order: 'ASC' }}
      >
        <SelectInput optionText='device name' optionValue='id' validate={required()} />
      </ReferenceInput>
      <TextInput label='Name' source='name' />
      <TextInput label='Value' source='value' />
    </SimpleForm>
  </Edit>
);

const deviceConfigVar = {
  list: DeviceConfigVarList,
  create: DeviceConfigVarCreate,
  edit: DeviceConfigVarEdit,
};

export default deviceConfigVar;
