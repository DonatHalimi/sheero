import axiosInstance from '../utils/api/axiosInstance';

export const loadUserService = () => axiosInstance.get('/auth/me');

export const registerUserService = (userData) => axiosInstance.post('/auth/register', userData);

export const verifyOTPService = (email, otp, action) => axiosInstance.post('/auth/verify-otp', { email, otp, action });

export const resendOTPService = (email) => axiosInstance.post('/auth/resend-otp', { email });

export const forgotPasswordService = (email) => axiosInstance.post('/auth/forgot-password', { email });

export const resetPasswordService = (token, password) => axiosInstance.post(`/auth/reset-password/${token}`, { password });

export const validateResetTokenService = (token) => axiosInstance.get(`/auth/validate-token/${token}`);

export const loginUserService = (email, password) => axiosInstance.post('/auth/login', { email, password });

export const enable2faService = (method = 'email') => axiosInstance.post('/auth/enable-2fa', { method });

export const disable2faService = (method = 'email') => axiosInstance.post('/auth/disable-2fa', { method });

export const verify2faService = (email, otp, action) => axiosInstance.post('/auth/verify-2fa', { email, otp, action });

export const resend2faService = (email, action, method = 'email') => axiosInstance.post('/auth/resend-2fa', { email, action, method });

export const getExistingSecretService = () => axiosInstance.get('/auth/get-existing-secret');

export const enableAuthenticator2FAService = () => axiosInstance.post('/auth/enable-2fa-auth');

export const verify2faAuthService = (email, token, action, isAuthenticator = true) => axiosInstance.post('/auth/verify-2fa-auth', { email, token, action, isAuthenticator });

export const verifySocialLogin2FAService = (data) => axiosInstance.post('/auth/verify-social-2fa', data);

export const toggleLoginNotificationsService = (loginNotifications) => axiosInstance.post('/auth/notifications/toggle', { loginNotifications });

export const logoutUserService = () => axiosInstance.post('/auth/logout');

export const editUserService = (userData) => axiosInstance.put('/auth/profile', userData);