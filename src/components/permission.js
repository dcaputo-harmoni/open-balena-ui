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
  ReferenceManyField,
  SimpleForm,
  SingleFieldList,
  TextField,
  TextInput,
  Toolbar,
  required,
} from 'react-admin';

const RoleTitle = ({ record }) => {
  return <span>Permission {record ? `"${record.name}"` : ''}</span>;
};

export const PermissionList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <TextField source='name' />
        <ReferenceManyField label='Roles' source='id' reference='role-has-permission' target='permission'>
          <SingleFieldList linkType={false}>
            <ReferenceField source='role' reference='role' target='id'>
              <ChipField source='name' />
            </ReferenceField>
          </SingleFieldList>
        </ReferenceManyField>
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const PermissionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source='name' validate={required()} />
    </SimpleForm>
  </Create>
);

export const PermissionEdit = (props) => (
  <Edit title={<RoleTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source='id' />
      <TextInput source='name' validate={required()} />
    </SimpleForm>
  </Edit>
);

const permission = {
  list: PermissionList,
  create: PermissionCreate,
  edit: PermissionEdit,
};

export default permission;
