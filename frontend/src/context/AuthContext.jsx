import axios from 'axios';
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuthState] = useState({
        accessToken: localStorage.getItem('accessToken'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
    });

    const setAuth = (authData) => {
        setAuthState(authData);
        localStorage.setItem('accessToken', authData.accessToken || '');
        localStorage.setItem('role', authData.role || '');
        localStorage.setItem('username', authData.username || '');
        localStorage.setItem('email', authData.email || '');
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            setAuth({
                accessToken: response.data.accessToken,
                role: response.data.role,
                username: response.data.username,
                email: response.data.email
            });
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || 'Login failed');
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        setAuth({ accessToken: null, role: null, username: null, email: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
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

    return (
        <AuthContext.Provider value={{ auth, setAuth: setAuthState, login, logout, register, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };