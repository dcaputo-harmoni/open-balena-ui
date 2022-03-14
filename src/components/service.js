import * as React from "react";
import {
    TextField,
    Datagrid,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
} from 'react-admin';

export const ServiceList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField label="Name" source="service name" />
                <ReferenceManyField label="Fleet" source="application" reference="application" target="id">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
            </Datagrid>
        </List>
    )
};

const service = {
    list: ServiceList
}

export default service;