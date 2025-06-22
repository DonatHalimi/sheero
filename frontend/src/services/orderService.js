import axiosInstance from "../utils/axiosInstance";

export const getOrdersService = () => axiosInstance.get('/orders/get');

export const getOrderDetailsService = (orderId) => axiosInstance.get(`/orders/${orderId}`);

export const ITEMS_PER_PAGE = 8;

export const getUserOrdersService = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', statusFilter = 'all') => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

    return axiosInstance.get(`/orders/user/${userId}?${params.toString()}`);
};

export const editOrderService = (data) => axiosInstance.put('/orders/status/update', data);

export const verifyStripeOrderService = (data) => axiosInstance.post('/orders/verify', data);