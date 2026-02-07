import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  validateStatus: (status: number) => {
    return status < 500;
  },
});

export default axiosInstance;
