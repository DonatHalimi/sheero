import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  DashboardCustomizeOutlined,
  PeopleOutline,
  PersonOutline,
  StarHalf,
  InventoryOutlined,
  Inventory2Outlined,
  ImageOutlined,
  AllInboxOutlined,
  InboxOutlined,
  WidgetsOutlined,
  ExploreOutlined,
  FlagOutlined,
  ApartmentOutlined,
  RoomOutlined,
  PrecisionManufacturingOutlined,
} from '@mui/icons-material';
import { CollapsibleListItem, ActiveListItem } from './CustomComponents';

/**
 * Renders the main list items for the CRUD dashboard.
 *
 * @param {Object} props - The properties for the component.
 * @param {Function} props.setCurrentView - The function to set the current view.
 * @return {React.ReactNode} The rendered main list items.
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
    <React.Fragment>
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
            handleClick={() => handleItemClick('reviews')}
            selected={activeItem === 'reviews'}
            icon={<StarHalf />}
            primary="Reviews"
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
            icon={<ImageOutlined />}
            primary="Images"
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
    </React.Fragment>
  );
};

export const secondaryListItems = (
  <React.Fragment>
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
  </React.Fragment>
);