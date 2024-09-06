import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import { App as AntdApp } from "antd";
import AdminDashboard from "./views/admin/AdminDashboard";
import AdminSettings from "./views/admin/AdminSettings";
import UserDashboard from "./views/user/UserDashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import UserProfile from "./views/user/UserProfile";
import Product from "./views/admin/Product";
import Users from "./views/admin/Users";
import AdminProfile from "./views/admin/AdminProfile";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoutes>
          <AdminLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "/admin/settings",
          element: <AdminSettings />,
        },
        {
          path: "/admin/products",
          element: <Product />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/profile",
          element: <AdminProfile />,
        },
      ],
    },
    {
      path: "/user",
      element: (
        <ProtectedRoutes>
          <UserLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <UserDashboard />,
        },
        {
          path: "/user/profile",
          element: <UserProfile />,
        },
      ],
    },
    {
      path: "*",
      element: <h1>404 Not Found</h1>,
    },
  ]);

  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
};

export default App;
