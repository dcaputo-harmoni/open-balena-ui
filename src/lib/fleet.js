import { useDataProvider } from 'react-admin';
import { useDeleteRelease } from './release';
import { useDeleteDevice } from './device';
import { useDeleteService } from '../lib/service'
import { useDeleteApiKey } from './apiKey';

export function useCreateFleet () {

    const dataProvider = useDataProvider();

    return async (data) => {
        let actor = await dataProvider.create('actor', { data: {} });
        data.actor = actor.data.id;
        return data;
    }
}

export function useDeleteFleet () {

    const dataProvider = useDataProvider();
    const deleteRelease = useDeleteRelease();
    const deleteDevice = useDeleteDevice();
    const deleteService = useDeleteService();
    const deleteApiKey = useDeleteApiKey();

    return async (fleet) => {
        // to do: set "should be running-release" to null
        let relatedIndirectLookups = [
            { resource: "api key", field: "is of-actor", viaResource: "actor", viaField: "id", localField: "actor", deleteFunction: deleteApiKey},
        ];
        let relatedLookups = [
            { resource: "service", field: "application", localField: "id", deleteFunction: deleteService },
            { resource: "release", field: "belongs to-application", localField: "id", deleteFunction: deleteRelease },
            { resource: "device", field: "belongs to-application", localField: "id", deleteFunction: deleteDevice},
            { resource: "application config variable", field: "application", localField: "id" },
            { resource: "application environment variable", field: "application", localField: "id" },
            { resource: "application tag", field: "application", localField: "id" },
        ];
        await Promise.all(relatedIndirectLookups.map( x => {
            return dataProvider.getList(x.viaResource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [x.viaField]: fleet[x.localField] }
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
                filter: { [x.field]: fleet[x.localField] }
            }).then((existingMappings) => {
            if (existingMappings.data.length > 0) {
                return x.deleteFunction
                ? Promise.all(existingMappings.data.map(y => x.deleteFunction(y)))
                : dataProvider.deleteMany( x.resource, { ids: existingMappings.data.map(y => y.id) } );
            }})
        }));
        await dataProvider.delete( 'application', { id: fleet['id'] } );
        await dataProvider.delete( 'actor', { id: fleet['actor'] } );
        return Promise.resolve();
    }
}

export function useDeleteFleetBulk () {

    const dataProvider = useDataProvider();
    const deleteFleet = useDeleteFleet();

    return async (fleetIds) => {
        const selectedFleets = await dataProvider.getMany('application', { ids: fleetIds });
        return Promise.all(selectedFleets.data.map(fleet => deleteFleet(fleet)))
    }
}