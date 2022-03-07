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
    TextInput,
} from 'react-admin';

export const ApiKeyList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="key" label="API Key" />
                <ReferenceManyField label="Roles" reference="api key-has-role" target="api key">
                    <SingleFieldList>
                        <ReferenceField source="role" reference="role">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Permissions" reference="api key-has-permission" target="api key">
                    <SingleFieldList>
                        <ReferenceField source="permission" reference="permission">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Users" source="is of-actor" reference="user" target="actor">
                    <SingleFieldList>
                        <ChipField source="username" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Fleets" source="is of-actor" reference="application" target="actor">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Devices" source="is of-actor" reference="device" target="actor">
                    <SingleFieldList>
                        <ChipField source="device name" />
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const ApiKeyCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="key" />
        </SimpleForm>
    </Create>
);

export const ApiKeyEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="key" />
        </SimpleForm>
    </Edit>
);

export default {
    list: ApiKeyList,
    create: ApiKeyCreate,
    edit: ApiKeyEdit
}