import * as React from "react";
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
    TextInput,
} from 'react-admin';

const OrganizationTitle = ({ record }) => {
    return <span>Organization {record ? `"${record.name}"` : ''}</span>;
};

export const OrganizationList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="handle" />
                <ReferenceManyField label="Users" reference="organization membership" target="is member of-organization">
                    <SingleFieldList>
                        <ReferenceField source="user" reference="user">
                            <ChipField source="username" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const OrganizationCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="handle" />
        </SimpleForm>
    </Create>
);

export const OrganizationEdit = props => (
    <Edit title={<OrganizationTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="handle" />
        </SimpleForm>
    </Edit>
);

const organization = {
    list: OrganizationList,
    create: OrganizationCreate,
    edit: OrganizationEdit
}

export default organization;