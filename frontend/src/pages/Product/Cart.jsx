import { DeleteOutline } from '@mui/icons-material';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckoutButton, CustomDeleteModal, EmptyState, LoadingCart, RoundIconButton, truncateText } from '../../assets/CustomComponents';
import emptyCartImage from '../../assets/img/empty-cart.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import PaymentModal from '../../components/Product/PaymentModal';
import { getImageUrl } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
    const [cart, setCart] = useState({ items: [] });
    const [address, setAddress] = useState(null);

    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const axiosInstance = useAxios();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await axiosInstance.get('/cart')
                setCart(data);
            } catch (error) {
                console.error('Failed to fetch cart:', error?.response?.data?.message || error.message);
                setCart({ items: [] });
            } finally {
                setLoading(false);
            }
        };
        window.scrollTo(0, 0);
        fetchCart();
    }, [auth.accessToken]);

    const updateQuantity = async (productId, quantityChange) => {
        try {
            const { data } = await axiosInstance.put(`/cart/quantity/update`,
                { productId, quantityChange },
            );
            setCart(data);
        } catch (error) {
            console.error('Failed to update quantity:', error?.response?.data?.message || error.message);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const { data } = await axiosInstance.delete(`/cart/remove`, {
                data: { productId }
            });
            setCart(data);
        } catch (error) {
            console.error('Failed to remove product from cart:', error?.response?.data?.message || error.message);
        }
    };

    const handleClearCart = async () => {
        try {
            const { data } = await axiosInstance.delete('/cart/clear');
            setCart(data);
        } catch (error) {
            console.error('Failed to clear cart:', error?.response?.data?.message || error.message);
        }
        setOpenModal(false);
    };

    useEffect(() => {
        if (auth.userId) {
            fetchAddress();
        }
    }, [auth.userId]);

    const fetchAddress = async () => {
        try {
            const response = await axiosInstance.get(`/addresses/user/${auth.userId}`);
            setAddress(response.data);
        } catch (error) {
            console.error('Error fetching address:', error.message);
        }
    };

    const handleStripePayment = async () => {
        if (!address) {
            toast.warn("No address found. Click here to add one!", {
                onClick: () => navigate('/profile/address'),
            });
            return;
        }

        try {
            const { data } = await axiosInstance.post('/orders/payment/stripe', {
                productIds: cart.items.map(item => item.product._id),
                addressId: address._id,
                userId: auth.userId,
                email: auth.email
            });

            await axiosInstance.delete('/cart/clear');

            setShowPaymentModal(false);

            window.location.href = data.url;
        } catch (error) {
            console.error('Error during Stripe checkout:', error.message);
            toast.error("Failed to initiate checkout. Please try again.");
        }
    };

    const handleShowModal = () => {
        setShowPaymentModal(true);
    };

    const handleCashPayment = async () => {
        if (!address) {
            toast.warn("No address found. Click here to add one!", {
                onClick: () => navigate('/profile/address'),
            });
            return;
        }

        try {
            const { data } = await axiosInstance.post('/orders/payment/cash', {
                productIds: cart.items.map(item => item.product._id),
                addressId: address._id,
                userId: auth.userId,
                email: auth.email
            });

            await axiosInstance.delete('/cart/clear');

            toast.success(data.message || "Order placed successfully. Please pay with cash upon delivery.");
            setShowPaymentModal(false);
            navigate('/profile/orders');
        } catch (error) {
            console.error('Error during cash payment:', error.message);
            toast.error("Failed to place the order. Please try again.");
            setShowPaymentModal(false);
        }
    };

    const handleProductClick = (productId) => navigate(`/product/${productId}`);

    if (loading) return <LoadingCart />;

    const calculateTotalPrice = () =>
        (cart?.items || []).reduce((total, item) => total + item.quantity * (item.product.salePrice || item.product.price), 0);

    const shippingCost = 2;
    const subtotal = calculateTotalPrice();
    const total = subtotal + shippingCost;

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-24 py-2 mb-16 bg-gray-50 mt-10 flex">
                <div className="flex-1">
                    <h1 className="text-2xl font-semilight mb-4">Cart</h1>
                    {(cart?.items?.length > 0) ? (
                        <>
                            <TableContainer component={Paper} className="bg-white">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="center">Total</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Clear cart" arrow placement="top">
                                                    <RoundIconButton onClick={() => setOpenModal(true)} className="cursor-pointer">
                                                        <DeleteOutline color="primary" />
                                                    </RoundIconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.items.map(item => (
                                            <TableRow key={item.product._id}>
                                                <TableCell component="th" scope="row">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={getImageUrl(`/${item.product.image}`)}
                                                            alt={item.product.name}
                                                            className="w-20 h-20 object-cover cursor-pointer rounded mr-4"
                                                            onClick={() => handleProductClick(item.product._id)}
                                                        />
                                                        <div>
                                                            <h2
                                                                className="text-base font-normal cursor-pointer hover:underline"
                                                                onClick={() => handleProductClick(item.product._id)}
                                                            >
                                                                {truncateText(item.product.name, 25)}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.product.salePrice ? (
                                                        <>
                                                            <span className="text-lg font-semibold">{item.product.salePrice.toFixed(2)} €</span>
                                                            <br />
                                                            <span className="text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-1">
                                                                You save {(item.product.price - item.product.salePrice).toFixed(2)} €
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className='text-lg font-semibold'>{item.product.price.toFixed(2)} €</span>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            className="border rounded-sm px-3 py-1"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-1 border">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            disabled={item.quantity >= item.product.inventoryCount}
                                                            className={`border rounded-sm px-3 py-1 ${item.quantity >= item.product.inventoryCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <h2 className="text-base font-semibold">
                                                        {(item.quantity * (item.product.salePrice || item.product.price)).toFixed(2)} €
                                                    </h2>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <RoundIconButton onClick={() => handleRemove(item.product._id)}>
                                                        <DeleteOutline color="primary" />
                                                    </RoundIconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (
                        <EmptyState imageSrc={emptyCartImage} message="Your cart is empty!" />
                    )}
                    <CustomDeleteModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onDelete={handleClearCart}
                        title="Clear Cart"
                        message="Are you sure you want to clear the cart?"
                    />
                </div>

                {/* Cart summary */}
                {cart?.items?.length > 0 && (
                    <div className="ml-6 w-80 mt-12">
                        <Paper className="p-4">
                            <h2 className="text-xl font-semibold mb-2">Total of Cart</h2>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell align="right">{subtotal.toFixed(2)} €</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Shipping</TableCell>
                                        <TableCell align="right">2.00 €</TableCell>
                                    </TableRow>
                                    {cart.items.some(item => item.product.salePrice) && (
                                        <TableRow>
                                            <TableCell>Including Sale</TableCell>
                                            <TableCell align="right">
                                                {`-${cart.items.reduce((total, item) => {
                                                    if (item.product.salePrice) {
                                                        return total + (item.product.price - item.product.salePrice) * item.quantity;
                                                    }
                                                    return total;
                                                }, 0).toFixed(2)} €`}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell>Total</TableCell>
                                        <TableCell align="right" className="font-bold">
                                            {(subtotal + 2).toFixed(2)} €
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <CheckoutButton onClick={handleShowModal} className="w-full">
                                    Proceed to Checkout
                                </CheckoutButton>
                            </div>

                            <PaymentModal
                                open={showPaymentModal}
                                onClose={() => setShowPaymentModal(false)}
                                onStripePayment={handleStripePayment}
                                onCashPayment={handleCashPayment}
                            />
                        </Paper>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
};

export default Cart;
