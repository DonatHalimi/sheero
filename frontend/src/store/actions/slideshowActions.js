import { getSlideShowService } from '../../services/slideshowService';
import { GET_SLIDESHOWS, GET_SLIDESHOWS_ERROR } from '../types';

export const getImages = () => async (dispatch) => {
    try {
        const res = await getSlideShowService();

        dispatch({
            type: GET_SLIDESHOWS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: GET_SLIDESHOWS_ERROR,
            payload: error.response?.data?.message || 'Failed to fetch slideshow images',
        });
    }
};