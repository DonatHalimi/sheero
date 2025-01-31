import axios from 'axios';
import { API_URL } from './config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/') {
                console.error('Unauthorized access - Please log in again.');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;