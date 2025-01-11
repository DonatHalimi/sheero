import axios from 'axios';
import { getApiUrl } from '../../utils/config';
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
    GET_USERS_ERROR
} from '../types';

export const getUsers = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/users/get'), { withCredentials: true });

        dispatch({
            type: GET_USERS,
            payload: res.data.users,
        });
    } catch (error) {
        dispatch({
            type: GET_USERS_ERROR,
            payload: error.response?.data?.message || 'Failed to get users',
        });
    }
};

export const getRoles = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/roles/get'), { withCredentials: true });

        dispatch({
            type: GET_ROLES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_ROLES_ERROR,
            payload: error.response?.data?.message || 'Failed to get roles',
        });
    }
};

export const getReviews = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/reviews/get'), { withCredentials: true });

        dispatch({
            type: GET_REVIEWS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_ERROR,
            payload: error.response?.data?.message || 'Failed to get reviews',
        });
    }
};

export const getOrders = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/orders/get'), { withCredentials: true });

        dispatch({
            type: GET_ORDERS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_ORDERS_ERROR,
            payload: error.response?.data?.message || 'Failed to get orders',
        });
    }
};

export const getReturnRequests = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/returns/get'), { withCredentials: true });

        dispatch({
            type: GET_RETURNS,
            payload: res.data.returnRequests
        });
    } catch (error) {
        dispatch({
            type: GET_RETURNS_ERROR,
            payload: error.response?.data?.message || 'Failed to get returns',
        });
    }
};

export const getFAQs = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/faqs/get'), { withCredentials: true });

        dispatch({
            type: GET_FAQS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_FAQS_ERROR,
            payload: error.response?.data?.message || 'Failed to get faqs',
        });
    }
};

export const getContacts = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/contact/get'), { withCredentials: true });

        dispatch({
            type: GET_CONTACTS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_CONTACTS_ERROR,
            payload: error.response?.data?.message || 'Failed to get contacts',
        });
    }
};

export const getSubcategories = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/subcategories/get'), { withCredentials: true });

        dispatch({
            type: GET_SUBCATEGORIES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_SUBCATEGORIES_ERROR,
            payload: error.response?.data?.message || 'Failed to get subcategories',
        });
    }
};

export const getSubSubcategories = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/subSubcategories/get'), { withCredentials: true });

        dispatch({
            type: GET_SUBSUBCATEGORIES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_SUBSUBCATEGORIES_ERROR,
            payload: error.response?.data?.message || 'Failed to get subsubcategories',
        });
    }
};

export const getCities = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/cities/get'), { withCredentials: true });

        dispatch({
            type: GET_CITIES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_CITIES_ERROR,
            payload: error.response?.data?.message || 'Failed to get cities',
        });
    }
};

export const getAddresses = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/addresses/get'), { withCredentials: true });

        dispatch({
            type: GET_ADDRESSES,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_ADDRESSES_ERROR,
            payload: error.response ? error.response.data : 'Failed to get addresses',
        });
    }
};

export const getSuppliers = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/suppliers/get'), { withCredentials: true });

        dispatch({
            type: GET_SUPPLIERS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: GET_SUPPLIERS_ERROR,
            payload: error.response?.data?.message || 'Failed to get suppliers',
        });
    }
};