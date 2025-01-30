import { getProductsService } from '../../services/productService';
import { GET_PRODUCTS, GET_PRODUCTS_ERROR } from '../types';

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