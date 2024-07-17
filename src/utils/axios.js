/**
 * axios setup to use mock service
 */

import axios from 'axios';

const axiosServices = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/', headers: {
        'Content-Type': 'application/json'
    }
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        // return Promise.reject((error.response && error.response.data) || 'Wrong Services')
        return Promise.reject(error || 'Wrong Services')
    }
);

export default axiosServices;