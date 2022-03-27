import * as React from "react";
import { 
    ShowView,
    TabbedShowLayout,
    Tab,
} from 'react-admin';
import {
    ShowContextProvider,
} from 'ra-core';
import Banner from './banner';
import Summary from './summary';
import Logs from './logs';
import Connect from './connect';
import Control from './control';

import { useCustomShowController } from './useCustomShowController';

const DeviceDashboard = props => {
    const controllerProps = useCustomShowController({...props});
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView component="div" title="Device Dashboard" actions={false} {...props} {...controllerProps}>
                <Banner/>
            </ShowView>
            <ShowView actions={false} title="&nbsp;" {...props} {...controllerProps}>
                <TabbedShowLayout>
                    <Tab label="Summary">
                        <Summary />
                    </Tab>
                    <Tab label="Logs" path="body">
                        <Logs/>
                    </Tab>
                    <Tab label="Connect" path="miscellaneous">
                        <Connect/>
                    </Tab>
                    <Tab label="Control" path="comments">
                        <Control/>
                    </Tab>
                </TabbedShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default DeviceDashboard;