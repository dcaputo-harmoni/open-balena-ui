import * as React from "react";
import * as bcrypt from "bcryptjs";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    EmailField,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    PasswordInput,
    ReferenceArrayInput,
    SelectArrayInput,
    useDataProvider
} from 'react-admin';

const UserTitle = ({ record }) => {
    return <span>User {record ? `"${record.username}"` : ''}</span>;
};

const hashPassword = value => {
    const saltRounds = 10;
    return bcrypt.hashSync(value, saltRounds);
};

const clearPassword = value => {
    return "";
};

export const UserList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="username" />
                <EmailField source="email" />
                <ReferenceManyField label="Organizations" reference="organization membership" target="user">
                    <SingleFieldList>
                        <ReferenceField source="is member of-organization" reference="organization">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="API Keys" source="actor" reference="api key" target="is of-actor">
                    <SingleFieldList>
                        <ChipField source="key" />
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Roles" reference="user-has-role" target="user">
                    <SingleFieldList>
                        <ReferenceField source="role" reference="role">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Permissions" reference="user-has-permission" target="user">
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

export const UserCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="email" />
            <PasswordInput source="password" parse={hashPassword} />
        </SimpleForm>
    </Create>
);

export const UserEdit = props => {

    const dataProvider = useDataProvider();
    
    const modifyMappings = async (data) => {
        let mappingTable = 'user-has-role';
        let mappingSource = 'user';
        let mappingDest = 'role';

        let existingMappings = await dataProvider.getList(mappingTable, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [mappingSource]: data.id }
        });
        let existingData = existingMappings.data.map(x => x[mappingDest]);
        let createRoles = data.selectedValues.filter(value => !existingData.includes(value));
        let deleteIds = existingMappings.data.filter(value => !data.selectedValues.includes(value[mappingDest])).map(x => x.id);
        await Promise.all(createRoles.map(insertData => dataProvider.create(mappingTable, {data: { [mappingSource]: data.id, [mappingDest]: insertData }})));
        await Promise.all(deleteIds.map(deleteId => dataProvider.delete(mappingTable, { id: deleteId })));
        delete data.selectedValues;
        return data;
    }

    const getMappings = async () => {
        let mappingTable = 'user-has-role';
        let mappingSource = 'user';
        let mappingDest = 'role';
        let existingMappings = await dataProvider.getList(mappingTable, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [mappingSource]: props.id }
        });
        return { selectedValues: existingMappings.data.map(x => x[mappingDest]) };
    }

    const UserTransform = (data) => modifyMappings(data).then((newData) => {
        return ({ ...newData })
    });

    return (
    <Edit title={<UserTitle />} transform={UserTransform} {...props}>
        <SimpleForm initialValues={getMappings}>
            <TextInput disabled source="id" />
            <TextInput source="username" />
            <TextInput source="email" />
            <PasswordInput source="password" parse={hashPassword} format={clearPassword} />
            <ReferenceArrayInput source="selectedValues" reference="role" >
                <SelectArrayInput optionText="name" optionValue="id"/>
            </ReferenceArrayInput>
            <TextInput disabled source="jwt secret" />
        </SimpleForm>
    </Edit>
)};

export default {
    list: UserList,
    create: UserCreate,
    edit: UserEdit
}