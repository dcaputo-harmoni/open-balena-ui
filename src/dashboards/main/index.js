import React from 'react';
import { Title } from 'react-admin';

import Banner from './banner';
import { FleetCards } from './fleets';
import { DeviceCards } from './devices';

const styles = {
  flex: { flex: '1', display: 'flex', flexDirection: 'row' },
  leftCol: { flex: '1', marginRight: '0.5em', display: 'flex', flexDirection: 'column' },
  rightCol: { flex: '1', marginLeft: '0.5em', display: 'flex', flexDirection: 'column' },
};

const Dashboard = () => {
  return (
    <>
      <Title title='Dashboard' />

      <Banner />

      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <FleetCards />
        </div>

        <div style={styles.rightCol}>
          <DeviceCards />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
