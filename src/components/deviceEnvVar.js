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
    DeleteButton,
    Toolbar,
    required,
} from 'react-admin';

const DeviceEnvVarTitle = ({ record }) => {
    return <span>Device Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceEnvVarList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <ReferenceField label="Device" source="device" reference="device" target="id">
                    <ChipField source="uuid"/>
                </ReferenceField>
                <TextField label="Name" source="name"/>
                <TextField label="Value" source="value"/>
                <ReferenceField label="Fleet" source="device" reference="device" target="id" link={false}>
                    <ReferenceField source="belongs to-application" reference="application" target="id" link={(record, reference) => `/${reference}/${record['belongs to-application']}`}>
                        <ChipField source="app name"/>
                    </ReferenceField>
                </ReferenceField>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const DeviceEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="device" reference="device" target="id" perPage={1000} sort={{field: "device name", order: "ASC"}} validate={required()}>
                <SelectInput optionText="device name" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Name" source="name" validate={required()}/>
            <TextInput label="Value" source="value" validate={required()}/>
        </SimpleForm>
    </Create>
);

export const DeviceEnvVarEdit = props => (
    <Edit title={<DeviceEnvVarTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="device" reference="device" target="id" perPage={1000} sort={{field: "device name", order: "ASC"}} validate={required()}>
                <SelectInput optionText="device name" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Name" source="name" validate={required()}/>
            <TextInput label="Value" source="value" validate={required()}/>
        </SimpleForm>
    </Edit>
);

const deviceEnvVar = {
    list: DeviceEnvVarList,
    create: DeviceEnvVarCreate,
    edit: DeviceEnvVarEdit
}

export default deviceEnvVar;