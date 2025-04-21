import axiosInstance from '../utils/axiosInstance';

export const loadUserService = () => axiosInstance.get('/auth/me');

export const registerUserService = (userData) => axiosInstance.post('/auth/register', userData);

export const verifyOTPService = (email, otp, action) => axiosInstance.post('/auth/verify-otp', { email, otp, action });

export const resendOTPService = (email) => axiosInstance.post('/auth/resend-otp', { email });

export const forgotPasswordService = (email) => axiosInstance.post('/auth/forgot-password', { email });

export const resetPasswordService = (token, password) => axiosInstance.post(`/auth/reset-password/${token}`, { password });

export const validateResetTokenService = (token) => axiosInstance.get(`/auth/validate-token/${token}`);

export const loginUserService = (email, password) => axiosInstance.post('/auth/login', { email, password });

export const enable2faService = () => axiosInstance.post('/auth/enable-2fa');

export const disable2faService = () => axiosInstance.post('/auth/disable-2fa');

export const verify2faService = (email, otp, action) => axiosInstance.post('/auth/verify-2fa', { email, otp, action });

export const resend2faService = (email, action) => axiosInstance.post('/auth/resend-2fa', { action, email });

export const getExistingSecretService = () => axiosInstance.get('/auth/get-existing-secret');

export const enableAuthenticator2FAService = () => axiosInstance.post('/auth/enable-2fa-auth');

export const verify2faAuthService = (email, token, action) => axiosInstance.post('/auth/verify-2fa-auth', { email, token, action, isAuthenticator: true });

export const verifySocialLogin2FAService = (data) => axiosInstance.post('/auth/verify-social-2fa', data);

export const logoutUserService = () => axiosInstance.post('/auth/logout');

export const editUserService = (userData) => axiosInstance.put('/auth/profile', userData);