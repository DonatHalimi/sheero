import {
    GET_ADDRESSES,
    GET_ADDRESSES_ERROR,
    GET_CITIES,
    GET_CITIES_ERROR,
    GET_CONTACTS,
    GET_CONTACTS_ERROR,
    GET_FAQS,
    GET_FAQS_ERROR,
    GET_ORDERS,
    GET_ORDERS_ERROR,
    GET_RETURNS,
    GET_RETURNS_ERROR,
    GET_REVIEWS,
    GET_REVIEWS_ERROR,
    GET_ROLES,
    GET_ROLES_ERROR,
    GET_SUBCATEGORIES,
    GET_SUBCATEGORIES_ERROR,
    GET_SUBSUBCATEGORIES,
    GET_SUBSUBCATEGORIES_ERROR,
    GET_SUPPLIERS,
    GET_SUPPLIERS_ERROR,
    GET_USERS,
    GET_USERS_ERROR,
} from "../types";

const initialState = {
    users: [],
    roles: [],
    reviews: [],
    orders: [],
    returnRequests: [],
    faqs: [],
    contacts: [],
    subcategories: [],
    subSubcategories: [],
    cities: [],
    addresses: [],
    suppliers: [],
    loading: true,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                users: Array.isArray(action.payload) ? action.payload : [],
                loading: false,
                error: null,
            };

        case GET_ROLES:
            return {
                ...state,
                roles: action.payload,
                loading: false,
                error: null,
            };

        case GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload,
                loading: false,
                error: null,
            };

        case GET_ORDERS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null,
            };

        case GET_RETURNS:
            return {
                ...state,
                returnRequests: action.payload,
                loading: false,
                error: null,
            };

        case GET_FAQS:
            return {
                ...state,
                faqs: action.payload,
                loading: false,
                error: null,
            };

        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                loading: false,
                error: null,
            }

        case GET_SUBCATEGORIES:
            return {
                ...state,
                subcategories: action.payload,
                loading: false,
                error: null,
            };

        case GET_SUBSUBCATEGORIES:
            return {
                ...state,
                subSubcategories: action.payload,
                loading: false,
                error: null,
            };

        case GET_CITIES:
            return {
                ...state,
                cities: action.payload,
                loading: false,
                error: null,
            };

        case GET_ADDRESSES:
            return {
                ...state,
                addresses: action.payload,
                loading: false,
                error: null,
            };

        case GET_SUPPLIERS:
            return {
                ...state,
                suppliers: action.payload,
                loading: false,
                error: null,
            };

        case GET_USERS_ERROR:
        case GET_ROLES_ERROR:
        case GET_REVIEWS_ERROR:
        case GET_ORDERS_ERROR:
        case GET_RETURNS_ERROR:
        case GET_FAQS_ERROR:
        case GET_CONTACTS_ERROR:
        case GET_SUBCATEGORIES_ERROR:
        case GET_SUBSUBCATEGORIES_ERROR:
        case GET_CITIES_ERROR:
        case GET_ADDRESSES_ERROR:
        case GET_SUPPLIERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}