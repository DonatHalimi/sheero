import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import emptyOrdersImage from '../../assets/img/empty/orders.png';
import { LoadingOrderDetails } from '../../components/custom/LoadingSkeletons';
import { EmptyState } from '../../components/custom/MUI';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import { formatDate, formatPrice } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import ReturnModal from '../../components/Product/Modals/ReturnModal';
import { generateOrderPDF } from '../../components/Product/Utils/DataExport';
import Footer from '../../components/Utils/Footer';
import { getOrderDetailsService } from '../../services/orderService';
import { getImageUrl } from '../../utils/config/config';

const OrderDetails = () => {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const openReturnModal = () => setIsReturnModalOpen(true);
    const [loading, setLoading] = useState(true);
    const isOrderDelivered = order && order.status === 'delivered';

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await getOrderDetailsService(orderId);
            setOrder(response.data.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusProgress = (status) => {
        switch (status) {
            case 'pending':
                return 13;
            case 'processed':
                return 43;
            case 'shipped':
                return 70.5;
            case 'delivered':
                return 100;
            case 'canceled':
                return 0;
            default:
                return 0;
        }
    };

    const handleDownloadOrder = () => {
        if (order) {
            generateOrderPDF(order);
        }
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Order:"
                    orderId={orderId}
                    isOrderDetails={isOrderDelivered}
                    openReturnModal={openReturnModal}
                    onDownloadOrder={handleDownloadOrder}
                />

                {loading ? (
                    <LoadingOrderDetails />
                ) : order ? (
                    <>
                        {/* Progress Card */}
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white shadow rounded-md p-6">
                                <p className="font-semibold text-center text-lg mb-1">
                                    Order Status
                                </p>
                                <p className="font-semilight text-center text-gray-500 text-md">
                                    Order Date: {formatDate(order.createdAt)}
                                </p>
                                {order.status === 'canceled' ? (
                                    <div className="font-semilight mb-3 text-center text-gray-500 text-md" />
                                ) : (
                                    order.status === 'delivered' ? (
                                        <p className="font-semilight mb-3 text-center text-gray-500 text-md">
                                            Arrival Date: {formatDate(order.arrivalDateRange.start)}
                                        </p>
                                    ) : (
                                        <p className="font-semilight mb-3 text-center text-gray-500 text-md">
                                            Arrival Date: {formatDate(order.arrivalDateRange.start)} - {formatDate(order.arrivalDateRange.end)}
                                        </p>
                                    )
                                )}
                                <LinearProgress
                                    variant="determinate"
                                    value={getStatusProgress(order.status)}
                                    sx={{
                                        height: 20,
                                        width: { xs: '80%', sm: '70%', md: '60%' },
                                        margin: 'auto',
                                        borderRadius: 1
                                    }}
                                />

                                <div className="flex justify-between mt-4" style={{ width: '60%', margin: 'auto', marginTop: '4px' }}>
                                    {order.status === 'canceled' ? (
                                        <span className="text-center font-semibold bg-stone-100 rounded-md px-1">Canceled</span>
                                    ) : (
                                        <>
                                            <span className={`text - center ${order.status === 'pending' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''} `}>Pending</span>
                                            <span className={`text-center ${order.status === 'processed' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''} `}>Processed</span>
                                            <span className={`text - center ${order.status === 'shipped' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''} `}>Shipped</span>
                                            <span className={`text - center ${order.status === 'delivered' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''} `}>Delivered</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white shadow rounded-md p-6">
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
                                                    <TableCell component="th" scope="row" className='w-10/12'>
                                                        <Link to={`/${product.slug}`} className="flex items-center">
                                                            <img
                                                                src={getImageUrl(product.image)}
                                                                alt={product.name}
                                                                className="w-16 h-16 object-contain rounded mr-4"
                                                            />
                                                            <div>
                                                                <div className='hover:underline'>{product.name}</div>
                                                                <div className="text-sm text-gray-500">Quantity: {quantity}</div>
                                                            </div>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        € {formatPrice(price)}
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
                            <div className="bg-white shadow rounded p-6">
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
                                                        € {formatPrice(order.products.reduce((total, { quantity, price }) => total + (price * quantity), 0))}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            {/* Shipping Cost */}
                                            <TableRow>
                                                <TableCell component="th" scope="row" className="!font-semibold">
                                                    Shipping:
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">€ 2.00</Typography>
                                                </TableCell>
                                            </TableRow>

                                            {/* Grand Total */}
                                            <TableRow>
                                                <TableCell component="th" scope="row" className="!font-semibold">
                                                    Grand Total:
                                                </TableCell>
                                                <TableCell align="right" className="font-bold">
                                                    <Typography variant="body2">
                                                        € {formatPrice(order.totalAmount)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white shadow rounded-md p-6">
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
                                                                <span>{order.address?.comment || 'N/A'}</span>
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
                    <EmptyState imageSrc={emptyOrdersImage} context='orders' />
                )}
            </ProfileLayout>
            <ReturnModal
                open={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                products={order ? order.products : []}
            />
            <Footer />
        </>
    );
};

export default OrderDetails;