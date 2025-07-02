import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * @file utils.js
 * @description A collection of general-purpose helper functions for the application.
 *
 * This file provides utility functions that support formatting, data manipulation,
 * and other common tasks to simplify and streamline core application logic.
 */

export const handleApiError = (error, defaultMessage) => {
    if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.message));
    } else {
        toast.error(defaultMessage);
    }
};

export const getLocalStorageState = (key, defaultValue) => {
    const savedState = localStorage.getItem('uiState');
    const parsed = savedState ? JSON.parse(savedState) : {};
    return key in parsed ? parsed[key] : defaultValue;
};

export const saveLocalStorageState = (key, value) => {
    const savedState = localStorage.getItem('uiState');
    const parsed = savedState ? JSON.parse(savedState) : {};
    parsed[key] = value;
    localStorage.setItem('uiState', JSON.stringify(parsed));
};

export const filterProductsByPrice = (products, range) => {
    return products.filter(product => {
        const priceToCheck = product.salePrice || product.price;
        if (range.min && priceToCheck < parseFloat(range.min)) return false;
        if (range.max && priceToCheck > parseFloat(range.max)) return false;
        return true;
    });
};

export const handlePageChange = (setPage) => (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
};

export const formatDimensions = (dimensions) => {
    if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height || !dimensions.unit) {
        return 'N/A';
    }
    return `${dimensions.length} x ${dimensions.width} x ${dimensions.height} ${dimensions.unit}`;
};

export const formatDiscount = (discount) => {
    return discount ? `${discount.value} ${discount.type}` : 'No Discount';
};

export const formatProductDiscount = (discount) => {
    if (!discount) return 'N/A';
    return `${discount.value}${discount.type === 'percentage' ? '%' : ''}`;
};

export const formatProductVariants = (variants) => {
    if (!variants || variants.length === 0) return 'N/A';
    return variants.map(variant => `Color: ${variant.color}, Size: ${variant.size}`).join(', ');
};

export const formatName = (name) => {
    return name?.name || 'Not Found';
};

export const formatVariants = (variants) => {
    return variants.length ? variants.map(variant => variant.name).join(', ') : 'No Variants';
};

export const formatSupplier = (supplier) => {
    return `${supplier?.name || 'No Supplier'} (${supplier?.contactInfo?.email || 'No Email'})`;
};

export const formatDetails = (details) => {
    return details.length ? details.join(', ') : 'No Details';
};

export const formatProductDetails = (details) => {
    if (!details || details.length === 0) return 'N/A';
    return details.map(detail => `${detail.attribute}: ${detail.value}`).join(', ');
};

export const formatReviews = (reviews) => {
    return reviews.length
        ? reviews.join(', ')
        : 'No Reviews';
};

export const formatShipping = (shipping) => {
    if (!shipping) return 'N/A';

    return `${shipping?.packageSize || 'Unknown Size'} | ${shipping?.cost ? '€' + shipping.cost : 'No Cost'} | Dimensions: ${shipping?.dimensions ? formatDimensions(shipping.dimensions) : 'No Dimensions'}`;
};

export const formatProductShipping = (shipping) => {
    if (!shipping) return 'N/A';
    return `${shipping.weight} kg, ${shipping.cost}€, ${shipping.packageSize}`;
};

export const getEmptyStateMessage = (context, items, searchTerm, statusFilter) => {
    const entity = context === 'reviews' ? 'reviews' : context === 'orders' ? 'orders' : context === 'wishlist' ? 'wishlist item' : context === 'sharedWishlist' ? 'wishlist item' : 'returns';

    if (items.length === 0 && !searchTerm) return context === 'wishlist' ? "Your wishlist is empty." : `No ${entity} found.`;
    if (items.length === 0 && searchTerm) return `No ${entity} match your search term!`;

    if (items.length === 0) return `You haven't placed any ${entity} yet!`;
    if (searchTerm && statusFilter !== 'all') return `No ${entity} match your search and selected filters.`;
    if (searchTerm) return `No ${entity} match your search term.`;
    if (statusFilter !== 'all') return `No ${entity} match the selected filters.`;
    return `No ${entity} found.`;
};

export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const pluralize = (word, count) => {
    if (count === 1) return word;
    return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`;
};

export const formatPrice = (price) => {
    if (price == null) return '0.00';
    return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const calculatePageCount = (items, itemsPerPage) => Math.ceil(items.length / itemsPerPage);

export const getPaginatedItems = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
};

export const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return null;
};

export const sortProducts = (products, order) => {
    let sortedProducts = [...products];
    switch (order) {
        case 'lowToHigh':
            return sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        case 'highToLow':
            return sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        case 'newest':
            return sortedProducts.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
        case 'highestSale':
            return sortedProducts.sort((a, b) => (b.discount?.value || 0) - (a.discount?.value || 0));
        default:
            return products;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const d = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const t = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return `${d} at ${t}`;
};

export const formatFullDate = (dateInput, { dateOnly } = {}) => {
    const date = new Date(dateInput);

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    const dateStr = date.toLocaleDateString('en-US', dateOptions);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);

    return dateOnly ? dateStr : `${dateStr} at ${timeStr}`;
};

export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }

    return 'Just now';
};

export const formatArrivalDateRange = (order) => `${formatDate(order.arrivalDateRange.start)} - ${formatDate(order.arrivalDateRange.end)}`;
export const formatUser = (order) => `${order.user.email}`;
export const formatProducts = (order) => order.products.map(item => item.product.name).join(', ');
export const formatQuantity = (order) => order.products.map(item => item.quantity).join(', ');
export const formatTotalAmount = (order) => `€  ${order.totalAmount.toFixed(2)}`;
export const formatAddress = (order) => `${order?.address?.street}, ${order?.address?.city?.name}, ${order?.address?.country?.name}, ${order?.address?.phoneNumber}`;

export const STATUS_CLASSES = {
    order: {
        pending: 'text-yellow-500',
        processed: 'text-cyan-500',
        shipped: 'text-blue-700',
        delivered: 'text-green-500',
        canceled: 'text-red-500',
        default: 'text-gray-500',
    },
    return: {
        pending: 'text-yellow-500',
        approved: 'text-blue-500',
        rejected: 'text-red-500',
        processed: 'text-green-500',
        default: 'text-gray-500',
    }
};

export const getStatusColor = (status, type = 'order') => {
    const classes = STATUS_CLASSES[type] || {};
    return `${classes[status] || classes.default} capitalize bg-stone-50 rounded-md px-1`;
};

export const knownEmailProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'mail.com',
    'aol.com',
    'zoho.com',
    'protonmail.com',
    'yandex.com',
    'fastmail.com',
    'gmx.com',
    'tutanota.com',
    'hushmail.com',
    'live.com',
    'me.com',
    'msn.com',
    'webmail.com',
    'front.com',
    'rediffmail.com',
    'cogeco.ca',
    'comcast.net',
    'verizon.net',
    'btinternet.com',
    'bellsouth.net',
    'sbcglobal.net',
    'blueyonder.co.uk',
    'charter.net',
    'earthlink.net',
    'optimum.net',
    'xfinity.com',
    'freenet.de',
    'mail.ru',
    'sina.com',
    'qq.com',
    '163.com',
    '126.com',
    'aliyun.com',
    '126.com',
    'example',
    'test',
    'custommail'
];