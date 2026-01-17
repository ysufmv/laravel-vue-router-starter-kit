import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth/')) {
                window.location.href = '/auth/login';
            }
        }

        // Handle 419 CSRF token mismatch - refresh the page
        if (error.response?.status === 419) {
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

export default api;
