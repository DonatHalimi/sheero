import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuthState] = useState({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        userId: localStorage.getItem('userId'),
    });

    const setAuth = (authData) => {
        setAuthState(authData);
        localStorage.setItem('accessToken', authData.accessToken || '');
        localStorage.setItem('refreshToken', authData.refreshToken || '');
        localStorage.setItem('role', authData.role || '');
        localStorage.setItem('username', authData.username || '');
        localStorage.setItem('email', authData.email || '');
        localStorage.setItem('userId', authData.userId || '');
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/refresh-token', {
                refreshToken: auth.refreshToken,
            });
    
            const newAccessToken = response.data.accessToken;
            const newRole = response.data.role;
    
            setAuth({
                ...auth,
                accessToken: newAccessToken,
                role: newRole,
            });
    
            localStorage.setItem('role', newRole);
    
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error.response?.data?.message || 'Failed to refresh access token');
            logout();
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });

            const authData = {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                role: response.data.role,
                username: response.data.username,
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
        setAuth({ accessToken: null, refreshToken: null, role: null, username: null, email: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
    };

    const register = async (username, email, password) => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
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
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, register, isAdmin, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };