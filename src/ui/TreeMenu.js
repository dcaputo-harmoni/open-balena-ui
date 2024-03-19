/** Copied from:
 * https://github.com/BigBasket/ra-components/pull/23
 *
 * But, updated to @mui/system
 * ... until ra-components updates to not use @mui/styled
 */
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import LabelIcon from '@mui/icons-material/Label';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MenuItemLink, useResourceDefinitions, useTranslate, DashboardMenuItem, useSidebarState } from 'react-admin';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DefaultIcon from '@mui/icons-material/ViewList';
import CustomMenuItem from './CustomMenuItem.js';

const PREFIX = 'RaTreeMenu';

const classes = {
  main: `${PREFIX}-main`,
  open: `${PREFIX}-open`,
  closed: `${PREFIX}-closed`,
};

const StyledThemeProvider = styled(ThemeProvider)(({ theme }) => ({
  [`& .${classes.main}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: '0.5em',
    [theme.breakpoints.only('xs')]: {
      marginTop: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '1.5em',
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  [`& .${classes.open}`]: {
    width: 200,
  },

  [`& .${classes.closed}`]: {
    width: 55,
  },
}));

const theme = createTheme();

export const TreeMenu = (props) => {
  const { className, dense, hasDashboard, onMenuClick, logout, dashboardlabel, setMenuColors, ...rest } = props;

  const translate = useTranslate();
  const [open] = useSidebarState();
  const pathname = window.location.hash;
  let allResources = useResourceDefinitions();
  const resources = Object.keys(allResources).map((name) => allResources[name]);
  const hasList = (resource) => resource.hasList;

  const handleToggle = (parent) => {
    setState((state) => ({ [parent]: !state[parent] }));
  };

  const isParent = (resource) =>
    resource && resource.options && resource.options.hasOwnProperty('isMenuParent') && resource.options.isMenuParent;

  const isOrphan = (resource) =>
    resource &&
    resource.options &&
    !resource.options.hasOwnProperty('menuParent') &&
    !resource.options.hasOwnProperty('isMenuParent');

  const isChildOfParent = (resource, parentResource) =>
    resource &&
    resource.options &&
    resource.options.hasOwnProperty('menuParent') &&
    resource.options.menuParent == parentResource.name;
  const geResourceName = (slug) => {
    if (!slug) return;
    var words = slug.toString().split('_');
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    return words.join(' ');
  };

  const getPrimaryTextForResource = (resource) => {
    let resourcename = '';
    if (resource && resource.options && resource.options.label) resourcename = resource.options.label;
    else if (resource.name) {
      resourcename = translate(`resources.${resource.name}.name`);
      if (resourcename.startsWith('resources.')) resourcename = geResourceName(resource.name);
    }
    return resourcename;
  };

  const MenuItem = (resource) => (
    <MenuItemLink
      key={resource.name}
      to={`/${resource.name}`}
      primaryText={getPrimaryTextForResource(resource)}
      leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
      onClick={onMenuClick}
      dense={dense}
      sidebarIsOpen={open}
      sx={setMenuColors ? { color: 'secondary.main' } : {}}
    />
  );

  const mapParentStack = (parentResource) => (
    <CustomMenuItem
      key={parentResource.name}
      handleToggle={() => handleToggle(parentResource.name)}
      isOpen={state[parentResource.name] || parentActiveResName === parentResource.name}
      sidebarIsOpen={open}
      name={getPrimaryTextForResource(parentResource)}
      icon={parentResource.icon ? <parentResource.icon /> : <LabelIcon />}
      dense={dense}
      setMenuColors={setMenuColors}
    >
      {
        // eslint-disable-next-line
        resources
          .filter((resource) => isChildOfParent(resource, parentResource) && hasList(resource))
          .map((childResource) => {
            return MenuItem(childResource);
          })
      }
    </CustomMenuItem>
  );

  const mapIndependent = (independentResource) => hasList(independentResource) && MenuItem(independentResource);

  const initialExpansionState = {};
  let parentActiveResName = null;

  resources &&
    resources.length > 0 &&
    resources.forEach((resource) => {
      if (isParent(resource)) {
        initialExpansionState[resource.name] = false;
      } else if (
        pathname.startsWith(`#/${resource.name}`) &&
        resource &&
        resource.options &&
        resource.options.hasOwnProperty('menuParent')
      ) {
        parentActiveResName = resource.options.menuParent;
      }
    });

  const [state, setState] = useState(initialExpansionState);
  const resRenderGroup = [];

  resources &&
    resources.length > 0 &&
    resources.forEach((resource) => {
      if (isParent(resource)) resRenderGroup.push(mapParentStack(resource));
      if (isOrphan(resource)) resRenderGroup.push(mapIndependent(resource));
    });

  return (
    <StyledThemeProvider theme={theme}>
      <div
        className={classnames(classes.main, className, {
          [classes.open]: open,
          [classes.closed]: !open,
        })}
        {...rest}
      >
        {hasDashboard && (
          <DashboardMenuItem
            onClick={onMenuClick}
            dense={dense}
            sidebarIsOpen={open}
            primaryText={dashboardlabel}
            sx={setMenuColors ? { color: 'primary.main' } : {}}
          />
        )}
        {resRenderGroup}
      </div>
    </StyledThemeProvider>
  );
};

TreeMenu.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  dense: PropTypes.bool,
  hasDashboard: PropTypes.bool,
  logout: PropTypes.element,
  onMenuClick: PropTypes.func,
  dashboardlabel: PropTypes.string,
  setMenuColors: PropTypes.bool,
};

TreeMenu.defaultProps = {
  onMenuClick: () => null,
  dashboardlabel: 'Dashboard',
  setMenuColors: true,
};
