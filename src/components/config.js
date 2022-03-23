import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    List,
    SimpleForm,
    EditButton,
    TextInput,
    DeleteButton,
} from 'react-admin';

const ConfigTitle = ({ record }) => {
    return <span>Config {record ? `"${record.name}"` : ''}</span>;
};

export const ConfigList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Key" source="key" />
                <TextField label="Value" source="value" />
                <TextField label="Scope" source="scope" />
                <TextField label="Description" source="description" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const ConfigCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput label="Key" source="key" />
            <TextInput label="Value" source="value" />
            <TextInput label="Scope" source="scope" />
            <TextInput label="Description" source="description" />
        </SimpleForm>
    </Create>
);

export const ConfigEdit = props => (
    <Edit title={<ConfigTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Key" source="key" />
            <TextInput label="Value" source="value" />
            <TextInput label="Scope" source="scope" />
            <TextInput label="Description" source="description" />
        </SimpleForm>
    </Edit>
);

const config = {
    list: ConfigList,
    create: ConfigCreate,
    edit: ConfigEdit
}

export default config;