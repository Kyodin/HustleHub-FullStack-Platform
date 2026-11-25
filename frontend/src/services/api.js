import axios from "axios";

// Create one reusable Axios instance for the whole frontend
const api = axios.create({
  baseURL: "https://localhost:3000/api"
});

// Add the JWT token automatically before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;