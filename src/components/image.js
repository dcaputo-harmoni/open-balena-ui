import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    FunctionField,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
    TextInput,
} from 'react-admin';

const ImageTitle = ({ record }) => {
    return <span>Image {record ? `"${record.name}"` : ''}</span>;
};

export const ImageList = (props) => {
    return (
        <List {...props}>
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
                <TextField label="Push Date" source="push timestamp" />
                <TextField label="Status" source="status" />
            </Datagrid>
        </List>
    )
};

export const ImageCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="Start Date" source="start timestamp" />
            <TextInput label="End Date" source="end timestamp" />
            <TextInput label="Push Date" source="push timestamp" />
            <TextInput label="Status" source="status" />
        </SimpleForm>
    </Create>
);

export const ImageEdit = props => (
    <Edit title={<ImageTitle />} {...props}>
        <SimpleForm>
            <TextInput label="Start Date" source="start timestamp" />
            <TextInput label="End Date" source="end timestamp" />
            <TextInput label="Push Date" source="push timestamp" />
            <TextInput label="Status" source="status" />
        </SimpleForm>
    </Edit>
);

export default {
    list: ImageList,
    create: ImageCreate,
    edit: ImageEdit
}