import { HomeOutlined, StarBorderOutlined } from '@mui/icons-material';
import { Divider, List, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ActiveListItem,
    CustomAddressIcon,
    CustomOrdersIcon,
    CustomProfileIcon,
    CustomReturnIcon,
    CustomReviewsIcon,
    CustomWishlistIcon,
    SidebarLayout,
    StyledFavoriteIcon,
    StyledInboxIcon,
    StyledMoveToInboxIcon,
    StyledPersonIcon
} from '../../assets/CustomComponents';

const ProfileSidebar = () => {
    const { user, loading } = useSelector((state) => state.auth);

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
    const greetingHeader = `Good ${greetingTime}, ${user?.firstName || 'User'}.`;
    const greetingMessage = 'Thank you for being part of sheero';

    const items = [
        { key: 'me', label: 'Profile', icon: <CustomProfileIcon isActive={true} />, inactiveIcon: <StyledPersonIcon />, },
        { key: 'address', label: 'Address', icon: <CustomAddressIcon isActive={true} />, inactiveIcon: <HomeOutlined />, },
        { key: 'orders', label: 'Orders', icon: <CustomOrdersIcon isActive={true} />, inactiveIcon: <StyledInboxIcon />, },
        { key: 'returns', label: 'Returns', icon: <CustomReturnIcon isActive={true} />, inactiveIcon: <StyledMoveToInboxIcon />, },
        { key: 'wishlist', label: 'Wishlist', icon: <CustomWishlistIcon isActive={true} />, inactiveIcon: <StyledFavoriteIcon />, },
        { key: 'reviews', label: 'Reviews', icon: <CustomReviewsIcon isActive={true} />, inactiveIcon: <StarBorderOutlined />, },
    ];

    return (
        <SidebarLayout>
            {loading ? (
                <LoadingProfile />
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className="!text-gray-800 !font-semilight">
                        {greetingHeader}
                    </Typography>
                    <span className="text-md">{greetingMessage}</span>
                </>
            )}
            <Divider className='!mt-4 !mb-2' />
            <List component="nav">
                {items.map(({ key, label, icon, inactiveIcon }) => (
                    <ActiveListItem
                        key={key}
                        handleClick={() => handleItemClick(key)}
                        selected={activeItem === key}
                        icon={activeItem === key ? icon : inactiveIcon}
                        primary={label}
                    />
                ))}
            </List>
        </SidebarLayout>
    );
};

export default ProfileSidebar;