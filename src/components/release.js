import * as React from "react";
import {
    TextField,
    Datagrid,
    ReferenceField,
    ChipField,
    List,
} from 'react-admin';

export const ReleaseList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id">
                    <ChipField source="app name" />
                </ReferenceField>
                <TextField label="Revision" source="revision" />
                <ReferenceField label="Services" source="id" reference="image-is part of-release" target="is part of-release" link={false}>
                    <ReferenceField source="image" reference="image" target="id" link={false}>
                        <ReferenceField label="Service" source="is a build of-service" reference="service" target="id" link={(record, reference) => `/${reference}/${record.id}`}>
                            <ChipField source="service name" />
                        </ReferenceField>
                    </ReferenceField>
                </ReferenceField>
                <TextField label="Commit" source="commit" />
            </Datagrid>
        </List>
    )
};

const release = {
    list: ReleaseList
}

export default release;