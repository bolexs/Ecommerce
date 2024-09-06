import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = () => {
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Decode the token to extract user information
  let user = null;
  try {
    user = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    sessionStorage.removeItem("token"); // Remove invalid token
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Determine if the user is an admin
  const isAdmin = user?.isAdmin;

  // Render routes based on user role
  if (isAdmin) {
    return <Outlet context={{ user }} />;
  }

  // For non-admin users, handle redirection to ensure correct access
  if (location.pathname.startsWith("/user")) {
    return <Outlet context={{ user }} />;
  } else {
    return <Navigate to="/user" state={{ from: location }} replace />;
  }
};

export default ProtectedRoutes;
