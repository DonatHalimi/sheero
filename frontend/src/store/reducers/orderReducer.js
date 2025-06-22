import { ITEMS_PER_PAGE } from '../../services/orderService';
import { GET_NOTIFICATION_COUNT, GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

const initialState = {
    orders: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalOrders: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE,
    },
    notifCount: 0,
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_ORDERS:
            return {
                ...state,
                orders: action.payload.orders || [],
                pagination: action.payload.pagination || state.pagination,
                loading: false,
                error: null,
            };

        case GET_NOTIFICATION_COUNT:
            return {
                ...state,
                notifCount: action.payload,
                loading: false,
                error: null,
            };

        case GET_USER_ORDERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};