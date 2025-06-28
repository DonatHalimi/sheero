import axiosInstance from "../utils/api/axiosInstance";

export const getSubcategoriesService = () => axiosInstance.get('/subcategories/get');

export const getSubcategoryByIdService = (id) => axiosInstance.get(`/subcategories/get/${id}`);

export const getSubcategoryBySlugService = (slug) => axiosInstance.get(`/subcategories/get-by-slug/${slug}`);

export const addSubcategoryService = (data) => axiosInstance.post('/subcategories/create', data);

export const editSubcategoryService = (subcategoryId, data) => axiosInstance.put(`/subcategories/update/${subcategoryId}`, data);