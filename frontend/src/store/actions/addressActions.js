import { addAddressService, editAddressService, getAddressByUserService, getAddressService } from '../../services/addressService';
import { getCitiesByCountryService } from '../../services/cityService';
import { getCountriesService } from '../../services/countryService';
import { ADD_ADDRESS, ADDRESS_ERROR, GET_ADDRESS, GET_ADDRESS_BY_USER, GET_CITIES_BY_COUNTRY, GET_COUNTRIES, UPDATE_ADDRESS } from '../types';

export const getAddress = (addressId) => async (dispatch) => {
    try {
        const res = await getAddressService(addressId);

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

export const getUserAddress = (userId) => async (dispatch) => {
    try {
        const res = await getAddressByUserService(userId);

        dispatch({
            type: GET_ADDRESS_BY_USER,
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
        const res = await addAddressService(addressData);

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
        const res = await editAddressService(addressId, addressData);

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
        const res = await getCountriesService();

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
        const res = await getCitiesByCountryService(countryId);

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
