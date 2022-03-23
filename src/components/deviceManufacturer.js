import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    List,
    SimpleForm,
    EditButton,
    TextInput,
    DeleteButton,
    Toolbar,
} from 'react-admin';

const DeviceManufacturerTitle = ({ record }) => {
    return <span>Device Manufacturer {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceManufacturerList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Slug" source="slug" />
                <TextField label="Name" source="name" />
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const DeviceManufacturerCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput label="Slug" source="slug" />
            <TextInput label="Name" source="name" />
        </SimpleForm>
    </Create>
);

export const DeviceManufacturerEdit = props => (
    <Edit title={<DeviceManufacturerTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Slug" source="slug" />
            <TextInput label="Name" source="name" />
        </SimpleForm>
    </Edit>
);

const deviceManufacturer = {
    list: DeviceManufacturerList,
    create: DeviceManufacturerCreate,
    edit: DeviceManufacturerEdit
}

export default deviceManufacturer;