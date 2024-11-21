import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
