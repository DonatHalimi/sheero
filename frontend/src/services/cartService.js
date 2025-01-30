import axiosInstance from "../utils/axiosInstance";

export const getCartService = () => axiosInstance.get('/cart');

export const addToCartService = (data) => axiosInstance.post('/cart/add', data);

export const updateQuantityService = (data) => axiosInstance.put('/cart/quantity/update', data);

export const removeFromCartService = (productId) => axiosInstance.delete('/cart/remove', { data: { productId } });

export const clearCartService = () => axiosInstance.delete('/cart/clear');

export const createStripeSessionService = (data) => axiosInstance.post('/orders/payment/stripe', data);

export const makeCashPaymentService = (data) => axiosInstance.post('/orders/payment/cash', data);