import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ActiveListItemButton } from './CustomComponents';

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

  const handleUsersClick = () => {
    setUsersOpen(!usersOpen);
  };

  const handleProductsClick = () => {
    setProductsOpen(!productsOpen);
  };

  const handleCrudClick = () => {
    setCrudOpen(!crudOpen);
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleAddressesClick = () => {
    setAddressesOpen(!addressesOpen);
  };

  useEffect(() => {
    const path = window.location.pathname.split('/')[2]; // Get the third segment of the path
    if (path) {
      setActiveItem(path);
    } else {
      setActiveItem('users'); // Default to 'main' if no specific path
    }
  }, []);

  const handleItemClick = (view) => {
    setCurrentView(view);
    setActiveItem(view);
    navigate(`/dashboard/${view}`);
  };

  return (
    <React.Fragment>
      <ActiveListItemButton
        onClick={() => handleItemClick('main')}
        selected={activeItem === 'main'}>
        <ListItemIcon>
          <DashboardOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ActiveListItemButton>

      <ListItemButton onClick={handleCrudClick}>
        <ListItemIcon>
          <DashboardCustomizeOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="CRUDs" />
        {crudOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={crudOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton onClick={handleUsersClick}>
            <ListItemIcon>
              <PeopleOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="User" />
            {usersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={usersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ActiveListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleItemClick('users')}
                selected={activeItem === 'users'}
              >
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ActiveListItemButton>

              <ActiveListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleItemClick('reviews')}
                selected={activeItem === 'reviews'}
              >
                <ListItemIcon>
                  <StarHalfOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Reviews" />
              </ActiveListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={handleProductsClick}>
            <ListItemIcon>
              <InventoryOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Product" />
            {productsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={productsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ActiveListItemButton
                sx={{ pl: 4 }}
                onClick={() => handleItemClick('products')}
                selected={activeItem === 'products'}
              >
                <ListItemIcon>
                  <Inventory2OutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ActiveListItemButton>

              <ActiveListItemButton
                sx={{ pl: 4 }}
                onClick={handleCategoriesClick}
              >
                <ListItemIcon>
                  <AllInboxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Category" />
                {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
              </ActiveListItemButton>
              <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('categories')}
                    selected={activeItem === 'categories'}
                  >
                    <ListItemIcon>
                      <InboxOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Categories" />
                  </ActiveListItemButton>

                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('subcategories')}
                    selected={activeItem === 'subcategories'}
                  >
                    <ListItemIcon>
                      <WidgetsOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Subcategories" />
                  </ActiveListItemButton>
                </List>
              </Collapse>

              <ActiveListItemButton
                sx={{ pl: 4 }}
                onClick={handleAddressesClick}
              >
                <ListItemIcon>
                  <ExploreOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Address" />
                {addressesOpen ? <ExpandLess /> : <ExpandMore />}
              </ActiveListItemButton>
              <Collapse in={addressesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('countries')}
                    selected={activeItem === 'countries'}
                  >
                    <ListItemIcon>
                      <FlagOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Countries" />
                  </ActiveListItemButton>

                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('cities')}
                    selected={activeItem === 'cities'}
                  >
                    <ListItemIcon>
                      <ApartmentOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cities" />
                  </ActiveListItemButton>

                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('addresses')}
                    selected={activeItem === 'addresses'}
                  >
                    <ListItemIcon>
                      <RoomOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Addresses" />
                  </ActiveListItemButton>

                  <ActiveListItemButton
                    sx={{ pl: 6 }}
                    onClick={() => handleItemClick('suppliers')}
                    selected={activeItem === 'suppliers'}
                  >
                    <ListItemIcon>
                      <PrecisionManufacturingOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Suppliers" />
                  </ActiveListItemButton>
                </List>
              </Collapse>
            </List>
          </Collapse>
        </List>
      </Collapse>
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