import React from 'react';
import { SelectInput, useDataProvider, useRecordContext } from 'react-admin';

export const SelectDevice = (props) => {
  const [loaded, setLoaded] = React.useState(null);
  const [availableDevices, setAvailableDevices] = React.useState([]);
  const dataProvider = useDataProvider();
  const record = useRecordContext();

  React.useEffect(() => {
    if (loaded === null) {
      setLoaded(false);
      dataProvider
        .getList('device', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'device name', order: 'ASC' },
          filter: {},
        })
        .then((devices) => {
          if (record['service install']) {
            dataProvider
              .getOne('service install', {
                id: record['service install'],
              })
              .then((serviceInstall) => {
                record.device = serviceInstall.data.device;
                setAvailableDevices(devices.data);
                setLoaded(true);
              });
          } else {
            setAvailableDevices(devices.data);
            setLoaded(true);
          }
        });
    }
  }, [props, dataProvider, loaded, setLoaded, availableDevices, setAvailableDevices]);

  if (!loaded) return null;

  return <SelectInput choices={availableDevices} optionText='device name' optionValue='id' {...props} />;
};

export default SelectDevice;
