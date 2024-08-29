import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default UserLayout;
