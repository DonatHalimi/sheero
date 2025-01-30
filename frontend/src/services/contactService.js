import axiosInstance from "../utils/axiosInstance";

export const getContactsService = () => axiosInstance.get('/contact/get');

export const addContactService = (data) => axiosInstance.post('/contact/create', data);