import * as React from "react";
import { pseudoRandomBytes } from 'crypto-browserify';
import * as bcrypt from "bcryptjs";
import base32Encode from 'base32-encode'
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
    DataProviderContext,
    useDataProvider,
} from 'react-admin';
import ChangePasswordButton from "../ui/ChangePasswordButton";

const UserTitle = ({ record }) => {
    return <span>User {record ? `"${record.username}"` : ''}</span>;
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

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds).replace('2a','2b');
}

export const UserCreate = props => {
    let dataProvider = useDataProvider();
    const processUserCreate = async (data) => {
        let actor = await dataProvider.create('actor', { data: {} });
        data.actor = actor.data.id;
        data.password = hashPassword(data.password);
        const key = pseudoRandomBytes(20);
    	data['jwt secret'] = base32Encode(key, 'RFC3548').toString();
        return data;
    };    

    return (
        <Create transform={processUserCreate} {...props} >
            <SimpleForm>
                <TextInput source="username" />
                <TextInput source="email" />
                <PasswordInput source="password" />
            </SimpleForm>
        </Create>
    )
};


export class UserEdit extends React.Component {
    static contextType = DataProviderContext;
    constructor(props) {
        super(props);
        this.state = { record: {} }; // defaults while fetch is occurring
        this.mappings = {
            roleMapping: {
                arrayField: 'roleArray',
                mappingTable: 'user-has-role',
                mappingSourceField: 'user',
                mappingDestField: 'role',
            },
            permissionMapping: {
                arrayField: 'permissionArray',
                mappingTable: 'user-has-permission',
                mappingSourceField: 'user',
                mappingDestField: 'permission',
            },
            organizationMapping: {
                arrayField: 'organizationArray',
                mappingTable: 'organization membership',
                mappingSourceField: 'user',
                mappingDestField: 'is member of-organization',
            },
        }
    }

    componentDidMount() {
        Object.keys(this.mappings).map(x => {
                this.context.getList(this.mappings[x].mappingTable, {
                    pagination: { page: 1 , perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { [this.mappings[x].mappingSourceField]: this.props.id }
            }).then((existingMappings) => {
                let currentState = this.state;
                currentState.record[this.mappings[x].arrayField] = existingMappings.data.map(y => y[this.mappings[x].mappingDestField]);
                this.setState(currentState);
            })
        })
    }

    modifyMappingTable = async (data, arrayField, mappingTable, mappingSourceField, mappingDestField) => {
        let existingMappings = await this.context.getList(mappingTable, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [mappingSourceField]: data.id }
        });
        let existingData = existingMappings.data.map(x => x[mappingDestField]);
        let createRoles = data[arrayField].filter(value => !existingData.includes(value));
        let deleteIds = existingMappings.data.filter(value => !data[arrayField].includes(value[mappingDestField])).map(x => x.id);
        await Promise.all(createRoles.map(insertData => 
            this.context.create(mappingTable, {data: { [mappingSourceField]: data.id, [mappingDestField]: insertData }})
        ));
        await Promise.all(deleteIds.map(deleteId => 
            this.context.delete(mappingTable, { id: deleteId })
        ));
    }

    modifyMappingTables = async (data) => {
        await Promise.all(Object.keys(this.mappings).map(x => 
            this.modifyMappingTable(
                data, 
                this.mappings[x].arrayField, 
                this.mappings[x].mappingTable, 
                this.mappings[x].mappingSourceField, 
                this.mappings[x].mappingDestField
            )
        ));
        Object.keys(this.mappings).forEach(x => delete data[this.mappings[x].arrayField])
        return data;
    }

    processUserEdit = async (data) => {
        data = await this.modifyMappingTables(data);
        return data;
    }

    render() {
        return (
            <Edit title={<UserTitle />} transform={this.processUserEdit} {...this.props}>
                <SimpleForm initialValues={this.state.record} >
                    <TextInput disabled source="id"/>
                    <TextInput source="username"/>
                    <TextInput source="email"/>
                    <ChangePasswordButton/>
                    <ReferenceArrayInput source="roleArray" reference="role">
                        <SelectArrayInput optionText="name" optionValue="id"/>
                    </ReferenceArrayInput>
                    <ReferenceArrayInput source="permissionArray" reference="permission">
                        <SelectArrayInput optionText="name" optionValue="id"/>
                    </ReferenceArrayInput>
                    <ReferenceArrayInput source="organizationArray" reference="organization">
                        <SelectArrayInput optionText="name" optionValue="id"/>
                    </ReferenceArrayInput>
                    <TextInput disabled source="jwt secret"/>
                </SimpleForm>
            </Edit>
        );
    }
}

export default {
    list: UserList,
    create: UserCreate,
    edit: UserEdit
}