import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor for Auth Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const messageText = error.response?.data?.message || 'Something went wrong';
        return Promise.reject(messageText);
    }
);

// OTP API Functions
export const sendOtp = async (payload) => {
    try {
        const response = await api.post('/api/send-otp', payload);
        return response;
    } catch (error) {
        throw error;
    }
};

export const verifyOtp = async (otp, type, contact) => {
    try {
        const response = await api.post('/api/verify-otp', { otp, type, contact });
        return response;
    } catch (error) {
        throw error;
    }
};

export default api;
