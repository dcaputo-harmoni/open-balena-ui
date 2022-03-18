import * as React from "react";
import {
    TextField,
    Datagrid,
    ReferenceField,
    ChipField,
    List,
} from 'react-admin';

export const ServiceList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}>
            <Datagrid>
                <TextField source="id" />
                <TextField label="Name" source="service name" />
                <ReferenceField label="Fleet" source="application" reference="application" target="id">
                    <ChipField source="app name" />
                </ReferenceField>
            </Datagrid>
        </List>
    )
};

const service = {
    list: ServiceList
}

export default service;