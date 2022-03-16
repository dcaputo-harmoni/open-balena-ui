import React, { useState, useEffect, useCallback } from 'react';
import { useVersion, useDataProvider, Title } from 'react-admin';

import Banner from './banner';
import Fleets from './fleets';
import Devices from './devices';

const styles = {
    flex: { display: 'flex' },
    flexColumn: { display: 'flex', flexDirection: 'column' },
    leftCol: { flex: 1, marginRight: '0.5em' },
    rightCol: { flex: 1, marginLeft: '0.5em' },
    singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const Dashboard = () => {
    const [state, setState] = useState({});
    const version = useVersion();
    const dataProvider = useDataProvider();

    const fetchFleets = useCallback(async () => {
        let { data: deviceTypes } = await dataProvider.getList(
            'device type',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
        let { data: organizations } = await dataProvider.getList(
            'organization',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
        let { data: fleets } = await dataProvider.getList(
            'application',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
        let { data: devices } = await dataProvider.getList(
            'device',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
        if (fleets.length > 0) {
            fleets = await Promise.all(fleets.map( async fleet => {
                fleet.organizationName = organizations.find(organization => organization.id === fleet['organization'])['name'];
                fleet.deviceTypeName = deviceTypes.find(deviceType => deviceType.id === fleet['is for-device type'])['slug'];
                fleet.numDevices = devices.filter(device => device['belongs to-application'] === fleet.id).length;
                fleet.numOnlineDevices = devices.filter(device => device['belongs to-application'] === fleet.id && device['api heartbeat state'] === "online").length;
                return fleet;
                }));
        }
        setState(state => ({
            ...state,
            fleets: fleets,
        }));
        devices = devices.map(device => {
            device.applicationName = fleets.find(fleet => fleet.id === device['belongs to-application'])['app name'];
            device.deviceTypeName = deviceTypes.find(deviceType => deviceType.id === device['is of-device type'])['slug'];
            return device; 
        });
        setState(state => ({
            ...state,
            devices: devices,
        }));
    }, [dataProvider]);

    useEffect(() => {
        fetchFleets();
    }, [version]);

    const {
        fleets,
        devices,
    } = state;
    return (
        <>
            <Title title="Dashboard" />
            <Banner />
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Fleets value={fleets ? fleets : []} />
                </div>
                <div style={styles.rightCol}>
                    <Devices value={devices ? devices : []} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;