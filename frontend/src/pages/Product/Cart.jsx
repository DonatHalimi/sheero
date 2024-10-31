import { DeleteOutline } from '@mui/icons-material';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckoutButton, CustomDeleteModal, EmptyState, LoadingCart, LoadingOverlay, RoundIconButton, formatPrice, truncateText } from '../../assets/CustomComponents';
import emptyCartImage from '../../assets/img/empty/cart.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import PaymentModal from '../../components/Product/PaymentModal';
import { getImageUrl } from '../../config';

const Cart = () => {
    const [cart, setCart] = useState({ items: [] });
    const [address, setAddress] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0) }, [])

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const { data } = await axiosInstance.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error.message);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await axiosInstance.get('/cart');
                setCart(data);
            } catch (error) {
                console.error('Failed to fetch cart:', error?.response?.data?.message || error.message);
                setCart({ items: [] });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCart();
        }
    }, [user]);

    const updateQuantity = async (productId, quantityChange) => {
        try {
            const { data } = await axiosInstance.put(`/cart/quantity/update`, { productId, quantityChange });
            setCart(data);
        } catch (error) {
            console.error('Failed to update quantity:', error?.response?.data?.message || error.message);
        }
    };

    const handleRemove = async (productId) => {
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.delete('/cart/remove', {
                data: { productId }
            });

            if (data && Array.isArray(data.items)) {
                setCart(data);
            } else {
                const response = await axiosInstance.get('/cart');
                setCart(response.data);
            }
        } catch (error) {
            console.error('Failed to remove product from cart:', error?.response?.data?.message || error.message);
            try {
                const { data } = await axiosInstance.get('/cart');
                setCart(data);
            } catch (fetchError) {
                console.error('Failed to fetch updated cart:', fetchError);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearCart = async () => {
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.delete('/cart/clear');
            setCart(data);
        } catch (error) {
            console.error('Failed to clear cart:', error?.response?.data?.message || error.message);
        } finally {
            setActionLoading(false);
            setOpenModal(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAddress();
        }
    }, [user]);

    const fetchAddress = async () => {
        try {
            const response = await axiosInstance.get(`/addresses/user/${user.id}`);
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
                cartId: cart._id,
                addressId: address._id,
                userId: user.id,
                email: user.email,
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
                cartId: cart._id,
                addressId: address._id,
                userId: user.id,
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

    const productLabel = cart?.items?.length > 1 ? 'Products' : 'Product';

    return (
        <>
            <Navbar />

            {actionLoading && <LoadingOverlay />}

            <div className="container mx-auto px-4 lg:px-24 py-2 mb-16 bg-gray-50 mt-10">
                {/* Mobile-only header */}
                <div className="bg-white p-4 rounded-md shadow-sm mb-3 flex justify-between items-center px-2 md:hidden mt-16">
                    <h1 className="text-2xl font-semilight ml-2">Cart</h1>
                    {cart?.items?.length > 0 && (
                        <Tooltip title="Clear cart" arrow placement="top">
                            <RoundIconButton
                                onClick={() => setOpenModal(true)}
                                className="cursor-pointer"
                            >
                                <DeleteOutline color="primary" />
                            </RoundIconButton>
                        </Tooltip>
                    )}
                </div>

                <h1 className="text-2xl font-semilight mb-2 hidden md:block">Cart</h1>

                {cart?.items?.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <TableContainer component={Paper} className="bg-white">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{productLabel}</TableCell>
                                                <TableCell align="center">Price</TableCell>
                                                <TableCell align="center">Quantity</TableCell>
                                                <TableCell align="center">Total</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Clear cart" arrow placement="top">
                                                        <RoundIconButton
                                                            onClick={() => setOpenModal(true)}
                                                            className="cursor-pointer"
                                                        >
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
                                                                src={getImageUrl(item.product.image)}
                                                                alt={item.product.name}
                                                                className="w-20 h-20 object-contain cursor-pointer rounded mr-4"
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
                                                                <span className="text-lg font-semibold">
                                                                    {formatPrice(item.product.salePrice)} €
                                                                </span>
                                                                <br />
                                                                <span className="text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-1">
                                                                    You save {formatPrice(item.product.price - item.product.salePrice)} €
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-semibold">
                                                                {formatPrice(item.product.price)} €
                                                            </span>
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
                                                            {formatPrice(item.quantity * (item.product.salePrice || item.product.price))} €
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
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {cart.items.map(item => (
                                    <div key={item.product._id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex gap-4">
                                            <img
                                                src={getImageUrl(item.product.image)}
                                                alt={item.product.name}
                                                className="w-24 h-24 object-contain rounded cursor-pointer"
                                                onClick={() => handleProductClick(item.product._id)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3
                                                        className="font-medium mb-2 cursor-pointer hover:underline"
                                                        onClick={() => handleProductClick(item.product._id)}
                                                    >
                                                        {truncateText(item.product.name, 25)}
                                                    </h3>
                                                    <RoundIconButton
                                                        onClick={() => handleRemove(item.product._id)}
                                                        className="h-8 w-8 -mt-1 -mr-1"
                                                    >
                                                        <DeleteOutline fontSize="small" color="primary" />
                                                    </RoundIconButton>
                                                </div>
                                                <div className="mb-3">
                                                    {item.product.salePrice ? (
                                                        <>
                                                            <span className="text-lg font-semibold">
                                                                {formatPrice(item.product.salePrice)} €
                                                            </span>
                                                            <br />
                                                            <span className="text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-1">
                                                                You save {formatPrice(item.product.price - item.product.salePrice)} €
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-semibold">
                                                            {formatPrice(item.product.price)} €
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border rounded">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            className="px-3 py-1 border-r"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-1">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            disabled={item.quantity >= item.product.inventoryCount}
                                                            className={`px-3 py-1 border-l ${item.quantity >= item.product.inventoryCount ? 'opacity-50' : ''}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className="font-semibold">
                                                        {formatPrice(item.quantity * (item.product.salePrice || item.product.price))} €
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Summary Section */}
                        <div className="lg:w-80 w-full">
                            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)} €</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span>Shipping</span>
                                        <span>{shippingCost.toFixed(2)} €</span>
                                    </div>
                                    {cart.items.some(item => item.product.salePrice) && (
                                        <div className="flex justify-between py-2 border-b">
                                            <span>Total Savings</span>
                                            <span>
                                                -{cart.items.reduce((total, item) => {
                                                    if (item.product.salePrice) {
                                                        return total + (item.product.price - item.product.salePrice) * item.quantity;
                                                    }
                                                    return total;
                                                }, 0).toFixed(2)} €
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-2 font-bold !mb-2">
                                        <span>Total</span>
                                        <span>{formatPrice(total)} €</span>
                                    </div>
                                </div>
                                <CheckoutButton
                                    onClick={handleShowModal}
                                    className="w-full mt-4"
                                >
                                    Proceed to Checkout
                                </CheckoutButton>

                                <PaymentModal
                                    open={showPaymentModal}
                                    onClose={() => setShowPaymentModal(false)}
                                    onStripePayment={handleStripePayment}
                                    onCashPayment={handleCashPayment}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState imageSrc={emptyCartImage} message="Your cart is empty!" />
                )}
            </div>

            <CustomDeleteModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onDelete={handleClearCart}
                title="Clear Cart"
                message="Are you sure you want to clear the cart?"
            />

            <Footer />
        </>
    );
};

export default Cart;