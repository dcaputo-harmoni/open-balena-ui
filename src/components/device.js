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
    EditButton,
    Toolbar,
    ReferenceInput,
    SelectInput,
} from 'react-admin';
import DeviceServicesButton from '../ui/DeviceServicesButton';
import DeviceConnectButton from '../ui/DeviceConnectButton';
import DeleteDeviceButton from '../ui/DeleteDeviceButton';

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

const CustomBulkActionButtons = props => (
    <React.Fragment>
        <DeleteDeviceButton variant="text" size="small" color="default" {...props}> Delete </DeleteDeviceButton>
    </React.Fragment>
);

export const DeviceList = (props) => {
    return (
        <List {...props} filters={deviceFilters} bulkActionButtons={<CustomBulkActionButtons />}>
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
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <DeviceServicesButton label="" style={{color: "black"}}/>
                    <DeviceConnectButton label="" style={{color: "black"}}/>
                    <ShowButton label="" color="default"/>
                    <EditButton label="" color="default"/>
                    <DeleteDeviceButton variant="text" size="small" color="default"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const DeviceCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextInput label="UUID" source="uuid" />
            <TextInput label="Device Name" source="device name" />
            <TextInput label="Note" source="note" />
            <ReferenceInput label="Fleet" source="belongs to-application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Target Release" source="should be running-release" reference="release" target="id" allowEmpty>
                <SelectInput optionText="revision" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Managed by Device" source="is managed by-device" reference="device" target="id" allowEmpty>
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

export const DeviceEdit = props => (
    <Edit title={<DeviceTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput label="UUID" source="uuid" />
            <TextInput label="Device Name" source="device name" />
            <TextInput label="Note" source="note" />
            <ReferenceInput label="Fleet" source="belongs to-application" reference="application" target="id">
                <SelectInput optionText="app name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Target Release" source="should be running-release" reference="release" target="id" allowEmpty>
                <SelectInput optionText="revision" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput label="Managed by Device" source="is managed by-device" reference="device" target="id" allowEmpty>
                <SelectInput optionText="device name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const device = {
    list: DeviceList,
    create: DeviceCreate,
    edit: DeviceEdit
}

export default device;