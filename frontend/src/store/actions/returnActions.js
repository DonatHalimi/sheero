import { getUserReturnRequestsService, ITEMS_PER_PAGE } from '../../services/returnService';
import { GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

export const getUserReturns = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', statusFilter = 'all') => async (dispatch) => {
    try {
        const res = await getUserReturnRequestsService(userId, page, limit, searchTerm, statusFilter);

        dispatch({
            type: GET_USER_RETURNS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_USER_RETURNS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch user returns',
        });
    }
};