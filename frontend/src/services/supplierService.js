import axiosInstance from "../utils/api/axiosInstance";

export const getSuppliersService = () => axiosInstance.get('/suppliers/get');

export const addSupplierService = (data) => axiosInstance.post('/suppliers/create', data);

export const editSupplierService = (supplierId, data) => axiosInstance.put(`/suppliers/update/${supplierId}`, data);