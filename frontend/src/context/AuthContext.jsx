import axios from 'axios';
import React, { createContext, useState } from 'react';
import CryptoJS from 'crypto-js';
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
    const getLocalStorageItem = (key) => {
        const value = localStorage.getItem(key);
        if (!value) return null;
        try {
            // Always decrypt the stored data
            return decryptData(value);
        } catch (error) {
            console.error('Error decrypting localStorage:', error);
            return null;
        }
    };

    const [auth, setAuthState] = useState({
        accessToken: getLocalStorageItem('accessToken'),
        role: getLocalStorageItem('role'),
        userId: getLocalStorageItem('userId'),
    });

    const setAuth = (authData) => {
        setAuthState(authData);
        localStorage.setItem('accessToken', encryptData(authData.accessToken || ''));
        localStorage.setItem('role', encryptData(authData.role || ''));
        localStorage.setItem('userId', encryptData(authData.userId || ''));
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(getApiUrl('/auth/login'), { email, password });
            const authData = {
                accessToken: response.data.accessToken,
                role: response.data.role,
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
        setAuth({ accessToken: null, role: null, userId: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
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

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, register, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };