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
    ReferenceInput,
    SelectInput,
    DeleteButton,
    Toolbar,
} from 'react-admin';

const ServiceLabelTitle = ({ record }) => {
    return <span>Service Label {record ? `"${record['label name']}"` : ''}</span>;
};

export const ServiceLabelList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Service" source="service" reference="service" target="id">
                    <ChipField source="service name" />
                </ReferenceField>
                <TextField label="Name" source="label name" />
                <TextField label="Value" source="value" />
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const ServiceLabelCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="service" reference="service" target="id">
                <SelectInput optionText="service name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="label name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const ServiceLabelEdit = props => (
    <Edit title={<ServiceLabelTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="service" reference="service" target="id">
                <SelectInput optionText="service name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="label name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const serviceLabel = {
    list: ServiceLabelList,
    create: ServiceLabelCreate,
    edit: ServiceLabelEdit
}

export default serviceLabel;