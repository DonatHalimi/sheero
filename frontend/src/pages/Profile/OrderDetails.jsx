import { Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { EmptyState, formatDate, Header, OrderDetailsSkeleton } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty-orders.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { getImageUrl } from '../../config';
import ProfileSidebar from './ProfileSidebar';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            if (response.data.success) {
                setOrder(response.data.data);
            } else {
                console.log('Order not found or access denied.');
            }
        } catch (error) {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                console.log('Access denied. You are not authorized to view this order.');
                navigate('/');
            } else {
                console.error('Error fetching order details:', error);
                setError('An error occurred while fetching the order details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusProgress = (status) => {
        switch (status) {
            case 'pending':
                return 16;
            case 'shipped':
                return 57;
            case 'delivered':
                return 100;
            case 'canceled':
                return 0;
            default:
                return 0;
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-5xl relative mb-16" style={{ paddingLeft: '77px' }}>
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-20">
                        <Header title="Order:" orderId={orderId} />

                        {loading ? (
                            <OrderDetailsSkeleton />
                        ) : order ? (
                            <>
                                {/* Progress Card */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <p className="font-semibold text-center text-lg mb-1">
                                            Order Status
                                        </p>
                                        <p className="font-semilight text-center text-gray-500 text-md">
                                            Order Date: {formatDate(order.createdAt)}
                                        </p>
                                        {order.status === 'delivered' ? (
                                            <p className="font-semilight mb-4 text-center text-gray-500 text-md">
                                                Arrival Date: {formatDate(order.arrivalDateRange.start)}
                                            </p>
                                        ) : (
                                            <p className="font-semilight mb-4 text-center text-gray-500 text-md">
                                                Arrival Date: {formatDate(order.arrivalDateRange.start)} - {formatDate(order.arrivalDateRange.end)}
                                            </p>
                                        )}
                                        <LinearProgress
                                            variant="determinate"
                                            value={getStatusProgress(order.status)}
                                            sx={{ height: 20, width: '50%', margin: 'auto', borderRadius: 1 }}
                                        />

                                        <div className="flex justify-between mt-4" style={{ width: '50%', margin: 'auto', marginTop: '4px' }}>
                                            {order.status === 'canceled' ? (
                                                <span className="text-center font-semibold bg-stone-100 rounded-md px-1">Canceled</span>
                                            ) : (
                                                <>
                                                    <span className={`text-center ${order.status === 'pending' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>
                                                        Pending
                                                    </span>
                                                    <span className={`text-center ${order.status === 'shipped' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>
                                                        Shipped
                                                    </span>
                                                    <span className={`text-center ${order.status === 'delivered' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>
                                                        Delivered
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Products Table */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            {order.products.length > 1 ? 'Products' : 'Product'}
                                                        </TableCell>
                                                        <TableCell align="right">Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {order.products.map(({ product, quantity, price }) => (
                                                        <TableRow key={product._id}>
                                                            <TableCell component="th" scope="row">
                                                                <Link to={`/product/${product._id}`} className="flex items-center">
                                                                    <img
                                                                        src={getImageUrl(`/${product.image}`)}
                                                                        alt={product.name}
                                                                        className="w-20 h-20 object-cover rounded mr-2"
                                                                    />
                                                                    <div>
                                                                        <div className='hover:underline'>{product.name}</div>
                                                                        <div className="text-sm text-gray-500">Quantity: {quantity}</div>
                                                                    </div>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                €{price.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>

                                {/* Total Amount Card */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {/* Subtotal */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="!font-semibold">
                                                            Subtotal:
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">
                                                                €{order.products.reduce((total, { quantity, price }) => total + (price * quantity), 0).toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Shipping Cost */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="!font-semibold">
                                                            Shipping:
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">€2.00</Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Grand Total */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="!font-semibold">
                                                            Grand Total:
                                                        </TableCell>
                                                        <TableCell align="right" className="font-bold">
                                                            <Typography variant="body2">
                                                                €{order.totalAmount.toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <Typography variant="h6" gutterBottom>
                                                    Shipping Address
                                                </Typography>
                                                <TableContainer>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Name:</span>
                                                                        <span>{order.address?.name || 'Name not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Country:</span>
                                                                        <span>{order.address?.country?.name || 'Country not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">City:</span>
                                                                        <span>{order.address?.city?.name || 'City not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Zip Code:</span>
                                                                        <span>{order.address?.city?.zipCode || 'Zip Code not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Street:</span>
                                                                        <span>{order.address?.street || 'Street not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Phone Number:</span>
                                                                        <span>{order.address?.phoneNumber || 'Phone number not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Comment:</span>
                                                                        <span>{order.address?.comment || 'No comment provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>

                                            {/* Payment Information on the left */}
                                            <div>
                                                <Typography variant="h6" gutterBottom>
                                                    Payment Information
                                                </Typography>
                                                <TableContainer>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Payment Method:</span>
                                                                        <span>{order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'Payment method not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold">Payment Status:</span>
                                                                        <span>{order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Payment status not provided'}</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                imageSrc={emptyOrdersImage}
                                message="No orders found!"
                            />
                        )}
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default OrderDetails;