import axios from 'axios';
import { getApiUrl } from '../../config';
import { GET_ORDER_DETAILS, GET_ORDER_DETAILS_ERROR, GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

export const getUserOrders = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/orders/user/${userId}`), { withCredentials: true });

        dispatch({
            type: GET_USER_ORDERS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_USER_ORDERS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch user orders',
        });
    }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/orders/${orderId}`), { withCredentials: true });

        dispatch({
            type: GET_ORDER_DETAILS,
            payload: res.data.data,
        });
    } catch (error) {
        dispatch({
            type: GET_ORDER_DETAILS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch order details',
        });
    }
};