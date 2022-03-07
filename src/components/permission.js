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

const RoleTitle = ({ record }) => {
    return <span>Permission {record ? `"${record.name}"` : ''}</span>;
};

export const PermissionList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <ReferenceManyField label="Roles" reference="role-has-permission" target="permission">
                    <SingleFieldList>
                        <ReferenceField source="role" reference="role">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const PermissionCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export const PermissionEdit = props => (
    <Edit title={<RoleTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export default {
    list: PermissionList,
    create: PermissionCreate,
    edit: PermissionEdit
}