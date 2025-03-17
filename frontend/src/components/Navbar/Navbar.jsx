import { Menu as MenuIcon } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartDropdown, CartIcon, LoadingOverlay, LoginButton, NavbarLogo, ProfileDropdown, ProfileIcon, WishlistIcon } from '../../assets/CustomComponents';
import { clearCartService, getCartService, removeFromCartService, updateQuantityService } from '../../services/cartService';
import { logoutUser, selectIsAdmin, selectIsContentManager, selectIsOrderManager, selectIsProductManager } from '../../store/actions/authActions';
import CategoryNavbar from './CategoryNavbar';
import SearchBar from './SearchBar';

const Navbar = ({ activeCategory }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const isAdmin = useSelector(selectIsAdmin);
    const isOrderManager = useSelector(selectIsOrderManager);
    const isContentManager = useSelector(selectIsContentManager);
    const isProductManager = useSelector(selectIsProductManager);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCart, setIsFetchingCart] = useState(false);

    const fetchCart = async () => {
        setIsFetchingCart(true);
        try {
            const { data: cart } = await getCartService();
            setCartItems(cart.items || []);
            const total = (cart.items || []).reduce((acc, item) => {
                const price = item.product.salePrice || item.product.price;
                return acc + price * item.quantity;
            }, 0);
            setCartTotal(total);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        } finally {
            setIsFetchingCart(false);
        }
    };

    const toggleDropdown = (type) => {
        if (type === 'profile') {
            setIsProfileDropdownOpen((prev) => !prev);
            setIsCartDropdownOpen(false);
        } else if (type === 'cart') {
            setIsCartDropdownOpen((prev) => !prev);
            setIsProfileDropdownOpen(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        setIsLoading(true);
        try {
            await removeFromCartService(productId);
            toast.success('Product removed from cart');

            await fetchCart();

            window.dispatchEvent(new Event('cartUpdate'));
            if (cartItems.length === 1) setIsCartDropdownOpen(false);
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCart = async () => {
        setIsLoading(true);
        try {
            await clearCartService();
            toast.success('Cart cleared successfully');
            await fetchCart();
            window.dispatchEvent(new Event('cartUpdate'));
            setIsCartDropdownOpen(false);
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, quantityChange) => {
        setIsLoading(true);

        const cartData = {
            productId,
            quantityChange
        }
        try {
            const { data } = await updateQuantityService(cartData);

            setCartItems(data.items);
            setCartTotal(data.items.reduce((sum, item) => {
                const price = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
                return sum + price * item.quantity;
            }, 0));
            toast.success('Quantity updated successfully');
            window.dispatchEvent(new Event('cartUpdate'));
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            fetchCart();
            if (location.pathname !== '/cart') setIsCartDropdownOpen(true);
        };

        if (isAuthenticated) fetchCart();
        document.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            document.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logoutUser());
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

    const handleProductClick = (slug) => navigate(`/${slug}`);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        document.body.style.overflow = isSidebarOpen ? 'unset' : 'hidden';
    };

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white h-20">
                <div className="mx-auto max-w-screen-xl">
                    <div className="flex flex-col w-full">
                        <div className="flex items-center p-4 w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <button onClick={toggleSidebar} className="lg:hidden pr-2 hover:bg-gray-100 rounded-lg mr-2">
                                        <MenuIcon className="text-stone-500" />
                                    </button>

                                    <div className="flex-shrink-0 mr-0">
                                        <NavbarLogo className="w-auto" />
                                    </div>
                                </div>

                                <div className="search-bar mx-8 max-w-xl">
                                    <SearchBar />
                                </div>

                                <div className="flex items-center space-x-1">
                                    {isAuthenticated ? (
                                        <>
                                            <ClickAwayListener onClickAway={() => setIsProfileDropdownOpen(false)}>
                                                <div className="relative z-[1000]">
                                                    <ProfileIcon
                                                        handleProfileDropdownToggle={() => toggleDropdown('profile')}
                                                        isDropdownOpen={isProfileDropdownOpen}
                                                    />
                                                    {isProfileDropdownOpen && (
                                                        <ProfileDropdown
                                                            isOpen={isProfileDropdownOpen}
                                                            isAdmin={isAdmin}
                                                            isOrderManager={isOrderManager}
                                                            isContentManager={isContentManager}
                                                            isProductManager={isProductManager}
                                                            handleLogout={handleLogout}
                                                        />
                                                    )}
                                                </div>
                                            </ClickAwayListener>

                                            <WishlistIcon />

                                            <ClickAwayListener onClickAway={() => setIsCartDropdownOpen(false)}>
                                                <div className="relative z-[1000]">
                                                    <CartIcon
                                                        handleCartDropdownToggle={() => toggleDropdown('cart')}
                                                        totalQuantity={totalQuantity}
                                                        isDropdownOpen={isCartDropdownOpen}
                                                    />
                                                    {isCartDropdownOpen && (
                                                        <CartDropdown
                                                            isOpen={isCartDropdownOpen}
                                                            cartItems={cartItems}
                                                            cartTotal={cartTotal}
                                                            handleRemoveItem={handleRemoveItem}
                                                            handleClearCart={handleClearCart}
                                                            handleUpdateQuantity={handleUpdateQuantity}
                                                            handleGoToCart={handleGoToCart}
                                                            isLoading={isFetchingCart}
                                                            handleProductClick={handleProductClick}
                                                        />
                                                    )}
                                                </div>
                                            </ClickAwayListener>
                                        </>
                                    ) : (
                                        <LoginButton />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:hidden px-4 mb-4 w-full bg-white h-16 border-t border-gray-50 pt-3">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mt-20 bg-white">
                <CategoryNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeCategory={activeCategory} />
            </div>
        </>
    );
};

export default Navbar;