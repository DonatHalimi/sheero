import { Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { WishlistIcon } from '../../components/custom/Icons';
import { LoadingOverlay } from '../../components/custom/LoadingSkeletons';
import { CartMenu, LoginButton, NavbarLogo, NotificationMenu, ProfileMenu } from '../../components/custom/MUI';
import { clearCartService, getCartService, removeFromCartService, updateQuantityService } from '../../services/cartService';
import { archiveNotificationService, getArchivedNotificationsService, getNotificationsService, markAllNotificationsReadService, markAllNotificationsUnreadService, markNotificationReadService, markNotificationUnreadService, unarchiveNotificationService } from '../../services/notificationService';
import { logoutUser, selectIsAdmin, selectIsContentManager, selectIsOrderManager, selectIsProductManager } from '../../store/actions/authActions';
import { getCartCount } from '../../store/actions/cartActions';
import { getWishlistCount } from '../../store/actions/wishlistActions';
import { BASE_URL } from '../../utils/config';
import CategoryNavbar from './CategoryNavbar';
import SearchBar from './SearchBar';

const Navbar = ({ activeCategory }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { wishlistCount } = useSelector((state) => state.wishlist);
    const { cartCount } = useSelector((state) => state.cart);

    const { user } = useSelector((state) => state.auth);
    const userId = user?.id;
    const isAdmin = useSelector(selectIsAdmin);
    const isOrderManager = useSelector(selectIsOrderManager);
    const isContentManager = useSelector(selectIsContentManager);
    const isProductManager = useSelector(selectIsProductManager);

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
    const [isNotifLoading, setIsNotifLoading] = useState(false);
    const [notifFilter, setNotifFilter] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const isAllRead = notifications.length > 0 && notifications.every(n => n.isRead);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCart, setIsFetchingCart] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleDropdownToggle = (dropdownType) => {
        setIsProfileDropdownOpen(false);
        setIsCartDropdownOpen(false);
        setIsNotifDropdownOpen(false);

        if (dropdownType === 'profile') {
            setIsProfileDropdownOpen(true);
        } else if (dropdownType === 'cart') {
            setIsCartDropdownOpen(true);
        } else if (dropdownType === 'notif' && isAuthenticated && isOrderManager) {
            setIsNotifDropdownOpen(true);
            fetchNotifications();
        }
    };
    const handleRemoveItem = async (productId) => {
        setIsLoading(true);
        try {
            const res = await removeFromCartService(productId);
            if (res.data.success === true) {
                toast.success(res.data.message);
            }

            await fetchCart();

            window.dispatchEvent(new Event('cartUpdate'));
            dispatch(getCartCount());
            if (cartItems.length === 1) setIsCartDropdownOpen(false);
        } catch (error) {
            toast.error('Failed to remove item from cart');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCart = async () => {
        setIsLoading(true);
        try {
            const res = await clearCartService();
            if (res.data.success === true) {
                toast.success(res.data.message);
            }

            await fetchCart();
            window.dispatchEvent(new Event('cartUpdate'));
            dispatch(getCartCount());
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
            dispatch(getCartCount());
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
            dispatch(getCartCount());
            dispatch(getWishlistCount());
        }

        const handleCartUpdate = () => {
            fetchCart();
            if (location.pathname !== '/cart') {
                setIsProfileDropdownOpen(false);
                setIsNotifDropdownOpen(false);
                setIsCartDropdownOpen(true);
            }
        };

        const handleWishlistUpdate = () => {
            dispatch(getWishlistCount());
        };

        document.addEventListener('cartUpdated', handleCartUpdate);
        document.addEventListener('wishlistUpdated', handleWishlistUpdate);

        return () => {
            document.removeEventListener('cartUpdated', handleCartUpdate);
            document.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [isAuthenticated, dispatch, location.pathname]);

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

    const updateNotificationState = (updatedNotifications) => {
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.isRead && !n.isArchived).length);
    };

    const fetchNotifications = async (filter = notifFilter) => {
        setIsNotifLoading(true);
        try {
            const response = filter === 'all'
                ? await getNotificationsService()
                : await getArchivedNotificationsService();
            updateNotificationState(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsNotifLoading(false);
        }
    };

    const handleNotifFilterChange = async (filter) => {
        setNotifFilter(filter);
        await fetchNotifications(filter);
    };

    useEffect(() => {
        if (!isAuthenticated || !isOrderManager) return;

        fetchNotifications();

        const socket = io(BASE_URL, {
            path: '/socket.io',
            query: { userId },
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('notification', (notif) => {
            updateNotificationState([notif, ...notifications]);
        });

        return () => {
            socket.off();
            socket.disconnect();
        };
    }, [isAuthenticated, isOrderManager, userId]);

    const handleToggleNotificationRead = async (notification) => {
        try {
            const service = notification.isRead
                ? markNotificationUnreadService
                : markNotificationReadService;
            await service(notification._id);

            setNotifications(prev => prev.map(n =>
                n._id === notification._id
                    ? { ...n, isRead: !notification.isRead }
                    : n
            ));

            if (!notification.isArchived) {
                setUnreadCount(prev => {
                    const newCount = notification.isRead ? 1 : -1;
                    return Math.max(0, prev + newCount);
                });
            }
        } catch (error) {
            toast.error('Failed to update notification');
        }
    };

    const handleToggleAllNotificationsRead = async () => {
        try {
            const visibleNotifications = notifFilter === 'all'
                ? notifications.filter(n => !n.isArchived)
                : notifications;

            const isAllVisibleRead = visibleNotifications.every(n => n.isRead);
            const service = isAllVisibleRead
                ? markAllNotificationsUnreadService
                : markAllNotificationsReadService;

            await service();
            await fetchNotifications();
        } catch (error) {
            toast.error('Failed to update notifications');
        }
    };

    const handleArchiveNotification = async (id) => {
        try {
            const res = await archiveNotificationService(id);
            if (res.data.success === true) {
                toast.success(res.data.message);
            }
            await fetchNotifications(notifFilter);
        } catch (error) {
            toast.error('Failed to archive notification');
        }
    };

    const handleUnarchiveNotification = async (id) => {
        try {
            const res = await unarchiveNotificationService(id);
            if (res.data.success === true) {
                toast.success(res.data.message);
            }
            await fetchNotifications(notifFilter);
        } catch (err) {
            toast.error('Failed to restore notification');
        }
    };

    console.log(notifications);

    const handleProductClick = (slug) => navigate(`/${slug}`);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        document.body.style.overflow = isSidebarOpen ? 'unset' : 'hidden';
    };

    return (
        <>
            {isLoading && <LoadingOverlay />}

            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white h-20">
                <div className="mx-auto max-w-screen-xl">
                    <div className="flex flex-col w-full">
                        <div className="flex items-center p-4 w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <button onClick={handleToggleSidebar} className="lg:hidden pr-2 hover:bg-gray-100 rounded-lg mr-2">
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
                                            <ProfileMenu
                                                isProfileDropdownOpen={isProfileDropdownOpen}
                                                setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                                                toggleDropdown={handleDropdownToggle}
                                                isAdmin={isAdmin}
                                                isOrderManager={isOrderManager}
                                                isContentManager={isContentManager}
                                                isProductManager={isProductManager}
                                                handleLogout={handleLogout}
                                            />

                                            <WishlistIcon totalQuantity={wishlistCount} />

                                            <CartMenu
                                                isCartDropdownOpen={isCartDropdownOpen}
                                                setIsCartDropdownOpen={setIsCartDropdownOpen}
                                                toggleDropdown={handleDropdownToggle}
                                                cartCount={cartCount}
                                                cartItems={cartItems}
                                                cartTotal={cartTotal}
                                                handleRemoveItem={handleRemoveItem}
                                                handleClearCart={handleClearCart}
                                                handleUpdateQuantity={handleUpdateQuantity}
                                                handleGoToCart={handleGoToCart}
                                                isLoading={isFetchingCart}
                                                handleProductClick={handleProductClick}
                                            />

                                            {isOrderManager && (
                                                <NotificationMenu
                                                    isNotifDropdownOpen={isNotifDropdownOpen}
                                                    setIsNotifDropdownOpen={setIsNotifDropdownOpen}
                                                    toggleDropdown={handleDropdownToggle}
                                                    notifications={notifications}
                                                    isLoading={isNotifLoading}
                                                    onToggleRead={handleToggleNotificationRead}
                                                    onArchive={handleArchiveNotification}
                                                    onToggleReadAll={handleToggleAllNotificationsRead}
                                                    isAllRead={isAllRead}
                                                    unreadCount={unreadCount}
                                                    activeFilter={notifFilter}
                                                    onFilterChange={handleNotifFilterChange}
                                                    onUnarchive={handleUnarchiveNotification}
                                                />
                                            )}
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
                <CategoryNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar} activeCategory={activeCategory} />
            </div>
        </>
    );
};

export default Navbar;