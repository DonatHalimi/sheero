import { ITEMS_PER_PAGE } from '../../services/returnService';
import { GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

const initialState = {
    returns: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalReturns: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE,
    },
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_RETURNS:
            return {
                ...state,
                returns: action.payload.returns || [],
                pagination: action.payload.pagination || state.pagination,
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