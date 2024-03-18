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
  ReferenceInput,
  SelectInput,
  TextInput,
  EditButton,
  DeleteButton,
  Toolbar,
  required,
  FormDataConsumer,
} from 'react-admin';

const ServiceEnvVarTitle = ({ record }) => {
  return <span>Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const ServiceEnvVarList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source='id' />
        <ReferenceField label='Fleet' source='service' reference='service' target='id'>
          <ReferenceField source='application' reference='application' target='id'>
            <ChipField source='app name' />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField label='Service' source='service' reference='service' target='id'>
          <ChipField source='service name' />
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

export const ServiceEnvVarCreate = (props) => {
  const processCreate = async (data) => {
    delete data.application;
    return data;
  };

  return (
    <Create transform={processCreate} {...props}>
      <SimpleForm redirect='list'>
        <ReferenceInput
          label='Fleet'
          source='application'
          reference='application'
          target='id'
          perPage={1000}
          sort={{ field: 'app name', order: 'ASC' }}
          validate={required()}
        >
          <SelectInput optionText='app name' optionValue='id' />
        </ReferenceInput>
        <FormDataConsumer>
          {({ formData, ...rest }) =>
            formData['application'] && (
              <ReferenceInput
                label='Service'
                source='service'
                reference='service'
                target='id'
                filter={{ application: formData.application }}
                perPage={1000}
                sort={{ field: 'service name', order: 'ASC' }}
                validate={required()}
              >
                <SelectInput optionText='service name' optionValue='id' />
              </ReferenceInput>
            )
          }
        </FormDataConsumer>
        <TextInput label='Name' source='name' validate={required()} />
        <TextInput label='Value' source='value' validate={required()} />
      </SimpleForm>
    </Create>
  );
};

export const ServiceEnvVarEdit = (props) => (
  <Edit title={<ServiceEnvVarTitle />} {...props}>
    <SimpleForm>
      <ReferenceInput
        label='Fleet'
        source='application'
        reference='application'
        target='id'
        perPage={1000}
        sort={{ field: 'app name', order: 'ASC' }}
        validate={required()}
      >
        <SelectInput optionText='app name' optionValue='id' />
      </ReferenceInput>
      <FormDataConsumer>
        {({ formData, ...rest }) =>
          formData['application'] && (
            <ReferenceInput
              label='Service'
              source='service'
              reference='service'
              target='id'
              filter={{ application: formData.application }}
              perPage={1000}
              sort={{ field: 'service name', order: 'ASC' }}
              validate={required()}
            >
              <SelectInput optionText='service name' optionValue='id' />
            </ReferenceInput>
          )
        }
      </FormDataConsumer>
      <TextInput label='Name' source='name' validate={required()} />
      <TextInput label='Value' source='value' validate={required()} />
    </SimpleForm>
  </Edit>
);

const serviceEnvVar = {
  list: ServiceEnvVarList,
  create: ServiceEnvVarCreate,
  edit: ServiceEnvVarEdit,
};

export default serviceEnvVar;
