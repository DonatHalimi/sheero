import { HomeOutlined, StarBorderOutlined } from '@mui/icons-material';
import { List, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    ActiveListItem,
    CustomAddressIcon,
    CustomOrdersIcon,
    CustomProfileIcon,
    CustomReviewsIcon,
    CustomWishlistIcon,
    LoadingProfile,
    SidebarLayout,
    StyledFavoriteIcon,
    StyledInboxIcon,
    StyledPersonIcon
} from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';

const ProfileSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/me');
                setFirstName(response.data.firstName);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const path = location.pathname.split('/')[2];
        setActiveItem(path || 'me');
    }, [location]);

    const handleItemClick = (view) => {
        setActiveItem(view);
        navigate(`/profile/${view}`);
    };

    const greetingTime = new Date().getHours() < 12 ? "morning" : (new Date().getHours() < 18 ? "afternoon" : "evening");
    const greetingH = `Good ${greetingTime}, ${firstName}.`;
    const greetingM = 'Thank you for being part of sheero';

    const items = [
        { key: 'me', label: 'Profile', icon: <CustomProfileIcon isActive={true} />, inactiveIcon: <StyledPersonIcon />, },
        { key: 'address', label: 'Address', icon: <CustomAddressIcon isActive={true} />, inactiveIcon: <HomeOutlined />, },
        { key: 'orders', label: 'Orders', icon: <CustomOrdersIcon isActive={true} />, inactiveIcon: <StyledInboxIcon />, },
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
                        {greetingH}
                    </Typography>
                    <span className="text-md">{greetingM}</span>
                </>
            )}
            <div className="border-t border-stone-200 mt-4 mb-2" />
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