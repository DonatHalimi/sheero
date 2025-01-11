import axios from 'axios';
import { getApiUrl } from '../../utils/config';
import { GET_CATEGORIES, GET_CATEGORIES_ERROR, GET_SUBCATEGORIES_BY_CATEGORY, GET_SUBCATEGORIES_BY_CATEGORY_ERROR, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY_ERROR } from '../types';

export const getCategories = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/categories/get'), { withCredentials: true });

        dispatch({
            type: GET_CATEGORIES,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_CATEGORIES_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch categories',
        });
    }
};

export const getSubcategoriesAndSubsubcategories = (categoryId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/subcategories/get-by-category/${categoryId}`), { withCredentials: true });

        dispatch({
            type: GET_SUBCATEGORIES_BY_CATEGORY,
            payload: { categoryId, subcategories: res.data },
        });

        const subsubPromises = res.data.map(async (subcategory) => {
            try {
                const subsubRes = await axios.get(
                    getApiUrl(`/subsubcategories/get-by-subcategory/${subcategory._id}`),
                    { withCredentials: true }
                );
                return { subcategoryId: subcategory._id, subsubcategories: subsubRes.data };
            } catch (error) {
                dispatch({
                    type: GET_SUBSUBCATEGORIES_BY_SUBCATEGORY_ERROR,
                    payload: { subcategoryId: subcategory._id, error: error.response?.data?.message || 'Failed to fetch subsubcategories' },
                });
                return null;
            }
        });

        const subsubResults = await Promise.all(subsubPromises);

        subsubResults.forEach((result) => {
            if (result) {
                const { subcategoryId, subsubcategories } = result;
                dispatch({
                    type: GET_SUBSUBCATEGORIES_BY_SUBCATEGORY,
                    payload: { subcategoryId, subsubcategories },
                });
            }
        });
    } catch (error) {
        dispatch({
            type: GET_SUBCATEGORIES_BY_CATEGORY_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch subcategories',
        });
    }
};