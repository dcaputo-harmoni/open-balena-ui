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
import DeviceLogs from '../../ui/DeviceLogs';
import DeviceConnect from '../../ui/DeviceConnect';
import Control from './control';
import { makeStyles } from '@material-ui/core/styles';
import { useCustomShowController } from './useCustomShowController';

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

const DeviceDashboard = props => {
    const controllerProps = useCustomShowController({...props});
    const classes = useStyles();
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView component="div" title="Device Dashboard" actions={false} {...props} {...controllerProps}>
                <Banner/>
            </ShowView>
            <ShowView actions={false} title="&nbsp;" {...props} {...controllerProps} classes={classes}>
                <TabbedShowLayout style={{width:"100%", display: "flex", flexDirection: "column", flex:"1"}} classes={classes}>
                    <Tab label="Summary" style={{width:"100%", display: "flex", flexDirection: "column", flex:"1"}}>
                        <Summary />
                    </Tab>
                    <Tab label="Logs" style={{flex:"1"}} contentClassName={classes.tab}>
                        <DeviceLogs className={classes.tabContent}/>
                    </Tab>
                    <Tab label="Connect" style={{width:"100%", display: "flex", flexDirection: "column", flex:"1"}} contentClassName={classes.tab}>
                        <DeviceConnect className={classes.tabContent}/>
                    </Tab>
                    <Tab label="Control" style={{width:"100%", display: "flex", flexDirection: "column", flex:"1"}} contentClassName={classes.tab}>
                        <Control/>
                    </Tab>
                </TabbedShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default DeviceDashboard;