import axiosInstance from "../utils/api/axiosInstance";

export const checkReviewEligibilityService = (productId) => axiosInstance.get(`/reviews/orders/check-review/${productId}`);

export const getProductNamesService = () => axiosInstance.get('/reviews/products');

export const ITEMS_PER_PAGE = 8;

export const getUserReviewsService = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', ratingFilter = '') => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
    if (ratingFilter && ratingFilter !== 'all') params.append('rating', ratingFilter);

    return axiosInstance.get(`/reviews/user/${userId}?${params.toString()}`);
};

export const getProductReviewsService = (productId) => axiosInstance.get(`/reviews/products/${productId}`);

export const getReviewsService = () => axiosInstance.get('/reviews/get');

export const addReviewService = (productId, data) => axiosInstance.post(`/reviews/product/${productId}`, data);

export const editReviewService = (reviewId, data) => axiosInstance.put(`/reviews/update/${reviewId}`, data);

export const deleteUserReviewService = (reviewId) => axiosInstance.delete(`/reviews/delete/${reviewId}`);