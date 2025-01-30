import { getUserOrdersService } from '../../services/orderService';
import { GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

export const getUserOrders = (userId) => async (dispatch) => {
    try {
        const res = await getUserOrdersService(userId);

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