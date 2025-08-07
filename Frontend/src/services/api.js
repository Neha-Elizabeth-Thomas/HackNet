import axios from 'axios';

// Create an Axios instance with a base URL for your backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, // ✅ Include credentials (cookies)
});

// Interceptor to add the JWT to every request if it exists
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;