import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
} from 'react-admin';

const DeviceTitle = ({ record }) => {
    return <span>Device {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="UUID" source="uuid" />
                <TextField label="Name" source="device name" />
                <ReferenceManyField label="Device Type" source="is of-device type" reference="device type" target="id">
                    <SingleFieldList>
                        <ChipField source="slug" />
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const DeviceCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="uuid" />
            <TextInput source="device name" />
        </SimpleForm>
    </Create>
);

export const DeviceEdit = props => (
    <Edit title={<DeviceTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="uuid" />
            <TextInput source="device name" />
        </SimpleForm>
    </Edit>
);

export default {
    list: DeviceList,
    create: DeviceCreate,
    edit: DeviceEdit
}