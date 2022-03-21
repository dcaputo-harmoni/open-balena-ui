import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    FunctionField,
    BooleanField,
    ReferenceField,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    ReferenceInput,
    SelectInput,
    EditButton,
    useDataProvider,
    required,
} from 'react-admin';
import { v4 as uuidv4 } from 'uuid';

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
            <Datagrid>
                <TextField source="id" />
                <TextField label="Name" source="app name" />
                <TextField label="Slug" source="slug" />
                <ReferenceField label="Device Type" source="is for-device type" reference="device type" target="id">
                    <ChipField source="slug" />
                </ReferenceField>
                <BooleanBinaryField label="Track Latest Rel." source="should track latest release" />
                <ReferenceField label="Target Rel." source="should be running-release" reference="release" target="id">
                    <ChipField source="revision" />
                </ReferenceField>
                <TextField label="Depends On" source="depends on-application" />
                <BooleanBinaryField label="Host" source="is host" />
                <BooleanBinaryField label="Archived" source="is archived" />
                <BooleanBinaryField label="Public" source="is public" />
                <ReferenceField label="Organization" source="organization" reference="organization" target="id">
                    <ChipField source="name" />
                </ReferenceField>
                <ReferenceField label="Fleet Type" source="application type" reference="application type" target="id">
                    <ChipField source="name" />
                </ReferenceField>
                <EditButton label="" color="default"/>
            </Datagrid>
        </List>
    )
};

export const FleetCreate = props => {
    let dataProvider = useDataProvider();
    const processFleetCreate = async (data) => {
        let actor = await dataProvider.create('actor', { data: {} });
        data.actor = actor.data.id;
        return data;
    };
    return (
    <Create transform={processFleetCreate} {...props}>
        <SimpleForm redirect="list">
            <TextInput source="app name" validate={required()}/>
            <TextInput source="slug" validate={required()}/>
            <TextInput source="uuid" initialValue={uuidv4().replace(/-/g, '').toLowerCase()} validate={required()}/>
            <ReferenceInput label="Device Type" source="is for-device type" reference="device type" target="id" perPage={1000} sort={{field: "slug", order: "ASC"}} validate={required()}>
                <SelectInput optionText="slug" optionValue="id"/>
            </ReferenceInput>
            <ReferenceInput label="Organization" source="organization" reference="organization" target="id" validate={required()}>
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Fleet Type" source="application type" reference="application type" target="id" validate={required()}>
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
    );
}

export const FleetEdit = props => (
    <Edit title={<FleetTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="app name" />
            <TextInput source="slug" />
            <ReferenceInput label="Device Type" source="is for-device type" reference="device type" target="id">
                <SelectInput optionText="slug" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Organization" source="organization" reference="organization" target="id">
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Fleet Type" source="application type" reference="application type" target="id">
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const fleet = {
    list: FleetList,
    create: FleetCreate,
    edit: FleetEdit
}

export default fleet;