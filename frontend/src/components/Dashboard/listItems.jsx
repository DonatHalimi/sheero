import {
  AllInbox,
  AllInboxOutlined,
  Apartment,
  ApartmentOutlined,
  Category,
  CategoryOutlined,
  Collections,
  CollectionsOutlined,
  Contacts,
  ContactsOutlined,
  Dashboard,
  DashboardCustomize,
  DashboardCustomizeOutlined,
  DashboardOutlined,
  DryCleaning,
  DryCleaningOutlined,
  Explore,
  ExploreOutlined,
  Flag,
  FlagOutlined,
  Help,
  HelpOutlineOutlined,
  Inbox,
  InboxOutlined,
  Inventory,
  Inventory2Outlined,
  MoveToInbox,
  People,
  PeopleOutlineOutlined,
  Person,
  PersonOutline,
  PrecisionManufacturing,
  PrecisionManufacturingOutlined,
  Room,
  RoomOutlined,
  Star,
  StarHalf,
  Widgets,
  WidgetsOutlined
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListItem, CollapsibleListItem, DashboardSearchBar, getLocalStorageState, saveLocalStorageState, StyledInboxIcon, StyledMoveToInboxIcon } from '../../assets/CustomComponents';
import { Tooltip } from '@mui/material';

// User related pages
const userMenuItems = [
  {
    id: 'users',
    icon: { active: Person, inactive: PersonOutline },
    label: 'Users'
  },
  {
    id: 'roles',
    icon: { active: People, inactive: PeopleOutlineOutlined },
    label: 'Roles'
  },
  {
    id: 'reviews',
    icon: { active: Star, inactive: StarHalf },
    label: 'Reviews'
  },
  {
    id: 'orders',
    icon: { active: Inbox, inactive: StyledInboxIcon },
    label: 'Orders'
  },
  {
    id: 'returns',
    icon: { active: MoveToInbox, inactive: StyledMoveToInboxIcon },
    label: 'Returns'
  },
];

// Product related pages
const productMenuItems = [
  {
    id: 'products',
    icon: { active: DryCleaning, inactive: DryCleaningOutlined },
    label: 'Products'
  },
  {
    id: 'images',
    icon: { active: Collections, inactive: CollectionsOutlined },
    label: 'Images'
  },
  {
    id: 'faqs',
    icon: { active: Help, inactive: HelpOutlineOutlined },
    label: 'FAQs'
  },
  {
    id: 'contacts',
    icon: { active: Contacts, inactive: ContactsOutlined },
    label: 'Contacts'
  },
];

// Category related pages
const categoryMenuItems = [
  {
    id: 'categories',
    icon: { active: Inbox, inactive: InboxOutlined },
    label: 'Categories'
  },
  {
    id: 'subcategories',
    icon: { active: Widgets, inactive: WidgetsOutlined },
    label: 'Subcategories'
  },
  {
    id: 'subsubcategories',
    icon: { active: Category, inactive: CategoryOutlined },
    label: 'Subsubcategories'
  },
];

// Address related pages
const addressMenuItems = [
  {
    id: 'countries',
    icon: { active: Flag, inactive: FlagOutlined },
    label: 'Countries'
  },
  {
    id: 'cities',
    icon: { active: Apartment, inactive: ApartmentOutlined },
    label: 'Cities'
  },
  {
    id: 'addresses',
    icon: { active: Room, inactive: RoomOutlined },
    label: 'Addresses'
  },
  {
    id: 'suppliers',
    icon: { active: PrecisionManufacturing, inactive: PrecisionManufacturingOutlined },
    label: 'Suppliers'
  },
];

// Collapsible sections
const mainSections = [
  {
    id: 'users',
    icon: { active: People, inactive: PeopleOutlineOutlined },
    label: 'User',
    items: userMenuItems,
    stateKey: 'usersOpen'
  },
  {
    id: 'products',
    icon: { active: Inventory, inactive: Inventory2Outlined },
    label: 'Product',
    items: productMenuItems,
    stateKey: 'productsOpen'
  },
  {
    id: 'categories',
    icon: { active: AllInbox, inactive: AllInboxOutlined },
    label: 'Category',
    items: categoryMenuItems,
    stateKey: 'categoriesOpen'
  },
  {
    id: 'addresses',
    icon: { active: Explore, inactive: ExploreOutlined },
    label: 'Address',
    items: addressMenuItems,
    stateKey: 'addressesOpen'
  },
];

export const mainListItems = ({ setCurrentView, collapsed }) => {
  const defaultState = {
    crudOpen: true,
    usersOpen: true,
    productsOpen: true,
    addressesOpen: true,
    categoriesOpen: true,
    reportsOpen: true
  };

  const [menuState, setMenuState] = useState(getLocalStorageState('menuState', defaultState));
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();

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
    const path = window.location.pathname.split('/')[2];
    setActiveItem(path || 'users');
  }, []);

  const renderMenuItem = ({ id, icon, label }) => (
    <div key={id}>
      <Tooltip title={collapsed ? label : ""} arrow placement="right">
        <div>
          <ActiveListItem
            handleClick={() => handleItemClick(id)}
            selected={activeItem === id}
            icon={activeItem === id ? <icon.active /> : <icon.inactive />}
            primary={!collapsed ? label : ""}
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
      />

      <CollapsibleListItem
        open={menuState.crudOpen}
        handleClick={() => toggleStateAndSave('crudOpen')}
        icon={menuState.crudOpen ? <DashboardCustomize /> : <DashboardCustomizeOutlined />}
        primary={!collapsed ? "CRUDs" : ""}
      >
        {mainSections.map(section => (
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

export const secondaryListItems = (
  <>
    {/* <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton> */}
  </>
);