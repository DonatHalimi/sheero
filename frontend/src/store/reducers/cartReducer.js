import { GET_CART_COUNT } from "../types";

const initialState = {
    cartCount: 0,
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CART_COUNT:
            return {
                ...state,
                cartCount: action.payload
            };
        default:
            return state;
    }
};