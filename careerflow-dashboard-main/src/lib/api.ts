import axios from "axios";
import { getAccessToken } from "./tokenStore";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
