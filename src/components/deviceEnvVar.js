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

const DeviceEnvVarTitle = ({ record }) => {
    return <span>Device Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceEnvVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Device" source="device" reference="device" target="id">
                    <SingleFieldList>
                        <ChipField source="uuid" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <ReferenceManyField label="Fleet" source="device" reference="device" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="belongs to-application" reference="application" target="id">
                            <SingleFieldList>
                                <ChipField source="app name" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const DeviceEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const DeviceEnvVarEdit = props => (
    <Edit title={<DeviceEnvVarTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: DeviceEnvVarList,
    create: DeviceEnvVarCreate,
    edit: DeviceEnvVarEdit
}