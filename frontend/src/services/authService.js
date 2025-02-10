import axiosInstance from '../utils/axiosInstance';

export const loadUserService = () => axiosInstance.get('/auth/me');

export const registerUserService = (userData) => axiosInstance.post('/auth/register', userData);

export const verifyOTPService = (email, otp) => axiosInstance.post('/auth/verify-otp', { email, otp });

export const resendOTPService = (email) => axiosInstance.post('/auth/resend-otp', { email });

export const forgotPasswordService = (email) => axiosInstance.post('/auth/forgot-password', { email });

export const resetPasswordService = (token, password) => axiosInstance.post(`/auth/reset-password/${token}`, { password });

export const validateResetTokenService = (token) => axiosInstance.get(`/auth/validate-token/${token}`);

export const loginUserService = (email, password) => axiosInstance.post('/auth/login', { email, password });

export const enable2faService = () => axiosInstance.post('/auth/enable-2fa');

export const disable2faService = () => axiosInstance.post('/auth/disable-2fa');

export const verify2faService = (email, otp, action) => axiosInstance.post('/auth/verify-2fa', { email, otp, action });

export const resend2faService = (email, action) => axiosInstance.post('/auth/resend-2fa', { action, email });

export const logoutUserService = () => axiosInstance.post('/auth/logout');

export const editUserService = (userData) => axiosInstance.put('/auth/profile', userData);