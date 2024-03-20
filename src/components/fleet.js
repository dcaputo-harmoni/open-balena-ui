import * as React from 'react';
import {
  BooleanField,
  BooleanInput,
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
  SelectField,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  maxLength,
  minLength,
  required,
} from 'react-admin';
import { useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { useCreateFleet } from '../lib/fleet';
import DeleteFleetButton from '../ui/DeleteFleetButton';
import SemVerChip, { getSemver } from '../ui/SemVerChip';

const FleetTitle = ({ record }) => {
  return <span>Fleet {record ? `"${record['app name']}"` : ''}</span>;
};

const BooleanBinaryField = (props) => {
  return (
    <FunctionField
      {...props}
      render={(record, source) => (
        <BooleanField source='enabled' record={{ ...record, enabled: record[source] === 1 }} />
      )}
    />
  );
};

const CustomBulkActionButtons = (props) => (
  <React.Fragment>
    <DeleteFleetButton variant='text' size='small' {...props}>
      {' '}
      Delete{' '}
    </DeleteFleetButton>
  </React.Fragment>
);

export const FleetList = (props) => {
  return (
    <List {...props}>
      <Datagrid bulkActionButtons={<CustomBulkActionButtons />}>
        <TextField source='id' />
        <TextField label='Name' source='app name' />
        <ReferenceField label='Organization' source='organization' reference='organization' target='id'>
          <ChipField source='name' />
        </ReferenceField>
        <TextField label='Slug' source='slug' />
        <ReferenceField label='Device Type' source='is for-device type' reference='device type' target='id'>
          <ChipField source='slug' />
        </ReferenceField>
        <BooleanBinaryField label='Track Latest Rel.' source='should track latest release' />
        <ReferenceField label='Target Rel.' source='should be running-release' reference='release' target='id'>
          <SemVerChip />
        </ReferenceField>
        <SelectField
          label='Class'
          source='is of-class'
          choices={[
            { id: 'fleet', name: 'Fleet' },
            { id: 'app', name: 'App' },
            { id: 'block', name: 'Block' },
          ]}
        />
        <BooleanBinaryField label='Host' source='is host' />
        <BooleanBinaryField label='Archived' source='is archived' />
        <BooleanBinaryField label='Public' source='is public' />
        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' />
          <DeleteFleetButton variant='text' size='small' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const FleetCreate = (props) => {
  let createFleet = useCreateFleet();

  return (
    <Create transform={createFleet} {...props}>
      <SimpleForm redirect='list'>
        <TextInput source='app name' validate={[required(), minLength(4), maxLength(100)]} />
        <TextInput source='slug' validate={required()} />
        <TextInput
          source='uuid'
          initialValue={uuidv4().replace(/-/g, '').toLowerCase()}
          validate={[required(), minLength(32), maxLength(32)]}
        />
        <ReferenceInput
          label='Device Type'
          source='is for-device type'
          reference='device type'
          target='id'
          perPage={1000}
          sort={{ field: 'slug', order: 'ASC' }}
        >
          <SelectInput optionText='slug' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Organization'
          source='organization'
          reference='organization'
          target='id'
          perPage={1000}
          sort={{ field: 'name', order: 'ASC' }}
        >
          <SelectInput optionText='name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Fleet Type'
          source='application type'
          reference='application type'
          target='id'
          perPage={1000}
          sort={{ field: 'name', order: 'ASC' }}
          initialValue={1}
        >
          <SelectInput optionText='name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <BooleanInput
          label='Track Latest Release'
          source='should track latest release'
          format={(v) => v !== 0}
          parse={(v) => (v ? 1 : 0)}
          initialValue={1}
        />
        <SelectInput
          label='Class'
          source='is of-class'
          choices={[
            { id: 'fleet', name: 'Fleet' },
            { id: 'app', name: 'App' },
            { id: 'block', name: 'Block' },
          ]}
          initialValue={'fleet'}
        />
        <BooleanInput
          label='Host'
          source='is host'
          format={(v) => v !== 0}
          parse={(v) => (v ? 1 : 0)}
          initialValue={0}
        />
        <BooleanInput
          label='Archived'
          source='is archived'
          format={(v) => v !== 0}
          parse={(v) => (v ? 1 : 0)}
          initialValue={0}
        />
        <BooleanInput
          label='Public'
          source='is public'
          format={(v) => v !== 0}
          parse={(v) => (v ? 1 : 0)}
          initialValue={0}
        />
        <ReferenceInput
          label='Depends on Fleet'
          source='depends on-application'
          reference='application'
          target='id'
          allowEmpty
        >
          <SelectInput optionText='app name' optionValue='id' />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ justifyContent: 'space-between' }}>
    <SaveButton />
    <DeleteFleetButton
      variant='text'
      sx={{ 'padding': '6px', 'color': '#f44336', '.hover': { backgroundColor: '#fff', color: '#3c52b2' } }}
    >
      {' '}
      Delete{' '}
    </DeleteFleetButton>
  </Toolbar>
);

export const FleetEdit = () => {
  const { id: fleetId } = useParams();

  return (
    <Edit title={<FleetTitle />}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput disabled source='id' />
        <TextInput source='app name' validate={[required(), minLength(4), maxLength(100)]} />
        <TextInput source='slug' validate={required()} />
        <TextInput source='uuid' validate={[required(), minLength(32), maxLength(32)]} />
        <ReferenceInput
          label='Device Type'
          source='is for-device type'
          reference='device type'
          target='id'
          perPage={1000}
          sort={{ field: 'slug', order: 'ASC' }}
        >
          <SelectInput optionText='slug' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Organization'
          source='organization'
          reference='organization'
          target='id'
          perPage={1000}
          sort={{ field: 'name', order: 'ASC' }}
        >
          <SelectInput optionText='name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <ReferenceInput
          label='Fleet Type'
          source='application type'
          reference='application type'
          target='id'
          perPage={1000}
          sort={{ field: 'name', order: 'ASC' }}
        >
          <SelectInput optionText='name' optionValue='id' validate={required()} />
        </ReferenceInput>
        <BooleanInput
          label='Track Latest Release'
          source='should track latest release'
          format={(v) => v !== 0}
          parse={(v) => (v ? 1 : 0)}
        />
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['should track latest release'] === 0 && (
              <ReferenceInput
                label='Target Release'
                source='should be running-release'
                reference='release'
                target='id'
                filter={{ 'belongs to-application': fleetId }}
                allowEmpty
              >
                <SelectInput optionText={(o) => getSemver(o)} optionValue='id' />
              </ReferenceInput>
            )
          }
        </FormDataConsumer>
        <SelectInput
          label='Class'
          source='is of-class'
          choices={[
            { id: 'fleet', name: 'Fleet' },
            { id: 'app', name: 'App' },
            { id: 'block', name: 'Block' },
          ]}
          initialValue={'fleet'}
        />
        <BooleanInput label='Host' source='is host' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
        <BooleanInput label='Archived' source='is archived' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
        <BooleanInput label='Public' source='is public' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
        <ReferenceInput
          label='Depends on Fleet'
          source='depends on-application'
          reference='application'
          target='id'
          allowEmpty
        >
          <SelectInput optionText='app name' optionValue='id' />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

const fleet = {
  list: FleetList,
  create: FleetCreate,
  edit: FleetEdit,
};

export default fleet;
