import * as React from 'react';
import {
  BooleanField,
  ChipField,
  Create,
  Datagrid,
  Edit,
  EditButton,
  FormDataConsumer,
  FunctionField,
  List,
  ReferenceField,
  ReferenceInput,
  SaveButton,
  SearchInput,
  SelectInput,
  ShowButton,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  required,
  useRedirect,
} from 'react-admin';
import { v4 as uuidv4 } from 'uuid';
import { useCreateDevice, useModifyDevice } from '../lib/device';
import DeleteDeviceButton from '../ui/DeleteDeviceButton';
import DeviceConnectButton from '../ui/DeviceConnectButton';
import DeviceServicesButton from '../ui/DeviceServicesButton';
import SelectOperatingSystem from '../ui/SelectOperatingSystem';
import SemVerChip, { getSemver } from '../ui/SemVerChip';

const DeviceTitle = ({ record }) => {
  return <span>Device {record ? `"${record['device name']}"` : ''}</span>;
};

const OnlineField = (props) => {
  return (
    <FunctionField
      {...props}
      render={(record, source) => (
        <BooleanField source='enabled' record={{ ...record, enabled: record[source] === 'online' }} />
      )}
    />
  );
};

const deviceFilters = [<SearchInput source='#uuid,device name,status@ilike' alwaysOn />];

const CustomBulkActionButtons = (props) => (
  <React.Fragment>
    <DeleteDeviceButton variant='text' size='small' {...props}>
      {' '}
      Delete{' '}
    </DeleteDeviceButton>
  </React.Fragment>
);

export const DeviceList = (props) => {
  return (
    <List {...props} filters={deviceFilters}>
      <Datagrid bulkActionButtons={<CustomBulkActionButtons />}>
        <TextField source='id' />
        <FunctionField label='UUID' render={(record) => record['uuid'].substring(0, 7)} />
        <TextField label='Name' source='device name' />
        <OnlineField label='Online' source='api heartbeat state' />
        <TextField label='Status' source='status' />
        <FunctionField
          label='OS'
          render={(record) =>
            record['os version'] && record['os variant'] ? `${record['os version']}-${record['os variant']}` : ''
          }
        />
        <ReferenceField label='Device Type' source='is of-device type' reference='device type' target='id'>
          <ChipField source='slug' />
        </ReferenceField>
        <ReferenceField label='Fleet' source='belongs to-application' reference='application' target='id'>
          <ChipField source='app name' />
        </ReferenceField>
        <ReferenceField label='Current Release' source='is running-release' reference='release' target='id'>
          <SemVerChip />
        </ReferenceField>
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <DeviceServicesButton label='' />
          <DeviceConnectButton label='' />
          <ShowButton label='' />
          <EditButton label='' />
          <DeleteDeviceButton variant='text' size='small' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const DeviceCreate = (props) => {
  const createDevice = useCreateDevice();
  const redirect = useRedirect();

  const processComplete = ({ data }) => {
    redirect('list', data.id, data);
  };

  return (
    <Create transform={createDevice} onSuccess={processComplete} {...props}>
      <SimpleForm redirect='list'>
        <TextInput
          label='UUID'
          source='uuid'
          initialValue={uuidv4().replace(/-/g, '').toLowerCase()}
          validate={required()}
        />
        <TextInput label='Device Name' source='device name' validate={required()} />
        <TextInput label='Note' source='note' />
        <ReferenceInput
          label='Device Type'
          source='is of-device type'
          reference='device type'
          target='id'
          perPage={1000}
          sort={{ field: 'slug', order: 'ASC' }}
        >
          <SelectInput optionText='slug' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Fleet'
          source='belongs to-application'
          reference='application'
          target='id'
          perPage={1000}
          sort={{ field: 'app name', order: 'ASC' }}
          filter={{ 'is of-class': 'fleet' }}
        >
          <SelectInput optionText='app name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['belongs to-application'] && (
              <ReferenceInput
                label='Target Release'
                source='should be running-release'
                reference='release'
                target='id'
                filter={{ 'belongs to-application': formData['belongs to-application'] }}
                allowEmpty
              >
                <SelectInput optionText={(o) => getSemver(o)} optionValue='id' />
              </ReferenceInput>
            )
          }
        </FormDataConsumer>
        <SelectOperatingSystem label='Target OS' source='should be operated by-release' />
        <ReferenceInput
          label='Managed by Device'
          source='is managed by-device'
          reference='device'
          target='id'
          allowEmpty
        >
          <SelectInput optionText='device name' optionValue='id' />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ justifyContent: 'space-between' }}>
    <SaveButton />
    <DeleteDeviceButton
      variant='text'
      sx={{ 'padding': '6px', 'color': '#f44336', '.hover': { backgroundColor: '#fff', color: '#3c52b2' } }}
    >
      {' '}
      Delete{' '}
    </DeleteDeviceButton>
  </Toolbar>
);

export const DeviceEdit = (props) => {
  const modifyDevice = useModifyDevice();

  return (
    <Edit title={<DeviceTitle />} transform={modifyDevice} toolbar={<CustomToolbar />} {...props}>
      <SimpleForm>
        <TextInput disabled source='id' />
        <TextInput label='UUID' source='uuid' />
        <TextInput label='Device Name' source='device name' />
        <TextInput label='Note' source='note' />
        <ReferenceInput
          label='Device Type'
          source='is of-device type'
          reference='device type'
          target='id'
          perPage={1000}
          sort={{ field: 'slug', order: 'ASC' }}
        >
          <SelectInput optionText='slug' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Fleet'
          source='belongs to-application'
          reference='application'
          target='id'
          perPage={1000}
          sort={{ field: 'app name', order: 'ASC' }}
          filter={{ 'is of-class': 'fleet' }}
        >
          <SelectInput optionText='app name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['belongs to-application'] && (
              <ReferenceInput
                label='Target Release'
                source='should be running-release'
                reference='release'
                target='id'
                filter={{ 'belongs to-application': formData['belongs to-application'] }}
                allowEmpty
              >
                <SelectInput optionText={(o) => getSemver(o)} optionValue='id' />
              </ReferenceInput>
            )
          }
        </FormDataConsumer>
        <SelectOperatingSystem label='Target OS' source='should be operated by-release' />
        <ReferenceInput
          label='Managed by Device'
          source='is managed by-device'
          reference='device'
          target='id'
          allowEmpty
        >
          <SelectInput optionText='device name' optionValue='id' />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

const device = {
  list: DeviceList,
  create: DeviceCreate,
  edit: DeviceEdit,
};

export default device;
