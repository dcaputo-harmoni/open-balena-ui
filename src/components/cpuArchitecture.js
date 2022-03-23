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

const CpuArchitectureTitle = ({ record }) => {
    return <span>CpuArchitecture {record ? `"${record.name}"` : ''}</span>;
};

export const CpuArchitectureList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Slug" source="slug" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const CpuArchitectureCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput label="Slug" source="slug" />
        </SimpleForm>
    </Create>
);

export const CpuArchitectureEdit = props => (
    <Edit title={<CpuArchitectureTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Slug" source="slug" />
        </SimpleForm>
    </Edit>
);

const cpuArchitecture = {
    list: CpuArchitectureList,
    create: CpuArchitectureCreate,
    edit: CpuArchitectureEdit
}

export default cpuArchitecture;