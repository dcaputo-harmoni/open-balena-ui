import * as React from 'react';
import { Show, Tab, TabbedShowLayout } from 'react-admin';
import DeviceConnect from '../../ui/DeviceConnect';
import DeviceLogs from '../../ui/DeviceLogs';
import Banner from './banner';
import Control from './control';
import Summary from './summary';

/*
const flexStyle = {
    display: "flex",
    flexDirection: "column",
    flex: "1"
}

const useStyles = makeStyles({
    root: flexStyle,
    main: flexStyle,
    card: flexStyle,
    content: flexStyle,
    tab: flexStyle,
    tabContent: flexStyle,
});
*/

const DeviceDashboard = () => {
  return (
    <Show component='div' title='Device Dashboard' actions={false}>
      <Banner />

      <TabbedShowLayout style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1' }}>
        <Tab label='Summary' style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1' }}>
          <Summary />
        </Tab>

        <Tab label='Logs' style={{ flex: '1' }}>
          <DeviceLogs />
        </Tab>

        <Tab label='Connect' style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1' }}>
          <DeviceConnect />
        </Tab>

        <Tab label='Control' style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1' }}>
          <Control />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

export default DeviceDashboard;
