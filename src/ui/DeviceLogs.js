import { Box } from '@mui/material';
import React from 'react';
import { Form, SelectInput, useAuthProvider, useDataProvider, useRecordContext } from 'react-admin';
import utf8decode from '../lib/utf8decode';

export class Iframe extends React.Component {
  render() {
    return (
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <iframe
          id={this.props.id}
          title={this.props.title}
          srcDoc={this.props.content}
          height={this.props.height}
          width={this.props.width}
          frameBorder={0}
          style={{
            flex: '1',
            position: 'relative',
            minHeight: '400px',
            background: 'rgb(52, 52, 52)',
          }}
        />
      </div>
    );
  }
}

export const DeviceLogs = () => {
  const record = useRecordContext();
  const [loaded, setLoaded] = React.useState(false);
  const [containers, setContainers] = React.useState([]);
  const [content, setContent] = React.useState('');
  const dataProvider = useDataProvider();
  const authProvider = useAuthProvider();
  const session = authProvider.getSession();

  const onSubmit = (container) => {
    let API_HOST = process.env.REACT_APP_OPEN_BALENA_API_URL;

    return fetch(`${API_HOST}/device/v2/${record.uuid}/logs`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwt}`,
      }),
      insecureHTTPParser: true,
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }

        let result = [];
        const reader = response.body.getReader();

        return reader.read().then(function processText({ done, value }) {
          if (done) {
            const logs = JSON.parse(utf8decode(result));

            const containerLogs = logs.filter((x) =>
              container === 0 ? !x.hasOwnProperty('serviceId') : x.serviceId === container,
            );

            const formattedLogs = containerLogs
              .map((x) => `[${new Date(x.timestamp).toISOString()}] ${x.message}`)
              .join('<br/>');

            setContent(`<html style='font-family: consolas; color: #ffffff'>${formattedLogs}</html>`);
            return;
          }

          result.push(...value);
          return reader.read().then(processText);
        });
      })
      .catch(() => {
        throw new Error(`Error: Could not get logs for device ${record.uuid}`);
      });
  };

  React.useEffect(() => {
    if (!loaded) {
      let containerChoices = [{ id: 0, name: 'host' }];
      dataProvider
        .getList('image install', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'id', order: 'ASC' },
          filter: { device: record.id, status: 'Running' },
        })
        .then((installs) => {
          Promise.all(
            installs.data.map(async (install) => {
              let image = await dataProvider
                .getList('image', {
                  pagination: { page: 1, perPage: 1000 },
                  sort: { field: 'id', order: 'ASC' },
                  filter: { id: install['installs-image'] },
                })
                .then(async (imageRec) => {
                  return await dataProvider
                    .getList('service', {
                      pagination: { page: 1, perPage: 1000 },
                      sort: { field: 'id', order: 'ASC' },
                      filter: { id: imageRec.data[0]['is a build of-service'] },
                    })
                    .then(async (imageService) => {
                      return {
                        service: imageService,
                      };
                    });
                });
              let containerName = image.service.data[0]['service name'];
              containerChoices.push({ id: image.service.data[0].id, name: containerName });
              return Promise.resolve();
            }),
          ).then(() => {
            setContainers(containerChoices);
          });
        });
      setLoaded(true);
    }
  }, [record, authProvider, dataProvider, setContainers, setLoaded, loaded]);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Box
          sx={{
            'display': 'flex',
            'padding': '5px 15px',
            'alignItems': 'center',
            '.MuiFormHelperText-root, .MuiFormLabel-root': {
              display: 'none',
            },
            '.MuiOutlinedInput-root': {
              height: '35px',
            },
            '.MuiSelect-select': {
              padding: '9px 14px',
            },
          }}
        >
          <strong style={{ flex: 1 }}>Logs</strong>

          <SelectInput
            source='container'
            disabled={containers.length === 0}
            choices={containers}
            size='small'
            label=''
            onChange={(event) => onSubmit(event.target.value)}
          />
        </Box>
      </Form>

      <Iframe content={content} width='100%' height='100%' />
    </>
  );
};

export default DeviceLogs;
