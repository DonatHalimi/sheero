import { IconButton, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BrownButton,
    BrownDeleteOutlinedIcon,
    OutlinedBrownButton,
    ProfileButton,
    RoundIconButton,
    StyledDashboardIcon,
    StyledFavoriteIcon,
    StyledInboxIcon,
    StyledLogoutIcon,
    StyledPersonIcon,
    StyledShoppingCartIcon,
} from '../assets/CustomComponents';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import CategoryNavbar from './CategoryNavbar';
import Badge from '@mui/material/Badge';
import useAxios from '../axiosInstance';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { auth, isAdmin, logout } = useContext(AuthContext);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const axiosInstance = useAxios();
    const profileDropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            if (auth.accessToken) {
                try {
                    const response = await axiosInstance.get('/cart');
                    const cart = response.data;
                    setCartItems(cart.items);
                    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
                    setCartTotal(total);
                } catch (error) {
                    console.error('Error fetching cart data:', error);
                }
            }
        };

        fetchCartData();
    }, [auth.accessToken, axiosInstance]);

    const handleProfileDropdownToggle = () => {
        setIsProfileDropdownOpen(prev => !prev);
        setIsCartDropdownOpen(false);
    };

    const handleCartDropdownToggle = () => {
        setIsCartDropdownOpen(prev => !prev);
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
    };

    const handleClickOutsideProfile = (event) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
            setIsProfileDropdownOpen(false);
        }
    };

    const handleClickOutsideCart = (event) => {
        if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
            setIsCartDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideProfile);
        document.addEventListener('mousedown', handleClickOutsideCart);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideProfile);
            document.removeEventListener('mousedown', handleClickOutsideCart);
        };
    }, []);

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleRemoveItem = async (productId) => {
        try {
            const response = await axiosInstance.delete('/cart/remove', {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
                data: { productId }
            });

            toast.success(`Product removed from cart`)

            // Update cart items and total
            setCartItems(response.data.items);
            const updatedTotal = response.data.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            setCartTotal(updatedTotal);

        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const ProfileDropdown = () => (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg p-2" ref={profileDropdownRef}>
            {isAdmin() && (
                <>
                    <Link to="/dashboard/users" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                        <StyledDashboardIcon className="mr-2" />
                        Dashboard
                    </Link>
                    <hr className='border-stone-200 mb-2' />
                </>
            )}
            <Link to="/profile" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                <StyledPersonIcon className="mr-2" />
                Profile
            </Link>
            <Link to="/orders" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                <StyledInboxIcon className="mr-2" />
                Orders
            </Link>
            <Link to="/wishlist" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                <StyledFavoriteIcon className="mr-2" />
                Wishlist
            </Link>
            <hr className='border-stone-200 mb-2' />
            <button onClick={handleLogout} className="flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left">
                <StyledLogoutIcon className="mr-2" />
                Log Out
            </button>
        </div>
    );

    const CartDropdown = () => (
        <div className="absolute right-0 mt-2 w-96 bg-white border shadow-lg rounded-lg p-4" ref={cartDropdownRef}>
            {cartItems.length === 0 ? (
                <div className="text-sm text-left">Your cart is empty</div>
            ) : (
                <>
                    <ul className="mt-2 mb-4">
                        {cartItems.map(item => (
                            <li key={item.product._id} className="flex justify-between items-center mb-4">
                                <img
                                    src={`http://localhost:5000/${item.product.image}`}
                                    alt={item.product.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="ml-2 flex-grow">
                                    <span className="block font-semibold">{item.product.name}</span>
                                    <span className="block text-sm text-gray-500">{item.quantity} x {item.product.price} €</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.product._id)}
                                >
                                    <BrownDeleteOutlinedIcon />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <hr className='border-stone-200' />
                    <div className="flex justify-between items-center mt-4 mb-4">
                        <div className="flex justify-start items-center space-x-1">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">{cartTotal.toFixed(2)} €</span>
                        </div>
                    </div>
                    <button
                        className="w-full bg-stone-600 text-white py-2 rounded"
                        onClick={() => navigate('/cart')}
                    >
                        Go to Cart
                    </button>
                </>
            )}
        </div>
    );

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white p-4">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                    <Tooltip title="Home" arrow>
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="Logo" className="w-60 h-11" />
                        </Link>
                    </Tooltip>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4">
                            {auth.accessToken ? (
                                <>
                                    <div className="relative">
                                        <Tooltip title="Profile" arrow>
                                            <div className="flex items-center">
                                                <ProfileButton onClick={handleProfileDropdownToggle} className="flex items-center space-x-2 rounded-sm">
                                                    <StyledPersonIcon />
                                                    {auth.username && <span className="ml-2 text-sm">{auth.username}</span>}
                                                </ProfileButton>
                                            </div>
                                        </Tooltip>
                                        {isProfileDropdownOpen && <ProfileDropdown />}
                                    </div>
                                    <div className='flex space-x-2'>
                                        <Link to='/wishlist'>
                                            <RoundIconButton><StyledFavoriteIcon /></RoundIconButton>
                                        </Link>
                                        <div className="relative">
                                            <RoundIconButton aria-label="cart" onClick={handleCartDropdownToggle}>
                                                <Badge badgeContent={totalQuantity} anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }} color="secondary">
                                                    <StyledShoppingCartIcon />
                                                </Badge>
                                            </RoundIconButton>
                                            {isCartDropdownOpen && <CartDropdown />}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <BrownButton variant="contained" color="primary">Login</BrownButton>
                                    </Link>
                                    <Link to='/register'>
                                        <OutlinedBrownButton>Register</OutlinedBrownButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <div className='pt-20 bg-white'>
                <CategoryNavbar />
            </div>
        </>
    );
};

export default Navbar;
