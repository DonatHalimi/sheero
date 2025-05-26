import {
    Add,
    Archive,
    Check,
    ChevronRight,
    Close,
    Create,
    Delete,
    ExpandLess,
    ExpandMore,
    Inbox,
    LocationOn,
    MarkEmailRead,
    MarkEmailUnread,
    Person,
    Phone,
    Remove,
    Star,
    StarBorder,
    Unarchive
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Skeleton,
    Stack,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    customMenuProps,
    filterLayoutSx,
    layoutContainerSx,
    orderDetailsBoxSx,
    orderDetailsModalSx,
    reviewCommentSx,
    reviewContainerSx,
    reviewContentSx,
    reviewImageSx,
    reviewTextAreaSx,
    reviewTitleContainerSx,
    reviewTitleSx,
    searchDropdownImageSx,
    searchDropdownItemSx,
    searchDropdownSx
} from "../../assets/sx";
import ProductItem from "../../components/Product/Items/ProductItem";
import FilterSidebar from "../../components/Product/Utils/FilterSidebar";
import { getImageUrl } from "../../utils/config";
import { BrownDeleteOutlinedIcon, CartIcon, HomeBreadCrumbIcon, HomeIcon, MarkAllReadIcon, MarkAllUnreadIcon, WishlistIcon } from "./Icons";
import { LoadingCartDropdown, LoadingCategoryDropdown, LoadingLabel, LoadingProductItem, LoadingRestock, WaveSkeleton } from "./LoadingSkeletons";
import { BrownButton, CustomBox, CustomModal, CustomTab, DropdownAnimation, NotFound, ReviewCard, RoundIconButton } from "./MUI";
import { formatFullDate, formatPrice, formatTimeAgo, truncateText } from "./utils";

/**
 * @file Product.jsx
 * @description A collection of custom components related to product display and management.
 *
 * This file includes components for presenting products, handling product interactions and managing
 * product-related views ensuring a consistent and dynamic product experience across the application.
 */

export const OutOfStock = ({ inventoryCount }) => {
    if (inventoryCount === 0) {
        return (
            <div className="absolute inset-0 bg-white opacity-75 flex items-center justify-center rounded pointer-events-none">
                <span className="text-black bg-gray-100 rounded-md px-1 font-semibold">Out of Stock</span>
            </div>
        );
    }

    return null;
};

export const DiscountPercentage = ({ discountPercentage }) => {
    if (discountPercentage > 0) {
        return (
            <span className="absolute top-0 right-0 bg-stone-500 text-white px-2 py-1 rounded text-xs">
                -{discountPercentage}%
            </span>
        )
    }

    return null;
};

export const RatingStars = ({ rating }) => {
    const stars = Array(5).fill(false).map((_, index) => index < rating);
    return (
        <Box display="flex">
            {stars.map((filled, index) =>
                filled ? <Star key={index} color="primary" /> : <StarBorder key={index} />
            )}
        </Box>
    );
};

export const DetailsBreadcrumbs = ({ product }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) return null;

    return (
        <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Link component={RouterLink} to="/" color="inherit" underline="none" className='cursor-pointer'>
                    <HomeBreadCrumbIcon className="text-stone-500 hover:text-stone-700" />
                </Link>
                {product.category && (
                    <Link component={RouterLink} to={`/category/${product.category.slug}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.category.name}
                    </Link>
                )}
                {product.subcategory && (
                    <Link component={RouterLink} to={`/subcategory/${product.subcategory.slug}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subcategory.name}
                    </Link>
                )}
                {product.subSubcategory && (
                    <Link component={RouterLink} to={`/subSubcategory/${product.subSubcategory.slug}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subSubcategory.name}
                    </Link>
                )}
                <Typography color="text.primary" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</Typography>
            </Breadcrumbs>
        </div>
    );
};

const BreadcrumbLink = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
    >
        {children}
    </button>
);

const BreadcrumbSeparator = () => (
    <span className="mx-2 text-gray-400 select-none">/</span>
);

const BreadcrumbText = ({ children }) => (
    <span className="text-sm text-gray-900">
        {children}
    </span>
);

export const Breadcrumb = ({ type, data }) => {
    const navigate = useNavigate();

    const crumbs = [
        <BreadcrumbLink
            key="home"
            onClick={(e) => {
                e.preventDefault();
                navigate('/');
            }}
        >
            <HomeBreadCrumbIcon className="text-stone-500 hover:text-[#5C504B] transition-colors duration-300" />
        </BreadcrumbLink>
    ];

    if (type === 'category') {
        crumbs.push(
            <BreadcrumbSeparator key="separator-category" />,
            <BreadcrumbText key="category">{data.name}</BreadcrumbText>
        );
    } else if (type === 'subcategory' && data.category) {
        crumbs.push(
            <BreadcrumbSeparator key="separator-category" />,
            <BreadcrumbLink
                key="category"
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/category/${data.category.slug}`);
                }}
            >
                {data.category.name}
            </BreadcrumbLink>,
            <BreadcrumbSeparator key="separator-subcategory" />,
            <BreadcrumbText key="subcategory">{data.name}</BreadcrumbText>
        );
    } else if (type === 'subSubcategory') {
        if (data.category) {
            crumbs.push(
                <BreadcrumbSeparator key="separator-category" />,
                <BreadcrumbLink
                    key="category"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/category/${data.category.slug}`);
                    }}
                >
                    {data.category.name}
                </BreadcrumbLink>
            );
        }
        if (data.subcategory) {
            crumbs.push(
                <BreadcrumbSeparator key="separator-subcategory" />,
                <BreadcrumbLink
                    key="subcategory"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/subcategory/${data.subcategory.slug}`);
                    }}
                >
                    {data.subcategory.name}
                </BreadcrumbLink>
            );
        }
        crumbs.push(
            <BreadcrumbSeparator key="separator-subSubcategory" />,
            <BreadcrumbText key="subSubcategory">{data.name}</BreadcrumbText>
        );
    }

    return <nav className="flex items-center space-x-1 mt-6 md:mt-0">{crumbs}</nav>;
};

