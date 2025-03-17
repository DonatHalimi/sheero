import axiosInstance from "../utils/axiosInstance";

export const getCategoriesService = () => axiosInstance.get('/categories/get');

export const getCategoryBySlugService = (slug) => axiosInstance.get(`/categories/get-by-slug/${slug}`);

export const getSubcategoriesByCategoryService = (slug) => axiosInstance.get(`/subcategories/get-by-category/${slug}`);

export const getSubSubcategoriesBySubcategoryService = (slug) => axiosInstance.get(`/subsubcategories/get-by-subcategory/${slug}`);

export const addCategoryService = (categoryData) => axiosInstance.post('/categories/create', categoryData);

export const editCategoryService = (categoryId, categoryData) => axiosInstance.put(`/categories/update/${categoryId}`, categoryData);