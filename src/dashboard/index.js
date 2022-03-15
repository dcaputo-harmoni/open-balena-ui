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
        const { data: fleets } = await dataProvider.getList(
            'application',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
        setState(state => ({
            ...state,
            fleets: fleets,
        }));
        const { data: devices } = await dataProvider.getList(
            'device',
            {
                filter: { },
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 50 },
            }
        );
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