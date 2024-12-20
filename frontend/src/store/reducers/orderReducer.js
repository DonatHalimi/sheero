import { GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

const initialState = {
    orders: [],
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