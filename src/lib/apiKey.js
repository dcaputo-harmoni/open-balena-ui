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