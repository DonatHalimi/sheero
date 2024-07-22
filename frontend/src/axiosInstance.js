import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const useAxios = () => {
    const { auth, refreshToken } = useContext(AuthContext);

    const instance = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    instance.interceptors.request.use(
        async (config) => {
            let token = auth.accessToken;
            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const tokenExpiry = tokenPayload.exp * 1000;

                if (Date.now() >= tokenExpiry) {
                    console.log('Token expired, refreshing token...');
                    try {
                        token = await refreshToken();
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                        throw error;
                    }
                }

                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            console.error('Error in request interceptor:', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!error.response) {
                console.error('Network error:', error);
                return Promise.reject({ message: 'Network error', ...error });
            }

            const originalRequest = error.config;
            if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const token = await refreshToken();
                    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return instance(originalRequest);
                } catch (err) {
                    console.error('Error refreshing token in response interceptor:', err);
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;