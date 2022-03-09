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
} from 'react-admin';

const ReleaseTitle = ({ record }) => {
    return <span>Release {record ? `"${record.name}"` : ''}</span>;
};

export const ReleaseList = (props) => {
    return (
        <List {...props}>
            <Datagrid rowClick="edit">
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

export const ReleaseCreate = props => (
    <Create {...props}>
        <SimpleForm>
        </SimpleForm>
    </Create>
);

export const ReleaseEdit = props => (
    <Edit title={<ReleaseTitle />} {...props}>
        <SimpleForm>
        </SimpleForm>
    </Edit>
);

const release = {
    list: ReleaseList,
    create: ReleaseCreate,
    edit: ReleaseEdit
}

export default release;