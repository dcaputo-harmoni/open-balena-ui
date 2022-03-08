import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
} from 'react-admin';

const FleetEnvVarTitle = ({ record }) => {
    return <span>Fleet Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const FleetEnvVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Fleet" source="application" reference="application" target="id">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
            </Datagrid>
        </List>
    )
};

export const FleetEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const FleetEnvVarEdit = props => (
    <Edit title={<FleetEnvVarTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: FleetEnvVarList,
    create: FleetEnvVarCreate,
    edit: FleetEnvVarEdit
}