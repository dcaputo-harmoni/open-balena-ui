import * as React from 'react';
import {
    Create,
    Edit,
    Datagrid,
    TextField,
    FunctionField,
    BooleanField,
    ReferenceField,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    SearchInput,
    ShowButton,
} from 'react-admin';
import DeviceServicesButton from '../ui/DeviceServicesButton';
import DeviceConnectButton from '../ui/DeviceConnectButton';

const DeviceTitle = ({ record }) => {
    return <span>Device {record ? `"${record.name}"` : ''}</span>;
};

const OnlineField = (props) => {
    return (
        <FunctionField {...props} render={(record, source) =>
            <BooleanField source="enabled" record={{ ...record, enabled: (record[source] === 'online') }} />}
        />
    );
};

const deviceFilters = [
    <SearchInput source="#uuid,device name,status@ilike" alwaysOn />,
];

export const DeviceList = (props) => {
    return (
        <List {...props} filters={deviceFilters}>
            <Datagrid>
                <TextField source="id" />
                <FunctionField label="UUID" render={record => record['uuid'].substring(0,7)}/>
                <TextField label="Name" source="device name" />
                <OnlineField label="Online" source="api heartbeat state" />
                <TextField label="Status" source="status" />
                <FunctionField label="OS" render={record => (record['os version'] && record['os variant']) ? `${record['os version']}-${record['os variant']}` : ""}/>
                <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id">
                    <ChipField source="app name" />
                </ReferenceField>
                <ReferenceField label="Release Rev." source="is running-release" reference="release" target="id" >
                    <ChipField source="revision" />
                </ReferenceField>
                <ReferenceField label="Device Type" source="is of-device type" reference="device type" target="id">
                    <ChipField source="slug" />
                </ReferenceField>
                <DeviceServicesButton label="" style={{color: "black"}}/>
                <DeviceConnectButton label="" style={{color: "black"}}/>
                <ShowButton label="" color="default"/>
            </Datagrid>
        </List>
    )
};

export const DeviceCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="UUID" source="uuid" />
            <TextInput label="Name" source="device name" />
        </SimpleForm>
    </Create>
);

export const DeviceEdit = props => (
    <Edit title={<DeviceTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="uuid" />
            <TextInput source="device name" />
        </SimpleForm>
    </Edit>
);

const device = {
    list: DeviceList,
    create: DeviceCreate,
    edit: DeviceEdit
}

export default device;