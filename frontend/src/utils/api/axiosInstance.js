import axios from 'axios';
import { API_URL } from '../config/config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (originalRequest.url?.includes('/auth/') || originalRequest._retry) {
            return Promise.reject(error);
        }

        if ((status === 401 || status === 403)) {
            const message = error.response?.data?.message || '';
            const isAuthError = message.includes('expired') ||
                message.includes('Authentication required') ||
                message.includes('Invalid token') ||
                status === 401;

            if (!isAuthError) return Promise.reject(error);

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosInstance(originalRequest));
            }

            isRefreshing = true;
            originalRequest._retry = true;

            try {
                const retryResponse = await axiosInstance(originalRequest);

                failedQueue.forEach(({ resolve }) => resolve());
                failedQueue = [];

                return retryResponse;
            } catch (retryError) {
                failedQueue.forEach(({ reject }) => reject(retryError));
                failedQueue = [];

                const path = window.location.pathname;
                if (path !== '/' && path !== '/login') {
                    console.error('Session expired - Redirecting to home page.');
                    window.location.href = '/';
                }

                return Promise.reject(retryError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;