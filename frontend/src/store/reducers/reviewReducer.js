import { ITEMS_PER_PAGE } from '../../services/reviewService';
import { DELETE_USER_REVIEW, DELETE_USER_REVIEW_ERROR, EDIT_USER_REVIEW, EDIT_USER_REVIEW_ERROR, GET_USER_REVIEWS, GET_USER_REVIEWS_ERROR } from '../types';

const initialState = {
    reviews: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalReviews: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE,
    },
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER_REVIEWS:
            return {
                ...state,
                reviews: action.payload.reviews || [],
                pagination: action.payload.pagination || state.pagination,
                loading: false,
                error: null,
            };

        case EDIT_USER_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review =>
                    review._id === action.payload._id ? action.payload : review
                ),
                loading: false,
                error: null,
            };

        case DELETE_USER_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review._id !== action.payload),
                loading: false,
                error: null,
            };

        case GET_USER_REVIEWS_ERROR:
        case EDIT_USER_REVIEW_ERROR:
        case DELETE_USER_REVIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}