import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../api/axiosInstance.config";
import { endpoints } from "../api/endpoints";
import useNotification from "./useNotification";

export const useDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { onNotify } = useNotification();

  const hasNotified = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("***");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axiosInstance.get(endpoints.auth.dashboard, {
          headers,
        });

        const { totalUsers, totalProducts } = response.data.data;
        setTotalUsers(totalUsers);
        setTotalProducts(totalProducts);

        if (!hasNotified.current) {
          onNotify("success", "Data Loaded", response?.data?.responseMessage);
          hasNotified.current = true;
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        onNotify(
          "error",
          "Error",
          error.response?.data?.responseMessage || "An error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { totalUsers, totalProducts, loading };
};
