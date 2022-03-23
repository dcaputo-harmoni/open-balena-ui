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
    TextInput,
    EditButton,
    DeleteButton,
} from 'react-admin';
import versions from '../versions'

const DeviceTypeTitle = ({ record }) => {
    return <span>Device Type {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceTypeList = (props) => {
    const deviceTypeAlias = versions.resource("deviceTypeAlias", process.env.REACT_APP_OPEN_BALENA_API_VERSION);
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Slug" source="slug" />
                <TextField label="Name" source="name" />
                <ReferenceField label="Architecture" source="is of-cpu architecture" reference="cpu architecture" target="id">
                    <ChipField source="slug" />
                </ReferenceField>
                {deviceTypeAlias ? 
                <ReferenceField label="Aliases" source="id" reference={deviceTypeAlias} target="device type">
                    <ChipField source="is referenced by-alias" />
                </ReferenceField>
                : <></>
                }
                <ReferenceField label="Family" source="belongs to-device family" reference="device family" target="id" allowEmpty>
                    <ChipField source="slug" />
                </ReferenceField>
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const DeviceTypeCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export const DeviceTypeEdit = props => (
    <Edit title={<DeviceTypeTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

const deviceType = {
    list: DeviceTypeList,
    create: DeviceTypeCreate,
    edit: DeviceTypeEdit
}

export default deviceType;