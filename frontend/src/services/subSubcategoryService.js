import axiosInstance from "../utils/axiosInstance";

export const getSubSubcategoriesService = () => axiosInstance.get('/subSubcategories/get');

export const getSubSubcategoriesBySubCategoryService = (subcategoryId) => axiosInstance.get(`/subsubcategories/get-by-subCategory/${subcategoryId}`);

export const getSubSubcategoryBySlugService = (slug) => axiosInstance.get(`/subsubcategories/get-by-slug/${slug}`);

export const addSubSubcategoryService = (data) => axiosInstance.post('/subsubcategories/create', data);

export const editSubSubcategoryService = (subSubcategoryId, data) => axiosInstance.put(`/subsubcategories/update/${subSubcategoryId}`, data);