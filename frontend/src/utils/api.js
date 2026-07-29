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

export const checkMobile = async (mobileNumber) => {
    const response = await api.post('/auth/student/check-mobile', { mobileNumber });
    return response.data;
};

export const sendOtp = async (mobileNumber, type) => {
    const response = await api.post('/auth/student/send-otp', { mobileNumber, type });
    return response.data;
};

export const verifyOtp = async (mobileNumber, otp, type) => {
    const response = await api.post('/auth/student/verify-otp', { mobileNumber, otp, type });
    return response.data;
};

export const registerStudent = async (payload) => {
    const response = await api.post('/auth/student/register', payload);
    return response.data;
};

export const changeDob = async (mobileNumber, otp, newDob) => {
    const response = await api.post('/auth/student/change-dob', { mobileNumber, otp, newDob });
    return response.data;
};

export const fetchQuiz = async (grade, language) => {
    const params = `grade=${grade}${language ? `&language=${language}` : ''}`;
    const response = await api.get(`/question-masters?${params}`);
    return response.data;
};

export const submitExam = async (payload) => {
    // If it contains interestAnswers, it's a Career Aptitude submission
    const url = (payload.interestAnswers || payload.academicAnswers) ? '/aptitude-results/submit' : '/results/submit';
    const response = await api.post(url, payload);
    return response.data;
};

export const getResults = async () => {
    const response = await api.get('/results/my-results');
    return response.data;
};

export const getAptitudeResults = async () => {
    const response = await api.get('/aptitude-results/my-results');
    return response.data;
};

export const getResultDetails = async (id) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
};

export const getAptitudeResultDetails = async (id) => {
    const response = await api.get(`/aptitude-results/${id}`);
    return response.data;
};

export const getCertificates = async () => {
    const response = await api.get('/results/my-certificates');
    return response.data;
};

export const downloadCertificate = async (resultId, isAptitude = false) => {
    try {
        const url = isAptitude 
            ? `/aptitude-results/${resultId}/report` 
            : `/results/${resultId}/certificate`;
            
        const response = await api.get(url, {
            responseType: 'blob'
        });

        // Check if response is actually a JSON error payload disguised as a blob
        if (response.data && response.data.type === 'application/json') {
            const text = await response.data.text();
            const parsed = JSON.parse(text);
            throw new Error(parsed.message || 'Failed to download certificate.');
        }

        const urlBlob = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', isAptitude ? `career_report_${resultId}.pdf` : `certificate_${resultId}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Defer cleanup to let browser start downloading
        setTimeout(() => {
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        }, 100);
    } catch (err) {
        console.error('Download certificate error:', err);
        let errorMsg = err.message;
        if (err.response?.data instanceof Blob) {
            try {
                const text = await err.response.data.text();
                const parsed = JSON.parse(text);
                errorMsg = parsed.message || errorMsg;
            } catch (e) {}
        }
        alert('Failed to download certificate: ' + errorMsg);
    }
};

export const downloadReport = async (resultId, isAptitude = false) => {
    try {
        const url = isAptitude 
            ? `/aptitude-results/${resultId}/report` 
            : `/results/${resultId}/report`;
            
        const response = await api.get(url, {
            responseType: 'blob'
        });

        // Check if response is actually a JSON error payload disguised as a blob
        if (response.data && response.data.type === 'application/json') {
            const text = await response.data.text();
            const parsed = JSON.parse(text);
            throw new Error(parsed.message || 'Failed to download report.');
        }

        const urlBlob = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', isAptitude ? `career_report_${resultId}.pdf` : `report_${resultId}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Defer cleanup to let browser start downloading
        setTimeout(() => {
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        }, 100);
    } catch (err) {
        console.error('Download report error:', err);
        let errorMsg = err.message;
        if (err.response?.data instanceof Blob) {
            try {
                const text = await err.response.data.text();
                const parsed = JSON.parse(text);
                errorMsg = parsed.message || errorMsg;
            } catch (e) {}
        }
        alert('Failed to download report: ' + errorMsg);
    }
};

export default api;
