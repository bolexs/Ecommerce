import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ecommerce-k42q.onrender.com/api/",
});

// An interceptor to handle expired or invalid tokens

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 400)
    ) {
      const message = error.response.data.responseMessage;

      if (
        message === "Access denied. No token provided." ||
        message === "Access denied: User not found" ||
        message === "Invalid token"
      ) {
        sessionStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
