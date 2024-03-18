import * as React from 'react';
import {
  Create,
  Edit,
  TextField,
  Datagrid,
  ChipField,
  List,
  SimpleForm,
  EditButton,
  ReferenceField,
  DeleteButton,
  TextInput,
  FormDataConsumer,
  Toolbar,
  required,
} from 'react-admin';
import SelectDevice from '../ui/SelectDevice';
import SelectDeviceService from '../ui/SelectDeviceService';
import { useCreateDeviceServiceVar, useModifyDeviceServiceVar } from '../lib/deviceServiceVar';

const DeviceServiceVarTitle = ({ record }) => {
  return <span>Device Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceServiceVarList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Device' source='service install' reference='service install' target='id'>
          <ReferenceField source='device' reference='device' target='id'>
            <ChipField source='uuid' />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField label='Service' source='service install' reference='service install' target='id' link={false}>
          <ReferenceField
            source='installs-service'
            reference='service'
            target='id'
            link={(record, reference) => `/${reference}/${record['installs-service']}`}
          >
            <ChipField source='service name' />
          </ReferenceField>
        </ReferenceField>
        <TextField label='Name' source='name' />
        <TextField label='Value' source='value' />
        <ReferenceField label='Fleet' source='service install' reference='service install' target='id' link={false}>
          <ReferenceField source='device' reference='device' target='id' link={false}>
            <ReferenceField
              source='belongs to-application'
              reference='application'
              target='id'
              link={(record, reference) => `/${reference}/${record['belongs to-application']}`}
            >
              <ChipField source='app name' />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteButton label='' style={{ color: 'black' }} size='medium' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const DeviceServiceVarCreate = (props) => {
  const createDeviceServiceVar = useCreateDeviceServiceVar();

  return (
    <Create transform={createDeviceServiceVar} {...props}>
      <SimpleForm redirect='list'>
        <SelectDevice label='Device' source='device' />
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['device'] && (
              <SelectDeviceService label='Service' source='service install' device={formData.device} />
            )
          }
        </FormDataConsumer>
        <TextInput label='Name' source='name' validate={required()} />
        <TextInput label='Value' source='value' validate={required()} />
      </SimpleForm>
    </Create>
  );
};

export const DeviceServiceVarEdit = (props) => {
  const modifyDeviceServiceVar = useModifyDeviceServiceVar();

  return (
    <Edit transform={modifyDeviceServiceVar} title={<DeviceServiceVarTitle />} {...props}>
      <SimpleForm>
        <SelectDevice label='Device' source='device' />
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['device'] && (
              <SelectDeviceService label='Service' source='service install' device={formData.device} />
            )
          }
        </FormDataConsumer>
        <TextInput label='Name' source='name' validate={required()} />
        <TextInput label='Value' source='value' validate={required()} />
      </SimpleForm>
    </Edit>
  );
};

const deviceServiceVar = {
  list: DeviceServiceVarList,
  create: DeviceServiceVarCreate,
  edit: DeviceServiceVarEdit,
};

export default deviceServiceVar;
