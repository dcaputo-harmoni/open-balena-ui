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
  EditButton,
  ReferenceInput,
  SelectInput,
  DeleteButton,
  Toolbar,
  required,
} from 'react-admin';

const ServiceLabelTitle = ({ record }) => {
  return <span>Service Label {record ? `"${record['label name']}"` : ''}</span>;
};

export const ServiceLabelList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Service' source='service' reference='service' target='id'>
          <ChipField source='service name' />
        </ReferenceField>
        <TextField label='Name' source='label name' />
        <TextField label='Value' source='value' />
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' style={{ color: 'black' }} size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const ServiceLabelCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <ReferenceInput
        source='service'
        reference='service'
        target='id'
        perPage={1000}
        sort={{ field: 'service name', order: 'ASC' }}
        validate={required()}
      >
        <SelectInput optionText='service name' optionValue='id' />
      </ReferenceInput>
      <TextInput label='Name' source='label name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Create>
);

export const ServiceLabelEdit = (props) => (
  <Edit title={<ServiceLabelTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput
        source='service'
        reference='service'
        target='id'
        perPage={1000}
        sort={{ field: 'service name', order: 'ASC' }}
        validate={required()}
      >
        <SelectInput optionText='service name' optionValue='id' />
      </ReferenceInput>
      <TextInput label='Name' source='label name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Edit>
);

const serviceLabel = {
  list: ServiceLabelList,
  create: ServiceLabelCreate,
  edit: ServiceLabelEdit,
};

export default serviceLabel;
