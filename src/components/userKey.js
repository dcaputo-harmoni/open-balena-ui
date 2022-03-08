import * as React from "react";
import * as bcrypt from "bcryptjs";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
} from 'react-admin';

const UserKeysTitle = ({ record }) => {
    return <span>User Key {record ? `"${record.id}"` : ''}</span>;
};

export const UserKeysList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="User" source="user" reference="user" target="id">
                    <SingleFieldList>
                        <ChipField source="username" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Key Name" source="title" />
                <TextField label="Key" source="public key" />
            </Datagrid>
        </List>
    )
};

export const UserKeysCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const UserKeysEdit = props => (
    <Edit title={<UserKeysTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: UserKeysList,
    create: UserKeysCreate,
    edit: UserKeysEdit
}