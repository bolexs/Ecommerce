import { NavLink } from "react-router-dom";
import useLogout from "../customHooks/useLogout";

const AdminSidebar = () => {
  const { logout } = useLogout();

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-[250px] h-[100vh] bg-[#f5f5f5]">
        <div className="flex items-center justify-center w-[200px] h-[200px] bg-white rounded-full">
          <h1 className="text-4xl font-bold">Logo</h1>
        </div>
        <div className="mt-10">
          <ul>
            <li className="mb-5">
              <NavLink to="/admin/" className="text-[#1677ff]">
                Dashboard
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink to="/admin/profile" className="text-[#1677ff]">
                Profile
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink to="/admin/users" className="text-[#1677ff]">
                Users
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink to="/admin/products" className="text-[#1677ff]">
                Products
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink to="/admin/settings" className="text-[#1677ff]">
                Settings
              </NavLink>
            </li>
            <li className="mb-5">
              <button
                onClick={logout}
                className="text-[#1677ff] bg-transparent border-0 cursor-pointer"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
