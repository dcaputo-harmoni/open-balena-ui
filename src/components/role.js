import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    List,
    SimpleForm,
    TextInput,
    EditButton,
    DeleteButton,
    DataProviderContext,
    Toolbar,
} from 'react-admin';
import ManagePermissions from "../ui/ManagePermissions";

const RoleTitle = ({ record }) => {
    return <span>Role {record ? `"${record.name}"` : ''}</span>;
};

export const RoleList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const RoleCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export class RoleEdit extends React.Component {
    static contextType = DataProviderContext;
    constructor(props) {
        super(props);
        this.state = { record: {} }; // defaults while fetch is occurring
        this.mappings = {
            permissionMapping: {
                arrayField: 'permissionArray',
                mappingTable: 'role-has-permission',
                mappingSourceField: 'role',
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
            <Edit title={<RoleTitle />} transform={this.processEdit} {...this.props}>
                <SimpleForm initialValues={this.state.record} toolbar={<Toolbar alwaysEnableSaveButton/>}>
                    <TextInput disabled source="id"/>
                    <TextInput source="name"/>
                    <ManagePermissions source="permissionArray" initialValues={this.state.record.permissionArray}/>
                </SimpleForm>
            </Edit>
        );
    }
}

const role = {
    list: RoleList,
    create: RoleCreate,
    edit: RoleEdit
}

export default role;