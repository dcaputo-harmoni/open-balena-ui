import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ChipField,
    List,
    SimpleForm,
    EditButton,
    ReferenceField,
    DeleteButton,
    ReferenceInput,
    SelectInput,
    TextInput,
    FormDataConsumer,
} from 'react-admin';

const DeviceServiceVarTitle = ({ record }) => {
    return <span>Device Service Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const DeviceServiceVarList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Device" source="service install" reference="service install" target="id">
                    <ReferenceField source="device" reference="device" target="id">
                        <ChipField source="uuid" />
                    </ReferenceField>
                </ReferenceField>
                <ReferenceField label="Service" source="service install" reference="service install" target="id" link={false}>
                    <ReferenceField source="installs-service" reference="service" target="id" link={(record, reference) => `/${reference}/${record['installs-service']}`}>
                        <ChipField source="service name" />
                    </ReferenceField>
                </ReferenceField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
                <ReferenceField label="Fleet" source="service install" reference="service install" target="id" link={false}>
                    <ReferenceField source="device" reference="device" target="id" link={false}>
                        <ReferenceField source="belongs to-application" reference="application" target="id" link={(record, reference) => `/${reference}/${record['belongs to-application']}`}>
                            <ChipField source="app name" />
                        </ReferenceField>
                    </ReferenceField>
                </ReferenceField>
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const DeviceServiceVarCreate = props => {
    return (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput label="Device" source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id"/>
            </ReferenceInput>
            <FormDataConsumer>
                {({ formData, ...rest }) => formData["device"] &&
                    <ReferenceInput label="Service" source="service install" reference="service install" target="device" filter={{device: formData.device}}>
                        <ReferenceInput source="service" reference="service" target="id">
                            <SelectInput optionText="service name" optionValue="id"/>
                        </ReferenceInput>
                    </ReferenceInput>
                }
            </FormDataConsumer>
            <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
    )
}

export const DeviceServiceVarEdit = props => (
    <Edit title={<DeviceServiceVarTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="device" reference="device" target="id">
                <SelectInput optionText="device name" optionValue="id"/>
            </ReferenceInput>
                <FormDataConsumer>
                    {({ formData, ...rest }) => formData['device'] &&
                        <ReferenceInput label="Service" source="service install" reference="service install" target="device" filter={{device: formData.device}}>
                            <ReferenceInput source="service" reference="service" target="id">
                                <SelectInput optionText="service name" optionValue="id"/>
                            </ReferenceInput>
                        </ReferenceInput>
                    }
                </FormDataConsumer>
                <TextInput label="Name" source="name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const deviceServiceVar = {
    list: DeviceServiceVarList,
    create: DeviceServiceVarCreate,
    edit: DeviceServiceVarEdit
}

export default deviceServiceVar;