import * as React from "react";
import { Admin, Resource, ListGuesser, fetchUtils } from 'react-admin';
import TreeMenu from '@bb-tech/ra-treemenu';
import postgrestDataProvider from './dataProvider/postgrestDataProvider';
import openbalenaAuthProvider from './authProvider/openbalenaAuthProvider';
import user from './components/user';
import userKey from './components/userKey';
import organization from './components/organization';
import role from './components/role';
import permission from './components/permission';
import apiKey from './components/apiKey';
import fleet from './components/fleet';
import fleetEnvVar from './components/fleetEnvVar';
import fleetConfigVar from './components/fleetConfigVar';
import fleetTag from './components/fleetTag';
import device from './components/device';
import deviceEnvVar from './components/deviceEnvVar';
import deviceConfigVar from './components/deviceConfigVar';
import deviceServiceVar from './components/deviceServiceVar';
import deviceType from './components/deviceType';
import deviceTag from './components/deviceTag';
import image from './components/image';
import release from './components/release';
import releaseTag from './components/releaseTag';
import imageEnvVar from './components/imageEnvVar';
import imageLabel from './components/imageLabel';
import service from './components/service';
import serviceEnvVar from './components/serviceEnvVar';
import Dashboard from './dashboard';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  options.headers.set('Authorization', `Bearer ${localStorage.getItem('auth')}`);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = postgrestDataProvider(process.env.REACT_APP_OPEN_BALENA_POSTGREST_URL, httpClient);

const App = () => (
<Admin  title="Open Balena Admin" dataProvider={dataProvider} authProvider={openbalenaAuthProvider} dashboard={Dashboard} menu={TreeMenu} > 

  <Resource name="menu-access" options={{ label: "Access", "isMenuParent": true }} />
  <Resource name="organization" options={{ label: 'Orgs', "menuParent": "menu-access" }} {...organization} />
  <Resource name="user" options={{ label: 'Users', "menuParent": "menu-access" }} {...user} />
  <Resource name="api key" options={{ label: 'API Keys', "menuParent": "menu-access" }} {...apiKey} />
  <Resource name="user-has-public key" options={{ label: 'SSH Keys', "menuParent": "menu-access" }} {...userKey} />

  <Resource name="menu-fleet" options={{ label: "Fleets", "isMenuParent": true }} />
  <Resource name="application" options={{ label: 'Fleets', "menuParent": "menu-fleet" }} {...fleet} />
  <Resource name="application config variable" options={{ label: 'Config Vars', "menuParent": "menu-fleet" }}  {...fleetConfigVar} />
  <Resource name="application environment variable" options={{ label: 'Environment Vars', "menuParent": "menu-fleet" }} {...fleetEnvVar} />
  <Resource name="application tag" options={{ label: 'Tags', "menuParent": "menu-fleet" }} {...fleetTag} />

  <Resource name="menu-device" options={{ label: "Devices", "isMenuParent": true }} />
  <Resource name="device" options={{ label: 'Devices', "menuParent": "menu-device" }} {...device} />
  <Resource name="device config variable" options={{ label: 'Config Vars', "menuParent": "menu-device" }} {...deviceConfigVar} />
  <Resource name="device environment variable" options={{ label: 'Environment Vars', "menuParent": "menu-device" }} {...deviceEnvVar} />
  <Resource name="device service environment variable" options={{ label: 'Service Vars', "menuParent": "menu-device" }} {...deviceServiceVar} />
  <Resource name="device tag" options={{ label: 'Tags', "menuParent": "menu-device" }} {...deviceTag} />

  <Resource name="menu-image" options={{ label: "Images", "isMenuParent": true }} />
  <Resource name="image" options={{ label: 'Images', "menuParent": "menu-image" }} {...image} />
  <Resource name="image environment variable" options={{ label: 'Environment Vars', "menuParent": "menu-image" }} {...imageEnvVar} />
  <Resource name="image label" options={{ label: 'Labels', "menuParent": "menu-image" }} {...imageLabel} />

  <Resource name="menu-release" options={{ label: "Releases", "isMenuParent": true }} />
  <Resource name="release" options={{ label: 'Releases', "menuParent": "menu-release" }} {...release} />
  <Resource name="release tag" options={{ label: 'Tags', "menuParent": "menu-release" }} {...releaseTag} />

  <Resource name="menu-service" options={{ label: "Services", "isMenuParent": true }} />
  <Resource name="service" options={{ label: 'Services', "menuParent": "menu-service" }} {...service} />
  <Resource name="service environment variable" options={{ label: 'Environment Vars', "menuParent": "menu-service" }} {...serviceEnvVar} />
  <Resource name="service label" options={{ label: 'Labels', "menuParent": "menu-service" }} list={ListGuesser} />

  <Resource name="menu-static" options={{ label: "Static Data", "isMenuParent": true }} />
  <Resource name="config" options={{ label: 'Configs', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="cpu architecture" options={{ label: 'CPU Architectures', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="device family" options={{ label: 'Device Families', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="device manufacturer" options={{ label: 'Device Mfgs', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="device type" options={{ label: 'Device Types', "menuParent": "menu-static" }} {...deviceType} />
  <Resource name="application type" options={{ label: 'Fleet Types', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="gateway download" options={{ label: 'Gateway D/Ls', "menuParent": "menu-static" }} list={ListGuesser} />
  <Resource name="permission" options={{ label: 'Permissions', "menuParent": "menu-static" }} {...permission} />
  <Resource name="role" options={{ label: 'Roles', "menuParent": "menu-static" }} {...role} />
  
  <Resource name="actor" />
  <Resource name="api key-has-permission" />
  <Resource name="api key-has-role" />
  <Resource name="device type alias" />
  <Resource name="image install" />
  <Resource name="image-is part of-release" />
  <Resource name="migration" />
  <Resource name="migration lock" />
  <Resource name="model" />
  <Resource name="organization membership" />
  <Resource name="role-has-permission" />
  <Resource name="service install" />
  <Resource name="service instance" />
  <Resource name="user-has-permission" />
  <Resource name="user-has-role" />

</Admin>
);

export default App;