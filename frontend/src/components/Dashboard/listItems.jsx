import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import * as React from 'react';
import { ActiveListItemButton } from './CustomComponents';

export const mainListItems = ({ setCurrentView }) => {
  const [crudOpen, setCrudOpen] = React.useState(true);
  const [addressesOpen, setAddressesOpen] = React.useState(true);
  const [categoriesOpen, setCategoriesOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('users');

  const handleCrudClick = () => {
    setCrudOpen(!crudOpen);
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleAddressesClick = () => {
    setAddressesOpen(!addressesOpen);
  };

  const handleItemClick = (view) => {
    setCurrentView(view);
    setActiveItem(view);
  };

  return (
    <React.Fragment>
      <ActiveListItemButton
        onClick={() => handleItemClick('dashboard')}
        selected={activeItem === 'dashboard'}>
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
              <ContactMailOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Addresses" />
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
            </List>
          </Collapse>
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
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
    </ListItemButton>
  </React.Fragment>
);