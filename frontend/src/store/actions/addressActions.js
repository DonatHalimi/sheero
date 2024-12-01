import axios from 'axios';
import { getApiUrl } from '../../config';
import { ADD_ADDRESS, ADDRESS_ERROR, GET_ADDRESS, GET_CITIES_BY_COUNTRY, GET_COUNTRIES, UPDATE_ADDRESS } from '../types';

export const getAddress = (addressId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/addresses/get/${addressId}`), { withCredentials: true });

        dispatch({
            type: GET_ADDRESS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'An error occurred while fetching the address',
        });
    }
};

export const getAddressByUser = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/addresses/user/${userId}`), { withCredentials: true });

        dispatch({
            type: GET_ADDRESS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'An error occurred while fetching the user address',
        });
    }
};

export const addAddress = (addressData) => async (dispatch) => {
    try {
        const res = await axios.post(getApiUrl('/addresses/create'), addressData, { withCredentials: true });

        dispatch({
            type: ADD_ADDRESS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'An error occurred while adding the address',
        });
    }
};


export const updateAddress = (addressId, addressData) => async (dispatch) => {
    try {
        const res = await axios.put(getApiUrl(`/addresses/update/${addressId}`), addressData, { withCredentials: true });

        dispatch({
            type: UPDATE_ADDRESS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'An error occurred while updating the address',
        });
    }
};

export const getCountries = () => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl('/countries/get'), { withCredentials: true });

        dispatch({
            type: GET_COUNTRIES,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'Error fetching countries',
        });
    }
};

export const getCities = (countryId) => async (dispatch) => {
    try {
        const res = await axios.get(getApiUrl(`/cities/country/${countryId}`), { withCredentials: true });

        dispatch({
            type: GET_CITIES_BY_COUNTRY,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: ADDRESS_ERROR,
            payload: error.response ? error.response.data : 'Error fetching cities',
        });
    }
};
