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

            const tokenExpiry = JSON.parse(atob(token.split('.')[1])).exp * 1000;
            if (Date.now() >= tokenExpiry) {
                token = await refreshToken(); // Get the new token after refreshing
            }

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;
