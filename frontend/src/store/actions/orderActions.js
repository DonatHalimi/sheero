import { getNotificationsService } from '../../services/notificationService';
import { getUserOrdersService, ITEMS_PER_PAGE } from '../../services/orderService';
import { GET_NOTIFICATION_COUNT, GET_USER_ORDERS, GET_USER_ORDERS_ERROR } from '../types';

export const getUserOrders = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', statusFilter = 'all') => async (dispatch) => {
    try {
        const res = await getUserOrdersService(userId, page, limit, searchTerm, statusFilter);

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

export const getNotificationCount = () => async dispatch => {
    try {
        const res = await getNotificationsService();

        const count = (res.data || []).filter(n => !n.isRead && !n.isArchived).length;

        dispatch({ type: GET_NOTIFICATION_COUNT, payload: count });
    } catch (err) {
        dispatch({ type: GET_NOTIFICATION_COUNT, payload: 0 });
    }
};