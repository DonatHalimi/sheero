import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomPagination, EmptyState, Header, OrderItemSkeleton } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty-orders.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';

const itemsPerPage = 5;

const Orders = () => {
    const { auth } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const axiosInstance = useAxios();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/orders/user/${auth.userId}`);
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching user orders:', error);
            setError('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const totalOrders = orders.length;
    const pageCount = Math.ceil(totalOrders / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return orders.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const renderProductImages = (products) => {
        return products.map(product => (
            <Link
                key={product.product._id}
                to={`/product/${product.product._id}`}
            >
                <img
                    key={product.product._id}
                    src={`http://localhost:5000/${product.product.image}`}
                    alt={product.product.name}
                    className="w-20 h-20 object-cover rounded cursor-pointer"
                />
            </Link>
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500 bg-stone-50 rounded-md px-1';
            case 'shipped':
                return 'text-blue-400 bg-stone-50 rounded-md px-1';
            case 'delivered':
                return 'text-green-500 bg-stone-50 rounded-md px-1';
            case 'cancelled':
                return 'text-red-500 bg-stone-50 rounded-md px-1';
            default:
                return 'text-gray-500 bg-stone-50 rounded-md px-1';
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-20">
                        <Header title='Orders' />

                        {loading ? (
                            <OrderItemSkeleton />
                        ) : error ? (
                            <div>{error}</div>
                        ) : orders.length === 0 ? (
                            <EmptyState
                                imageSrc={emptyOrdersImage}
                                message="No orders found!"
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    {getCurrentPageItems().map(order => (
                                        <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
                                            <Link to={`/profile/orders/${order._id}`}>
                                                <div className="flex justify-between text-sm capitalize mb-4">
                                                    <div className="flex items-center">
                                                        <p>#{order._id}</p>
                                                        <span className="mx-1">&#x2022;</span>
                                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        <span className="mx-1">&#x2022;</span>
                                                        <p className={getStatusColor(order.status)}>{order.status}</p>
                                                    </div>
                                                    <p className="font-semibold">€{order.totalAmount.toFixed(2)}</p>
                                                </div>

                                                <div className="mt-4">
                                                    <div className="flex space-x-2">
                                                        {renderProductImages(order.products)}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
                                    <CustomPagination
                                        count={pageCount}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        size="large"
                                        sx={{
                                            position: 'relative',
                                            bottom: '10px',
                                            '& .MuiPagination-ul': {
                                                justifyContent: 'flex-start',
                                            },
                                        }}
                                    />
                                </Box>
                            </>
                        )}
                    </div>
                </main>
            </Box>

            <div className='mb-32' />
            <Footer />
        </>
    );
};

export default Orders;