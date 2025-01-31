import { getCategoriesService, getSubcategoriesByCategoryService, getSubSubcategoriesBySubcategoryService } from '../../services/categoryService';
import { GET_CATEGORIES, GET_CATEGORIES_ERROR, GET_SUBCATEGORIES_BY_CATEGORY, GET_SUBCATEGORIES_BY_CATEGORY_ERROR, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY_ERROR } from '../types';

export const getCategories = () => async (dispatch) => {
    try {
        const res = await getCategoriesService();

        dispatch({
            type: GET_CATEGORIES,
            payload: res.data,
        });

        res.data.forEach((category) => {
            dispatch(getSubcategoriesAndSubsubcategories(category._id));
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
        const res = await getSubcategoriesByCategoryService(categoryId);

        dispatch({
            type: GET_SUBCATEGORIES_BY_CATEGORY,
            payload: { categoryId, subcategories: res.data },
        });

        const subsubPromises = res.data.map(async (subcategory) => {
            try {
                const subsubRes = await getSubSubcategoriesBySubcategoryService(subcategory._id);
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