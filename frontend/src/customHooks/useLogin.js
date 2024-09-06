import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance.config";
import { endpoints } from "../api/endpoints";
import useNotification from "./useNotification";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { onNotify } = useNotification();
  const navigate = useNavigate();

  // function to call for login
  const onLogin = async (request) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(endpoints.auth.login, request);
      setLoading(false);

      if (response.data?.responseCode === "00") {
        onNotify("success", "Successful", response?.data?.responseMessage);
        const token = response.data?.data?.token;
        sessionStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        const redirectPath = decodedToken.isAdmin ? "/admin" : "/user";
        setTimeout(() => {
          return navigate(redirectPath, {
            replace: true,
          });
        }, 2000);
      } else {
        onNotify("error", "Error occured", response?.data?.responseMessage);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      onNotify("error", "Error occured", error.response?.data?.responseMessage);
    }
  };

  return {
    onLogin,
    loading,
  };
};

export default useLogin;
