import * as React from 'react';
import { Show, Tab, TabbedShowLayout } from 'react-admin';
import DeviceConnect from '../../ui/DeviceConnect';
import DeviceLogs from '../../ui/DeviceLogs';
import Banner from './banner';
import Summary from './summary';

const DeviceDashboard = () => {
  return (
    <Show component='div' title='Device Dashboard' actions={false}>
      <Banner />

      <TabbedShowLayout
        sx={{
          'marginTop': '-3px',
          '.MuiDivider-root': {
            display: 'none',
          },
          '.MuiTabs-root': {
            background: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 8px 8px 0px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderTopWidth: 0,
            borderBottomLeftRadius: '3px',
            borderBottomRightRadius: '3px',
            overflow: 'hidden',
          },
          '.MuiTab-root': {
            flex: 1,
            maxWidth: 'none',
          },
        }}
      >
        <Tab label='Summary'>
          <Summary />
        </Tab>

        <Tab label='Logs'>
          <DeviceLogs />
        </Tab>

        <Tab label='Connect'>
          <DeviceConnect />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

export default DeviceDashboard;
