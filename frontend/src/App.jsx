import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import { App as AntdApp } from "antd";
import Dashboard from "./views/admin/Dashboard";
// import Dashboard1 from "./views/users/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import Profile from "./views/admin/Profile";
import Product from "./views/admin/Product";
import Settings from "./views/admin/Settings";
// import Users from "./views/admin/Users";
import UserProfile from "./views/users/UserProfile";
import UserProducts from "./views/users/UserProducts";
import UserSettings from "./views/users/UserSettings";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/admin/",
      element: (
        <ProtectedRoutes>
          <AdminLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/admin/profile",
          element: <Profile />,
        },
        {
          path: "/admin/products",
          element: <Product />,
        },
        {
          path: "/admin/settings",
          element: <Settings />,
        },
        // {
        //   path: "/admin/users",
        //   element: <Users />,
        // },
      ],
    },
    {
      path: "/users/",
      element: (
        <ProtectedRoutes>
          <UserLayout />
        </ProtectedRoutes>
      ),
      children: [
        // {
        //   index: true,
        //   element: <Dashboard1 />,
        // },
        {
          path: "/users/userprofile",
          element: <UserProfile />,
        },
        {
          path: "/users/usersproducts",
          element: <UserProducts />,
        },
        {
          path: "/users/usersettings",
          elements: <UserSettings />,
        },
      ],
    },
  ]);
  return (
    <AntdApp>
      <RouterProvider router={router} />
    </AntdApp>
  );
};

export default App;
