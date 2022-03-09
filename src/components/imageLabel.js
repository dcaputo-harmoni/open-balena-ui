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
    TextInput
} from 'react-admin';

const ImageLabelTitle = ({ record }) => {
    return <span>Image Label {record ? `"${record.name}"` : ''}</span>;
};

export const ImageLabelList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Fleet" source="release image" reference="image" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="is a build of-service" reference="service" target="id">
                            <SingleFieldList>
                                <ReferenceManyField source="application" reference="application" target="id">
                                    <SingleFieldList>
                                        <ChipField source="app name" />
                                    </SingleFieldList>
                                </ReferenceManyField>
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Release Rev." source="release image" reference="image" target="id">
                    <SingleFieldList>
                        <ReferenceManyField reference="image-is part of-release" target="image">
                            <SingleFieldList>
                                <ReferenceField source="is part of-release" reference="release">
                                    <ChipField source="revision" />
                                </ReferenceField>
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Image" source="release image" reference="image" target="id">
                    <SingleFieldList>
                        <ReferenceManyField label="Service" source="is a build of-service" reference="service" target="id">
                            <SingleFieldList>
                                <ChipField source="service name" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="label name" />
                <TextField label="Value" source="value" />
            </Datagrid>
        </List>
    )
};

export const ImageLabelCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const ImageLabelEdit = props => (
    <Edit title={<ImageLabelTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
        </SimpleForm>
    </Edit>
);

const imageLabel = {
    list: ImageLabelList,
    create: ImageLabelCreate,
    edit: ImageLabelEdit
}

export default imageLabel;