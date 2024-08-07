import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    AppBar, BrownButton, Drawer, ProfileButton, StyledDashboardIcon,
    StyledFavoriteIcon,
    StyledInboxIcon,
    StyledLogoutIcon,
    StyledPersonIcon
} from '../../assets/CustomComponents';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../context/AuthContext';
import theme from '../../theme';
import { mainListItems, secondaryListItems } from './listItems';

const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const { auth, isAdmin, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', backgroundColor: 'white' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ pr: '32px' }}>
                        <IconButton
                            edge="start"
                            color="black"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <div className="flex justify-between items-center top-0 left-0 right-0 z-50 mx-auto-xl px-16 mt-4 w-full">
                            <div className="flex items-center mb-5">
                                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <img src={logo} alt="Logo" className="w-60 h-11" />
                                </a>
                            </div>
                            <div className="flex items-center space-x-6">
                                <ul className="flex items-center space-x-6">
                                    {/* <li>
                                        <Link to="/" className="block py-2 px-3 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-brown-700 md:p-0">Home</Link>
                                    </li> 
                                    */}
                                </ul>
                                <div className="flex items-center space-x-4">
                                    {auth.accessToken ? (
                                        <>
                                            <div className="relative ml-4" ref={dropdownRef}>
                                                <ProfileButton onClick={handleDropdownToggle} className="rounded-sm">
                                                    <StyledPersonIcon />
                                                    {auth.username && (
                                                        <span className="ml-2 text-sm">
                                                            {auth.username}
                                                        </span>
                                                    )}
                                                </ProfileButton>
                                                {isDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white border  shadow-lg rounded-lg p-2">
                                                        {isAdmin() && (
                                                            <>
                                                                <Link to="/dashboard/users" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                                                                    <StyledDashboardIcon className="mr-2" />
                                                                    Dashboard
                                                                </Link>
                                                                <div className="border-t border-stone-200 mb-2"></div>
                                                            </>
                                                        )}
                                                        <Link to="/profile" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                                                            <StyledPersonIcon className="mr-2" />
                                                            Profile
                                                        </Link>
                                                        <Link to="/orders" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                                                            <StyledInboxIcon className="mr-2" />
                                                            Orders
                                                        </Link>
                                                        <Link to="/wishlist" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                                                            <StyledFavoriteIcon className="mr-2" />
                                                            Wishlist
                                                        </Link>
                                                        <div className="border-t border-stone-200 mb-2"></div>
                                                        <button onClick={handleLogout} className="flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left">
                                                            <StyledLogoutIcon className="mr-2" />
                                                            Log Out
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} className='mt-4'>
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
                        {mainListItems({ setCurrentView: () => { } })}
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
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DashboardLayout;
