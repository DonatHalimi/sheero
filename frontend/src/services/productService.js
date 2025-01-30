import axiosInstance from "../utils/axiosInstance";

export const getProductsService = () => axiosInstance.get('/products/get');

export const getProductDetails = (id) => axiosInstance.get(`/products/get/${id}`);

export const fetchSearchResultsService = (query) => axiosInstance.get('/products/search', { params: { query } });

export const getProductsByCategoryService = (categoryId) => axiosInstance.get(`/products/get-by-category/${categoryId}`);

export const getProductsBySubcategoryService = (id) => axiosInstance.get(`/products/get-by-subcategory/${id}`);

export const getProductsBySubSubcategoryService = (id) => axiosInstance.get(`/products/get-by-subSubcategory/${id}`);