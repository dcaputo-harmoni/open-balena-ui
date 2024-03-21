import * as React from 'react';
import { Show } from 'react-admin';
import Summary from './summary';

const DeviceDashboard = () => {
  return (
    <Show component='div' title='Device Dashboard' actions={false}>
      <Summary />
    </Show>
  );
};

export default DeviceDashboard;
