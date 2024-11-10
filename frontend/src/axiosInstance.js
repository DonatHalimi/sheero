import axios from 'axios';
import { useContext } from 'react';
import { API_URL } from './config';
import { AuthContext } from './context/AuthContext';

const useAxios = () => {
    const { auth } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
    });

    // Request interceptor to add the access token to every request
    axiosInstance.interceptors.request.use(
        config => {
            if (auth?.accessToken) {
                config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                console.error('Unauthorized access - Please log in again.');
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;