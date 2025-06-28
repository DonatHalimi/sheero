import axiosInstance from "../utils/api/axiosInstance";

export const getFAQsService = () => axiosInstance.get('/faqs/get');

export const addFAQService = (data) => axiosInstance.post('/faqs/create', data);

export const editFAQService = (faqId, data) => axiosInstance.put(`/faqs/update/${faqId}`, data);