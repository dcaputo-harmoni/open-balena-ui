import * as React from 'react';
import {
  BooleanField,
  BooleanInput,
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
import Row from '../ui/Row';
import SemVerChip, { getSemver } from '../ui/SemVerChip';
import versions from '../versions';

const isPinnedOnRelease = versions.resource('isPinnedOnRelease', process.env.REACT_APP_OPEN_BALENA_API_VERSION);

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
    <DeleteFleetButton size='small' {...props}>
      Delete Selected Fleets
    </DeleteFleetButton>
  </React.Fragment>
);

export const FleetList = () => {
  return (
    <List>
      <Datagrid
        bulkActionButtons={<CustomBulkActionButtons />}
        size='medium'
        sx={{
          '.column-is, .column-should.track.latest.release': {
            textAlign: 'center',
          },
          '.column-is.for-device.type': {
            textAlign: 'left',
          },
        }}
      >
        <TextField label='Name' source='app name' />

        <ReferenceField label='Organization' source='organization' reference='organization' target='id'>
          <TextField source='name' />
        </ReferenceField>

        <TextField label='Slug' source='slug' />

        <ReferenceField label='Device Type' source='is for-device type' reference='device type' target='id'>
          <TextField source='slug' />
        </ReferenceField>

        <ReferenceField label='Target Rel.' source='should be running-release' reference='release' target='id'>
          <SemVerChip />
        </ReferenceField>

        <BooleanBinaryField label='Host' source='is host' />

        <BooleanBinaryField label='Archived' source='is archived' />

        <BooleanBinaryField label='Public' source='is public' />

        <BooleanBinaryField label='Track Latest Rel.' source='should track latest release' />

        <Toolbar>
          <EditButton label='' size='small' variant='outlined' />
          <DeleteFleetButton size='small' variant='outlined' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const FleetCreate = (props) => {
  let createFleet = useCreateFleet();

  return (
    <Create title='Create Fleet' transform={createFleet} {...props}>
      <SimpleForm redirect='list'>
        <Row>
          <TextInput source='app name' validate={[required(), minLength(4), maxLength(100)]} size='large' />

          <TextInput source='slug' validate={required()} size='large' />
        </Row>

        <TextInput
          source='uuid'
          initialValue={uuidv4().replace(/-/g, '').toLowerCase()}
          validate={[required(), minLength(32), maxLength(32)]}
          size='large'
          fullWidth={true}
        />

        <Row>
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

          <ReferenceInput
            label='Depends on Fleet'
            source='depends on-application'
            reference='application'
            target='id'
            allowEmpty
          >
            <SelectInput optionText='app name' optionValue='id' />
          </ReferenceInput>
        </Row>

        <Row>
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
        </Row>

        <br />

        <Row>
          <BooleanInput
            label='Track Latest Release'
            source='should track latest release'
            format={(v) => v !== 0}
            parse={(v) => (v ? 1 : 0)}
            initialValue={1}
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
        </Row>
      </SimpleForm>
    </Create>
  );
};

const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ justifyContent: 'space-between' }}>
    <SaveButton sx={{ flex: 1 }} />
    <DeleteFleetButton size='large' sx={{ marginLeft: '40px' }}>
      Delete
    </DeleteFleetButton>
  </Toolbar>
);

export const FleetEdit = () => {
  const { id: fleetId } = useParams();

  return (
    <Edit title='Edit Fleet'>
      <SimpleForm toolbar={<CustomToolbar />}>
        <Row>
          <TextInput source='app name' validate={[required(), minLength(4), maxLength(100)]} size='large' />
          <TextInput source='slug' validate={required()} size='large' />
        </Row>

        <TextInput source='uuid' validate={[required(), minLength(32), maxLength(32)]} size='large' fullWidth={true} />

        <Row>
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

          <ReferenceInput
            label='Depends on Fleet'
            source='depends on-application'
            reference='application'
            target='id'
            allowEmpty
          >
            <SelectInput optionText='app name' optionValue='id' />
          </ReferenceInput>
        </Row>

        <Row>
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
        </Row>

        <br />

        <Row>
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

          <BooleanInput label='Host' source='is host' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
          <BooleanInput label='Archived' source='is archived' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
          <BooleanInput label='Public' source='is public' format={(v) => v !== 0} parse={(v) => (v ? 1 : 0)} />
        </Row>
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