export const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

export const ReviewsList = ({ reviews, openModal }) => {
    return (
        <Box className="grid gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <ReviewCard
                        key={index}
                        onClick={() => openModal(review)}
                        className="cursor-pointer"
                    >
                        <Box className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-base sm:text-lg truncate">
                                {`${review.user.firstName}`}
                            </p>
                            <RatingStars rating={review.rating} />
                        </Box>
                        <p style={reviewTitleSx} className="text-sm sm:text-base font-medium mb-1 truncate">
                            {review.title}
                        </p>
                        <p style={reviewCommentSx} className="text-sm sm:text-base text-gray-600 mb-2 truncate" >
                            {review.comment}
                        </p>
                        <Typography variant="caption" className="text-gray-500">
                            {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                        </Typography>
                    </ReviewCard>
                ))
            ) : (
                <Typography className="text-center col-span-full text-gray-500">
                    No reviews found.
                </Typography>
            )}
        </Box>
    );
};

export const ReviewModal = ({ open, handleClose, selectedReview, onImageClick }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
        >
            <Box sx={reviewContainerSx}>
                {selectedReview && selectedReview.user && (
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={reviewImageSx}>
                            <img
                                src={getImageUrl(selectedReview.product.image)}
                                alt={selectedReview.product.name}
                                onClick={() => onImageClick(selectedReview.product.slug)}
                                style={{ maxHeight: '200px' }}
                                className="w-full h-auto object-contain rounded-md cursor-pointer"
                            />
                        </Box>

                        <Box sx={reviewContentSx}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography id="review-modal-title" variant="h6" component="h2" mb={1} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, textAlign: 'justify' }}>
                                        {selectedReview.user.firstName} {selectedReview.user.lastName}
                                        <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                            {new Date(selectedReview.updatedAt || selectedReview.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <RatingStars rating={selectedReview.rating} />
                                    </Typography>

                                    <Typography variant="h6" component="h2" display="flex" alignItems="center" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, textAlign: 'justify' }}>
                                        <span style={{ maxWidth: '360px', textAlign: 'left' }}>
                                            {selectedReview.product.name}
                                        </span>
                                    </Typography>

                                    <Box sx={reviewTitleContainerSx}>
                                        {selectedReview.title}
                                    </Box>

                                    <textarea
                                        value={selectedReview.comment}
                                        readOnly
                                        style={reviewTextAreaSx}
                                        onFocus={(e) => e.target.style.border = 'none'}
                                        className="custom-textarea break-words"
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ marginTop: 'auto' }} />
                            <IconButton
                                onClick={handleClose}
                                aria-label="close"
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export const ProductTabs = ({ value, handleChange }) => {
    return (
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="product details tabs"
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
            <CustomTab label="Description" />
            <CustomTab label="Details" />
            <CustomTab label="Reviews" />
        </Tabs>
    );
};

