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
    SelectInput,
    TextInput,
    ReferenceInput,
    EditButton,
    DeleteButton,
    Toolbar,
} from 'react-admin';

const FleetTagTitle = ({ record }) => {
    return <span>Fleet Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const FleetTagList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Fleet" source="application" reference="application" target="id">
                    <ChipField source="app name" />
                </ReferenceField>
                <TextField label="Name" source="tag key" />
                <TextField label="Value" source="value" />
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const FleetTagCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="tag key" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const FleetTagEdit = props => (
    <Edit title={<FleetTagTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="tag key" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const fleetTag = {
    list: FleetTagList,
    create: FleetTagCreate,
    edit: FleetTagEdit
}

export default fleetTag;