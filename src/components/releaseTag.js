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
} from 'react-admin';

const ReleaseTagTitle = ({ record }) => {
    return <span>Release Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const ReleaseTagList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <ReferenceField label="Fleet" source="release" reference="release" target="id" link={false}>
                    <ReferenceField source="belongs to-application" reference="application" target="id" link={(record, reference) => `/${reference}/${record.id}`}>
                        <ChipField source="app name" />
                    </ReferenceField>
                </ReferenceField>
                <ReferenceField label="Release Rev." source="release" reference="release" target="id">
                    <ChipField source="revision" />
                </ReferenceField>
                <TextField label="Name" source="tag key" />
                <TextField label="Value" source="value" />
                <EditButton label="" color="default"/>
            </Datagrid>
        </List>
    )
};

export const ReleaseTagCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const ReleaseTagEdit = props => (
    <Edit title={<ReleaseTagTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

const releaseTag = {
    list: ReleaseTagList,
    create: ReleaseTagCreate,
    edit: ReleaseTagEdit
}

export default releaseTag;