export const ProductRestockNotificationModal = ({
    open,
    onClose,
    handleNotifySubmit,
    notifyEmail,
    setNotifyEmail,
    loading,
    loadingRemove,
    isSubscribed,
    checkSubscription,
    deleteSubscription,
    showEmailInput = false,
}) => {
    const { user } = useSelector((state) => state.auth);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [errorVisible, setErrorVisible] = useState(false);
    const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

    const userEmail = user?.email;

    useEffect(() => {
        if (open) {
            if (userEmail) {
                setNotifyEmail(userEmail);
                setIsCheckingSubscription(true);
                checkSubscription(userEmail).finally(() => setIsCheckingSubscription(false));
            } else {
                setIsCheckingSubscription(false);
            }
        }
    }, [userEmail, open, setNotifyEmail, checkSubscription]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const email = e.target.value;
        setNotifyEmail(email);
        setIsValidEmail(validateEmail(email));
        setErrorVisible(!validateEmail(email) && email.length > 0);
    };

    const handleSubmit = () => {
        if (showEmailInput && !validateEmail(notifyEmail)) {
            setIsValidEmail(false);
            setErrorVisible(true);
            return;
        }
        handleNotifySubmit();
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography variant="h6" className="!mb-2">
                    {isCheckingSubscription ? "Checking Subscription..." : isSubscribed ? "Already Subscribed" : "Get Notified"}
                </Typography>

                {isCheckingSubscription ? (
                    <LoadingRestock />
                ) : isSubscribed ? (
                    <>
                        <p className="mb-2">You have already subscribed to restock notifications for this product. You will be notified via email when this product is back in stock.</p>
                        <BrownButton
                            onClick={() => deleteSubscription(notifyEmail)}
                            variant="contained"
                            color="secondary"
                            disabled={loadingRemove}
                            className="w-full !mt-3"
                        >
                            <LoadingLabel loading={loadingRemove} defaultLabel="Remove Subscription" loadingLabel="Removing" />
                        </BrownButton>
                    </>
                ) : (
                    <>
                        <p className="mb-2">We will notify you once this product is back in stock. We won't use your email address for any other purpose, including promotional offers.</p>
                        {!showEmailInput && (
                            <>
                                <BrownOutlinedTextField
                                    autoFocus
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={notifyEmail}
                                    onChange={handleChange}
                                />
                                {!isValidEmail && notifyEmail && errorVisible && (
                                    <div className="absolute bottom-[11px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-[calc(100%-30px)] z-10">
                                        <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                        Please provide a valid email address
                                    </div>
                                )}
                            </>
                        )}
                        <BrownButton
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className="w-full !mt-3"
                        >
                            <LoadingLabel loading={loading} defaultLabel="Notify Me" loadingLabel="Subscribing" />
                        </BrownButton>
                    </>
                )}
            </CustomBox>
        </CustomModal>
    );
};

