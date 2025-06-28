export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://sheero-backend.onrender.com'
    : 'http://localhost:5000';

export const API_URL = `${BASE_URL}/api`;

export const getImageUrl = (imagePath) => `${BASE_URL}/${imagePath}`;

export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;