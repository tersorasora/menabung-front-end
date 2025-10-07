import axios from "axios";

const API = axios.create({
    // baseURL: "https://menabung-app.herokuapp.com/api",
    baseURL: "http://localhost:5223/api",
});

// automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;