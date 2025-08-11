import axios from 'axios';

// Create an Axios instance with a base URL for your backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, // ✅ Include credentials (cookies)
});

export default api;