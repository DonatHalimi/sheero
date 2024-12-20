import {
  AllInboxOutlined,
  ApartmentOutlined,
  CategoryOutlined,
  CollectionsOutlined,
  ContactsOutlined,
  DashboardCustomizeOutlined,
  DashboardOutlined,
  ExploreOutlined,
  FlagOutlined,
  HelpOutlineOutlined,
  InboxOutlined,
  Inventory2Outlined,
  InventoryOutlined,
  PeopleOutline,
  PeopleOutlineOutlined,
  PersonOutline,
  PrecisionManufacturingOutlined,
  RoomOutlined,
  StarHalf,
  WidgetsOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveListItem, CollapsibleListItem, StyledInboxIcon, StyledMoveToInboxIcon } from '../../assets/CustomComponents';

/**
 * Returns a list of main menu items for the dashboard.
 * @param {object} props An object containing the setCurrentView function.
 * @returns {React.ReactElement} A list of main menu items for the dashboard.
 */
export const mainListItems = ({ setCurrentView }) => {
  const [crudOpen, setCrudOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);
  const [addressesOpen, setAddressesOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();

  const handleItemClick = (view) => {
    setCurrentView(view);
    setActiveItem(view);
    navigate(`/dashboard/${view}`);
  };

  useEffect(() => {
    const path = window.location.pathname.split('/')[2];
    if (path) {
      setActiveItem(path);
    } else {
      setActiveItem('users');
    }
  }, []);

  return (
    <>
      <ActiveListItem
        icon={<DashboardOutlined />}
        primary="Dashboard"
        handleClick={() => handleItemClick('main')}
        selected={activeItem === 'main'}
      />

      <CollapsibleListItem
        open={crudOpen}
        handleClick={() => setCrudOpen(!crudOpen)}
        icon={<DashboardCustomizeOutlined />}
        primary="CRUDs"
      >
        <CollapsibleListItem
          open={usersOpen}
          handleClick={() => setUsersOpen(!usersOpen)}
          icon={<PeopleOutline />}
          primary="User"
        >
          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('users')}
            selected={activeItem === 'users'}
            icon={<PersonOutline />}
            primary="Users"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('roles')}
            selected={activeItem === 'roles'}
            icon={<PeopleOutlineOutlined />}
            primary="Roles"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('reviews')}
            selected={activeItem === 'reviews'}
            icon={<StarHalf />}
            primary="Reviews"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('orders')}
            selected={activeItem === 'orders'}
            icon={<StyledInboxIcon />}
            primary="Orders"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('returns')}
            selected={activeItem === 'returns'}
            icon={<StyledMoveToInboxIcon />}
            primary="Returns"
          />
        </CollapsibleListItem>

        <CollapsibleListItem
          open={productsOpen}
          handleClick={() => setProductsOpen(!productsOpen)}
          icon={<InventoryOutlined />}
          primary="Product"
        >
          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('products')}
            selected={activeItem === 'products'}
            icon={<Inventory2Outlined />}
            primary="Products"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('images')}
            selected={activeItem === 'images'}
            icon={<CollectionsOutlined />}
            primary="Images"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('faqs')}
            selected={activeItem === 'faqs'}
            icon={<HelpOutlineOutlined />}
            primary="FAQs"
          />

          <ActiveListItem
            sx={{ pl: 4 }}
            handleClick={() => handleItemClick('contacts')}
            selected={activeItem === 'contacts'}
            icon={<ContactsOutlined />}
            primary="Contacts"
          />

          <CollapsibleListItem
            open={categoriesOpen}
            handleClick={() => setCategoriesOpen(!categoriesOpen)}
            icon={<AllInboxOutlined />}
            primary="Category"
          >
            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('categories')}
              selected={activeItem === 'categories'}
              icon={<InboxOutlined />}
              primary="Categories"
            />

            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('subcategories')}
              selected={activeItem === 'subcategories'}
              icon={<WidgetsOutlined />}
              primary="Subcategories"
            />

            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('subsubcategories')}
              selected={activeItem === 'subsubcategories'}
              icon={<CategoryOutlined />}
              primary="SubSubcategories"
            />
          </CollapsibleListItem>

          <CollapsibleListItem
            open={addressesOpen}
            handleClick={() => setAddressesOpen(!addressesOpen)}
            icon={<ExploreOutlined />}
            primary="Address"
          >
            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('countries')}
              selected={activeItem === 'countries'}
              icon={<FlagOutlined />}
              primary="Countries"
            />

            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('cities')}
              selected={activeItem === 'cities'}
              icon={<ApartmentOutlined />}
              primary="Cities"
            />

            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('addresses')}
              selected={activeItem === 'addresses'}
              icon={<RoomOutlined />}
              primary="Addresses"
            />

            <ActiveListItem
              sx={{ pl: 6 }}
              handleClick={() => handleItemClick('suppliers')}
              selected={activeItem === 'suppliers'}
              icon={<PrecisionManufacturingOutlined />}
              primary="Suppliers"
            />
          </CollapsibleListItem>
        </CollapsibleListItem>
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