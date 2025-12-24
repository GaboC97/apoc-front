import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default api;
