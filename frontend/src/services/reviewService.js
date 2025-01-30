import axiosInstance from "../utils/axiosInstance";

export const checkReviewEligibilityService = (productId) => axiosInstance.get(`/reviews/orders/check-review/${productId}`);

export const getProductNamesService = () => axiosInstance.get('/reviews/products');

export const getUserReviewsService = (userId) => axiosInstance.get(`/reviews/user/${userId}`);

export const getProductReviewsService = (productId) => axiosInstance.get(`/reviews/products/${productId}`);

export const getReviewsService = () => axiosInstance.get('/reviews/get');

export const addReviewService = (productId, data) => axiosInstance.post(`/reviews/product/${productId}`, data);

export const editReviewService = (reviewId, data) => axiosInstance.put(`/reviews/update/${reviewId}`, data);

export const deleteUserReviewService = (reviewId) => axiosInstance.delete(`/reviews/delete/${reviewId}`);