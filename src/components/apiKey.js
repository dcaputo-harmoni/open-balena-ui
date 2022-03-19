import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    ReferenceArrayInput,
    SelectInput,
    FormDataConsumer,
    DataProviderContext,
    EditButton,
    SearchInput
} from 'react-admin';
import Chip from '@material-ui/core/Chip';

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

export const ApiKeyList = (props) => {
    return (
        <List {...props} filters={apiKeyFilters}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="API Key" source="key" />
                <TextField label="Name" source="name" />
                <TextField label="Description" source="description" />
                <ReferenceManyField label="Roles" reference="api key-has-role" target="api key">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="role" reference="role">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Permissions" reference="api key-has-permission" target="api key">
                    <SingleFieldList linkType={false}>
                        <ReferenceField source="permission" reference="permission">
                            <ChipField source="name" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ActorField label="Assigned To"/>
                <EditButton label="" color="default"/>
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
        console.dir(data);
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

export const ApiKeyEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="key" />
            <TextInput source="name" />
            <TextInput source="description" />
        </SimpleForm>
    </Edit>
);

const apiKey = {
    list: ApiKeyList,
    create: ApiKeyCreate,
    edit: ApiKeyEdit
}

export default apiKey;