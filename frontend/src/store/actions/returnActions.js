import axios from 'axios';
import { getApiUrl } from '../../config';
import { GET_RETURN_DETAILS, GET_RETURN_DETAILS_ERROR, GET_USER_RETURNS, GET_USER_RETURNS_ERROR } from '../types';

export const getUserReturns = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/returns/user/${userId}`), { withCredentials: true });

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

export const getReturnDetails = (returnId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/returns/${returnId}`), { withCredentials: true });

        dispatch({
            type: GET_RETURN_DETAILS,
            payload: res.data.data,
        });
    } catch (error) {
        dispatch({
            type: GET_RETURN_DETAILS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch return details',
        });
    }
};