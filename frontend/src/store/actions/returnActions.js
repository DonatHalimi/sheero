import { getUserReturnRequestsService } from '../../services/returnService';
import { GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

export const getUserReturns = (userId) => async (dispatch) => {
    try {
        const res = await getUserReturnRequestsService(userId);

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