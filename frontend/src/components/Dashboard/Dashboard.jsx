import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AppBar, BrownButton, Drawer } from '../Dashboard/CustomComponents';
import { AuthContext } from '../../context/AuthContext';
import AddressesPage from '../../pages/Dashboard/AddressesPage';
import CategoriesPage from '../../pages/Dashboard/CategoriesPage';
import CitiesPage from '../../pages/Dashboard/CitiesPage';
import CountriesPage from '../../pages/Dashboard/CountriesPage';
import DashboardContent from '../../pages/Dashboard/DashboardContent';
import ProductsPage from '../../pages/Dashboard/ProductsPage';
import SubcategoriesPage from '../../pages/Dashboard/SubcategoriesPage';
import UsersPage from '../../pages/Dashboard/UsersPage';
import { mainListItems, secondaryListItems } from './listItems';

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [currentView, setCurrentView] = React.useState('users');
  const { auth, logout } = useContext(AuthContext);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardContent />;
      case 'countries':
        return <CountriesPage />;
      case 'cities':
        return <CitiesPage />;
      case 'addresses':
        return <AddressesPage />;
      case 'products':
        return <ProductsPage />;
      case 'users':
        return <UsersPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'subcategories':
        return <SubcategoriesPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="black"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <div className="flex justify-between items-center mx-auto-xl px-4 w-full">
            <div className="flex items-center mb-5">
              <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src={logo} alt="Logo" className="w-60 h-11" />
              </a>
            </div>
            <div className="flex items-center space-x-6">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link to="/" className="block py-2 px-3 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-brown-700 md:p-0">Home</Link>
                </li>
              </ul>
              <div className="flex items-center space-x-4">
                {auth.accessToken ? (
                  <>
                    <BrownButton variant="contained" color="primary" onClick={logout}>Log Out</BrownButton>
                  </>
                ) : (
                  <>
                    <Link to='/login'>
                      <BrownButton variant="contained" color="primary">Login</BrownButton>
                    </Link>
                    <Link to='/register'>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'black',
                          borderColor: '#83776B',
                          '&:hover': {
                            borderColor: '#5b504b',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems({ setCurrentView })}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}