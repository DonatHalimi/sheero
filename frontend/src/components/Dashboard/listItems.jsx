import { Dashboard, DashboardCustomize, DashboardCustomizeOutlined, DashboardOutlined, } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardSearchBar } from '../../components/custom/Dashboard';
import { ActiveListItem, CollapsibleListItem } from '../../components/custom/MUI';
import { getLocalStorageState, saveLocalStorageState } from '../../components/custom/utils';
import { selectIsContentManager, selectIsCustomerSupport, selectIsOrderManager, selectIsProductManager } from '../../store/actions/authActions';
import { mainSections } from './menuSections';

export const mainListItems = ({ setCurrentView, collapsed }) => {
  const defaultState = {
    crudOpen: true,
    usersOpen: true,
    productsOpen: true,
    newslettersOpen: true,
    addressesOpen: true,
    categoriesOpen: true,
    reportsOpen: true
  };

  const [menuState, setMenuState] = useState(() => getLocalStorageState('menuState', defaultState));
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isOrderManager = useSelector(selectIsOrderManager);
  const isContentManager = useSelector(selectIsContentManager);
  const isCustomerSupport = useSelector(selectIsCustomerSupport);
  const isProductManager = useSelector(selectIsProductManager);

  const canSearch = (isOrderManager || isContentManager || isCustomerSupport || isProductManager);

  const userRoles = {
    isOrderManager,
    isContentManager,
    isCustomerSupport,
    isProductManager,
  };

  const roleAccessMap = {
    isOrderManager: ['orders', 'products'],
    isContentManager: ['faqs', 'images'],
    isCustomerSupport: ['contacts'],
    isProductManager: [
      'reviews', 'products', 'categories',
      'subcategories', 'subsubcategories',
      'productRestockSubscriptions', 'suppliers'
    ],
  };

  const allowedItems = Object.entries(userRoles)
    .filter(([_, hasRole]) => hasRole)
    .flatMap(([role]) => roleAccessMap[role] || []);

  const getFilteredSections = () => {
    if (allowedItems.length === 0) return mainSections;

    return mainSections.map(section => ({
      ...section,
      items: section.items.filter(item => allowedItems.includes(item.id)),
    })).filter(section => section.items.length > 0);
  };

  const handleItemClick = (view) => {
    setCurrentView(view);
    setActiveItem(view);
    navigate(`/dashboard/${view}`);
  };

  const toggleStateAndSave = (key) => {
    const updatedState = { ...menuState, [key]: !menuState[key] };
    setMenuState(updatedState);
    saveLocalStorageState('menuState', updatedState);
  };

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    setActiveItem(path || 'users');
  }, [location.pathname]);

  const renderMenuItem = ({ id, icon, label }) => (
    <div key={id}>
      <Tooltip title={collapsed ? label : ""} arrow placement="right">
        <div>
          <ActiveListItem
            handleClick={() => handleItemClick(id)}
            selected={activeItem === id}
            icon={activeItem === id ? <icon.active /> : <icon.inactive />}
            primary={!collapsed ? label : ""}
            isDashboard={true}
          />
        </div>
      </Tooltip>
    </div>
  );

  const getAllMenuItems = () => {
    const allItems = [];
    mainSections.forEach(section => {
      section.items.forEach(item => {
        allItems.push({
          id: item.id,
          label: item.label,
          icon: item.icon,
          parentId: section.id
        });
      });
    });
    return allItems;
  };

  return (
    <>
      {!canSearch && !collapsed && (
        <>
          <DashboardSearchBar
            collapsed={collapsed}
            onMenuItemClick={handleItemClick}
            getAllMenuItems={getAllMenuItems}
          />

          <ActiveListItem
            icon={activeItem === 'main' ? <Dashboard /> : <DashboardOutlined />}
            primary={!collapsed ? "Dashboard" : ""}
            handleClick={() => handleItemClick('main')}
            selected={activeItem === 'main'}
            isMainPage={true}
            isDashboard={true}
          />
        </>
      )}

      <CollapsibleListItem
        open={menuState.crudOpen}
        handleClick={() => toggleStateAndSave('crudOpen')}
        icon={menuState.crudOpen ? <DashboardCustomize /> : <DashboardCustomizeOutlined />}
        primary={!collapsed ? "CRUDs" : ""}
      >
        {getFilteredSections().map(section => (
          <CollapsibleListItem
            key={section.id}
            open={menuState[section.stateKey]}
            handleClick={() => toggleStateAndSave(section.stateKey)}
            icon={menuState[section.stateKey] ? <section.icon.active /> : <section.icon.inactive />}
            primary={!collapsed ? section.label : ""}
          >
            {section.items.map(renderMenuItem)}
          </CollapsibleListItem>
        ))}
      </CollapsibleListItem>
    </>
  );
};