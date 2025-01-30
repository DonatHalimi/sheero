import axiosInstance from "../utils/axiosInstance";

export const getUsersWishlistService = () => axiosInstance.get('/wishlist');

export const addToWishlistService = (data) => axiosInstance.post('/wishlist/add', data);

export const getSharedUserWishlistService = (userId) => axiosInstance.get(`/wishlist/${userId}`);

export const removeFromWishlistService = (productId) => axiosInstance.delete('/wishlist/remove', { data: { productId }, });

export const clearWishlistService = () => axiosInstance.delete('/wishlist/clear');