import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    List,
    SimpleForm,
    TextInput,
    EditButton,
    DeleteButton,
    FunctionField,
    BooleanField,
    Toolbar,
} from 'react-admin';

const FleetTypeTitle = ({ record }) => {
    return <span>Fleet Type {record ? `"${record.name}"` : ''}</span>;
};

const BooleanBinaryField = props => {
    return (
        <FunctionField {...props} render={(record, source) =>
            <BooleanField source="enabled" record={{ ...record, enabled: (record[source] === 1) }}/>}
        />
    );
};

export const FleetTypeList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <TextField label="Slug" source="slug"/>
                <TextField label="Name" source="name"/>
                <BooleanBinaryField label="Web URL" source="supports web url"/>
                <BooleanBinaryField label="Multicontainer" source="supports multicontainer"/>
                <BooleanBinaryField label="Gateway Mode" source="supports gateway mode"/>
                <TextField label="OS Version Range" source="needs-os version range"/>
                <BooleanBinaryField label="Payment" source="requires payment"/>
                <BooleanBinaryField label="Legacy" source="is legacy"/>
                <TextField label="Description" source="description"/>
                <TextField label="Max Devices" source="maximum device count"/>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label=""/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const FleetTypeCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="slug"/>
            <TextInput source="name"/>
        </SimpleForm>
    </Create>
);

export const FleetTypeEdit = props => (
    <Edit title={<FleetTypeTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id"/>
            <TextInput source="slug"/>
            <TextInput source="name"/>
        </SimpleForm>
    </Edit>
);

const fleetType = {
    list: FleetTypeList,
    create: FleetTypeCreate,
    edit: FleetTypeEdit
}

export default fleetType;