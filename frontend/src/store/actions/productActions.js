import { getProductsPaginatedService, getProductsService, ITEMS_PER_PAGE } from '../../services/productService';
import { GET_PAGINATED_PRODUCTS, GET_PAGINATED_PRODUCTS_ERROR, GET_PRODUCTS, GET_PRODUCTS_ERROR } from '../types';

export const getProducts = () => async (dispatch) => {
    try {
        const res = await getProductsService();

        dispatch({
            type: GET_PRODUCTS,
            payload: res.data.products,
        });
    } catch (error) {
        dispatch({
            type: GET_PRODUCTS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch products',
        });
    }
};

export const getPaginatedProducts = (page = 1, limit = ITEMS_PER_PAGE) => async (dispatch) => {
    try {
        const res = await getProductsPaginatedService(page, limit);

        if (res.data && res.data.success) {
            dispatch({
                type: GET_PAGINATED_PRODUCTS,
                payload: {
                    products: res.data.products,
                    pagination: res.data.pagination,
                    page: page
                },
            });
        } else {
            throw new Error(res.data?.message || 'Failed to fetch paginated products');
        }
    } catch (error) {
        dispatch({
            type: GET_PAGINATED_PRODUCTS_ERROR,
            payload: error.response?.data?.message || error.message || 'Failed to fetch paginated products',
        });
    }
};