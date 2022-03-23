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
    DeleteButton,
} from 'react-admin';

const ServiceEnvVarTitle = ({ record }) => {
    return <span>Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const ServiceEnvVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Service" source="service" reference="service" target="id">
                    <ChipField source="service name" />
                </ReferenceField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
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