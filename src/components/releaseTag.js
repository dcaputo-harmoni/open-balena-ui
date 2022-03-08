import * as React from "react";
import {
    Create,
    Edit,
    TextField,
    Datagrid,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    SimpleForm,
} from 'react-admin';

const ReleaseTagTitle = ({ record }) => {
    return <span>Release Tag {record ? `"${record['tag key']}"` : ''}</span>;
};

export const ReleaseTagList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <ReferenceManyField label="Fleet" source="release" reference="release" target="id">
                    <SingleFieldList>
                        <ReferenceManyField source="belongs to-application" reference="application" target="id">
                            <SingleFieldList>
                                <ChipField source="app name" />
                            </SingleFieldList>
                        </ReferenceManyField>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Release Rev." source="release" reference="release" target="id">
                    <SingleFieldList>
                        <ChipField source="revision" />
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Name" source="tag key" />
                <TextField label="Value" source="value" />
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

export default {
    list: ReleaseTagList,
    create: ReleaseTagCreate,
    edit: ReleaseTagEdit
}