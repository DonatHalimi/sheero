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
        const path = location.pathname.split('/')[2];
        setActiveItem(path || 'me');
    }, [location]);

    const handleItemClick = (view) => {
        setActiveItem(view);
        navigate(`/profile/${view}`);
    };

    const greetingTime = new Date().getHours() < 12 ? "morning" : (new Date().getHours() < 18 ? "afternoon" : "evening");

    return (
        <div className="absolute top-[234px] left-[320px] w-80 bg-white p-5 shadow-sm rounded-sm">
            <Typography variant="h5" gutterBottom className="!text-gray-800 !font-semilight">
                Good {greetingTime}, {auth.firstName}.
            </Typography>
            <span className='text-md'>Thank you for being part of sheero</span>
            <div className="border-t border-stone-200 mt-4 mb-2"></div>
            <List component="nav">
                <ActiveListItem
                    handleClick={() => handleItemClick('me')}
                    selected={activeItem === 'me'}
                    icon={<StyledPersonIcon />}
                    primary="Profile"
                />
                <ActiveListItem
                    handleClick={() => handleItemClick('address')}
                    selected={activeItem === 'address'}
                    icon={<HomeOutlined />}
                    primary="Address"
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
