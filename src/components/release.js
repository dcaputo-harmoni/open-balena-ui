import * as React from "react";
import {
    TextField,
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
} from 'react-admin';

export const ReleaseList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceManyField label="Fleet" source="belongs to-application" reference="application" target="id">
                    <SingleFieldList>
                        <ChipField source="app name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Revision" source="revision" />
                <ReferenceManyField label="Services" reference="image-is part of-release" target="is part of-release">
                    <SingleFieldList>
                        <ReferenceField source="image" reference="image">
                            <ReferenceManyField label="Service" source="is a build of-service" reference="service" target="id">
                                <SingleFieldList>
                                    <ChipField source="service name" />
                                </SingleFieldList>
                            </ReferenceManyField>
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Commit" source="commit" />
            </Datagrid>
        </List>
    )
};

const release = {
    list: ReleaseList
}

export default release;