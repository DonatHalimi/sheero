import { HomeOutlined, StarBorderOutlined } from '@mui/icons-material';
import { List, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActiveListItem, SidebarLayout, StyledFavoriteIcon, StyledInboxIcon, StyledPersonIcon } from '../../assets/CustomComponents';
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
                const userData = response.data;
                setFirstName(userData.firstName);
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

    return (
        <SidebarLayout>
            {loading ? (
                <>
                    <Skeleton variant="text" width={250} height={40} />
                    <Skeleton variant="text" width={265} height={30} />
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className="!text-gray-800 !font-semilight">
                        Good {greetingTime}, {firstName}.
                    </Typography>
                    <span className='text-md'>Thank you for being part of sheero</span>
                </>
            )}
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
        </SidebarLayout>
    );
};

export default ProfileSidebar;