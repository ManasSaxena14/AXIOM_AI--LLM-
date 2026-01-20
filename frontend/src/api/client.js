import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://axiom-ai-llm.onrender.com/api'
        : (import.meta.env.VITE_API_URL || '/api'),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && token !== 'none') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => {
        if (response.data?.data?.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response;
    },
    (error) => {

        const isAuthCheck = error.config?.url?.includes('/auth/session');
        const isExpectedAuthFailure = isAuthCheck && (error.response?.status === 401 || error.response?.status === 404);
        const isSilent = error.config?._silent;

        if (import.meta.env.DEV && !isExpectedAuthFailure && !isSilent) {
            console.error('API Error:', error.response?.data?.message || error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
