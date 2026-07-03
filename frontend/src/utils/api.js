import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1'; // Adjust based on your backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Interceptor for Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});

export const studentLogin = async (mobileNumber, dob) => {
    const response = await api.post('/auth/student-login', { mobileNumber, dob });
    return response.data;
};

export const fetchQuiz = async (grade) => {
    // This endpoint should return questions based on grade
    // For now using a general fetch or specific query
    const response = await api.get(`/question-masters?grade=${grade}`);
    return response.data;
};

export const submitExam = async (payload) => {
    const response = await api.post('/results/submit', payload);
    return response.data;
};

export const getResults = async () => {
    const response = await api.get('/results/my-results');
    return response.data;
};

export const getResultDetails = async (id) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
};

export const getCertificates = async () => {
    const response = await api.get('/results/my-certificates');
    return response.data;
};

export const downloadCertificate = async (resultId) => {
    const response = await api.get(`/results/${resultId}/certificate`, {
        responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificate_${resultId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const downloadReport = async (resultId) => {
    const response = await api.get(`/results/${resultId}/report`, {
        responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${resultId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export default api;
