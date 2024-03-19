import * as React from 'react';
import { ShowView, TabbedShowLayout, Tab } from 'react-admin';
import { ShowContextProvider } from 'ra-core';
import Banner from './banner';
import Summary from './summary';
import DeviceLogs from '../../ui/DeviceLogs';
import DeviceConnect from '../../ui/DeviceConnect';
import Control from './control';
import { useCustomShowController } from './useCustomShowController';

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

const DeviceDashboard = (props) => {
  const controllerProps = useCustomShowController({ ...props });
  return (
    <ShowContextProvider value={controllerProps}>
      <ShowView component='div' title='Device Dashboard' actions={false} {...props} {...controllerProps}>
        <Banner {...props} {...controllerProps} />
      </ShowView>
      <ShowView actions={false} title='&nbsp;' {...props} {...controllerProps}>
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
      </ShowView>
    </ShowContextProvider>
  );
};

export default DeviceDashboard;
