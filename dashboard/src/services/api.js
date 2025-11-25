import axios from "axios";

const api = axios.create({
  baseURL: "https://analytical-dashboard-vfwl.onrender.com/api", // backend base URL
  timeout: 10000
});

export default api;
