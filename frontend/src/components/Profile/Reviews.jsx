import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import Footer from '../Footer';
import Navbar from '../Navbar';
import ReviewItem from '../Product/ReviewItem';
import ProfileSidebar from './ProfileSidebar';

const Reviews = () => {
    const { auth } = useContext(AuthContext);
    const userId = auth?.userId;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container mx-auto max-w-6xl mt-20 mb-20">
                        <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3">
                            <Typography variant="h5" className="!text-gray-800 !font-semilight">
                                Reviews
                            </Typography>
                        </div>
                        <div className="rounded-sm mb-2">
                            {userId && auth.accessToken ? (
                                <ReviewItem userId={userId} />
                            ) : (
                                <Typography variant="body1">Please log in to view your reviews.</Typography>
                            )}
                        </div>
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default Reviews;