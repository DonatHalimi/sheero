import { Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { EmptyState, Header, OrderDetailsSkeleton } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty-orders.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProfileSidebar from './ProfileSidebar';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusProgress = (status) => {
        switch (status) {
            case 'pending':
                return 11;
            case 'shipped':
                return 50;
            case 'delivered':
                return 100;
            default:
                return 10;
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-20">
                        <Header title='Order Details ' />

                        {loading ? (
                            <OrderDetailsSkeleton />
                        ) : order ? (
                            <>
                                {/* Progress Card */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <p className="font-semibold text-center text-lg">
                                            Order: #{order._id}
                                        </p>
                                        <p className="font-semilight mb-4 text-center text-gray-500 text-md">
                                            Order Date: {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <LinearProgress
                                            variant="determinate"
                                            value={getStatusProgress(order.status)}
                                            sx={{ height: 20, width: '50%', margin: 'auto', borderRadius: 1 }}
                                        />

                                        <div className="flex justify-between mt-4" style={{ width: '50%', margin: 'auto', marginTop: '4px' }}>
                                            <span className={`text-center ${order.status === 'pending' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Pending</span>
                                            <span className={`text-center ${order.status === 'shipped' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Shipped</span>
                                            <span className={`text-center ${order.status === 'delivered' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Delivered</span>
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
                                                                        src={`http://localhost:5000/${product.image}`}
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
                                                <TableHead>
                                                    <TableRow>
                                                        {/* Optional: You can keep this row empty or add headers as needed */}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {/* Subtotal */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
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
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            Shipping:
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">€2.00</Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Grand Total */}
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
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

                                {/* Address and Payment Method Table */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-white shadow-md rounded-lg p-6">
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Name:</span>
                                                                <span>{order.address?.name || 'Name not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Street:</span>
                                                                <span>{order.address?.street || 'Street not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>City:</span>
                                                                <span>{order.address?.city?.name || 'City not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Country:</span>
                                                                <span>{order.address?.country?.name || 'Country not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Zip Code:</span>
                                                                <span>{order.address?.city?.zipCode || 'Zip Code not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Phone Number:</span>
                                                                <span>{order.address?.phoneNumber || 'Phone number not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell component="th" scope="row" className="font-bold">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>Payment Method:</span>
                                                                <span>{order.paymentMethod || 'Payment method not provided'}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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
            </Box >
            <Footer />
        </>
    );
};

export default OrderDetails;
