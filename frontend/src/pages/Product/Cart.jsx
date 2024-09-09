import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutButton, CustomDeleteModal, DecreaseButton, EmptyCart, IncreaseButton, LoadingCart, RoundIconButton } from '../../assets/CustomComponents';
import emptyCartImage from '../../assets/empty-cart.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const axiosInstance = useAxios();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axiosInstance.get('/cart', {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                setCart(response.data);
            } catch (error) {
                console.error('Failed to fetch cart:', error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [auth.accessToken]);

    const updateQuantity = async (productId, quantityChange) => {
        try {
            const response = await axiosInstance.put('/cart/update-quantity', {
                productId,
                quantityChange
            }, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to update product quantity:', error.response?.data?.message || error.message);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const response = await axiosInstance.delete(`/cart/remove`, {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
                data: { productId }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to remove product from cart:', error.response?.data?.message || error.message);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await axiosInstance.delete(`/cart/clear`, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to clear cart:', error.response?.data?.message || error.message);
        }
        setOpenModal(false);
    };

    const handleCheckout = () => {
        // TODO: Implement checkout functionality
        navigate('/checkout');
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return <LoadingCart />
    }

    // Handle cases where cart might be null
    if (!cart || !cart.items) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-2 mb-16 bg-gray-50 mt-10">
                    <h1 className="text-2xl font-semibold mb-4">Cart</h1>
                    <div className="flex flex-col items-center justify-center mt-10 bg-white p-8 rounded-sm shadow-lg">
                        <img src={emptyCartImage} alt="Empty Cart" className="w-60 h-60 object-cover mb-4" />
                        <p className="text-lg font-semibold mb-4">Your cart is empty.</p>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/')}
                        >
                            Go Back to Home
                        </Button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-2 mb-16 bg-gray-50 mt-10">
                <h1 className="text-2xl font-semilight mb-4">Cart</h1>
                {cart.items.length > 0 ? (
                    <>
                        <TableContainer component={Paper} className="bg-white">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                        <TableCell align="center"><DeleteOutlineIcon color="primary" onClick={() => setOpenModal(true)} className='cursor-pointer' /></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.items.map(item => (
                                        <TableRow key={item.product._id}>
                                            <TableCell component="th" scope="row">
                                                <div className="flex items-center">
                                                    <img
                                                        src={`http://localhost:5000/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-20 h-20 object-cover cursor-pointer rounded mr-4"
                                                        onClick={() => handleProductClick(item.product._id)}
                                                    />
                                                    <div>
                                                        <h2
                                                            className="text-base font-normal cursor-pointer hover:underline"
                                                            onClick={() => handleProductClick(item.product._id)}
                                                        >
                                                            {item.product.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.product.salePrice ? (
                                                    <>
                                                        <span className="text-lg font-semibold">{item.product.salePrice.toFixed(2)} €</span>
                                                        <br />
                                                        <span className="text-sm font-semibold text-stone-600">
                                                            You save {(item.product.price - item.product.salePrice).toFixed(2)}€
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className='text-lg font-semibold'>{item.product.price.toFixed(2)} €</span>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex justify-center items-center">
                                                    <DecreaseButton
                                                        onClick={() => updateQuantity(item.product._id, -1)}
                                                    >
                                                        -
                                                    </DecreaseButton>
                                                    <span className="px-4 py-1 border">{item.quantity}</span>
                                                    <IncreaseButton
                                                        onClick={() => updateQuantity(item.product._id, 1)}
                                                    >
                                                        +
                                                    </IncreaseButton>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <h2 className='text-base font-semibold'>
                                                    {(item.quantity * (item.product.salePrice || item.product.price)).toFixed(2)} €
                                                </h2>
                                            </TableCell>
                                            <TableCell align="center">
                                                <RoundIconButton
                                                    onClick={() => handleRemove(item.product._id)}
                                                >
                                                    <DeleteOutlineIcon color="primary" />
                                                </RoundIconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="mt-6 text-right">
                            <h2 className="text-lg font-semibold mb-2">Total: {cart.totalPrice.toFixed(2)} €</h2>
                            <CheckoutButton
                                onClick={handleCheckout}
                            >
                                Checkout
                            </CheckoutButton>
                        </div>
                    </>
                ) : (
                    <EmptyCart />
                )}

                <CustomDeleteModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onDelete={handleClearCart}
                    title="Clear Cart"
                    message="Are you sure you want to clear the cart?"
                />
            </div>

            <Footer />
        </>
    );
};

export default Cart;