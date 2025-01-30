import axiosInstance from '../utils/axiosInstance';

export const loadUserService = () => axiosInstance('/auth/me');

export const registerUserService = (userData) => axiosInstance.post('/auth/register', userData);

export const loginUserService = (email, password) => axiosInstance.post('/auth/login', { email, password });

export const logoutUserService = () => axiosInstance.post('/auth/logout');

export const editUserService = (userData) => axiosInstance.put('/auth/profile', userData);