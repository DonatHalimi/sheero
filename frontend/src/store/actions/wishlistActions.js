import { clearWishlistService, getUsersWishlistService, ITEMS_PER_PAGE, removeFromWishlistService } from '../../services/wishlistService';
import { CLEAR_WISHLIST, GET_WISHLIST_COUNT, GET_WISHLIST_ITEMS, GET_WISHLIST_ITEMS_ERROR, REMOVE_FROM_WISHLIST } from '../types';

export const getWishlistItems = (page = 1, limit = ITEMS_PER_PAGE) => async (dispatch) => {
    try {
        const res = await getUsersWishlistService(page, limit);

        dispatch({
            type: GET_WISHLIST_ITEMS,
            payload: {
                wishlistItems: res.data.items,
                pagination: res.data.pagination,
            },
        });

        return {
            items: res.data.items,
            totalCount: res.data.pagination.totalItems,
            pagination: res.data.pagination
        };
    } catch (error) {
        dispatch({
            type: GET_WISHLIST_ITEMS_ERROR,
            payload: error.response?.data?.message || 'Failed to get wishlist items',
        });

        return {
            items: [],
            totalCount: 0,
            pagination: null
        };
    }
};

export const getWishlistCount = () => async dispatch => {
    try {
        const res = await getUsersWishlistService(1, ITEMS_PER_PAGE);

        const count = res.data.pagination?.totalItems || 0;

        dispatch({ type: GET_WISHLIST_COUNT, payload: count });
    } catch (err) {
        console.error('Error fetching wishlist count', err);
        dispatch({ type: GET_WISHLIST_COUNT, payload: 0 });
    }
};

export const removeFromWishlist = (productId) => async (dispatch) => {
    try {
        await removeFromWishlistService(productId);

        dispatch({
            type: REMOVE_FROM_WISHLIST,
            payload: productId,
        });
    } catch (error) {
        console.error('Error removing wishlist item:', error);
    }
};

export const clearWishlist = (closeModal) => async (dispatch) => {
    try {
        await clearWishlistService();

        dispatch({ type: CLEAR_WISHLIST });
        if (closeModal) {
            closeModal();
        }
    } catch (error) {
        console.error('Error clearing wishlist:', error);
    }
};