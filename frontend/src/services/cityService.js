import axiosInstance from "../utils/axiosInstance";

export const getCitiesService = () => axiosInstance.get('/cities/get');

export const getCitiesByCountryService = (countryId) => axiosInstance.get(`/cities/country/${countryId}`);

export const addCityService = (data) => axiosInstance.post('/cities/create', data);

export const editCityService = (cityId, data) => axiosInstance.put(`/cities/update/${cityId}`, data);