import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
} from 'react-admin';

const FleetTagTitle = ({ record }) => {
    return <span>Fleet Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const FleetTagList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Fleet" source="application" reference="application" target="id">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="tag key" />
                <TextField label="Value" source="value" />
            </Datagrid>
        </List>
    )
};

export const FleetTagCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const FleetTagEdit = props => (
    <Edit title={<FleetTagTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

export default {
    list: FleetTagList,
    create: FleetTagCreate,
    edit: FleetTagEdit
}