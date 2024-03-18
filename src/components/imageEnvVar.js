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

const ImageEnvVarTitle = ({ record }) => {
  return <span>Image Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const ImageEnvVarList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Fleet' source='release image' reference='image' target='id' link={false}>
          <ReferenceField source='is a build of-service' reference='service' target='id' link={false}>
            <ReferenceField
              source='application'
              reference='application'
              target='id'
              link={(record, reference) => `/${reference}/${record['application']}`}
            >
              <ChipField source='app name' />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>
        <ReferenceField label='Release Rev.' source='release image' reference='image' target='id' link={false}>
          <ReferenceField source='id' reference='image-is part of-release' target='image' link={false}>
            <ReferenceField
              source='is part of-release'
              reference='release'
              link={(record, reference) => `/${reference}/${record['is part of-release']}`}
            >
              <ChipField source='revision' />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>
        <ReferenceField label='Service' source='release image' reference='image' target='id' link={false}>
          <ReferenceField
            source='is a build of-service'
            reference='service'
            target='id'
            link={(record, reference) => `/${reference}/${record['is a build of-service']}`}
          >
            <ChipField source='service name' />
          </ReferenceField>
        </ReferenceField>
        <TextField label='Name' source='name' />
        <TextField label='Value' source='value' />
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' style={{ color: 'black' }} size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const ImageEnvVarCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect='list'>
      <ReferenceInput source='release image' reference='image' target='id' validate={required()}>
        <SelectInput optionText='id' optionValue='id' />
      </ReferenceInput>
      <TextInput label='Name' source='name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Create>
);

export const ImageEnvVarEdit = (props) => (
  <Edit title={<ImageEnvVarTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput source='release image' reference='image' target='id' validate={required()}>
        <SelectInput optionText='id' optionValue='id' />
      </ReferenceInput>
      <TextInput label='Name' source='name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Edit>
);

const imageEnvVar = {
  list: ImageEnvVarList,
  create: ImageEnvVarCreate,
  edit: ImageEnvVarEdit,
};

export default imageEnvVar;
