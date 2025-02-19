import Chip from '@mui/material/Chip';
import * as React from 'react';
import {
  Create,
  DataProviderContext,
  Datagrid,
  Edit,
  EditButton,
  FormDataConsumer,
  FunctionField,
  List,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceManyField,
  SaveButton,
  SearchInput,
  SelectInput,
  SimpleForm,
  SingleFieldList,
  TextField,
  TextInput,
  Toolbar,
  useRecordContext,
} from 'react-admin';
import { useCreateApiKey, useGenerateApiKey, useModifyApiKey } from '../lib/apiKey';
import CopyChip from '../ui/CopyChip';
import DeleteApiKeyButton from '../ui/DeleteApiKeyButton';
import ManagePermissions from '../ui/ManagePermissions';
import ManageRoles from '../ui/ManageRoles';
import Row from '../ui/Row';

class ActorField extends React.Component {
  static contextType = DataProviderContext;
  constructor(props) {
    super(props);
    this.state = { record: {} }; // defaults while fetch is occurring
  }

  componentDidMount() {
    let actorLookups = [
      { resource: 'user', field: 'actor' },
      { resource: 'device', field: 'actor' },
      { resource: 'application', field: 'actor' },
    ];
    return Promise.all(
      actorLookups.map((lookup) => {
        return this.context
          .getList(lookup.resource, {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [lookup.field]: this.props.record['is of-actor'] },
          })
          .then((result) => {
            if (result.data.length > 0) {
              let currentState = this.state;
              currentState.record.actorName =
                result.data[0].username || result.data[0]['app name'] || result.data[0]['device name'];
              currentState.record.actorType = result.data[0].username
                ? 'User'
                : result.data[0]['app name']
                  ? 'Fleet'
                  : 'Device';
              let actorRecordType = result.data[0].username
                ? 'user'
                : result.data[0]['app name']
                  ? 'application'
                  : 'device';
              let actorRecordId = result.data[0].id;
              currentState.record.actorLink = `/#/${actorRecordType}/${actorRecordId}`;
              this.setState(currentState);
            }
          });
      }),
    );
  }

  generateLabel() {
    if (this.state.record.actorType && this.state.record.actorName) {
      return `${this.state.record.actorType}: ${this.state.record.actorName}`;
    } else {
      return 'Unassigned';
    }
  }

  render() {
    return <Chip label={this.generateLabel()} href={this.state.record.actorLink} component='a' clickable />;
  }
}

const apiKeyFilters = [<SearchInput source='#key,name,description@ilike' alwaysOn />];

const CustomBulkActionButtons = (props) => (
  <React.Fragment>
    <DeleteApiKeyButton variant='contained' size='small' {...props}>
      Delete Selected API Keys
    </DeleteApiKeyButton>
  </React.Fragment>
);

const ActorFieldWrapper = (props) => {
  const record = useRecordContext();
  return <ActorField {...props} record={record} />;
};

export const ApiKeyList = () => {
  return (
    <List filters={apiKeyFilters}>
      <Datagrid size='medium' rowClick={false} bulkActionButtons={<CustomBulkActionButtons />}>
        <FunctionField
          label='API Key'
          render={(record) => <CopyChip title={record.key} label={record.key.slice(0, 10) + '...'} />}
        />

        <TextField label='Name' source='name' />
        <ActorFieldWrapper label='Assigned To' />

        <ReferenceManyField label='Roles' source='id' reference='api key-has-role' target='api key'>
          <SingleFieldList linkType={false}>
            <ReferenceField source='role' reference='role' target='id'>
              <TextField source='name' />
            </ReferenceField>
          </SingleFieldList>
        </ReferenceManyField>

        <Toolbar style={{ minHeight: 0, minWidth: 0, padding: 0, margin: 0, background: 0, textAlign: 'center' }}>
          <EditButton label='' size='small' variant='outlined' />
          <DeleteApiKeyButton size='small' variant='outlined' />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

export const ApiKeyCreate = (props) => {
  const generateApiKey = useGenerateApiKey();
  const createApiKey = useCreateApiKey();

  return (
    <Create {...props} transform={createApiKey}>
      <SimpleForm>
        <TextInput source='key' initialValue={generateApiKey()} size='large' fullWidth={true} />

        <Row>
          {' '}
          <TextInput source='name' size='large' />
          <TextInput source='description' size='large' />
        </Row>

        <Row>
          <FormDataConsumer>
            {({ formData, ...rest }) => {
              if (formData.deviceActor || formData.fleetActor) rest.disabled = true;
              return (
                <ReferenceArrayInput source='userActor' reference='user' {...rest}>
                  <SelectInput optionText='username' optionValue='actor' resettable />
                </ReferenceArrayInput>
              );
            }}
          </FormDataConsumer>

          <FormDataConsumer>
            {({ formData, ...rest }) => {
              if (formData.userActor || formData.fleetActor) rest.disabled = true;
              return (
                <ReferenceArrayInput source='deviceActor' reference='device' {...rest}>
                  <SelectInput optionText='device name' optionValue='actor' resettable />
                </ReferenceArrayInput>
              );
            }}
          </FormDataConsumer>

          <FormDataConsumer>
            {({ formData, ...rest }) => {
              if (formData.userActor || formData.deviceActor) rest.disabled = true;
              return (
                <ReferenceArrayInput source='fleetActor' reference='application' {...rest}>
                  <SelectInput optionText='app name' optionValue='actor' resettable />
                </ReferenceArrayInput>
              );
            }}
          </FormDataConsumer>
        </Row>
      </SimpleForm>
    </Create>
  );
};

const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ justifyContent: 'space-between', marginTop: '40px' }}>
    <SaveButton sx={{ flex: 1 }} />
    <DeleteApiKeyButton sx={{ flex: 0.3, marginLeft: '40px' }}> Delete </DeleteApiKeyButton>
  </Toolbar>
);

export const ApiKeyEdit = () => {
  const modifyApiKey = useModifyApiKey();

  return (
    <Edit
      title='Edit API Key'
      transform={modifyApiKey}
      sx={{
        '> div > div': {
          maxWidth: '900px !important',
        },
      }}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source='key' disabled={true} size='large' fullWidth={true} />

        <Row>
          <TextInput source='name' size='large' />
          <TextInput source='description' size='large' />
        </Row>

        <ManagePermissions source='permissionArray' reference='api key-has-permission' target='api key' />
        <ManageRoles source='roleArray' reference='api key-has-role' target='api key' />
      </SimpleForm>
    </Edit>
  );
};

const apiKey = {
  list: ApiKeyList,
  create: ApiKeyCreate,
  edit: ApiKeyEdit,
};

export default apiKey;
