import UserSidebar from "../../components/UserSidebar";
import { useDashboard } from "../../customHooks/useDashboard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Spin } from "antd";

const UserDashboard = () => {
  const { totalUsers, totalProducts, loading } = useDashboard();

  const data = [
    { name: "Total Users", Usercount: totalUsers, key: "total-users" },
    {
      name: "Total Products",
      Productcount: totalProducts,
      key: "total-products",
    },
  ];

  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-grow flex flex-col items-center p-10">
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl mb-4 self-start">Dashboard</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <div className="w-full max-w-4xl h-[500px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Usercount" fill="#8884d8" />
                  <Bar dataKey="Productcount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
