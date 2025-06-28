import axiosInstance from "../utils/api/axiosInstance";

export const getContactsService = () => axiosInstance.get('/contact/get');

export const addContactService = (data) => axiosInstance.post('/contact/create', data);