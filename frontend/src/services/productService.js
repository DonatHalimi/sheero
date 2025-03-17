import axiosInstance from "../utils/axiosInstance";

export const getProductsService = () => axiosInstance.get('/products/get');

export const getProductDetails = (slug) => axiosInstance.get(`/products/get-by-slug/${slug}`);

export const fetchSearchResultsService = (query) => axiosInstance.get('/products/search', { params: { query } });

export const getProductsByCategoryService = (categoryId) => axiosInstance.get(`/products/get-by-category/${categoryId}`);

export const getProductsBySubcategoryService = (slug) => axiosInstance.get(`/products/get-by-subcategory/${slug}`);

export const getProductsBySubSubcategoryService = (slug) => axiosInstance.get(`/products/get-by-subSubcategory/${slug}`);

export const subscribeForRestockService = (id, email) => axiosInstance.post(`/products/${id}/subscribe-restock`, { email });

export const getRestockSubscriptions = () => axiosInstance.get('/products/restock-subscriptions');

export const checkUserRestockSubscriptionService = (email) => axiosInstance.get(`/products/restock-subscription?email=${email}`);

export const deleteUserRestockSubscriptionService = () => axiosInstance.delete(`/products/delete-restock-subscription`);