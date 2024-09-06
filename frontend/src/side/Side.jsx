import { NavLink } from "react-router-dom";

const Side = () => {
  return (
    <div className="w-[250px] bg-[#f5f5f5] min-h-screen flex flex-col items-center py-5">
      <div className="flex items-center justify-center w-[200px] h-[200px] bg-white rounded-full mb-10">
        <h1 className="text-4xl font-bold">Logo</h1>
      </div>
      <ul className="w-full">
        <li className="mb-5">
          <NavLink to="/user" className="text-[#1677ff]">
            Dashboard
          </NavLink>
        </li>
        <li className="mb-5">
          <NavLink to="/user/profile" className="text-[#1677ff]">
            Profile
          </NavLink>
        </li>
        <li className="mb-5">
          <NavLink to="/user/settings" className="text-[#1677ff]">
            Settings
          </NavLink>
        </li>
        <li className="mb-5">
          <NavLink to="/logout" className="text-[#1677ff]">
            Log Out
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Side;
