import Side from "../side/Side";

import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <div className="flex">
      <Side />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