export const CategoryDropdown = ({
    category,
    subcategories,
    subsubcategories,
    navigate,
    dropdownStyle,
    loading,
}) => (
    <div style={dropdownStyle()} className="fixed bg-white shadow-xl rounded-md p-4 z-50">
        {loading ? (
            <LoadingCategoryDropdown />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {subcategories[category.slug]?.map((subcategory) => (
                    <div key={subcategory.slug} className="flex items-left">
                        <img
                            src={getImageUrl(subcategory.image)}
                            alt=""
                            className="rounded-md object-contain mr-2 w-12 h-12"
                        />
                        <div>
                            <button
                                onClick={() => navigate(`/subcategory/${subcategory.slug}`, category.slug)}
                                className="block py-2 px-2 mr-1 rounded text-gray-700 hover:bg-gray-100 font-semibold"
                            >
                                {subcategory.name}
                            </button>
                            {subsubcategories[subcategory.slug]?.length > 0 && (
                                <div className="flex flex-wrap lg:flex-wrap text-start lg:text-left">
                                    {subsubcategories[subcategory.slug].map((subsubcategory) => (
                                        <div key={subsubcategory.slug} className="text-start">
                                            <button
                                                onClick={() => navigate(`/subSubcategory/${subsubcategory.slug}`, category.slug)}
                                                className="block py-1 px-2 ml-1 rounded text-gray-500 hover:bg-gray-100"
                                            >
                                                {subsubcategory.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export const SidebarHeader = ({ navigate, isAuthenticated }) => (
    <div className="p-2 border-b flex flex-col items-start">
        <div className='-mx-0 h-12 bg-stone-500 flex items-center justify-between w-full rounded-md mb-2 !p-0'>
            <h1
                onClick={() => navigate('/')}
                className="text-white font-bold text-lg pl-3 cursor-pointer"
            >
                sheero
            </h1>
            <div className="flex items-center pr-3">
                <IconButton
                    onClick={() => navigate('/profile/me')}
                    className="text-white hover:opacity-80 mr-1"
                >
                    {isAuthenticated ? <Person className='text-white' /> : null}
                </IconButton>
            </div>
        </div>

        <div
            onClick={() => navigate('/')}
            className="flex items-center rounded w-full text-left mb-2 cursor-pointer"
        >
            <HomeIcon color="primary" />
            <p className="ml-2">Home</p>
        </div>

        <div
            onClick={() => navigate('/cart')}
            className="flex items-center rounded w-full text-left mb-2 cursor-pointer"
        >
            <CartIcon color="primary" />
            <p className="ml-2">Cart</p>
        </div>

        <div
            onClick={() => navigate('/profile/wishlist')}
            className="flex items-center rounded w-full text-left cursor-pointer"
        >
            <WishlistIcon color="primary" />
            <p className="ml-2">Wishlist</p>
        </div>
    </div>
);

export const SidebarFooter = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col text-gray-400 gap-3">
            <span
                onClick={() => navigate('/faqs')}
                className="text-sm ml-4 underline"
            >
                Frequently Asked Questions
            </span>
            <span
                onClick={() => navigate('/contact-us')}
                className="text-sm ml-4 underline">Contact us:</span>
            <span className="text-sm ml-4">Email: support@sheero.com</span>
            <span className="text-sm ml-4 mb-10">Tel.: 044888999</span>
        </div>
    );
};

export const CategoryList = ({
    loading,
    categories,
    subcategories,
    subsubcategories,
    activeCategory,
    openCategory,
    toggleSubcategories,
    handleNavigation,
}) => (
    <ul className="p-4">
        {loading ? (
            Array(10).fill().map((_, index) => (
                <li key={index} className="mb-4">
                    <Skeleton variant="text" animation="wave" height={40} />
                </li>
            ))
        ) : (
            categories.map((category, index) => (
                <li
                    key={category._id}
                    className={`mb-4 ${index === categories.length - 1 ? 'mb-[2px]' : ''}`}
                >
                    <div className="flex items-center justify-between">
                        <div className='border-t bg-gray-50' />
                        <img
                            src={getImageUrl(category.image)}
                            alt=""
                            className='object-contain w-6 h-6'
                        />
                        <button
                            onClick={() => handleNavigation(`/category/${category.slug}`, category.slug)}
                            className={`flex-grow text-left p-1 ml-2 ${activeCategory === category.slug ? 'bg-gray-100 rounded-lg text-stone-700' : ''}`}
                        >
                            {category.name}
                        </button>
                        <button
                            onClick={(e) => toggleSubcategories(category.slug, e)}
                            className={`p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition duration-200 ${openCategory === category.slug ? 'rotate-90' : ''}`}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    <AnimatePresence initial={false}>
                        {openCategory === category.slug && (
                            <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-2 overflow-hidden"
                            >
                                {subcategories[category.slug]?.map((subcategory) => (
                                    <li key={subcategory._id} className='mb-2 ml-3'>
                                        <div className="flex items-center">
                                            <img
                                                src={getImageUrl(subcategory.image)}
                                                alt=""
                                                className='object-contain w-6 h-6'
                                            />
                                            <button
                                                onClick={() => handleNavigation(`/subcategory/${subcategory.slug}`, category.slug)}
                                                className="block py-1 px-2 mt-[2px] text-gray-700 hover:bg-gray-100"
                                            >
                                                {subcategory.name}
                                            </button>
                                        </div>
                                        <AnimatePresence initial={false}>
                                            {subsubcategories[subcategory.slug]?.length > 0 && (
                                                <motion.ul
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="pl-4 overflow-hidden"
                                                >
                                                    {subsubcategories[subcategory.slug].map((subsubcategory) => (
                                                        <div key={subsubcategory._id} className="flex items-center mb-1">
                                                            <div className="rounded-md mr-9" />
                                                            <button
                                                                onClick={() => handleNavigation(`/subSubcategory/${subsubcategory.slug}`, category.slug)}
                                                                className="block py-1 text-gray-500 hover:bg-gray-100"
                                                            >
                                                                {subsubcategory.name}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </li>
            ))
        )}
    </ul>
);

export const CartDropdown = ({
    isOpen,
    cartItems,
    cartTotal,
    handleRemoveItem,
    handleGoToCart,
    isLoading,
    handleProductClick,
    handleClearCart,
    handleUpdateQuantity
}) => {
    return (
        <div tabIndex="0" className="absolute right-0 mt-1 w-96 bg-white border shadow-lg rounded-lg p-4">
            <DropdownAnimation isOpen={isOpen}>
                {isLoading ? (
                    <LoadingCartDropdown />
                ) : cartItems.length === 0 ? (
                    <div className="text-sm text-left">You have no products in your cart</div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm !font-medium">
                                {cartItems.length} {cartItems.length === 1 ? 'Product' : 'Products'}
                            </span>
                            <button
                                onClick={handleClearCart}
                                disabled={isLoading}
                                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                            >
                                Clear Cart
                            </button>
                        </div>
                        <ul className='overflow-y-auto max-h-60 mb-2'>
                            {cartItems.map(item => (
                                <li
                                    key={`${item.product._id}-${item.quantity}`}
                                    className="flex justify-between items-center mb-3"
                                >
                                    <img
                                        src={getImageUrl(item.product.image)}
                                        alt={item.product.name}
                                        onClick={() => handleProductClick(item.product.slug)}
                                        className="w-12 h-12 object-contain rounded cursor-pointer"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <span onClick={() => handleProductClick(item.product.slug)} className="block font-semibold cursor-pointer hover:underline truncate max-w-[calc(22ch)]">
                                            {item.product.name}
                                        </span>
                                        <span className="block text-sm text-gray-500 mt-1">
                                            Item Price: {' '}
                                            <span className="font-semibold">
                                                {item.product.salePrice > 0
                                                    ? formatPrice(item.product.salePrice)
                                                    : formatPrice(item.product.price)}{' '}
                                                €
                                            </span>
                                        </span>
                                        <div className="flex items-center mt-1">
                                            <IconButton
                                                onClick={() =>
                                                    item.quantity > 1
                                                        ? handleUpdateQuantity(item.product._id, -1)
                                                        : handleRemoveItem(item.product._id)
                                                }
                                                disabled={isLoading}
                                                size="small"
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Remove fontSize="small" />
                                            </IconButton>
                                            <span className="px-2 py-0.5 text-sm">
                                                {item.quantity}
                                            </span>
                                            <IconButton
                                                onClick={() => handleUpdateQuantity(item.product._id, 1)}
                                                disabled={isLoading}
                                                size="small"
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <RoundIconButton
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        disabled={isLoading}
                                    >
                                        <BrownDeleteOutlinedIcon />
                                    </RoundIconButton>
                                </li>
                            ))}
                        </ul>
                        <Divider />
                        <div className="flex justify-between items-center mt-4 mb-4">
                            <div className="flex justify-start items-center space-x-1">
                                <span className="font-semibold">Total:</span>
                                <span className="font-semibold">
                                    <CountUp
                                        end={cartTotal}
                                        duration={0.6}
                                        separator=","
                                        decimals={2}
                                        prefix="€ "
                                    />
                                </span>
                            </div>
                        </div>
                        <BrownButton onClick={handleGoToCart} disabled={isLoading} fullWidth>
                            Go to Cart
                        </BrownButton>
                    </>
                )}
            </DropdownAnimation>
        </div>
    );
};

const OrderDetailsHeader = ({ order, activeTab, setActiveTab }) => {
    const statusClasses = {
        pending: 'text-yellow-500',
        processed: 'text-cyan-500',
        shipped: 'text-blue-700',
        delivered: 'text-green-500',
        canceled: 'text-red-500',
        default: 'text-gray-500'
    };

    const getStatusColor = (status) => `${statusClasses[status] || statusClasses.default} capitalize bg-stone-50 rounded-md px-1.5 py-0.5 text-sm ml-2`;

    return (
        <div className="bg-white pb-1 flex-shrink-0">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center">
                        <Typography variant="h6" component="div" className="font-bold">
                            Order #{order.orderId}
                        </Typography>
                        <span className={getStatusColor(order.status)}>{order.status}</span>
                    </div>
                    <Typography variant="body2" color="text.secondary" className="text-sm">
                        {formatFullDate(order.createdAt)}
                    </Typography>
                </div>

                <div className="text-right">
                    <Typography variant="subtitle1" className="!font-semibold">
                        <CountUp
                            end={order.total}
                            duration={0.6}
                            separator=","
                            decimals={2}
                            prefix="€ "
                        />
                    </Typography>
                </div>
            </div>

            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-stone-500 text-stone-600' : 'text-gray-500'}`}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-4 py-2 font-medium ${activeTab === 'contact' ? 'border-b-2 border-stone-500 text-stone-600' : 'text-gray-500'}`}
                >
                    Customer & Shipping
                </button>
            </div>
        </div>
    );
};

const ProductCount = ({ showCombinedCount, uniqueProducts, totalItems }) => {
    return (
        <div className="flex justify-end rounded-lg mb-2 text-sm">
            {showCombinedCount ? (
                <span className="text-stone-600">
                    <strong>{uniqueProducts}</strong> item{uniqueProducts === 1 ? '' : 's'}
                </span>
            ) : (
                <>
                    <span className="text-stone-600">
                        <strong>{uniqueProducts}</strong> unique product{uniqueProducts === 1 ? '' : 's'}
                    </span>
                    <span className="mx-2">|</span>
                    <span className="text-stone-600">
                        <strong>{totalItems}</strong> total item{totalItems === 1 ? '' : 's'}
                    </span>
                </>
            )}
        </div>
    );
};

const OrderProductsList = ({ order, copiedFields, showCombinedCount, uniqueProducts, totalItems, handleCopy }) => {
    return (
        <div className={`space-y-3 ${order.products?.length > 4 ? 'pr-3' : ''}`}>
            <ProductCount
                showCombinedCount={showCombinedCount}
                uniqueProducts={uniqueProducts}
                totalItems={totalItems}
            />

            {order.products?.map((product, index) => (
                <div key={index} className="border rounded-lg p-3">
                    <div className="flex gap-3">
                        <div className="w-16 h-16">
                            <img
                                src={getImageUrl(product.productImage)}
                                alt={product.productName}
                                className="w-[50px] h-[50px] object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <Typography variant="subtitle2" className="font-medium line-clamp-2">
                                {product.productName}
                            </Typography>
                            <div className="flex justify-between mt-1">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span className="text-gray-500">Qty: {product.quantity}</span>
                                        <Tooltip title="Copy Product ID" placement="right">
                                            <span
                                                onClick={() => handleCopy(product.productId, 'productId', index)}
                                                className="cursor-pointer text-stone-600 hover:underline"
                                            >
                                                #{product.productId}
                                                {copiedFields[`productId-${index}`] && <Check className="ml-1 w-3 h-3 inline" />}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span>Current: {product.previousInventory}</span>
                                        <span className="mx-2">|</span>
                                        <span className={product.updatedInventory < 30 ? 'text-red-600' : 'text-green-600'}>
                                            Projected: {product.updatedInventory}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-medium text-sm">€ {formatPrice(product.price)}</span>
                                    <span className="text-xs text-gray-500">€ {formatPrice(product.price * product.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const OrderCustomerDetails = ({ order, copiedFields, handleCopy, expandedContact, setExpandedContact }) => {
    const formatAddress = (address) => `${address.street}, ${address.city}, ${address.country}`;

    return (
        <div className="px-1">
            <div className="border rounded-lg p-4">
                <div onClick={() => setExpandedContact(!expandedContact)} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <img
                            src={order.user.profilePicture}
                            alt={`${order.user.firstName}'s profile`}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                            <Typography variant="subtitle2" className="font-medium">
                                {order.user.firstName} {order.user.lastName}
                            </Typography>
                            <Tooltip title="Copy email" placement="right">
                                <Typography
                                    variant="body2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(order.user.email, 'email');
                                    }}
                                    className="text-gray-500 text-sm hover:underline cursor-pointer"
                                >
                                    {order.user.email}
                                    {copiedFields.email && <Check className="ml-1 w-3 h-3 inline" />}
                                </Typography>
                            </Tooltip>
                        </div>
                    </div>

                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                        {expandedContact ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </div>

                {expandedContact && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Typography variant="caption" className="text-gray-500">
                                    Contact
                                </Typography>
                                <div className="flex items-center space-x-1">
                                    <Phone fontSize="small" className="text-gray-400" />
                                    <Tooltip title="Copy phone number" placement="right">
                                        <span onClick={() => handleCopy(order.address.phoneNumber, 'phone')} className="cursor-pointer hover:underline">
                                            {order.address.phoneNumber}
                                            {copiedFields.phone && <Check className="ml-1 w-3 h-3 inline" />}
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Typography variant="caption" className="text-gray-500">
                                    Shipping Method
                                </Typography>
                                <Typography variant="body2">
                                    {order.shippingMethod || 'Standard Shipping'}
                                </Typography>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Typography variant="caption" className="text-gray-500">
                                Shipping Address
                            </Typography>
                            <div className="p-2 bg-gray-50 rounded">
                                <div className="flex items-start">
                                    <LocationOn fontSize="small" className="text-gray-400 mt-0.5 mr-1" />
                                    <Tooltip title="Copy address">
                                        <span
                                            onClick={() => handleCopy(
                                                formatAddress(order.address),
                                                'address'
                                            )}
                                            className="cursor-pointer hover:underline"
                                        >
                                            {order.address.street}, {order.address.city}, {order.address.country}
                                            {copiedFields.address && <Check className="ml-1 w-3 h-3 inline" />}
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderDetailsModal = ({ open, onClose, order }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [copiedFields, setCopiedFields] = useState({});
    const [expandedContact, setExpandedContact] = useState(false);

    const handleCopy = (text, fieldName, productIndex = null) => {
        navigator.clipboard.writeText(text).then(() => {
            const key = productIndex !== null ? `${fieldName}-${productIndex}` : fieldName;
            setCopiedFields(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setCopiedFields(prev => ({ ...prev, [key]: false })), 2000);
            toast.success(`Copied to clipboard`);
        });
    };

    const totalItems = order.products?.reduce((total, product) => total + product.quantity, 0) || 0;
    const uniqueProducts = order.products?.length || 0;
    const showCombinedCount = uniqueProducts === totalItems;

    return (
        <Modal open={open} onClose={onClose} sx={orderDetailsModalSx}>
            <Box sx={orderDetailsBoxSx}>
                <OrderDetailsHeader
                    order={order}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="flex-1 overflow-y-auto py-3 min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            {activeTab === 'products' && (
                                <OrderProductsList
                                    order={order}
                                    showCombinedCount={showCombinedCount}
                                    uniqueProducts={uniqueProducts}
                                    totalItems={totalItems}
                                    copiedFields={copiedFields}
                                    handleCopy={handleCopy}
                                />
                            )}

                            {activeTab === 'contact' && (
                                <OrderCustomerDetails
                                    order={order}
                                    copiedFields={copiedFields}
                                    handleCopy={handleCopy}
                                    expandedContact={expandedContact}
                                    setExpandedContact={setExpandedContact}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t mt-4 bg-white">
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleCopy(order.orderId, 'orderId')}
                    >
                        Copy Order #
                    </Button>
                </div>
            </Box>
        </Modal >
    );
};

const EmptyOrderNotifs = ({ activeFilter }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Avatar className="!w-12 !h-12 !bg-[#F9FAFB] !mb-2">
                <Inbox className='text-stone-600' />
            </Avatar>
            <span className="font-medium text-lg mb-1">
                No {activeFilter === 'archived' ? 'archived orders' : 'notifications'} yet
            </span>
            <span className="text-gray-500 max-w-xs text-sm">
                {activeFilter === 'archived' ? `You'll see archived notifications here when you archive them` : `You'll see notifications here when new orders are placed`}
            </span>
        </div>
    );
};

const OrderNotifHeader = ({ notifications, activeFilter, isAllRead, onToggleReadAll, onFilterChange }) => {
    const handleFilterClick = (filter) => {
        if (filter !== activeFilter) {
            onFilterChange(filter);
        }
    };

    return (
        <>
            {notifications.length > 0 && (
                <div className="sticky top-0 bg-white z-10 px-4 pt-2 flex justify-between items-center">
                    <Typography variant="body2" className="!font-medium">
                        {getNotificationCountText(notifications)}
                    </Typography>
                    <RoundIconButton onClick={onToggleReadAll}>
                        {isAllRead ? <MarkAllUnreadIcon /> : <MarkAllReadIcon />}
                    </RoundIconButton>
                </div>
            )}

            <div className="flex px-4 pt-2 !pb-2 border-b border-gray-100">
                <button
                    onClick={() => handleFilterClick('all')}
                    disabled={activeFilter === 'all'}
                    className={`px-3 py-1 text-sm rounded-full mr-2 ${activeFilter === 'all' ? 'bg-stone-600 text-white cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'}`}
                >
                    All
                </button>
                <button
                    onClick={() => handleFilterClick('archived')}
                    disabled={activeFilter === 'archived'}
                    className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'archived' ? 'bg-stone-600 text-white cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'}`}
                >
                    Archived
                </button>
            </div>
        </>
    );
};

const OrderNotifAvatar = ({ notif }) => {
    return (
        <ListItemAvatar>
            <Avatar className={`!w-10 !h-10 ${notif.isRead ? '!bg-[#F9FAFB]' : '!bg-[#57534E]'}`}>
                <Inbox className={`${notif.isRead ? 'text-stone-600' : 'text-white'}`} />
            </Avatar>
        </ListItemAvatar>
    );
};

const OrderNotifActions = ({ notif, activeFilter, onToggleRead, onArchive, onUnarchive }) => {
    const handleToggleRead = (e) => {
        e.stopPropagation();
        onToggleRead(notif);
    };

    const handleUnarchive = (e, id) => {
        e.stopPropagation();
        onUnarchive(id);
    };

    const handleArchive = (e, id) => {
        e.stopPropagation();
        onArchive(id);
    };

    return (
        <div className="absolute top-2 right-4">
            <div className="flex flex-row space-x-2">
                <RoundIconButton onClick={e => handleToggleRead(e)}>
                    {notif.isRead ? <MarkEmailUnread className="text-stone-600" /> : <MarkEmailRead className="text-stone-600" />}
                </RoundIconButton>

                {activeFilter === 'archived' ? (
                    <RoundIconButton onClick={e => handleUnarchive(e, notif._id)}>
                        <Unarchive className="text-stone-600" />
                    </RoundIconButton>
                ) : (
                    <RoundIconButton onClick={e => handleArchive(e, notif._id)}>
                        <Archive className="text-stone-600" />
                    </RoundIconButton>
                )}
            </div>
        </div>
    );
};

const OrderNotifItem = ({
    notif,
    activeFilter,
    onToggleRead,
    onArchive,
    onUnarchive,
    onClick,
    onCopyOrderId
}) => {
    return (
        <ListItem alignItems="flex-start" onClick={onClick} className={`py-4 px-4 relative cursor-pointer transition-colors ${notif.isRead ? 'bg-white' : 'bg-stone-50'}`}>
            <OrderNotifActions
                notif={notif}
                activeFilter={activeFilter}
                onToggleRead={onToggleRead}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
            />

            <OrderNotifAvatar notif={notif} />

            <div className="flex flex-col flex-1 space-y-2">
                <div>
                    <Typography variant="body1" className={`${notif.isRead ? '' : '!font-semibold'} text-gray-900`}>
                        New Order Placed
                    </Typography>
                    <span onClick={onCopyOrderId} className="text-gray-500 text-sm cursor-pointer hover:underline">
                        Order ID #{notif.data.orderId}
                    </span>
                </div>

                <div className="flex justify-between items-center text-sm font-medium text-gray-900">
                    <span className="font-semibold">
                        <CountUp
                            end={notif.data.total}
                            duration={0.6}
                            separator=","
                            decimals={2}
                            prefix="€ "
                        />
                    </span>
                    <span className="text-gray-500">
                        {formatTimeAgo(notif.createdAt)}
                    </span>
                </div>
            </div>
        </ListItem>
    );
};

const getNotificationCountText = (notifications) => {
    const unread = notifications.filter(n => !n.isRead).length;
    if (unread > 0) {
        return `${unread} unread notification${unread > 1 ? 's' : ''}`;
    }
    const read = notifications.length;
    return `${read} read notification${read > 1 ? 's' : ''}`;
};

export const NotificationDropdown = ({
    isOpen,
    notifications,
    isLoading,
    onToggleRead,
    onArchive,
    onUnarchive,
    onToggleReadAll,
    isAllRead,
    activeFilter,
    onFilterChange,
}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOrderClick = (orderId) => (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(orderId).then(() => {
            toast.success(`Order #${orderId} copied to clipboard`);
        });
    };

    const handleListItemClick = (notification) => {
        const orderData = {
            products: notification.data?.products,
            status: notification.data?.orderStatus,
            user: notification.data?.user,
            address: notification.data?.address,
            total: notification.data?.total,
            orderId: notification.data?.orderId,
            createdAt: notification.data?.createdAt
        };
        setSelectedOrder(orderData);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div tabIndex="0" className="absolute right-0 mt-1 w-96 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
            <DropdownAnimation isOpen={isOpen}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <OrderNotifHeader
                            notifications={notifications}
                            activeFilter={activeFilter}
                            isAllRead={isAllRead}
                            onToggleReadAll={onToggleReadAll}
                            onFilterChange={onFilterChange}
                        />

                        {notifications.length === 0 ? (
                            <EmptyOrderNotifs activeFilter={activeFilter} />
                        ) : (
                            <ul className="divide-y divide-gray-100 overflow-y-auto max-h-[300px]">
                                {notifications.map((notif) => (
                                    <OrderNotifItem
                                        key={notif._id}
                                        notif={notif}
                                        activeFilter={activeFilter}
                                        onToggleRead={() => onToggleRead(notif)}
                                        onArchive={() => onArchive(notif._id)}
                                        onUnarchive={() => onUnarchive(notif._id)}
                                        onClick={() => handleListItemClick(notif)}
                                        onCopyOrderId={handleOrderClick(notif.data.orderId)}
                                    />
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </DropdownAnimation>

            {selectedOrder && (
                <OrderDetailsModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    order={selectedOrder}
                />
            )}
        </div>
    );
};

export const SearchDropdown = ({ results, onClickSuggestion }) => {
    const maxTitleLength = 45;

    const formatPrice = (price) => {
        return Number(price).toFixed(2);
    };

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const listRef = useRef(null);

    useHotkeys('down', (e) => {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIndex((prevIndex) => (prevIndex + 1) % results.length);
    }, { enableOnFormTags: true });

    useHotkeys('up', (e) => {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length);
    }, { enableOnFormTags: true });

    useHotkeys('enter', (e) => {
        if (results.length === 0 || selectedIndex === -1) return;
        e.preventDefault();
        onClickSuggestion(results[selectedIndex].slug);
    }, { enableOnFormTags: true });

    useEffect(() => {
        if (listRef.current && selectedIndex !== -1) {
            const listItem = listRef.current.children[selectedIndex];
            const listContainer = listRef.current;

            if (listItem) {
                const itemTop = listItem.offsetTop;
                const itemHeight = listItem.offsetHeight;
                const containerHeight = listContainer.clientHeight;

                if (itemTop + itemHeight > containerHeight) {
                    listContainer.scrollTop = itemTop + itemHeight - containerHeight;
                } else if (itemTop < listContainer.scrollTop) {
                    listContainer.scrollTop = itemTop;
                }
            }
        }
    }, [selectedIndex, results]);

    return (
        <List sx={searchDropdownSx} ref={listRef}>
            {results.map((result, index) => (
                <ListItem
                    key={result._id}
                    button
                    onClick={() => onClickSuggestion(result.slug)}
                    sx={{
                        ...searchDropdownItemSx,
                        backgroundColor: index === selectedIndex ? '#e0e0e0' : 'transparent',
                    }}
                >
                    <img
                        src={getImageUrl(result.image)}
                        alt={result.name}
                        style={searchDropdownImageSx}
                    />
                    <ListItemText
                        primary={truncateText(result.name, maxTitleLength)}
                        secondary={
                            <>
                                {result.salePrice ? (
                                    <>
                                        <span className='font-bold'>€ {formatPrice(result.salePrice)}</span>
                                        <br />
                                        <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                            € {formatPrice(result.price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className='font-bold'>€ {formatPrice(result.price)}</span>
                                )}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export const FilterLayout = ({
    children,
    loading,
    products,
    noProducts,
    breadcrumbType,
    breadcrumbData,
    onApplyPriceFilter,
    onSaleToggle = false,
}) => (
    <Box sx={filterLayoutSx}>
        <div className="absolute top-0 z-10 pb-4 bg-gray-50">
            {loading ? (
                <WaveSkeleton variant="text" width={250} height={20} />
            ) : products.length > 0 ? (
                <div>
                    <Breadcrumb type={breadcrumbType} data={breadcrumbData} />
                </div>
            ) : (
                <NotFound
                    imageSrc={noProducts}
                    message="No products found for"
                    dynamicValue={breadcrumbData?.name}
                    containerClass="p-8 mt-4 mx-14 md:mx-16 lg:mx-72"
                    imageClass="w-32 h-32"
                />
            )}
        </div>
        <FilterSidebar onApplyPriceFilter={onApplyPriceFilter} onSaleToggle={onSaleToggle} />
        <Box
            component="main"
            sx={layoutContainerSx}
        >
            {children}
        </Box>
    </Box>
);

export const ProductGrid = ({ loading, currentPageItems, isMainPage = false }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${isMainPage ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-4 mt-6`}>
        {loading ? (
            <LoadingProductItem />
        ) : (
            currentPageItems.map(product => <ProductItem key={product._id} product={product} />)
        )}
    </div>
);

export const CustomMenu = ({
    anchorEl,
    handleMenuClose,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            {...customMenuProps}
            disableScrollLock
        >
            <MenuItem onClick={handleEditClick}>
                <Create className='text-stone-500' />
                <span className='ml-2'>Edit</span>
            </MenuItem>
            <MenuItem
                onClick={handleDeleteClick}
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.05)' } }}
            >
                <Delete className='text-red-500' />
                <span className='ml-2 text-red-500'>Delete</span>
            </MenuItem>
        </Menu>
    );
};