import { GET_PRODUCTS, GET_PRODUCTS_ERROR } from '../types';

const initialState = {
    products: [],
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                loading: false,
                error: null,
            };

        case GET_PRODUCTS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};