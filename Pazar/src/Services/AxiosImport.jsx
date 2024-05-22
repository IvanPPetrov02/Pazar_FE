import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    //baseURL: 'http://localhost:8080', //TODO: Change this to the production URL
    baseURL: 'http://localhost:5190', // For development
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = Cookies.get('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;
