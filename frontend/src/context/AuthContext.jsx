import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuthState] = useState({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        role: localStorage.getItem('role'),
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        email: localStorage.getItem('email'),
        userId: localStorage.getItem('userId'),
    });

    const setAuth = (authData) => {
        setAuthState(authData);
        localStorage.setItem('accessToken', authData.accessToken || '');
        localStorage.setItem('refreshToken', authData.refreshToken || '');
        localStorage.setItem('role', authData.role || '');
        localStorage.setItem('firstName', authData.firstName || '');
        localStorage.setItem('lastName', authData.lastName || '');
        localStorage.setItem('email', authData.email || '');
        localStorage.setItem('userId', authData.userId || '');
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post('http://localhost:5000/api/auth/refresh-token',
                { refreshToken },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
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
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

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
            await axios.post('http://localhost:5000/api/auth/register', { firstName, lastName, email, password });
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

export { AuthContext, AuthProvider };
