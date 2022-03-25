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
    DeleteButton,
    ReferenceInput,
    SelectInput,
    TextInput,
    Toolbar,
    required,
} from 'react-admin';

const UserKeysTitle = ({ record }) => {
    return <span>User Key {record ? `"${record.id}"` : ''}</span>;
};

export const UserKeysList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <ReferenceField label="User" source="user" reference="user" target="id">
                    <ChipField source="username"/>
                </ReferenceField>
                <TextField label="Key Name" source="title"/>
                <TextField label="Key" source="public key"/>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const UserKeysCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="user" reference="user" target="id" validate={required()}>
                <SelectInput optionText="username" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Title" source="title" validate={required()}/>
            <TextInput multiline label="Key" source="public key" validate={required()}/>
        </SimpleForm>
    </Create>
);

export const UserKeysEdit = props => (
    <Edit title={<UserKeysTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="user" reference="user" target="id" validate={required()}>
                <SelectInput optionText="username" optionValue="id"/>
            </ReferenceInput>
            <TextInput label="Title" source="title" validate={required()}/>
            <TextInput multiline label="Key" source="public key" validate={required()}/>
        </SimpleForm>
    </Edit>
);

const userKey ={
    list: UserKeysList,
    create: UserKeysCreate,
    edit: UserKeysEdit
}

export default userKey;