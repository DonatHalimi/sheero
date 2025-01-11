import { GET_CATEGORIES, GET_CATEGORIES_ERROR, GET_SUBCATEGORIES_BY_CATEGORY, GET_SUBCATEGORIES_BY_CATEGORY_ERROR, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY, GET_SUBSUBCATEGORIES_BY_SUBCATEGORY_ERROR } from '../types';

const initialState = {
    categories: [],
    subcategories: {},
    subsubcategories: {},
    loading: true,
    loadingCategories: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                loading: false,
                loadingCategories: false,
                error: null,
            };

        case GET_SUBCATEGORIES_BY_CATEGORY:
            return {
                ...state,
                subcategories: {
                    ...state.subcategories,
                    [action.payload.categoryId]: action.payload.subcategories,
                },
                loading: false,
                error: null,
            };

        case GET_SUBSUBCATEGORIES_BY_SUBCATEGORY:
            return {
                ...state,
                subsubcategories: {
                    ...state.subsubcategories,
                    [action.payload.subcategoryId]: action.payload.subsubcategories,
                },
                loading: false,
                error: null,
            };

        case GET_CATEGORIES_ERROR:
        case GET_SUBCATEGORIES_BY_CATEGORY_ERROR:
        case GET_SUBSUBCATEGORIES_BY_SUBCATEGORY_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}