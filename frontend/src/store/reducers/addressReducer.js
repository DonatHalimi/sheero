import { ADD_ADDRESS, ADDRESS_ERROR, DELETE_ADDRESS, GET_ADDRESS, GET_ADDRESS_BY_USER, GET_CITIES_BY_COUNTRY, GET_COUNTRIES, UPDATE_ADDRESS } from '../types';

const initialState = {
    address: null,
    loading: true,
    loadingUserAddress: true,
    loadingCountries: true,
    error: null,
    countries: [],
    cities: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ADDRESS:
            return {
                ...state,
                address: action.payload,
                loading: false,
                error: null,
            };

        case GET_ADDRESS_BY_USER:
            return {
                ...state,
                address: action.payload,
                loadingUserAddress: false,
                error: null,
            };

        case ADD_ADDRESS:
            return {
                ...state,
                address: action.payload,
                loading: false,
                error: null,
            };

        case UPDATE_ADDRESS:
            return {
                ...state,
                address: action.payload,
                loading: false,
                error: null,
            };

        case DELETE_ADDRESS:
            return {
                ...state,
                address: null,
                loading: false,
                error: null,
            };

        case ADDRESS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_COUNTRIES:
            return {
                ...state,
                countries: action.payload,
                loadingCountries: false,
                error: null,
            };

        case GET_CITIES_BY_COUNTRY:
            return {
                ...state,
                cities: action.payload,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};