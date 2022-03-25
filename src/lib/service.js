import { useDataProvider } from 'react-admin';
import { useDeleteImage } from './image';

export function useDeleteService () {

    const dataProvider = useDataProvider();
    const deleteImage = useDeleteImage();

    return async (service) => {
        let relatedIndirectLookups = [
            { resource: "device service environment variable", field: "service install", viaResource: "service install", viaField: "installs-service", localField: "id"},
        ];

        let relatedLookups = [
            { resource: "service environment variable", field: "service", localField: "id" },
            { resource: "service label", field: "service", localField: "id" },
            { resource: "service install", field: "installs-service", localField: "id" },
            { resource: "image", field: "is a build of-service", localField: "id", deleteFunction: deleteImage},
        ];
        await Promise.all(relatedIndirectLookups.map( x => {
            return dataProvider.getList(x.viaResource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.viaField]: service[x.localField] }
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
                filter: { [x.field]: service[x.localField] }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                return x.deleteFunction
                ? Promise.all(existingMappings.data.map(y => x.deleteFunction(y)))
                : dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'service', { id: service['id'] } );
        return Promise.resolve();
    }
}