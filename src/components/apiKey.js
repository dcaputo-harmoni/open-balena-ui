import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    List,
    ReferenceManyField,
    SingleFieldList,
    ReferenceField,
    ChipField,
    SimpleForm,
    TextInput,
    ReferenceArrayInput,
    SelectInput,
    FormDataConsumer,
    DataProviderContext,
    EditButton,
    SearchInput,
    SaveButton,
    Toolbar,
} from 'react-admin';
import Chip from '@mui/material/Chip';
import DeleteApiKeyButton from "../ui/DeleteApiKeyButton";
import ManagePermissions from "../ui/ManagePermissions";
import ManageRoles from "../ui/ManageRoles";
import { useGenerateApiKey, useModifyApiKey } from "../lib/apiKey";

class ActorField extends React.Component {
    static contextType = DataProviderContext;
    constructor(props) {
        super(props);
        this.state = { record: {} }; // defaults while fetch is occurring
    }

    componentDidMount() {
        let actorLookups = [
            { resource: "user", field: "actor" },
            { resource: "device", field: "actor" },
            { resource: "application", field: "actor" },
        ];
        return Promise.all(actorLookups.map(lookup => {
            return this.context.getList(lookup.resource, {
                pagination: { page: 1 , perPage: 1000 },
                sort: { field: 'id', order: 'ASC' },
                filter: { [lookup.field]: this.props.record['is of-actor'] }
            }).then((result) => {
                if (result.data.length > 0) {
                    let currentState = this.state;
                    currentState.record.actorName = result.data[0].username || result.data[0]['app name'] || result.data[0]['device name'];
                    currentState.record.actorType = result.data[0].username ? "User" : (result.data[0]['app name'] ? "Fleet" : "Device");
                    let actorRecordType = result.data[0].username ? "user" : (result.data[0]['app name'] ? "application" : "device");
                    let actorRecordId = result.data[0].id;
                    currentState.record.actorLink = `/#/${actorRecordType}/${actorRecordId}`;
                    this.setState(currentState);
                }
            });    
        }));
    }

    generateLabel() {
        if (this.state.record.actorType && this.state.record.actorName) {
            return `${this.state.record.actorType}: ${this.state.record.actorName}`
        } else {
            return 'Unassigned';
        }
    }

    render() {
        return (
            <Chip label={this.generateLabel()} href={this.state.record.actorLink} component="a" clickable />
        );
    }
}

const apiKeyFilters = [
    <SearchInput source="#key,name,description@ilike" alwaysOn />,
];

const CustomBulkActionButtons = props => (
    <React.Fragment>
        <DeleteApiKeyButton variant="text" size="small" {...props}> Delete </DeleteApiKeyButton>
    </React.Fragment>
);

export const ApiKeyList = props => {
    return (
        <List {...props} filters={apiKeyFilters} bulkActionButtons={<CustomBulkActionButtons />}>
            <Datagrid>
                <TextField source="id"/>
                <TextField label="API Key" source="key"/>
                <TextField label="Name" source="name"/>
                <TextField label="Description" source="description"/>
                <ActorField label="Assigned To"/>
                <ReferenceManyField label="Roles" source="id" reference="api key-has-role" target="api key">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="role" reference="role" target="id">
                            <ChipField source="name"/>
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteApiKeyButton variant="text" size="small"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const ApiKeyCreate = props => {

    const generateApiKey = useGenerateApiKey();
    const processApiKey = (data) => {
        data['is of-actor'] = data.userActor || data.deviceActor || data.fleetActor;
        ['userActor', 'deviceActor', 'fleetActor'].forEach(x => delete data[x]);
        return data;
    }
   
    return (
        <Create {...props} transform={processApiKey}>
            <SimpleForm>
                <TextInput source="key" initialValue={generateApiKey()}/>
                <TextInput source="name"/>
                <TextInput source="description"/>
                <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.deviceActor || formData.fleetActor) rest.disabled = true;
                    return (
                        <ReferenceArrayInput source="userActor" reference="user" {...rest}>
                            <SelectInput optionText="username" optionValue="actor" resettable/>
                        </ReferenceArrayInput>
                    )
                }}
                </FormDataConsumer>
                <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.userActor || formData.fleetActor) rest.disabled = true;
                    return (
                        <ReferenceArrayInput source="deviceActor" reference="device" {...rest}>
                            <SelectInput optionText="device name" optionValue="actor" resettable/>
                        </ReferenceArrayInput>
                    )
                }}
                </FormDataConsumer>
                <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.userActor || formData.deviceActor) rest.disabled = true;
                    return (
                        <ReferenceArrayInput source="fleetActor" reference="application" {...rest}>
                                <SelectInput optionText="app name" optionValue="actor" resettable/>
                        </ReferenceArrayInput>
                    )
                }}
                </FormDataConsumer>
            </SimpleForm>
        </Create>
    )
};

const CustomToolbar = props => (
    <Toolbar {...props} style={{ justifyContent: "space-between" }}>
        <SaveButton/>
        <DeleteApiKeyButton variant="text" sx={{padding: "6px", color: "#f44336", ".hover": { backgroundColor: '#fff', color: '#3c52b2'}}} > Delete </DeleteApiKeyButton>
    </Toolbar>
);

export const ApiKeyEdit = props => {

    const modifyApiKey = useModifyApiKey();

    const processEdit = async (data) => {
        data = await modifyApiKey(data);
        return data;
    }

    return (
        <Edit transform={processEdit} {...props}>
            <SimpleForm toolbar={<CustomToolbar alwaysEnableSaveButton/>}>
                <TextInput disabled source="id"/>
                <TextInput source="key"/>
                <TextInput source="name"/>
                <TextInput source="description"/>
                <ManagePermissions source="permissionArray" reference="api key-has-permission" target="api key"/>
                <ManageRoles source="roleArray" reference="api key-has-role" target="api key"/>
            </SimpleForm>
        </Edit>
    )
}

const apiKey = {
    list: ApiKeyList,
    create: ApiKeyCreate,
    edit: ApiKeyEdit
}

export default apiKey;