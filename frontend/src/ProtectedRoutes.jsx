/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({ children }) => {
  if (!sessionStorage.getItem("***")) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoutes