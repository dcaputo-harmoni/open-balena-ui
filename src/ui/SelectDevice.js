import React from "react";
import { useDataProvider, SelectInput } from 'react-admin';

export const SelectDevice = ({basePath, ...props}) => {

    const [loaded, setLoaded] = React.useState(null);
    const [availableDevices, setAvailableDevices] = React.useState([]);
    const dataProvider = useDataProvider();

    React.useEffect(() => {
        if (loaded === null) {
            setLoaded(false);
            dataProvider.getList('device', {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'device name', order: 'ASC' },
                filter: { }
            }).then(devices => {
                if (props.record['service install']) {
                    dataProvider.getOne('service install', {
                        id: props.record['service install']
                    }).then((serviceInstall) => {
                        props.record.device = serviceInstall.data.device;
                        setAvailableDevices(devices.data);
                        setLoaded(true);
                    })
                } else {
                    setAvailableDevices(devices.data);
                    setLoaded(true);
                }
            })
        }
    }, [props, dataProvider, loaded, setLoaded, availableDevices, setAvailableDevices]);

    if (!loaded) return null;

    return (
        <SelectInput choices={availableDevices} optionText="device name" optionValue="id" {...props}/>
    );
}

export default SelectDevice;