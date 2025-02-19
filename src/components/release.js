import * as React from 'react';
import {
  BooleanField,
  ChipField,
  Datagrid,
  FunctionField,
  List,
  ReferenceField,
  ReferenceManyCount,
  ReferenceManyField,
  SearchInput,
  SingleFieldList,
  TextField,
  Toolbar,
  useDataProvider,
} from 'react-admin';
import DeleteReleaseButton from '../ui/DeleteReleaseButton';
import SemVerTextField from '../ui/SemVerTextField';

const releaseFilters = [<SearchInput source='status@ilike' alwaysOn />];

const BooleanBinaryField = (props) => {
  return (
    <FunctionField
      {...props}
      render={(record, source) => (
        <BooleanField source='enabled' record={{ ...record, enabled: record[source] === 1 }} />
      )}
    />
  );
};

const TagChipField = (props) => {
  return (
    <FunctionField
      {...props}
      render={(record) => (
        <ChipField source='tag' record={{ ...record, tag: `${record['tag key']}: ${record['value']}` }} />
      )}
    />
  );
};

export const ReleaseList = (props) => {
  return (
    <List filters={releaseFilters}>
      <Datagrid
        size='medium'
        rowClick={false}
        bulkActionButtons={
          <DeleteReleaseButton size='small' color='' context={useDataProvider()} {...props}>
            Delete
          </DeleteReleaseButton>
        }
      >
        <ReferenceField
          label='Fleet'
          source='belongs to-application'
          reference='application'
          target='id'
          sortable={false}
        >
          <TextField source='app name' />
        </ReferenceField>
        <ReferenceField
          label='Host'
          source='belongs to-application'
          reference='application'
          target='id'
          sortable={false}
          link={false}
        >
          <BooleanBinaryField source='is host' />
        </ReferenceField>
        <SemVerTextField label='Version' />
        <ReferenceManyCount
          label='Devices'
          source='id'
          reference='device'
          target='is running-release'
          link={false}
          sortable={true}
        />

        <TextField label='Status' source='status' />

        <ReferenceManyField
          label='Tags'
          source='id'
          reference='release tag'
          target='release'
          link={false}
          sortable={false}
        >
          <SingleFieldList linkType={false}>
            <TagChipField />
          </SingleFieldList>
        </ReferenceManyField>

        <Toolbar>
          <DeleteReleaseButton variant='outlined' size='small' context={useDataProvider()} />
        </Toolbar>
      </Datagrid>
    </List>
  );
};

const release = {
  list: ReleaseList,
};

export default release;
