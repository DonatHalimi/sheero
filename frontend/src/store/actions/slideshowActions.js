import axios from 'axios';
import { getApiUrl } from '../../utils/config';
import { GET_SLIDESHOWS, GET_SLIDESHOWS_ERROR } from '../types';

export const getImages = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/slideshow/get'), { withCredentials: true });

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