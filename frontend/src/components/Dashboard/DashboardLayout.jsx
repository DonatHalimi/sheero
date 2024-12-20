import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { DashboardCollapse, DashboardNavbar, Drawer } from '../../assets/CustomComponents';
import { logoutUser, selectIsAdmin } from '../../store/actions/authActions';
import theme from '../../theme';
import { mainListItems, secondaryListItems } from './listItems';

/**
 * A layout component for the dashboard pages. It provides a
 * navigation bar on the left and a main content area for the
 * pages. It also handles the user authentication and provides
 * a logout button in the navigation bar.
 *
 * The component expects the following props:
 *
 * - `isAuthenticated`: a boolean indicating whether the user is
 *   authenticated or not.
 * - `isAdmin`: a boolean indicating whether the user is an admin
 *   or not.
 *
 * The component returns a JSX element that renders the layout.
 */
const DashboardLayout = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const isAdmin = useSelector(selectIsAdmin);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleProfileDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsDropdownOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', bgcolor: '#F5F5F5' }}>

                <DashboardNavbar
                    open={open}
                    toggleDrawer={toggleDrawer}
                    auth={isAuthenticated}
                    isDropdownOpen={isDropdownOpen}
                    handleProfileDropdownToggle={handleProfileDropdownToggle}
                    handleLogout={handleLogout}
                    isAdmin={isAdmin}
                />
                <Drawer variant="permanent" open={open}>
                    <DashboardCollapse toggleDrawer={toggleDrawer} />

                    <Divider />

                    <List component="nav">
                        {mainListItems({ setCurrentView: () => { } })}
                        {/* <Divider sx={{ my: 1 }} /> */}
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
                        height: '105vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider >
    );
};

export default DashboardLayout;