import axiosInstance from "../utils/axiosInstance";

export const ITEMS_PER_PAGE = 12;

export const getUsersWishlistService = (page = 1, limit = ITEMS_PER_PAGE) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    return axiosInstance.get(`/wishlist?${params.toString()}`);
};

export const addToWishlistService = (data) => axiosInstance.post('/wishlist/add', data);

export const bulkAddWishlistToCartService = (wishlistUserId) => axiosInstance.post('/cart/bulk-add', { wishlistUserId });

export const SHARED_WISHLIST_ITEMS_PER_PAGE = 15;

export const getSharedUserWishlistService = (userId, page = 1, limit = SHARED_WISHLIST_ITEMS_PER_PAGE) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });
    return axiosInstance.get(`/wishlist/${userId}?${params.toString()}`);
};

export const removeFromWishlistService = (productId) => axiosInstance.delete('/wishlist/remove', { data: { productId }, });

export const clearWishlistService = () => axiosInstance.delete('/wishlist/clear');