import axios from 'axios';
import TokenManager from './TokenManager';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Adjust the base URL as needed
});

api.interceptors.request.use(
    (config) => {
        const token = TokenManager.getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
