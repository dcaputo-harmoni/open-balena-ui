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
    return <span>Role {record ? `"${record.name}"` : ''}</span>;
};

export const RoleList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                <ReferenceManyField label="Permissions" reference="role-has-permission" target="role">
                    <SingleFieldList>
                        <ReferenceField source="permission" reference="permission">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

export const RoleCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export const RoleEdit = props => (
    <Edit title={<RoleTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

const role = {
    list: RoleList,
    create: RoleCreate,
    edit: RoleEdit
}

export default role;