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
        <div>
            <iframe id={this.props.id} title={this.props.title} srcDoc={this.props.content} height={this.props.height} width={this.props.width} style={{ position: "relative", minHeight: this.props.minHeight, background: "#000000" }}/>         
        </div>
    )
}
}

function utf8decode(data) {
    const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
    var count = data.length;
    var str = "";
    for (var index = 0; index < count;) {
        var ch = data[index++];
        if (ch & 0x80) {
            var extra = extraByteMap[(ch >> 3) & 0x07];
            if (!(ch & 0x40) || !extra || ((index + extra) > count)) return null;
            ch = ch & (0x3F >> extra);
            for (;extra > 0;extra -= 1) {
                var chx = data[index++];
                if ((chx & 0xC0) !== 0x80) return null;
                ch = (ch << 6) | (chx & 0x3F);
            }
        }    
        str += String.fromCharCode(ch);
    }
    return str;
}

export const DeviceLogs = ({basePath, ...props}) => {

    const [loaded, setLoaded] = React.useState(false);
    const [containers, setContainers] = React.useState([]);
    const [content, setContent] = React.useState("");
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();
    const session = authProvider.getSession();

    const handleSubmit = values => {
        let API_HOST = process.env.REACT_APP_OPEN_BALENA_API_URL;
        return fetch(`${API_HOST}/device/v2/${props.record.uuid}/logs`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.jwt}`
            }),
            insecureHTTPParser: true
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            let result = [];
            const reader = response.body.getReader();
            return reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.dir(result);
                    const logs = JSON.parse(utf8decode(result));
                    console.dir(logs);
                    const containerLogs = logs.filter(x => values.container === 0 ? !x.hasOwnProperty("serviceId") : x.serviceId === values.container);
                    console.dir(containerLogs);
                    const formattedLogs = containerLogs.map(x => `[${(new Date(x.timestamp)).toISOString()}] ${x.message}`).join('<br/>');
                    setContent(`<html style='font-family: consolas; color: #ffffff'>${formattedLogs}</html>`);
                    return;
                }
                result.push(...value);
                return reader.read().then(processText);
                })
            })
            .catch(() => {
                throw new Error(`Error: Could not get logs for device ${props.record.uuid}`)
        });
    };

    React.useEffect(() => {
        if (!loaded) {
            let containerChoices = [{id: 0, name: "host"}];
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
                            return ({
                                service: imageService
                            })
                        })
                    });
                    let containerName = image.service.data[0]['service name'];
                    containerChoices.push({id: image.service.data[0].id, name: containerName});
                    return Promise.resolve();
                })).then(() => {
                    setContainers(containerChoices);
                })
            })
            setLoaded(true);
        }
    }, [props, authProvider, dataProvider, setContainers, setLoaded, loaded]);

    return (
    <> 
        <Form
            onSubmit={handleSubmit}
            render={({handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                    <SelectInput source="container" disabled={containers.length === 0} choices={containers} style={{ marginRight: '16px', marginTop: '8px' }}/>
                    <Button variant="contained" color="primary" type="submit" style={{ margin: '16px', minWidth: '160px' }} startIcon={<ConnectIcon/>} disabled={submitting || pristine}>
                        Connect
                    </Button>
                </form>
            )}
        />
        <Iframe content={content} width="100%" maxHeight="65vh" minHeight="40vh"/>,
    </>
    )
}

export default DeviceLogs;