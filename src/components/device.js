import { Tooltip, useTheme } from '@mui/material';
import dateFormat from 'dateformat';
import * as React from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  FormDataConsumer,
  FunctionField,
  List,
  ReferenceField,
  ReferenceInput,
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
import CopyChip from '../ui/CopyChip';
import DeleteDeviceButton from '../ui/DeleteDeviceButton';
import DeviceConnectButton from '../ui/DeviceConnectButton';
import DeviceServicesButton from '../ui/DeviceServicesButton';
import Row from '../ui/Row';
import SelectOperatingSystem from '../ui/SelectOperatingSystem';
import SemVerChip, { getSemver } from '../ui/SemVerChip';

export const OnlineField = (props) => {
  const theme = useTheme();

  return (
    <FunctionField
      {...props}
      render={(record, source) => {
        const isOnline = record[source] === 'online';

        return (
          <Tooltip
            placement='top'
            arrow={true}
            title={'Since ' + dateFormat(new Date(record['last connectivity event']))}
          >
            <strong style={{ color: isOnline ? theme.palette.success.light : theme.palette.error.light }}>
              {isOnline ? 'Online' : 'Offline'}
            </strong>
          </Tooltip>
        );
      }}
    />
  );
};

const deviceFilters = [<SearchInput source='#uuid,device name,status@ilike' alwaysOn />];

const CustomBulkActionButtons = (props) => (
  <React.Fragment>
    <DeleteDeviceButton size='small' {...props}>
      Delete Selected Devices
    </DeleteDeviceButton>
  </React.Fragment>
);

export const DeviceList = (props) => {
  return (
    <List {...props} filters={deviceFilters}>
      <Datagrid bulkActionButtons={<CustomBulkActionButtons />} size='medium'>
        <ReferenceField label='Name' source='id' reference='device' target='id' link='show'>
          <TextField source='device name' />
        </ReferenceField>

        <OnlineField label='Status' source='api heartbeat state' />

        <ReferenceField label='Current Release' source='is running-release' reference='release' target='id'>
          <SemVerChip />
        </ReferenceField>

        <ReferenceField label='Device Type' source='is of-device type' reference='device type' target='id' link={false}>
          <TextField source='slug' />
        </ReferenceField>

        <ReferenceField label='Fleet' source='belongs to-application' reference='application' target='id'>
          <TextField source='app name' />
        </ReferenceField>

        <FunctionField
          label='OS'
          render={(record) =>
            record['os version'] && record['os variant'] ? `${record['os version']}-${record['os variant']}` : ''
          }
        />

        <FunctionField
          label='UUID'
          render={(record) => <CopyChip title={record['uuid']} label={record['uuid'].substring(0, 7)} />}
        />

        <Toolbar sx={{ background: 'none', padding: '0' }}>
          <ShowButton variant='outlined' label='' size='small' />
          <EditButton variant='outlined' label='' size='small' />
          <DeviceServicesButton variant='outlined' size='small' />
          <DeviceConnectButton variant='outlined' size='small' />
          <DeleteDeviceButton variant='outlined' size='small' style={{ marginRight: '0 !important' }} />
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
    <Create title='Create Device' ttransform={createDevice} onSuccess={processComplete}>
      <SimpleForm redirect='list'>
        <Row>
          <TextInput
            label='UUID'
            source='uuid'
            initialValue={uuidv4().replace(/-/g, '').toLowerCase()}
            validate={required()}
            size='large'
          />

          <TextInput label='Device Name' source='device name' validate={required()} size='large' />
        </Row>

        <TextInput label='Note' source='note' size='large' fullWidth={true} />

        <Row>
          <ReferenceInput
            label='Device Type'
            source='is of-device type'
            reference='device type'
            target='id'
            perPage={1000}
            sort={{ field: 'slug', order: 'ASC' }}
          >
            <SelectInput optionText='slug' optionValue='id' validate={required()} size='large' />
          </ReferenceInput>

          <ReferenceInput
            label='Managed by Device'
            source='is managed by-device'
            reference='device'
            target='id'
            allowEmpty
          >
            <SelectInput optionText='device name' optionValue='id' size='large' />
          </ReferenceInput>
        </Row>

        <Row>
          <ReferenceInput
            label='Fleet'
            source='belongs to-application'
            reference='application'
            target='id'
            perPage={1000}
            sort={{ field: 'app name', order: 'ASC' }}
            filter={{ 'is of-class': 'fleet' }}
          >
            <SelectInput optionText='app name' optionValue='id' validate={required()} size='large' />
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
        </Row>

        <SelectOperatingSystem label='Target OS' source='should be operated by-release' />
      </SimpleForm>
    </Create>
  );
};

export const DeviceEdit = () => {
  const modifyDevice = useModifyDevice();

  return (
    <Edit title='Edit Device' actions={null} transform={modifyDevice}>
      <SimpleForm>
        <Row>
          <TextInput label='UUID' source='uuid' size='large' />

          <TextInput label='Device Name' source='device name' size='large' />
        </Row>

        <TextInput label='Note' source='note' size='large' fullWidth={true} />

        <Row>
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
            label='Managed by Device'
            source='is managed by-device'
            reference='device'
            target='id'
            allowEmpty
          >
            <SelectInput optionText='device name' optionValue='id' />
          </ReferenceInput>
        </Row>

        <Row>
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
        </Row>
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
