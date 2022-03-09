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

const ServiceEnvVarTitle = ({ record }) => {
    return <span>Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const ServiceEnvVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Service" source="service" reference="service" target="id">
                    <SingleFieldList>
                        <ChipField source="service name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
            </Datagrid>
        </List>
    )
};

export const ServiceEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const ServiceEnvVarEdit = props => (
    <Edit title={<ServiceEnvVarTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

const serviceEnvVar = {
    list: ServiceEnvVarList,
    create: ServiceEnvVarCreate,
    edit: ServiceEnvVarEdit
}

export default serviceEnvVar;