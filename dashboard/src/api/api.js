import axios from "axios";

const API = axios.create({
  baseURL: "https://analytical-dashboard-vfwl.onrender.com/api",
});

export default API;
