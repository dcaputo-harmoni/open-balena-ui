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
} from 'react-admin';

const UserKeysTitle = ({ record }) => {
    return <span>User Key {record ? `"${record.id}"` : ''}</span>;
};

export const UserKeysList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="User" source="user" reference="user" target="id">
                    <ChipField source="username" />
                </ReferenceField>
                <TextField label="Key Name" source="title" />
                <TextField label="Key" source="public key" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const UserKeysCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="user" reference="user" target="id">
                <SelectInput optionText="username" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Title" source="title" />
            <TextInput multiline label="Key" source="public key" />
        </SimpleForm>
    </Create>
);

export const UserKeysEdit = props => (
    <Edit title={<UserKeysTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="user" reference="user" target="id">
                <SelectInput optionText="username" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Title" source="title" />
            <TextInput multiline label="Key" source="public key" />
        </SimpleForm>
    </Edit>
);

const userKey ={
    list: UserKeysList,
    create: UserKeysCreate,
    edit: UserKeysEdit
}

export default userKey;