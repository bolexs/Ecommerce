import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      // Clear session storage
      sessionStorage.removeItem("token");

      // Redirect to login page or homepage
      navigate("/"); // Redirect to login page or another route as needed
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., notify the user)
    }
  };

  return { logout };
};

export default useLogout;
