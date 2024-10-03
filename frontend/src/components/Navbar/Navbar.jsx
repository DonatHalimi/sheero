import { Login } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    CartDropdown,
    CartIcon,
    LoadingOverlay,
    NavbarLogo,
    ProfileDropdown,
    ProfileIcon,
    RoundIconButton,
    WishlistIcon,
} from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import CategoryNavbar from './CategoryNavbar';
import SearchBar from './SearchBar';

const Navbar = () => {
    const { auth, isAdmin, logout } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);

    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            if (!auth.accessToken) return;
            try {
                const { data: cart } = await axiosInstance.get('/cart');
                setCartItems(cart.items);

                const total = cart.items.reduce((acc, item) => {
                    const price = item.product.salePrice || item.product.price;
                    return acc + price * item.quantity;
                }, 0);
                setCartTotal(total);
            } catch (error) {
                console.log('Error fetching cart data:', error);
            }
        };

        fetchCartData();
    }, [auth.accessToken, axiosInstance]);

    const handleRemoveItem = async (productId) => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.delete('/cart/remove', {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
                data: { productId },
            });
            toast.success('Product removed from cart');
            setCartItems(data.items);

            const updatedTotal = data.items.reduce((acc, item) => {
                const price = item.product.salePrice || item.product.price;
                return acc + price * item.quantity;
            }, 0);
            setCartTotal(updatedTotal);

            if (data.items.length === 0) {
                setIsCartDropdownOpen(false);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleProductAdded = () => setIsCartDropdownOpen(true);
        document.addEventListener('productAddedToCart', handleProductAdded);
        return () => document.removeEventListener('productAddedToCart', handleProductAdded);
    }, []);

    const toggleDropdown = (type) => {
        if (type === 'profile') {
            setIsProfileDropdownOpen(prev => !prev);
            setIsCartDropdownOpen(false);
        } else if (type === 'cart') {
            setIsCartDropdownOpen(prev => !prev);
            setIsProfileDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
    };

    const handleGoToCart = async () => {
        setIsLoading(true);
        try {
            navigate('/cart');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = (productId) => navigate(`/product/${productId}`);

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white p-4">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                    <NavbarLogo />

                    <div className="flex items-center space-x-4 flex-grow mx-4">
                        <SearchBar />

                        {auth.accessToken ? (
                            <>
                                {/* Profile button */}
                                <div className="relative">
                                    <ProfileIcon
                                        auth={auth}
                                        handleProfileDropdownToggle={() => toggleDropdown('profile')}
                                    />
                                    {isProfileDropdownOpen && (
                                        <ProfileDropdown
                                            isAdmin={isAdmin()}
                                            handleLogout={handleLogout}
                                        />
                                    )}
                                </div>

                                {/* Wishlist & Cart buttons */}
                                <div className="flex space-x-2">
                                    <WishlistIcon />

                                    <div className="relative">
                                        <CartIcon
                                            totalQuantity={totalQuantity}
                                            handleCartDropdownToggle={() => toggleDropdown('cart')}
                                        />
                                        {isCartDropdownOpen && (
                                            <CartDropdown
                                                cartItems={cartItems}
                                                cartTotal={cartTotal}
                                                handleRemoveItem={handleRemoveItem}
                                                handleGoToCart={handleGoToCart}
                                                isLoading={isLoading}
                                                handleProductClick={handleProductClick}
                                            />
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            // If not authenticated, show login button
                            <>
                                <RoundIconButton
                                    onClick={() => navigate('/login')}
                                    sx={{ color: '#686159' }}
                                >
                                    <Login />
                                </RoundIconButton>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="pt-20 bg-white">
                <CategoryNavbar />
            </div>
        </>
    );
};

export default Navbar;