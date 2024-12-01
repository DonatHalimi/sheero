import { GET_SLIDESHOWS, GET_SLIDESHOWS_ERROR } from "../types";

const initialState = {
    images: [],
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SLIDESHOWS:
            return {
                ...state,
                images: Array.isArray(action.payload) ? action.payload : [],
                loading: false,
                error: null,
            };

        case GET_SLIDESHOWS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};