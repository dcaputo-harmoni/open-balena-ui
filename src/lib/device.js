import { useDataProvider } from 'react-admin';
import { useGenerateApiKey, useDeleteApiKey } from './apiKey';

export function useCreateDevice () {

    const dataProvider = useDataProvider();
    const generateApiKey = useGenerateApiKey();

    return async (data) => {
        const roles = await dataProvider.getList('role', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { }
        });
        // create device actor and device API key
        const deviceRole = roles.data.find(x => x.name === 'device-api-key');
        const deviceActor = await dataProvider.create('actor', { data: {} });
        data.actor = deviceActor.data.id;
        const deviceApiKey = await dataProvider.create('api key', {data: {key: generateApiKey(), 'is of-actor': deviceActor.data.id}});
        await dataProvider.create('api key-has-role', {data: {'api key': deviceApiKey.data.id, role: deviceRole.id}});
        // create service installs
        const deviceServices = await dataProvider.getList('service', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { application: data['belongs to-application'] }
        });
        await Promise.all(deviceServices.data.map(service => 
            dataProvider.create('service install', {data: { device: data.id, 'installs-service': service.id }})
        ));
        return data;
    }
}

export function useModifyDevice () {

    const dataProvider = useDataProvider();

    return async (data) => {
        let existingMappings = await dataProvider.getList('service install', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { device: data.id }
        });
        let existingData = existingMappings.data.map(x => x['installs-service']);
        let newMappings = await dataProvider.getList('service', {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { application: data['belongs to-application'] }
        });
        let newData = newMappings.data.map(x => x.id);
        let createData = newData.filter(value => !existingData.includes(value));
        let deleteIds = existingMappings.data.filter(value => !newData.includes(value['installs-service'])).map(x => x.id);
        await Promise.all(createData.map(createDataItem => 
            dataProvider.create('service install', {data: { 'device': data.id, 'installs-service': createDataItem }})
        ));
        await Promise.all(deleteIds.map(deleteId => 
            dataProvider.delete('service install', { id: deleteId })
        ));
        return data;
    }
}

export function useDeleteDevice () {

    const dataProvider = useDataProvider();
    const deleteApiKey = useDeleteApiKey();

    return async (device) => {
        let relatedIndirectLookups = [
            { resource: "device service environment variable", field: "service install", viaResource: "service install", viaField: "device", localField: "id"},
            { resource: "api key", field: "is of-actor", viaResource: "actor", viaField: "id", localField: "actor", deleteFunction: deleteApiKey},
        ];
        let relatedLookups = [
            { resource: "device tag", field: "device", localField: "id" },
            { resource: "device config variable", field: "device", localField: "id" },
            { resource: "device environment variable", field: "device", localField: "id" },
            { resource: "service install", field: "device", localField: "id" },
            { resource: "image install", field: "device", localField: "id" },
            { resource: "gateway download", field: "is downloaded by-device", localField: "id" },
        ];
        await Promise.all(relatedIndirectLookups.map( x => {
            return dataProvider.getList(x.viaResource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.viaField]: device[x.localField] }
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
                filter: { [x.field]: device[x.localField] }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'device', { id: device['id'] } );
        await dataProvider.delete( 'actor', { id: device['actor'] } );
        return Promise.resolve();
    }
}

export function useDeleteDeviceBulk () {

    const dataProvider = useDataProvider();
    const deleteDevice = useDeleteDevice();

    return async (deviceIds) => {
        const selectedDevices = await dataProvider.getMany('device', { ids: deviceIds });
        return Promise.all(selectedDevices.data.map(device => deleteDevice(device)))
    }
}