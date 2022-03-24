import * as React from "react";
import { 
    Show,
    TabbedShowLayout,
    Tab,
} from 'react-admin';
import Banner from './banner';
import Summary from './summary';
import Logs from './logs';
import Connect from './connect';
import Control from './control';

import { useShowController } from 'react-admin';

const DeviceTitle = ({ record }) => {
    return <span>Device {record ? `"${record['device name']}"` : ''}</span>;
};

const DeviceDashboard = (props) => {
    return (
        <>
        <Banner {...useShowController(props)}/>
        <Show title={<DeviceTitle />} actions={false} {...props}>
            <TabbedShowLayout syncWithLocation={false}>
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
        </Show>
        </>
    );
};

export default DeviceDashboard;