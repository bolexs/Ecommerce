import { useState } from "react";
import { axiosInstance } from "../api/axiosInstance.config";
import { endpoints } from "../api/endpoints";
import useNotification from "./useNotification";
import { useNavigate } from "react-router-dom"

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const { onNotify } = useNotification();
  const navigate = useNavigate()

  // function to call for registration
  const onRegister = async (request) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        endpoints.auth.register,
        request
      );
      setLoading(false);

      if (response.data?.responseCode === "00") {
        onNotify("success", "Successful", response?.data?.responseMessage);
        setTimeout(() => {
            return navigate("/")
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
    onRegister,
    loading,
  };
};

export default useRegister;
