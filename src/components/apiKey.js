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
import Chip from '@material-ui/core/Chip';
import DeleteApiKeyButton from "../ui/DeleteApiKeyButton";
import ManagePermissions from "../ui/ManagePermissions";
import ManageRoles from "../ui/ManageRoles";

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
        <DeleteApiKeyButton variant="text" size="small" color="default" {...props}> Delete </DeleteApiKeyButton>
    </React.Fragment>
);

export const ApiKeyList = (props) => {
    return (
        <List {...props} filters={apiKeyFilters} bulkActionButtons={<CustomBulkActionButtons />}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="API Key" source="key" />
                <TextField label="Name" source="name" />
                <TextField label="Description" source="description" />
                <ActorField label="Assigned To"/>
                <ReferenceManyField label="Roles" source="id" reference="api key-has-role" target="api key">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="role" reference="role" target="id">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <EditButton label="" color="default"/>
                <DeleteApiKeyButton variant="text" size="small" color="default"/>
            </Datagrid>
        </List>
    )
};

export const ApiKeyCreate = props => {
    const genApiKey = (keyLength) => {
        var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (i = 0; i < keyLength; i++) {
            key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
        }
        return key;
    }
    const processApiKey = (data) => {
        data['is of-actor'] = data.userActor || data.deviceActor || data.fleetActor;
        ['userActor', 'deviceActor', 'fleetActor'].forEach(x => delete data[x]);
        return data;
    }
   
    return (
        <Create {...props} transform={processApiKey}>
            <SimpleForm initialValues={{ key: genApiKey(32) }}>
                <TextInput source="key" />
                <TextInput source="name" />
                <TextInput source="description" />
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
        <DeleteApiKeyButton variant="standard" style={{padding: "6px", color: "#f44336", ".hover": { backgroundColor: '#fff', color: '#3c52b2'}}} > Delete </DeleteApiKeyButton>
    </Toolbar>
);

export class ApiKeyEdit extends React.Component {

    static contextType = DataProviderContext;

    constructor(props) {
        super(props);
        this.state = { record: {} }; // defaults while fetch is occurring
        this.mappings = {
            roleMapping: {
                arrayField: 'roleArray',
                mappingTable: 'api key-has-role',
                mappingSourceField: 'api key',
                mappingDestField: 'role',
            },
            permissionMapping: {
                arrayField: 'permissionArray',
                mappingTable: 'api key-has-permission',
                mappingSourceField: 'api key',
                mappingDestField: 'permission',
            },
        }
    }

    componentDidMount() {
        Object.keys(this.mappings).map(x => {
                return this.context.getList(this.mappings[x].mappingTable, {
                    pagination: { page: 1 , perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { [this.mappings[x].mappingSourceField]: this.props.id }
            }).then((existingMappings) => {
                let currentState = this.state;
                currentState.record[this.mappings[x].arrayField] = existingMappings.data.map(y => y[this.mappings[x].mappingDestField]);
                this.setState(currentState);
            })
        })
    }

    modifyMappingTable = async (data, arrayField, mappingTable, mappingSourceField, mappingDestField) => {
        let existingMappings = await this.context.getList(mappingTable, {
            pagination: { page: 1 , perPage: 1000 },
            sort: { field: 'id', order: 'ASC' },
            filter: { [mappingSourceField]: data.id }
        });
        let existingData = existingMappings.data.map(x => x[mappingDestField]);
        let createData = data[arrayField].filter(value => !existingData.includes(value));
        let deleteIds = existingMappings.data.filter(value => !data[arrayField].includes(value[mappingDestField])).map(x => x.id);
        await Promise.all(createData.map(newData => 
            this.context.create(mappingTable, {data: { [mappingSourceField]: data.id, [mappingDestField]: newData }})
        ));
        await Promise.all(deleteIds.map(deleteId => 
            this.context.delete(mappingTable, { id: deleteId })
        ));
    }

    modifyMappingTables = async (data) => {
        await Promise.all(Object.keys(this.mappings).map(x => 
            this.modifyMappingTable(
                data, 
                this.mappings[x].arrayField, 
                this.mappings[x].mappingTable, 
                this.mappings[x].mappingSourceField, 
                this.mappings[x].mappingDestField
            )
        ));
        Object.keys(this.mappings).forEach(x => delete data[this.mappings[x].arrayField])
        return data;
    }

    processEdit = async (data) => {
        data = await this.modifyMappingTables(data);
        return data;
    }

    render() {
        return (
        <Edit transform={this.processEdit} {...this.props}>
            <SimpleForm toolbar={<CustomToolbar alwaysEnableSaveButton/>} >
                <TextInput disabled source="id" />
                <TextInput source="key" />
                <TextInput source="name" />
                <TextInput source="description" />
                <ManagePermissions source="permissionArray" initialValues={this.state.record.permissionArray}/>
                <ManageRoles source="roleArray" initialValues={this.state.record.roleArray}/>
            </SimpleForm>
        </Edit>
        )
    }
}

const apiKey = {
    list: ApiKeyList,
    create: ApiKeyCreate,
    edit: ApiKeyEdit
}

export default apiKey;