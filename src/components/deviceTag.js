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
} from 'react-admin';

const DeviceTagTitle = ({ record }) => {
    return <span>Device Tag {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceTagList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Device" source="device" reference="device" target="id">
                    <ChipField source="uuid" />
                </ReferenceField>
                <TextField label="Name" source="tag key" />
                <TextField label="Value" source="value" />
                <ReferenceField label="Fleet" source="device" reference="device" target="id" link={false}>
                    <ReferenceField source="belongs to-application" reference="application" target="id" link={(record, reference) => `/${reference}/${record['belongs to-application']}`}>
                        <ChipField source="app name" />
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

export const DeviceTagCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="tag key" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const DeviceTagEdit = props => (
    <Edit title={<DeviceTagTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="tag key" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const deviceTag = {
    list: DeviceTagList,
    create: DeviceTagCreate,
    edit: DeviceTagEdit
}

export default deviceTag;