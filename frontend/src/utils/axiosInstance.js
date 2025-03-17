import axios from 'axios';
import { API_URL } from './config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status, config } = error.response || {};
        const isAuthEndpoint = config?.url?.includes('/auth/me');
        const isUnauthorized = status === 401 || status === 403;

        if (isUnauthorized && !isAuthEndpoint) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/') {
                console.error('Unauthorized access - Redirecting to home page.');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;