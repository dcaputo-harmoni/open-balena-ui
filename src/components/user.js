import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    EmailField,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    PasswordInput,
    Toolbar,
    EditButton,
    SaveButton,
} from 'react-admin';
import ChangePasswordButton from "../ui/ChangePasswordButton";
import DeleteUserButton from "../ui/DeleteUserButton";
import ManagePermissions from "../ui/ManagePermissions";
import ManageRoles from "../ui/ManageRoles";
import ManageOrganizations from "../ui/ManageOrganizations";
import { useCreateUser, useModifyUser } from '../lib/user'

const UserTitle = ({ record }) => {
    return <span>User {record ? `"${record.username}"` : ''}</span>;
};

const CustomBulkActionButtons = props => (
    <React.Fragment>
        <DeleteUserButton variant="text" size="small" color="default" {...props}> Delete </DeleteUserButton>
    </React.Fragment>
);

export const UserList = props => {
    return (
        <List {...props} bulkActionButtons={<CustomBulkActionButtons />}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="username" />
                <EmailField source="email" />
                <ReferenceManyField label="Organizations" source="id" reference="organization membership" target="user">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="is member of-organization" reference="organization" target="id">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="API Keys" source="actor" reference="api key" target="is of-actor">
                    <SingleFieldList>
                        <ChipField source="key" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Roles" source="id" reference="user-has-role" target="user">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="role" reference="role" target="id">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteUserButton variant="text" size="small" color="default"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const UserCreate = props => {
    const createUser = useCreateUser();

    const processCreate = async (data) => {
        return createUser(data);
    };    

    return (
        <Create transform={processCreate} {...props} >
            <SimpleForm>
                <TextInput source="username" />
                <TextInput source="email" />
                <PasswordInput source="password" />
            </SimpleForm>
        </Create>
    )
};

const CustomToolbar = props => (
    <Toolbar {...props} style={{ justifyContent: "space-between" }}>
        <SaveButton/>
        <DeleteUserButton variant="text" style={{padding: "6px", color: "#f44336", ".hover": { backgroundColor: '#fff', color: '#3c52b2'}}} > Delete </DeleteUserButton>
    </Toolbar>
);

export const UserEdit = props => {

    const modifyUser = useModifyUser();

    const processEdit = async (data) => {
        data = await modifyUser(data);
        return data;
    }

    return (
        <Edit title={<UserTitle />} transform={processEdit} {...props}>
            <SimpleForm toolbar={<CustomToolbar alwaysEnableSaveButton/>}>
                <TextInput disabled source="id"/>
                <TextInput source="username"/>
                <TextInput source="email"/>
                <TextInput disabled source="jwt secret"/>
                <ChangePasswordButton/>
                <ManageOrganizations source="organizationArray" reference="organization membership" target="user"/>
                <ManagePermissions source="permissionArray" reference="user-has-permission" target="user"/>
                <ManageRoles source="roleArray" reference="user-has-role" target="user"/>
            </SimpleForm>
        </Edit>
    );
}

const userExport = {
    list: UserList,
    create: UserCreate,
    edit: UserEdit
}

export default userExport;