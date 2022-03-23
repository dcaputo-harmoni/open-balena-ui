import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceField,
    ChipField,
    List,
    SimpleForm,
    TextInput,
    EditButton,
    ReferenceInput,
    SelectInput,
    DeleteButton,
} from 'react-admin';

const ImageLabelTitle = ({ record }) => {
    return <span>Image Label {record ? `"${record.name}"` : ''}</span>;
};

export const ImageLabelList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Fleet" source="release image" reference="image" target="id" link={false}>
                    <ReferenceField source="is a build of-service" reference="service" target="id" link={false}>
                        <ReferenceField source="application" reference="application" target="id" link={(record, reference) => `/${reference}/${record['application']}`}>
                            <ChipField source="app name" />
                        </ReferenceField>
                    </ReferenceField>
                </ReferenceField>
                <ReferenceField label="Release Rev." source="release image" reference="image" target="id" link={false}>
                    <ReferenceField source="id" reference="image-is part of-release" target="image" link={false}>
                        <ReferenceField source="is part of-release" reference="release" link={(record, reference) => `/${reference}/${record['is part of-release']}`}>
                            <ChipField source="revision" />
                        </ReferenceField>
                    </ReferenceField>
                </ReferenceField>
                <ReferenceField label="Image" source="release image" reference="image" target="id" link={false}>
                    <ReferenceField label="Service" source="is a build of-service" reference="service" target="id" link={(record, reference) => `/${reference}/${record['is a build of-service']}`}>
                        <ChipField source="service name" />
                    </ReferenceField>
                </ReferenceField>
                <TextField label="Name" source="label name" />
                <TextField label="Value" source="value" />
                <EditButton label="" color="default"/>
                <DeleteButton label="" style={{color: "black"}} size="medium"/>
            </Datagrid>
        </List>
    )
};

export const ImageLabelCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput source="release image" reference="image" target="id">
                <SelectInput optionText="id" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="label name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Create>
);

export const ImageLabelEdit = props => (
    <Edit title={<ImageLabelTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="release image" reference="image" target="id">
                <SelectInput optionText="id" optionValue="id" />
            </ReferenceInput>
            <TextInput label="Name" source="label name" />
            <TextInput label="Value" source="value" />
        </SimpleForm>
    </Edit>
);

const imageLabel = {
    list: ImageLabelList,
    create: ImageLabelCreate,
    edit: ImageLabelEdit
}

export default imageLabel;