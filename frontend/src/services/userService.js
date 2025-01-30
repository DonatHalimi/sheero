import axiosInstance from "../utils/axiosInstance";

export const getUsersService = () => axiosInstance.get('/users/get');

export const addUserService = (data) => axiosInstance.post('/users/create', data);

export const editUserService = (userId, data) => axiosInstance.put(`/users/update/${userId}`, data);