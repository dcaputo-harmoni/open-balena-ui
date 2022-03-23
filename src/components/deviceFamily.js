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
} from 'react-admin';

const DeviceFamilyTitle = ({ record }) => {
    return <span>Device Family {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceFamilyList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Slug" source="slug" />
                <TextField label="Name" source="name" />
                <ReferenceField label="Manufacturer" source="is manufactured by-device manufacturer" reference="device manufacturer" target="id" link={false}>
                    <ChipField source="name" />
                </ReferenceField>
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const DeviceFamilyCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput label="Slug" source="slug" />
            <TextInput label="Name" source="name" />
            <ReferenceInput source="is manufactured by-device manufacturer" reference="device manufacturer" target="id">
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

export const DeviceFamilyEdit = props => (
    <Edit title={<DeviceFamilyTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Slug" source="slug" />
            <TextInput label="Name" source="name" />
            <ReferenceInput label="Manufacturer" source="is manufactured by-device manufacturer" reference="device manufacturer" target="id">
                <SelectInput optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const deviceFamily = {
    list: DeviceFamilyList,
    create: DeviceFamilyCreate,
    edit: DeviceFamilyEdit
}

export default deviceFamily;