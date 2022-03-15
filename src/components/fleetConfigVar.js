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
    ReferenceInput,
    SelectInput,
    EditButton,
} from 'react-admin';

const FleetConfigVarTitle = ({ record }) => {
    return <span>Fleet Config Variable {record ? `"${record.name}"` : ''}</span>;
};

export const FleetConfigVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Fleet" source="application" reference="application" target="id">
                    <ChipField source="app name" />
                </ReferenceField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <EditButton label="" color="default"/>
            </Datagrid>
        </List>
    )
};

export const FleetConfigVarCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const FleetConfigVarEdit = props => (
    <Edit title={<FleetConfigVarTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const fleetConfigVar = {
    list: FleetConfigVarList,
    create: FleetConfigVarCreate,
    edit: FleetConfigVarEdit
}

export default fleetConfigVar;