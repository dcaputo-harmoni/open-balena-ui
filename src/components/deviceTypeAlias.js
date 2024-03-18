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

const DeviceTypeAliasTitle = ({ record }) => {
    return <span>Device Type Alias {record ? `"${record["is referenced by-alias"]}"` : ''}</span>;
};

export const DeviceTypeAliasList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <ReferenceField label="Device Type" source="device type" reference="device type" target="id">
                    <ChipField source="slug"/>
                </ReferenceField>
                <TextField label="Alias" source="is referenced by-alias"/>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label=""/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const DeviceTypeAliasCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="device type" reference="device type" target="id" perPage={1000} sort={{field: "slug", order: "ASC"}} validate={required()}>
                <SelectInput optionText="slug" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Alias" source="is referenced by-alias" validate={required()}/>
        </SimpleForm>
    </Create>
);

export const DeviceTypeAliasEdit = props => (
    <Edit title={<DeviceTypeAliasTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="device type" reference="device type" target="id" perPage={1000} sort={{field: "slug", order: "ASC"}} validate={required()}>
                <SelectInput optionText="slug" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Alias" source="is referenced by-alias" validate={required()}/>
        </SimpleForm>
    </Edit>
);

const deviceTypeAlias = {
    list: DeviceTypeAliasList,
    create: DeviceTypeAliasCreate,
    edit: DeviceTypeAliasEdit
}

export default deviceTypeAlias;