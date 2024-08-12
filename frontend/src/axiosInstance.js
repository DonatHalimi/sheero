import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const useAxios = () => {
    const { auth } = useContext(AuthContext);

    const instance = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    instance.interceptors.request.use(
        (config) => {
            const token = auth.accessToken;
            if (token) {
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
        (error) => {
            if (!error.response) {
                console.error('Network error:', error);
                return Promise.reject({ message: 'Network error', ...error });
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;