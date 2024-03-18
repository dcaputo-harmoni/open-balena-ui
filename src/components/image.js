import * as React from 'react';
import { TextField, Datagrid, FunctionField, ReferenceField, ChipField, List } from 'react-admin';
import dateFormat from 'dateformat';
import SemVerChip from '../ui/SemVerChip';

export const ImageList = (props) => {
  return (
    <List {...props}>
      <Datagrid bulkActionButtons={false}>
        <TextField source='id' />
        <ReferenceField label='Fleet' source='id' reference='image-is part of-release' target='image' link={false}>
          <ReferenceField source='is part of-release' reference='release' target='id' link={false}>
            <ReferenceField
              label='Fleet'
              source='belongs to-application'
              reference='application'
              target='id'
              link={(record, reference) => `/${reference}/${record['belongs to-application']}`}
            >
              <ChipField source='app name' />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>
        <ReferenceField
          label='Release Rev.'
          source='id'
          reference='image-is part of-release'
          target='image'
          link={false}
        >
          <ReferenceField
            source='is part of-release'
            reference='release'
            target='id'
            link={(record, reference) => `/${reference}/${record['is part of-release']}`}
          >
            <SemVerChip />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField label='Service' source='is a build of-service' reference='service' target='id'>
          <ChipField source='service name' />
        </ReferenceField>
        <FunctionField
          label='Size'
          render={(record) => `${Math.round((record['image size'] / 1000000) * 10) / 10}mb`}
        />
        ;
        <FunctionField
          label='Push Date'
          render={(record) => `${dateFormat(new Date(record['push timestamp']), 'dd-mmm-yy h:MM:ss TT Z')}`}
        />
        <TextField label='Status' source='status' />
      </Datagrid>
    </List>
  );
};

const image = {
  list: ImageList,
};

export default image;
