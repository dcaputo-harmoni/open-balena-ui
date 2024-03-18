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
    EditButton,
    DeleteButton,
    Toolbar,
    required,
} from 'react-admin';

const OrganizationTitle = ({ record }) => {
    return <span>Organization {record ? `"${record.name}"` : ''}</span>;
};

export const OrganizationList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="name"/>
                <TextField source="handle"/>
                <ReferenceManyField label="Users" reference="organization membership" target="is member of-organization">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="user" reference="user">
                            <ChipField source="username"/>
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Fleets" source="id" reference="application" target="organization">
                    <SingleFieldList linkType={false}>
                        <ChipField source="app name"/>
                    </SingleFieldList>
                </ReferenceManyField>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label=""/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const OrganizationCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()}/>
            <TextInput source="handle" validate={required()}/>
        </SimpleForm>
    </Create>
);

export const OrganizationEdit = props => (
    <Edit title={<OrganizationTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id"/>
            <TextInput source="name" validate={required()}/>
            <TextInput source="handle" validate={required()}/>
        </SimpleForm>
    </Edit>
);

const organization = {
    list: OrganizationList,
    create: OrganizationCreate,
    edit: OrganizationEdit
}

export default organization;