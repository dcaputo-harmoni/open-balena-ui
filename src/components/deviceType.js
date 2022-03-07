import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput
} from 'react-admin';

const DeviceTypeTitle = ({ record }) => {
    return <span>Device Type {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceTypeList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="Slug" source="slug" />
                <TextField label="Name" source="name" />
                <ReferenceManyField label="Architecture" source="is of-cpu architecture" reference="cpu architecture" target="id">
                    <SingleFieldList>
                        <ChipField source="slug" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Aliases" source="id" reference="device type alias" target="device type">
                    <SingleFieldList>
                        <ChipField source="is referenced by-alias" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceField label="Family" source="belongs to-device family" reference="device family" target="id" allowEmpty>
                    <ChipField source="slug" />
                </ReferenceField>
            </Datagrid>
        </List>
    )
};

export const DeviceTypeCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export const DeviceTypeEdit = props => (
    <Edit title={<DeviceTypeTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export default {
    list: DeviceTypeList,
    create: DeviceTypeCreate,
    edit: DeviceTypeEdit
}