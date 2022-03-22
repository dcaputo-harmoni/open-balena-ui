import React from "react";
import { 
    ReferenceField,
    ReferenceManyField,
    Datagrid,
    TextField,
    FunctionField,
    ChipField,
    useDataProvider,
    useNotify,
} from 'react-admin';
import dateFormat from 'dateformat';

export const DeviceServices = ({basePath, ...props}) => {
    const [loaded, setLoaded] = React.useState(false);
    const dataProvider = useDataProvider();
    const notify = useNotify();

    React.useEffect(() => {
        if (!loaded) {
            dataProvider.getList('image install', {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { 'device': props.record.id }
            }).then((imageInstalls) => {
                if (imageInstalls.data.length > 0) {
                } else {
                    notify("No services are installed on this device")
                }
            });
            setLoaded(true);    
        }
    }, [props, dataProvider, notify, setLoaded, loaded]);

    return (
    <> 
        <ReferenceManyField source="id" reference="image install" target="device" filter={{"is provided by-release": props.record['is running-release']}}>
            <Datagrid>
                <ReferenceField label="Image" source="installs-image" reference="image" target="id" link={false}>
                    <ReferenceField label="Image" source="is a build of-service" reference="service" target="id" link={(record, reference) => `/${reference}/${record['is a build of-service']}`}>
                        <ChipField source="service name" />
                    </ReferenceField>
                </ReferenceField>
                <TextField label="Status" source="status" />
                <FunctionField label="Install Date" render={record => `${dateFormat((new Date(record['install date'])), "dd-mmm-yy h:MM:ss TT Z")}`} />
            </Datagrid>
        </ReferenceManyField>
    </>
  )
}

export default DeviceServices;