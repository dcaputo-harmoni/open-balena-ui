import React, { useCallback, useEffect, useState } from 'react';
import { Title, useDataProvider } from 'react-admin';

import Banner from './banner';
import Devices from './devices';
import Fleets from './fleets';

const styles = {
  flex: { flex: '1', display: 'flex', flexDirection: 'row' },
  leftCol: { flex: '1', marginRight: '0.5em', display: 'flex', flexDirection: 'column' },
  rightCol: { flex: '1', marginLeft: '0.5em', display: 'flex', flexDirection: 'column' },
};

const Dashboard = () => {
  const [state, setState] = useState({});
  const dataProvider = useDataProvider();

  const fetchData = useCallback(async () => {
    let { data: deviceTypes } = await dataProvider.getList('device type', {
      filter: {},
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
    });

    let { data: organizations } = await dataProvider.getList('organization', {
      filter: {},
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
    });

    let { data: fleets } = await dataProvider.getList('application', {
      filter: {},
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
    });

    let { data: devices } = await dataProvider.getList('device', {
      filter: {},
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
    });

    if (fleets.length > 0) {
      fleets = await Promise.all(
        fleets.map(async (fleet) => {
          fleet.organizationName = organizations.find((organization) => organization.id === fleet['organization'])[
            'name'
          ];

          fleet.deviceTypeName = deviceTypes.find((deviceType) => deviceType.id === fleet['is for-device type'])[
            'slug'
          ];

          fleet.numDevices = devices.filter((device) => device['belongs to-application'] === fleet.id).length;

          fleet.numOnlineDevices = devices.filter(
            (device) => device['belongs to-application'] === fleet.id && device['api heartbeat state'] === 'online',
          ).length;

          return fleet;
        }),
      );
    }

    setState((state) => ({
      ...state,
      fleets: fleets,
    }));

    devices = devices.map((device) => {
      device.applicationName = fleets.find((fleet) => fleet.id === device['belongs to-application'])['app name'];
      device.deviceTypeName = deviceTypes.find((deviceType) => deviceType.id === device['is of-device type'])['slug'];
      return device;
    });

    setState((state) => ({
      ...state,
      devices: devices,
    }));
  }, [dataProvider]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { fleets, devices } = state;

  return (
    <>
      <Title title='Dashboard' />

      <Banner />

      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <Fleets value={fleets || []} />
        </div>

        <div style={styles.rightCol}>
          <Devices value={devices || []} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
