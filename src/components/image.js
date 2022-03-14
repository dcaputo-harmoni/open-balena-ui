import * as React from "react";
import {
    TextField,
    Datagrid,
    FunctionField,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
} from 'react-admin';
import dateFormat from 'dateformat';

export const ImageList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Fleet" reference="image-is part of-release" target="image">
                    <SingleFieldList>
                        <ReferenceField source="is part of-release" reference="release">
                            <ReferenceManyField label="Fleet" source="belongs to-application" reference="application" target="id">
                                <SingleFieldList>
                                    <ChipField source="app name" />
                                </SingleFieldList>
                            </ReferenceManyField>
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Release Rev." reference="image-is part of-release" target="image">
                    <SingleFieldList>
                        <ReferenceField source="is part of-release" reference="release">
                            <ChipField source="revision" />
                        </ReferenceField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Service" source="is a build of-service" reference="service" target="id">
                    <SingleFieldList>
                        <ChipField source="service name" />
                    </SingleFieldList>
                </ReferenceManyField>
                <FunctionField label="Size" render={record => `${Math.round((record['image size']/1000000)*10)/10}mb`} />;
                <FunctionField label="Push Date" render={record => `${dateFormat((new Date(record['push timestamp'])), "dd-mmm-yy h:MM:ss TT Z")}`} />
                <TextField label="Status" source="status" />
            </Datagrid>
        </List>
    )
};

const image = {
    list: ImageList
}

export default image;