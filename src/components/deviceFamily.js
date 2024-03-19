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
  EditButton,
  ReferenceInput,
  SelectInput,
  TextInput,
  DeleteButton,
  Toolbar,
  required,
} from 'react-admin';

const DeviceFamilyTitle = ({ record }) => {
  return <span>Device Family {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceFamilyList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <TextField label='Slug' source='slug' />
        <TextField label='Name' source='name' />
        <ReferenceField
          label='Manufacturer'
          source='is manufactured by-device manufacturer'
          reference='device manufacturer'
          target='id'
          link={false}
        >
          <ChipField source='name' />
        </ReferenceField>
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' style={{ color: 'black' }} size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const DeviceFamilyCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <TextInput label='Slug' source='slug' />
      <TextInput label='Name' source='name' />
      <ReferenceInput
        source='is manufactured by-device manufacturer'
        reference='device manufacturer'
        target='id'
        perPage={1000}
        sort={{ field: 'name', order: 'ASC' }}
      >
        <SelectInput optionText='name' optionValue='id' validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const DeviceFamilyEdit = (props) => (
  <Edit title={<DeviceFamilyTitle />} {...props}>
    <SimpleForm>
      <TextInput label='Slug' source='slug' />
      <TextInput label='Name' source='name' />
      <ReferenceInput
        label='Manufacturer'
        source='is manufactured by-device manufacturer'
        reference='device manufacturer'
        target='id'
        perPage={1000}
        sort={{ field: 'name', order: 'ASC' }}
      >
        <SelectInput optionText='name' optionValue='id' validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

const deviceFamily = {
  list: DeviceFamilyList,
  create: DeviceFamilyCreate,
  edit: DeviceFamilyEdit,
};

export default deviceFamily;
