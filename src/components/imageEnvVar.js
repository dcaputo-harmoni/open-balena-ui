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

const ImageEnvVarTitle = ({ record }) => {
    return <span>Image Environment Variable {record ? `"${record.name}"` : ''}</span>;
};

export const ImageEnvVarList = (props) => {
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
                <ReferenceManyField label="Service" source="release image" reference="image" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="is a build of-service" reference="service" target="id">
                            <SingleFieldList>
                                <ChipField source="service name" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="name" />
                <TextField label="Value" source="value" />
            </Datagrid>
        </List>
    )
};

export const ImageEnvVarCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

export const ImageEnvVarEdit = props => (
    <Edit title={<ImageEnvVarTitle />} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="slug" />
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

export default {
    list: ImageEnvVarList,
    create: ImageEnvVarCreate,
    edit: ImageEnvVarEdit
}