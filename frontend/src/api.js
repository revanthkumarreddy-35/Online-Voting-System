import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    withCredentials: true // Important for sending session cookies
});

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                // Clear user data and redirect to login if not already on login/register
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
            // Handle 403 Forbidden
            else if (error.response.status === 403) {
                alert('You do not have permission to access this resource.');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
