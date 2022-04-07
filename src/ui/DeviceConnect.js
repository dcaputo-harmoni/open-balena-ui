import React from "react";
import { SelectInput, useDataProvider, useAuthProvider } from 'react-admin';
import {
    Button,
} from '@mui/material';
import ConnectIcon from '@mui/icons-material/Sensors';
import { Form } from 'react-final-form';

export class Iframe extends React.Component {
    render () {
        return(
            <div style={{flex: "1", display: "flex", flexDirection: "column"}}>
                <iframe id={this.props.id} title={this.props.title} src={this.props.src} height={this.props.height} width={this.props.width} style={{ flex: "1", position: "relative", minHeight: this.props.minHeight }}/>         
            </div>
        )
    }
}

export const DeviceConnect = ({basePath, ...props}) => {

    const [loaded, setLoaded] = React.useState(false);
    const [containers, setContainers] = React.useState({choices: [], services: [], links: []});
    const [services, setServices] = React.useState({choices: []});
    const [iframeUrl, setIframeUrl] = React.useState("");
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();

    const handleSubmit = values => {
        setIframeUrl(containers.links[values.container][values.service]);
    };

    const updateServices = (event) => {
        let idx = event.target.value;
        setServices({choices: containers.services[idx]});
    }

    React.useEffect(() => {
        if (!loaded) {
            let REMOTE_HOST = process.env.REACT_APP_OPEN_BALENA_REMOTE_URL;
            let session = authProvider.getSession();
            let containerChoices = [{id: 0, name: 'host'}];
            let containerServices = [[{id: 0, name: 'SSH'}]];
            let containerLinks = [[`${REMOTE_HOST}?service=ssh&uuid=${props.record.uuid}&jwt=${session.jwt}`]];
            dataProvider.getList('image install', {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { 'device': props.record.id, 'status': 'Running' }
            }).then((installs) => {
                Promise.all(installs.data.map(async install => {
                    let image = await dataProvider.getList('image', {
                        pagination: { page: 1 , perPage: 1000 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: { 'id': install['installs-image'] }
                    }).then(async imageRec => {
                        return await dataProvider.getList('service', {
                            pagination: { page: 1 , perPage: 1000 },
                            sort: { field: 'id', order: 'ASC' },
                            filter: { 'id': imageRec.data[0]['is a build of-service'] }
                        }).then(async (imageService) => {
                            return await dataProvider.getList('image-is part of-release', {
                                pagination: { page: 1 , perPage: 1000 },
                                sort: { field: 'id', order: 'ASC' },
                                filter: { 'image': install['installs-image'] }
                            }).then(async (imageRelease) => {
                                    return await dataProvider.getList('image label', {
                                    pagination: { page: 1 , perPage: 1000 },
                                    sort: { field: 'id', order: 'ASC' },
                                    filter: { 'release image': imageRelease.data[0]['id'] }
                                }).then(imageLabels => {
                                    return ({
                                        labels: imageLabels,
                                        service: imageService,
                                        install: install,
                                        image: imageRec
                                    })
                                })
                            })
                        })
                    });
                    let containerName = image.service.data[0]['service name'];
                    let services = [{id: 0, name: 'SSH'}];
                    let links = [`${REMOTE_HOST}?service=ssh&container=${containerName}&uuid=${props.record.uuid}&jwt=${session.jwt}`];
                    if (image.labels.data.find(x => x['label name'] === 'openbalena.remote.http')) {
                        let name = image.labels.data.find(x => x['label name'] === 'openbalena.remote.http.label');
                        services.push({id: services.length, name: name ? name.value : 'HTTP'});
                        let port = image.labels.data.find(x => x['label name'] === 'openbalena.remote.http.port');
                        let path = image.labels.data.find(x => x['label name'] === 'openbalena.remote.http.path');
                        links.push(`${REMOTE_HOST}${path ? path.value : ''}?service=tunnel&port=${port ? port.value : '80'}&protocol=http&uuid=${props.record.uuid}&jwt=${session.jwt}`);
                    };
                    if (image.labels.data.find(x => x['label name'] === 'openbalena.remote.https')) {
                        let name = image.labels.data.find(x => x['label name'] === 'openbalena.remote.https.label');
                        services.push({id: services.length, name: name ? name.value : 'HTTPS'});
                        let port = image.labels.data.find(x => x['label name'] === 'openbalena.remote.https.port');
                        let path = image.labels.data.find(x => x['label name'] === 'openbalena.remote.https.path');
                        links.push(`${REMOTE_HOST}${path ? path.value : ''}?service=tunnel&port=${port ? port.value : '443'}&protocol=https&uuid=${props.record.uuid}&jwt=${session.jwt}`);
                    };
                    if (image.labels.data.find(x => x['label name'] === 'openbalena.remote.vnc')) {
                        let name = image.labels.data.find(x => x['label name'] === 'openbalena.remote.vnc.label');
                        services.push({id: services.length, name: name ? name.value : 'VNC'});
                        let port = image.labels.data.find(x => x['label name'] === 'openbalena.remote.vnc.port');
                        links.push(`${REMOTE_HOST}?service=vnc&port=${port ? port.value : '5900'}&uuid=${props.record.uuid}&jwt=${session.jwt}`);
                    };
                    containerChoices.push({id: containerChoices.length, name: containerName});
                    containerServices.push(services);
                    containerLinks.push(links);
                    return Promise.resolve();
                })).then(() => {
                    setContainers({choices: containerChoices, services: containerServices, links: containerLinks});
                })
            })
            setLoaded(true);
        }
    }, [props, authProvider, dataProvider, setLoaded, loaded]);
    
    return (
    <> 
        <Form
            onSubmit={handleSubmit}
            render={({handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                    <SelectInput source="container" disabled={containers.choices.length === 0} choices={containers.choices} style={{ marginRight: '16px', marginTop: '8px' }} onChange={(event) => updateServices(event)}/>
                    <SelectInput source="service" disabled={services.choices.length === 0} choices={services.choices} style={{ MarginRight: '16px', marginTop: '8px' }}/>
                    <Button variant="contained" color="primary" type="submit" style={{ margin: '16px', minWidth: '160px' }} startIcon={<ConnectIcon/>} disabled={submitting || pristine}>
                        Connect
                    </Button>
                </form>
            )}
        />
        <Iframe src={iframeUrl} width="100%"/>,
    </>
  )
}

export default DeviceConnect;