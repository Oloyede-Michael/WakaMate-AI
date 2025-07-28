// src/api/axios.js
import axios from "../../../wakamate_backend/middleware/authMiddleware";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1050/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;