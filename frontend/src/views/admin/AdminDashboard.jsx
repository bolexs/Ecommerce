import AdminSidebar from "../../components/AdminSidebar";
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
import { Spin, Row, Col } from "antd";

const Dashboard = () => {
  const { totalUsers, totalProducts, loading } = useDashboard();

  // Prepare data for the chart
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
      <AdminSidebar />
      <div className="flex-grow flex flex-col items-center p-10">
        <h2 className="text-3xl mb-16">HI, Admin</h2>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="w-full max-w-4xl">
            <ResponsiveContainer width="100%" height={300}>
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
  );
};

export default Dashboard;
