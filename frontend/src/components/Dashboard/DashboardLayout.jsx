import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { DashboardCollapse, DashboardNavbar, Drawer, getLocalStorageState, saveLocalStorageState } from '../../assets/CustomComponents';
import { dashboardBoxSx, dashboardDrawerSx } from '../../assets/sx';
import { logoutUser, selectIsAdmin, selectIsContentManager, selectIsOrderManager, selectIsProductManager } from '../../store/actions/authActions';
import { DashboardThemeProvider } from '../../utils/ThemeContext';
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
 * - `isOrderManager`: a boolean indicating whether the user is an
 *   order manager or not.
 * - `isContentManager`: a boolean indicating whether the user is a
 *   content manager or not.
 *
 * The component returns a JSX element that renders the layout.
 */
const DashboardLayout = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const isAdmin = useSelector(selectIsAdmin);
    const isOrderManager = useSelector(selectIsOrderManager);
    const isContentManager = useSelector(selectIsContentManager);
    const isProductManager = useSelector(selectIsProductManager);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(() => getLocalStorageState('openSidebar', true));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDrawer = () => {
        const newState = !open;
        setOpen(newState);
        saveLocalStorageState('openSidebar', newState);
    };

    const handleProfileDropdownToggle = () => setIsDropdownOpen((prev) => !prev);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === '[') {
                toggleDrawer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [open]);

    return (
        <DashboardThemeProvider>
            <Box sx={{ backgroundColor: (theme) => theme.palette.background.default }} className="dashboard-container flex h-screen overflow-hidden">
                <DashboardNavbar
                    open={open}
                    toggleDrawer={toggleDrawer}
                    auth={isAuthenticated}
                    isDropdownOpen={isDropdownOpen}
                    handleProfileDropdownToggle={handleProfileDropdownToggle}
                    handleLogout={handleLogout}
                    isAdmin={isAdmin}
                    isOrderManager={isOrderManager}
                    isContentManager={isContentManager}
                    isProductManager={isProductManager}
                />
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={dashboardDrawerSx(open)}
                >
                    <DashboardCollapse toggleDrawer={toggleDrawer} />
                    <Divider />
                    <div className="custom-scrollbar">
                        <List component="nav">
                            {mainListItems({ setCurrentView: () => { }, collapsed: !open })}
                            {secondaryListItems}
                        </List>
                    </div>
                </Drawer>
                <Box
                    component="main"
                    role="main"
                    sx={dashboardBoxSx}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </DashboardThemeProvider>
    );
};

export default DashboardLayout;