import axiosInstance from "../utils/axiosInstance";

export const getSubcategoriesService = () => axiosInstance.get('/subcategories/get');

export const getSubcategoryByIdService = (id) => axiosInstance.get(`/subcategories/get/${id}`);

export const addSubcategoryService = (data) => axiosInstance.post('/subcategories/create', data);

export const editSubcategoryService = (subcategoryId, data) => axiosInstance.put(`/subcategories/update/${subcategoryId}`, data);