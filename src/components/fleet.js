import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    FunctionField,
    BooleanField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
} from 'react-admin';

const FleetTitle = ({ record }) => {
    return <span>Fleet {record ? `"${record.name}"` : ''}</span>;
};

const BooleanBinaryField = (props) => {
    return (
      <FunctionField {...props} render={(record, source) =>
        <BooleanField source="enabled" record={{ ...record, enabled: (record[source] === 1) }} />}
      />
    );
  };

export const FleetList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="Name" source="app name" />
                <TextField label="Slug" source="slug" />
                <ReferenceManyField label="Device Type" source="is for-device type" reference="device type" target="id">
                    <SingleFieldList>
                        <ChipField source="slug" />
                    </SingleFieldList>
                </ReferenceManyField>
                <BooleanBinaryField label="Track Latest Rel." source="should track latest release" />
                <TextField label="Target Rel." source="should be running-release" />
                <TextField label="Depends On" source="depends on-application" />
                <BooleanBinaryField label="Host" source="is host" />
                <BooleanBinaryField label="Archived" source="is archived" />
                <BooleanBinaryField label="Public" source="is public" />
                <ReferenceManyField label="Organizations" source="organization" reference="organization" target="id">
                    <SingleFieldList>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Fleet Type" source="application type" reference="application type" target="id">
                    <SingleFieldList>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const FleetCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="app name" />
            <TextInput source="slug" />
        </SimpleForm>
    </Create>
);

export const FleetEdit = props => (
    <Edit title={<FleetTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="app name" />
            <TextInput source="slug" />
        </SimpleForm>
    </Edit>
);

const fleet = {
    list: FleetList,
    create: FleetCreate,
    edit: FleetEdit
}

export default fleet;