import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-[250px] h-[100vh] bg-[#f5f5f5]">
        <div className="flex items-center justify-center w-[200px] h-[200px] bg-white rounded-full">
          <h1 className="text-4xl font-bold">Logo</h1>
        </div>
        <div className="mt-10">
          <ul>
            <li className="mb-5">
              <NavLink href="#" className="text-[#1677ff]">
                Dashboard
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink href="#" className="text-[#1677ff]">
                profile
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink href="#" className="text-[#1677ff]">
                settings
              </NavLink>
            </li>
            <li className="mb-5">
              <NavLink href="#" className="text-[#1677ff]">
                log out
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
