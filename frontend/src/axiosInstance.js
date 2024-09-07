import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const useAxios = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    // Request interceptor to add the access token to every request
    axiosInstance.interceptors.request.use(
        config => {
            if (auth?.accessToken) {
                config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle token refreshing
    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            // If the response is 401, try refreshing the token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Request to refresh the token
                    const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token', {
                        refreshToken: auth.refreshToken,
                    });

                    // Update the access token in the context
                    setAuth(prev => ({
                        ...prev,
                        accessToken: data.accessToken
                    }));

                    // Update the access token in local storage
                    localStorage.setItem('accessToken', data.accessToken);

                    // Update the Authorization header and retry the request
                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                    // Retry the original request with the new access token
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token is invalid or expired', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;