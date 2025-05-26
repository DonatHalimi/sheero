import { clearWishlistService, getUsersWishlistService, removeFromWishlistService } from '../../services/wishlistService';
import { CLEAR_WISHLIST, GET_WISHLIST_COUNT, GET_WISHLIST_ITEMS, GET_WISHLIST_ITEMS_ERROR, REMOVE_FROM_WISHLIST } from '../types';

export const getWishlistItems = () => async (dispatch) => {
    try {
        const res = await getUsersWishlistService();

        dispatch({
            type: GET_WISHLIST_ITEMS,
            payload: res.data.items,
        });
    } catch (error) {
        dispatch({
            type: GET_WISHLIST_ITEMS_ERROR,
            payload: error.response?.data?.message || 'Failed to get wishlist items',
        });
    }
};

export const getWishlistCount = () => async dispatch => {
    try {
        const { data } = await getUsersWishlistService();
        const count = (data.items || []).reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
        );
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