import { GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

const initialState = {
    returns: [],
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_RETURNS:
            return {
                ...state,
                returns: action.payload,
                loading: false,
                error: null,
            };

        case GET_USER_RETURNS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};