import { ITEMS_PER_PAGE } from '../../services/productService';
import { GET_PAGINATED_PRODUCTS, GET_PAGINATED_PRODUCTS_ERROR, GET_PRODUCTS, GET_PRODUCTS_ERROR } from '../types';

const initialState = {
    products: [],
    paginatedProducts: [],
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        limit: ITEMS_PER_PAGE,
    },
    loading: true,
    paginatedLoading: false,
    error: null,
    paginatedError: null,
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

        case GET_PAGINATED_PRODUCTS:
            return {
                ...state,
                paginatedProducts: action.payload.products,
                pagination: {
                    currentPage: action.payload.page,
                    hasNextPage: action.payload.pagination.hasNextPage,
                    totalProducts: action.payload.pagination.totalProducts
                },
                paginatedLoading: false,
                paginatedError: null,
            };

        case GET_PAGINATED_PRODUCTS_ERROR:
            return {
                ...state,
                paginatedLoading: false,
                paginatedError: action.payload,
            };

        default:
            return state;
    }
};