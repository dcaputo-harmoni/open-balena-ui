/** Originally from:
 * https://github.com/BigBasket/ra-components/pull/23
 *
 * But, updated to @mui/system
 * ... until ra-components updates to not use @mui/styled
 */
import React, { useState } from 'react';
import { styled, useTheme } from '@mui/system';
import LabelIcon from '@mui/icons-material/Label';
import { ThemeProvider } from '@mui/material/styles';
import { MenuItemLink, useResourceDefinitions, useTranslate, DashboardMenuItem, useSidebarState } from 'react-admin';
import PropTypes from 'prop-types';
import DefaultIcon from '@mui/icons-material/ViewList';
import CustomMenuItem from './CustomMenuItem.js';

const StyledMenu = styled('div')(({ theme, open }) => ({
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
  width: open ? 200 : 55,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const TreeMenu = ({
  className,
  dense,
  hasDashboard,
  onMenuClick,
  logout,
  dashboardlabel,
  setMenuColors,
  ...rest
}) => {
  const theme = useTheme();
  const translate = useTranslate();
  const [open] = useSidebarState();
  let allResources = useResourceDefinitions();
  const resources = Object.keys(allResources).map((name) => allResources[name]);
  const [state, setState] = useState({});

  const handleToggle = (parent) => {
    setState((prevState) => ({
      ...prevState,
      [parent]: !prevState[parent],
    }));
  };

  const isParent = (resource) => resource.options?.isMenuParent;

  const isChildOfParent = (resource, parentResourceName) => resource.options?.menuParent === parentResourceName;

  const getResourceName = (slug) => {
    return slug
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPrimaryTextForResource = (resource) => {
    let resourceName =
      resource.options?.label ??
      translate(`resources.${resource.name}.name`, {
        _: getResourceName(resource.name),
      });
    return resourceName;
  };

  const renderMenuItem = (resource) => (
    <MenuItemLink
      key={resource.name}
      to={`/${resource.name}`}
      primaryText={getPrimaryTextForResource(resource)}
      leftIcon={resource.icon ? React.createElement(resource.icon) : <DefaultIcon />}
      onClick={onMenuClick}
      dense={dense}
      sidebarIsOpen={open}
      sx={setMenuColors ? { color: 'secondary.main' } : {}}
    />
  );

  const renderCustomMenuItems = () =>
    resources
      .filter((resource) => isParent(resource) && resource.hasList)
      .map((parentResource) => (
        <CustomMenuItem
          key={parentResource.name}
          handleToggle={() => handleToggle(parentResource.name)}
          isOpen={state[parentResource.name]}
          sidebarIsOpen={open}
          name={getPrimaryTextForResource(parentResource)}
          icon={parentResource.icon ? React.createElement(parentResource.icon) : <LabelIcon />}
          dense={dense}
          setMenuColors={setMenuColors}
        >
          {resources
            .filter((childResource) => isChildOfParent(childResource, parentResource.name) && childResource.hasList)
            .map(renderMenuItem)}
        </CustomMenuItem>
      ));

  return (
    <ThemeProvider theme={theme}>
      <StyledMenu open={open} className={className} {...rest}>
        {hasDashboard && (
          <DashboardMenuItem
            onClick={onMenuClick}
            dense={dense}
            sidebarIsOpen={open}
            primaryText={dashboardlabel || 'Dashboard'}
            sx={setMenuColors ? { color: 'primary.main' } : {}}
          />
        )}
        {renderCustomMenuItems()}
        {resources
          .filter((resource) => !resource.options?.isMenuParent && !resource.options?.menuParent && resource.hasList)
          .map(renderMenuItem)}
        {logout}
      </StyledMenu>
    </ThemeProvider>
  );
};

TreeMenu.propTypes = {
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
