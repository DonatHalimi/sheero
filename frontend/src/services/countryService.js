import axiosInstance from "../utils/axiosInstance";

export const getCountriesService = () => axiosInstance.get('/countries/get');

export const addCountryService = (data) => axiosInstance.post('/countries/create', data); 5

export const editCountryService = (countryId, data) => axiosInstance.put(`/countries/update/${countryId}`, data);