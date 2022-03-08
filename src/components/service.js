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

const ServiceTitle = ({ record }) => {
    return <span>Service {record ? `"${record.name}"` : ''}</span>;
};

export const ServiceList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="Name" source="service name" />
                <ReferenceManyField label="Fleet" source="application" reference="application" target="id">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const ServiceCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const ServiceEdit = props => (
    <Edit title={<ServiceTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: ServiceList,
    create: ServiceCreate,
    edit: ServiceEdit
}