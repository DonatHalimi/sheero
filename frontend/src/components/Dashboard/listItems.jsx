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
  Mail,
  MailOutlined,
  MoveToInbox,
  MoveToInboxOutlined,
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
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardSearchBar } from '../../components/custom/Dashboard';
import { ActiveListItem, CollapsibleListItem } from '../../components/custom/MUI';
import { getLocalStorageState, saveLocalStorageState } from '../../components/custom/utils';
import { selectIsContentManager, selectIsOrderManager, selectIsProductManager } from '../../store/actions/authActions';

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
    id: 'orders',
    icon: { active: Inbox, inactive: InboxOutlined },
    label: 'Orders'
  },
  {
    id: 'returns',
    icon: { active: MoveToInbox, inactive: MoveToInboxOutlined },
    label: 'Returns'
  },
  {
    id: 'reviews',
    icon: { active: Star, inactive: StarHalf },
    label: 'Reviews'
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

// Newsletter related pages
const newsLetterMenuItems = [
  {
    id: 'productRestockSubscriptions',
    icon: { active: Inventory, inactive: Inventory2Outlined },
    label: 'Restock'
  }
]

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
    id: 'newsletters',
    icon: { active: Mail, inactive: MailOutlined },
    label: 'Newsletters',
    items: newsLetterMenuItems,
    stateKey: 'newslettersOpen'
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
    newslettersOpen: true,
    addressesOpen: true,
    categoriesOpen: true,
    reportsOpen: true
  };

  const [menuState, setMenuState] = useState(() => getLocalStorageState('menuState', defaultState));
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const isOrderManager = useSelector(selectIsOrderManager);
  const isContentManager = useSelector(selectIsContentManager);
  const isProductManager = useSelector(selectIsProductManager);

  const filterSectionItems = (section, allowedItems) => ({
    ...section,
    items: section.items.filter(item => allowedItems.includes(item.id)),
  });

  const getFilteredSections = () => {
    let allowedItems;

    switch (true) {
      case isOrderManager:
        allowedItems = ['orders', 'products'];
        break;
      case isContentManager:
        allowedItems = ['faqs', 'images'];
        break;
      case isProductManager:
        allowedItems = ['reviews', 'products', 'categories', 'subcategories', 'subsubcategories', 'productRestockSubscriptions', 'suppliers'];
        break;
      default:
        return mainSections;
    }

    return mainSections
      .map(section => filterSectionItems(section, allowedItems))
      .filter(section => section.items.length > 0);
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
      {!(isOrderManager || isContentManager || isProductManager) && !collapsed && (
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