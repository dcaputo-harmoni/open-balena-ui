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

const DeviceTagTitle = ({ record }) => {
    return <span>Device Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const DeviceTagList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Device" source="device" reference="device" target="id">
                    <SingleFieldList>
                        <ChipField source="uuid" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="tag key" />
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

export const DeviceTagCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const DeviceTagEdit = props => (
    <Edit title={<DeviceTagTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: DeviceTagList,
    create: DeviceTagCreate,
    edit: DeviceTagEdit
}