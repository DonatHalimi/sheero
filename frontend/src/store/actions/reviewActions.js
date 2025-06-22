import { deleteUserReviewService, editReviewService, getUserReviewsService, ITEMS_PER_PAGE } from '../../services/reviewService';
import { DELETE_USER_REVIEW, DELETE_USER_REVIEW_ERROR, EDIT_USER_REVIEW, EDIT_USER_REVIEW_ERROR, GET_USER_REVIEWS, GET_USER_REVIEWS_ERROR } from '../types';

export const getUserReviews = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', ratingFilter = 'all') => async (dispatch) => {
    dispatch({ type: 'GET_USER_REVIEWS_REQUEST' });

    try {
        const res = await getUserReviewsService(userId, page, limit, searchTerm, ratingFilter);

        dispatch({
            type: GET_USER_REVIEWS,
            payload: {
                reviews: res.data.reviews,
                pagination: res.data.pagination
            },
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
        const res = await editReviewService(reviewId, reviewData);

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
        await deleteUserReviewService(reviewId);

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