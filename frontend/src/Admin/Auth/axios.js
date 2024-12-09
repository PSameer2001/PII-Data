import axios from "axios";

export const axiosInstance = axios.create({
 baseURL: "http://localhost:5000/admin/api",
  withCredentials: true,
});
