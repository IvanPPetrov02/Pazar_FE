import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pazarapi-1:8000',  // Ensure this matches your API URL
    withCredentials: true,  // Include credentials if necessary
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
