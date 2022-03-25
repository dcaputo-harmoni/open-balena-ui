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
    EditButton,
    DeleteButton,
    ReferenceInput,
    SelectInput,
    TextInput,
    Toolbar,
    required,
    FormDataConsumer,
} from 'react-admin';

const ReleaseTagTitle = ({ record }) => {
    return <span>Release Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const ReleaseTagList = props => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id"/>
                <ReferenceField label="Fleet" source="release" reference="release" target="id" link={false}>
                    <ReferenceField source="belongs to-application" reference="application" target="id" link={(record, reference) => `/${reference}/${record.id}`}>
                        <ChipField source="app name"/>
                    </ReferenceField>
                </ReferenceField>
                <ReferenceField label="Release Rev." source="release" reference="release" target="id">
                    <ChipField source="revision"/>
                </ReferenceField>
                <TextField label="Name" source="tag key"/>
                <TextField label="Value" source="value"/>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <EditButton label="" color="default"/>
                    <DeleteButton label="" style={{color: "black"}} size="medium"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

export const ReleaseTagCreate = props => {

    const processCreate = async (data) => {
        delete data.application;
        return data;
    };

    return (
    <Create transform={processCreate} {...props}>
        <SimpleForm redirect="list">
            <ReferenceInput label="Fleet" source="application" reference="application" target="id" validate={required()}>
                <SelectInput optionText="app name" optionValue="id"/>
            </ReferenceInput>
            <FormDataConsumer>
                {({ formData, ...rest }) => formData['application'] &&
                    <ReferenceInput label="Release" source="release" reference="release" target="id" filter={{'belongs to-application': formData.application}} validate={required()}>
                        <SelectInput optionText="revision" optionValue="id"/>
                    </ReferenceInput>
                }
            </FormDataConsumer>
            <TextInput label="Name" source="tag key" validate={required()}/>
            <TextInput label="Value" source="value" validate={required()}/>
        </SimpleForm>
    </Create>
    )
}

export const ReleaseTagEdit = props => (
    <Edit title={<ReleaseTagTitle/>} {...props}>
        <SimpleForm>
            <ReferenceInput label="Fleet" source="application" reference="application" target="id" validate={required()}>
                <SelectInput optionText="app name" optionValue="id"/>
            </ReferenceInput>
            <FormDataConsumer>
                {({ formData, ...rest }) => formData['application'] &&
                    <ReferenceInput label="Release" source="release" reference="release" target="id" filter={{'belongs to-application': formData.application}} validate={required()}>
                        <SelectInput optionText="revision" optionValue="id"/>
                    </ReferenceInput>
                }
            </FormDataConsumer>
            <TextInput label="Name" source="tag key" validate={required()}/>
            <TextInput label="Value" source="value" validate={required()}/>
        </SimpleForm>
    </Edit>
);

const releaseTag = {
    list: ReleaseTagList,
    create: ReleaseTagCreate,
    edit: ReleaseTagEdit
}

export default releaseTag;