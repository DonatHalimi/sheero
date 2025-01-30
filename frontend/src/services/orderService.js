import axiosInstance from "../utils/axiosInstance";

export const getOrdersService = () => axiosInstance.get('/orders/get');

export const getOrderDetailsService = (orderId) => axiosInstance.get(`/orders/${orderId}`);

export const getUserOrdersService = (userId) => axiosInstance.get(`/orders/user/${userId}`);

export const editOrderService = (data) => axiosInstance.put('/orders/status/update', data);

export const verifyStripeOrderService = (data) => axiosInstance.post('/orders/verify', data);