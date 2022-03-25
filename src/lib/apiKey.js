import { useDataProvider } from 'react-admin';

export function useGenerateApiKey () {

    return () => {
        const keyLength = 32;
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let i, key = "";
        const charactersLength = characters.length;
        for (i = 0; i < keyLength; i++) {
            key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    }
}

export function useModifyApiKey () {

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
            roleMapping: {field: 'roleArray', table: 'api key-has-role', sourceField: 'api key', destField: 'role' },
            permissionMapping: { field: 'permissionArray', table: 'api key-has-permission', sourceField: 'api key', destField: 'permission' },
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

export function useDeleteApiKey () {

    const dataProvider = useDataProvider();

    return async (apiKey) => {
        let relatedLookups = [
            { resource: "api key-has-permission", field: "api key" },
            { resource: "api key-has-role", field: "api key" },
        ];
        await Promise.all(relatedLookups.map( x => {
            return dataProvider.getList(x.resource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.field]: apiKey.id }
            }).then((existingMappings) => {
                console.dir(existingMappings);
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'api key', { id: apiKey.id } );
        return Promise.resolve();
    }
}

export function useDeleteApiKeyBulk () {

    const dataProvider = useDataProvider();
    const deleteApiKey = useDeleteApiKey();

    return async (apiKeyIds) => {
        const selectedApiKeys = await dataProvider.getMany('api key', { ids: apiKeyIds });
        return Promise.all(selectedApiKeys.data.map(apiKey => deleteApiKey(apiKey)))
    }
}