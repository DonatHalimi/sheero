import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { EmptyState } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty-orders.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ProfileSidebar from './ProfileSidebar';

const Orders = () => {
    // TODO

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-20">
                        <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3">
                            <Typography variant="h5" className="!text-gray-800 !font-semilight">
                                Orders
                            </Typography>
                        </div>
                        {/* <div className="bg-white shadow-sm rounded-sm p-8"> */}
                        <EmptyState
                            imageSrc={emptyOrdersImage}
                            message="No orders found!"
                        />
                        {/* </div> */}
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default Orders;
