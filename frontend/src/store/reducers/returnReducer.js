import { GET_RETURN_DETAILS, GET_RETURN_DETAILS_ERROR, GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

const initialState = {
    returns: [],
    returnDetails: null,
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

        case GET_RETURN_DETAILS:
            return {
                ...state,
                returnDetails: action.payload,
                loading: false,
                error: null,
            };

        case GET_USER_RETURNS_ERROR:
        case GET_RETURN_DETAILS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};