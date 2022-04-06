import { useDataProvider } from 'react-admin';

export function useCreateDeviceType () {

    const dataProvider = useDataProvider();

    return async (data) => {
        const deviceType = dataProvider.create('device type', {data: data});
        await dataProvider.create('device type alias', {data: {'device type': deviceType.data.id, 'is referenced by-alias': data['slug']}});
        return null;
    }
}

export function useDeleteDeviceType () {

    const dataProvider = useDataProvider();

    return async (deviceType) => {
        let relatedIndirectLookups = [
        ];
        let relatedLookups = [
            { resource: "device type alias", field: "device type", localField: "id" },
        ];
        await Promise.all(relatedIndirectLookups.map( x => {
            return dataProvider.getList(x.viaResource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.viaField]: deviceType[x.localField] }
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
                filter: { [x.field]: deviceType[x.localField] }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'device type', { id: deviceType['id'] } );
        return Promise.resolve();
    }
}

export function useDeleteDeviceTypeBulk () {

    const dataProvider = useDataProvider();
    const deleteDeviceType = useDeleteDeviceType();

    return async (deviceTypeIds) => {
        const selectedDeviceTypes = await dataProvider.getMany('device type', { ids: deviceTypeIds });
        return Promise.all(selectedDeviceTypes.data.map(device => deleteDeviceType(device)))
    }
}