import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardCollapse, DashboardNavbar, Drawer } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';
import theme from '../../theme';
import { mainListItems, secondaryListItems } from './listItems';

/**
 * A functional component representing the layout of the dashboard.
 * It handles the state of the drawer, dropdown, and logout functionality.
 * It also renders the necessary components for the dashboard layout.
 *
 * @return {JSX.Element} The JSX element representing the dashboard layout.
 */
const DashboardLayout = () => {
    const [open, setOpen] = useState(true);
    const { auth, isAdmin, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleProfileDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', bgcolor: '#F5F5F5' }}>

                <DashboardNavbar
                    open={open}
                    toggleDrawer={toggleDrawer}
                    auth={auth}
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
