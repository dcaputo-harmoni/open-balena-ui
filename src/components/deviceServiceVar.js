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

const DeviceServiceVarTitle = ({ record }) => {
    return <span>Device Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceServiceVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Device" source="service install" reference="service install" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="device" reference="device" target="id">
                            <SingleFieldList>
                                <ChipField source="uuid" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Service" source="service install" reference="service install" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="installs-service" reference="service" target="id">
                            <SingleFieldList>
                                <ChipField source="service name" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <ReferenceManyField label="Fleet" source="service install" reference="service install" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="device" reference="device" target="id">
                            <SingleFieldList>
                                <ReferenceManyField source="belongs to-application" reference="application" target="id">
                                    <SingleFieldList>
                                        <ChipField source="app name" />
                                    </SingleFieldList>
                                </ReferenceManyField>
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const DeviceServiceVarCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const DeviceServiceVarEdit = props => (
    <Edit title={<DeviceServiceVarTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

const deviceServiceVar = {
    list: DeviceServiceVarList,
    create: DeviceServiceVarCreate,
    edit: DeviceServiceVarEdit
}

export default deviceServiceVar;