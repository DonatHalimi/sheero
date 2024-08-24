import { Tooltip } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BrownButton,
    OutlinedBrownButton,
    ProfileButton,
    RoundIconButton,
    StyledDashboardIcon,
    StyledFavoriteIcon,
    StyledInboxIcon,
    StyledLogoutIcon,
    StyledPersonIcon,
    StyledShoppingCartIcon,
} from '../assets/CustomComponents';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import CategoryNavbar from './CategoryNavbar';

const Navbar = () => {
    const { auth, isAdmin, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const NavbarDropdown = () => (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg p-2" ref={dropdownRef}>
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
    );

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white p-4">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                    <Tooltip title="Home" arrow>
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="Logo" className="w-60 h-11" />
                        </Link>
                    </Tooltip>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4">
                            {auth.accessToken ? (
                                <>
                                    <div className="relative">
                                        <Tooltip title="Profile" arrow>
                                            <ProfileButton onClick={handleDropdownToggle} className="flex items-center space-x-2 rounded-sm">
                                                <StyledPersonIcon />
                                                {auth.username && <span className="ml-2 text-sm">{auth.username}</span>}
                                            </ProfileButton>

                                            {isDropdownOpen && <NavbarDropdown />}
                                        </Tooltip>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <Link to='/wishlist'>
                                            <RoundIconButton><StyledFavoriteIcon /></RoundIconButton>
                                        </Link>
                                        <Link to='/cart'>
                                            <RoundIconButton><StyledShoppingCartIcon /></RoundIconButton>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <BrownButton variant="contained" color="primary">Login</BrownButton>
                                    </Link>
                                    <Link to='/register'>
                                        <OutlinedBrownButton>Register</OutlinedBrownButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <div className='pt-20 bg-white'>
                <CategoryNavbar />
            </div>
        </>
    );
};

export default Navbar;