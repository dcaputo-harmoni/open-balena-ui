import * as React from "react";
import {
    TextField,
    Datagrid,
    ReferenceField,
    ReferenceManyField,
    SingleFieldList,
    ChipField,
    List,
    Toolbar,
    SearchInput,
    FunctionField,
    BooleanField,
} from 'react-admin';
import DeleteReleaseButton from "../ui/DeleteReleaseButton";

const releaseFilters = [
    <SearchInput source="status@ilike" alwaysOn />,
];

const CustomBulkActionButtons = props => (
    <React.Fragment>
        <DeleteReleaseButton variant="text" size="small" {...props}> Delete </DeleteReleaseButton>
    </React.Fragment>
);

const FilterUnique = (props) => {
    let uniqueRecords = {};
    props.ids.forEach(id => {
        uniqueRecords[props.data[id][props.uniqueField]] = props.data[id];
        delete props.data[id];
    });
    while (props.ids.length) { props.ids.pop(); }
    Object.keys(uniqueRecords).forEach(uniqueId => {
        const id = uniqueRecords[uniqueId].id;
        props.ids.push(id);
        props.data[id] = uniqueRecords[uniqueId];
    });
    return props.children;
}

const BooleanBinaryField = props => {
    return (
        <FunctionField {...props} render={(record, source) =>
            <BooleanField source="enabled" record={{ ...record, enabled: (record[source] === 1) }}/>}
        />
    );
};

export const ReleaseList = props => {
    return (
        <List {...props} filters={releaseFilters} bulkActionButtons={<CustomBulkActionButtons />}>
            <Datagrid>
                <TextField source="id"/>
                <ReferenceField label="Fleet" source="belongs to-application" reference="application" target="id" sortable={false}>
                    <ChipField source="app name"/>
                </ReferenceField>
                <ReferenceField label="Host" source="belongs to-application" reference="application" target="id" sortable={false}>
                    <BooleanBinaryField source="is host"/>
                </ReferenceField>
                <TextField label="Revision" source="revision"/>
                <ReferenceManyField label="Devices" source="id" reference="image install" target="is provided by-release" filter={{"status": "Running"}} link={false} sortable={false}>
                    <FilterUnique uniqueField="device">
                        <SingleFieldList linkType={false}>
                            <ReferenceField source="device" reference="device" target="id" link={false}>
                                <ChipField source="device name"/>
                            </ReferenceField>
                        </SingleFieldList>
                    </FilterUnique>
                </ReferenceManyField>
                <ReferenceManyField label="Fleets" source="id" reference="application" target="should be running-release" link={false} sortable={false}>
                    <SingleFieldList linkType={false}>
                        <ChipField source="slug"/>
                    </SingleFieldList>
                </ReferenceManyField>
                <ReferenceManyField label="Tags" source="id" reference="release tag" target="release" link={false} sortable={false} >
                    <SingleFieldList linkType={false}>
                        <ChipField source="value"/>
                    </SingleFieldList>
                </ReferenceManyField>
                <TextField label="Status" source="status"/>
                <Toolbar style={{minHeight: 0, minWidth: 0, padding:0, margin:0, background: 0, textAlign: "center"}}>
                    <DeleteReleaseButton variant="text" size="small"/>
                </Toolbar>
            </Datagrid>
        </List>
    )
};

const release = {
    list: ReleaseList
}

export default release;