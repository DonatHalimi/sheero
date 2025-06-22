import { ITEMS_PER_PAGE } from '../../services/wishlistService';
import { CLEAR_WISHLIST, GET_WISHLIST_COUNT, GET_WISHLIST_ITEMS, GET_WISHLIST_ITEMS_ERROR, REMOVE_FROM_WISHLIST, } from '../types';

const initialState = {
    wishlistItems: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE,
    },
    wishlistCount: 0,
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_WISHLIST_ITEMS:
            return {
                ...state,
                wishlistItems: action.payload.wishlistItems || [],
                pagination: action.payload.pagination || state.pagination,
                loading: false,
                error: null,
            };

        case GET_WISHLIST_COUNT:
            return {
                ...state,
                wishlistCount: action.payload
            };

        case GET_WISHLIST_ITEMS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case REMOVE_FROM_WISHLIST:
            return {
                ...state,
                wishlistItems: state.wishlistItems.filter(item => item.product._id !== action.payload),
            };

        case CLEAR_WISHLIST:
            return {
                ...state,
                wishlistItems: []
            };
        default:
            return state;
    }
};