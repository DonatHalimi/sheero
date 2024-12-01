import { GET_ORDER_DETAILS, GET_ORDER_DETAILS_ERROR, GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

const initialState = {
    orders: [],
    orderDetails: null,
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_ORDERS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null,
            };

        case GET_ORDER_DETAILS:
            return {
                ...state,
                orderDetails: action.payload,
                loading: false,
                error: null,
            };

        case GET_USER_ORDERS_ERROR:
        case GET_ORDER_DETAILS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};