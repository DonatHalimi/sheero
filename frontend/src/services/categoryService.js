import axiosInstance from "../utils/axiosInstance";

export const getCategoriesService = () => axiosInstance.get('/categories/get');

export const getCategoryByIdService = (categoryId) => axiosInstance.get(`/categories/get/${categoryId}`);

export const getSubcategoriesByCategoryService = (categoryId) => axiosInstance.get(`/subcategories/get-by-category/${categoryId}`);

export const getSubSubcategoriesBySubcategoryService = (subcategoryId) => axiosInstance.get(`/subsubcategories/get-by-subcategory/${subcategoryId}`);

export const addCategoryService = (categoryData) => axiosInstance.post('/categories/create', categoryData);

export const editCategoryService = (categoryId, categoryData) => axiosInstance.put(`/categories/update/${categoryId}`, categoryData);