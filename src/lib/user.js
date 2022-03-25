import { useDataProvider } from 'react-admin';
import { pseudoRandomBytes } from 'crypto-browserify';
import base32Encode from 'base32-encode'
import * as bcrypt from "bcryptjs";
import { useGenerateApiKey, useDeleteApiKey } from './apiKey';

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds).replace('2a','2b');
}

export function useCreateUser () {

    const dataProvider = useDataProvider();
    const generateApiKey = useGenerateApiKey();

    return async (data) => {
        const roles = await dataProvider.getList('role', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { }
        });
        // create user actor and user API key
        const userRole = roles.data.find(x => x.name === 'named-user-api-key');
        const userActor = await dataProvider.create('actor', { data: {} });
        data.actor = userActor.data.id;
        const userApiKey = await dataProvider.create('api key', {data: {key: generateApiKey(), 'is of-actor': userActor.data.id}});
        await dataProvider.create('api key-has-role', {data: {'api key': userApiKey.data.id, role: userRole.id}});
        // hash password and generate jwt secret
        data.password = hashPassword(data.password);
        data['jwt secret'] = base32Encode(pseudoRandomBytes(20), 'RFC3548').toString();
        return data;
    }
}

export function useModifyUser () {

    const dataProvider = useDataProvider();

    const modifyMappingTable = async (data, field, table, sourceField, destField) => {
        let existingMappings = await dataProvider.getList(table, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [sourceField]: data.id }
        });
        let existingData = existingMappings.data.map(x => x[destField]);
        let createData = data[field].filter(value => !existingData.includes(value));
        let deleteIds = existingMappings.data.filter(value => !data[field].includes(value[destField])).map(x => x.id);
        await Promise.all(createData.map(newData => 
            dataProvider.create(table, {data: { [sourceField]: data.id, [destField]: newData }})
        ));
        await Promise.all(deleteIds.map(deleteId => 
            dataProvider.delete(table, { id: deleteId })
        ));
    }

    return async (data) => {
        const mappings = {
            roleMapping: {field: 'roleArray', table: 'user-has-role', sourceField: 'user', destField: 'role' },
            permissionMapping: { field: 'permissionArray', table: 'user-has-permission', sourceField: 'user', destField: 'permission' },
            organizationMapping: { field: 'organizationArray', table: 'organization membership', sourceField: 'user', destField: 'is member of-organization' },
        }    
        await Promise.all(Object.keys(mappings).map(x => 
            modifyMappingTable(
                data, 
                mappings[x].field, 
                mappings[x].table, 
                mappings[x].sourceField, 
                mappings[x].destField
            )
        ));
        Object.keys(mappings).forEach(x => delete data[mappings[x].field])
        return data;
    }
}

export function useDeleteUser () {

    const dataProvider = useDataProvider();
    const deleteApiKey = useDeleteApiKey();

    return async (user) => {
        let relatedIndirectLookups = [
            { resource: "api key", field: "is of-actor", viaResource: "actor", viaField: "id", localField: "actor", deleteFunction: deleteApiKey},
        ];
        let relatedLookups = [
            { resource: "user-has-permission", field: "user", localField: "id" },
            { resource: "user-has-public key", field: "user", localField: "id" },
            { resource: "user-has-role", field: "user", localField: "id" },
            { resource: "organization membership", field: "user", localField: "id" },
        ];
        await Promise.all(relatedIndirectLookups.map( x => {
            return dataProvider.getList(x.viaResource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.viaField]: user[x.localField] }
            }).then((existingIndirectMappings) => {
                return Promise.all(existingIndirectMappings.data.map( y => {
                    return dataProvider.getList(x.resource, {
                        pagination: { page: 1 , perPage: 1000 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: { [x.field]: y.id }
                    }).then((existingMappings) => {
                        if (existingMappings.data.length > 0) {
                            return x.deleteFunction
                                ? Promise.all(existingMappings.data.map(z => x.deleteFunction(z)))
                                : dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(z => z.id) } );
                        }
                    })
                }))
            })
        }));
        await Promise.all(relatedLookups.map( x => {
            return dataProvider.getList(x.resource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.field]: user[x.localField] }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'user', { id: user['id'] } );
        await dataProvider.delete( 'actor', { id: user['actor'] } );
        return Promise.resolve();
    }
}

export function useDeleteUserBulk () {

    const dataProvider = useDataProvider();
    const deleteUser = useDeleteUser();

    return async (userIds) => {
        const selectedUsers = await dataProvider.getMany('user', { ids: userIds });
        return Promise.all(selectedUsers.data.map(user => deleteUser(user)))
    }
}