import axios from 'axios';
import { getApiUrl } from '../../config';
import { DELETE_USER_REVIEW, DELETE_USER_REVIEW_ERROR, EDIT_USER_REVIEW, EDIT_USER_REVIEW_ERROR, GET_USER_REVIEWS, GET_USER_REVIEWS_ERROR } from '../types';

export const getUserReviews = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/reviews/user/${userId}`), { withCredentials: true });

        dispatch({
            type: GET_USER_REVIEWS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_USER_REVIEWS_ERROR,
            payload: error.response?.data?.message || 'Failed to get user reviews',
        });
    }
};

export const editUserReview = (reviewId, reviewData) => async (dispatch) => {
    try {
        const res = await axios.put(getApiUrl(`/reviews/update/${reviewId}`), reviewData, { withCredentials: true });

        dispatch({
            type: EDIT_USER_REVIEW,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: EDIT_USER_REVIEW_ERROR,
            payload: error.response?.data?.message || 'Failed to edit user review',
        });
    }
};

export const deleteUserReview = (reviewId) => async (dispatch) => {
    try {
        await axios.delete(getApiUrl(`/reviews/delete/${reviewId}`), { withCredentials: true });

        dispatch({
            type: DELETE_USER_REVIEW,
            payload: reviewId,
        });
    } catch (error) {
        dispatch({
            type: DELETE_USER_REVIEW_ERROR,
            payload: error.response?.data?.message || 'Failed to delete user review',
        });
    }
};