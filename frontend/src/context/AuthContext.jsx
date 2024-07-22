import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        role: localStorage.getItem('role'),
    });

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                email: username,
                password
            });
            setAuth({ ...response.data, role: response.data.role });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('role', response.data.role);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response ? error.response.data.message : 'Login failed' };
        }
    };

    const logout = () => {
        setAuth({ accessToken: null, refreshToken: null, role: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
    };

    const register = async (username, email, password) => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response ? error.response.data.message : 'Registration failed' };
        }
    };

    const refreshToken = async () => {
        if (!auth.refreshToken) {
            console.error('No refresh token available');
            return null;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/auth/token', { token: auth.refreshToken });
            setAuth(prevAuth => ({ ...prevAuth, accessToken: response.data.accessToken }));
            localStorage.setItem('accessToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            console.error('Token refresh failed', error);
            logout(); // Log out the user if token refresh fails
            throw error;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (auth.refreshToken) {
                refreshToken();
            }
        }, 15 * 60 * 1000); // Refresh token every 15 minutes

        return () => clearInterval(interval);
    }, [auth.refreshToken]);

    const isAdmin = () => auth.role === 'admin';

    return (
        <AuthContext.Provider value={{ auth, login, logout, register, refreshToken, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

