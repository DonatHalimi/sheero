import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { createContext, useEffect, useState } from 'react';
import { getApiUrl } from '../config';

const AuthContext = createContext();

const SECRET_KEY = import.meta.env.VITE_CRYPTOJS_SECRET_KEY;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
};

const AuthProvider = ({ children }) => {
    const getLocalStorageItem = (key, encrypted = false) => {
        const value = localStorage.getItem(key);
        if (!value) return null;
        try {
            return encrypted ? decryptData(value) : value;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return null;
        }
    };

    const [auth, setAuthState] = useState({
        accessToken: getLocalStorageItem('accessToken', true),
        refreshToken: getLocalStorageItem('refreshToken', true),
        role: getLocalStorageItem('role', true),
        firstName: getLocalStorageItem('firstName'),
        lastName: getLocalStorageItem('lastName'),
        email: getLocalStorageItem('email'),
        userId: getLocalStorageItem('userId', true),
    });

    const setAuth = (authData) => {
        setAuthState(authData);
        localStorage.setItem('accessToken', encryptData(authData.accessToken || ''));
        localStorage.setItem('refreshToken', encryptData(authData.refreshToken || ''));
        localStorage.setItem('role', encryptData(authData.role || ''));
        localStorage.setItem('firstName', authData.firstName || '');
        localStorage.setItem('lastName', authData.lastName || '');
        localStorage.setItem('email', authData.email || '');
        localStorage.setItem('userId', encryptData(authData.userId || ''));
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = getLocalStorageItem('refreshToken', true);
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(getApiUrl('/auth/token/refresh'),
                { refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const newAccessToken = response.data.accessToken;
            const newRole = response.data.role;

            setAuth({
                ...auth,
                accessToken: newAccessToken,
                role: newRole,
            });

            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error.response?.data?.message || error.message);
            logout();
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(getApiUrl('/auth/login'), { email, password });
            const authData = {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                role: response.data.role,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                userId: response.data.userId,
            };

            setAuth(authData);

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || 'Login failed');
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        setAuth({ accessToken: null, refreshToken: null, role: null, firstName: null, lastName: null, email: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            await axios.post(getApiUrl('/auth/register'), { firstName, lastName, email, password });
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || 'Registration failed');
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const isAdmin = () => {
        return auth.role === 'admin';
    };

    useEffect(() => {
        const refreshToken = async () => {
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error('Token refresh failed:', error);
            }
        };

        const interval = setInterval(refreshToken, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, register, isAdmin, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, decryptData, encryptData };