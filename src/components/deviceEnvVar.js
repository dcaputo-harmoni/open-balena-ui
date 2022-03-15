import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceField,
    ChipField,
    List,
    SimpleForm,
    EditButton,
    ReferenceInput,
    SelectInput,
    TextInput,
} from 'react-admin';

const DeviceEnvVarTitle = ({ record }) => {
    return <span>Device Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceEnvVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Device" source="device" reference="device" target="id">
                    <ChipField source="uuid" />
                </ReferenceField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <ReferenceField label="Fleet" source="device" reference="device" target="id">
                    <ReferenceField source="belongs to-application" reference="application" target="id">
                        <ChipField source="app name" />
                    </ReferenceField>
                </ReferenceField>
                <EditButton label="" color="default"/>
            </Datagrid>
        </List>
    )
};

export const DeviceEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const DeviceEnvVarEdit = props => (
    <Edit title={<DeviceEnvVarTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const deviceEnvVar = {
    list: DeviceEnvVarList,
    create: DeviceEnvVarCreate,
    edit: DeviceEnvVarEdit
}

export default deviceEnvVar;