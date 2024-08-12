import { HomeOutlined, StarBorderOutlined } from '@mui/icons-material';
import { List, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActiveListItem, StyledFavoriteIcon, StyledInboxIcon, StyledPersonIcon } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';

const ProfileSidebar = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        setActiveItem(path || 'profile');
    }, [location]);

    const handleItemClick = (view) => {
        setActiveItem(view);
        navigate(`/${view}`);
    };

    return (
        <div className="relative top-[96px] left-0 w-430 h-full bg-white p-5 shadow-lg rounded-sm">
            <Typography variant="h6" gutterBottom>
                Hello, {auth.username}
            </Typography>
            <span className='text-md'>Thank you for being part of sheero</span>
            <div className="border-t border-stone-200 mt-4 mb-2"></div>
            <List component="nav">
                <ActiveListItem
                    handleClick={() => handleItemClick('profile')}
                    selected={activeItem === 'profile'}
                    icon={<StyledPersonIcon />}
                    primary="Profile"
                />
                <ActiveListItem
                    handleClick={() => handleItemClick('addresses')}
                    selected={activeItem === 'addresses'}
                    icon={<HomeOutlined />}
                    primary="Addresses"
                />
                <ActiveListItem
                    handleClick={() => handleItemClick('orders')}
                    selected={activeItem === 'orders'}
                    icon={<StyledInboxIcon />}
                    primary="Orders"
                />
                <ActiveListItem
                    handleClick={() => handleItemClick('wishlist')}
                    selected={activeItem === 'wishlist'}
                    icon={<StyledFavoriteIcon />}
                    primary="Wishlist"
                />
                <ActiveListItem
                    handleClick={() => handleItemClick('reviews')}
                    selected={activeItem === 'reviews'}
                    icon={<StarBorderOutlined />}
                    primary="Reviews"
                />
            </List>
        </div>
    );
};

export default ProfileSidebar;
