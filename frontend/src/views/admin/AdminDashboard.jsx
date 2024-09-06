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
import { Spin, Row, Col, Table } from "antd";
// import { Card } from "antd";
const Dashboard = () => {
  const { totalUsers, totalProducts, users, products, loading } =
    useDashboard();

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
      <div className="flex-grow">
        <div>
          <div style={{ padding: "20px" }} className="w-[80vw]">
            <h2 className="text-3xl mb-16 pl-8">HI, Admin</h2>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Row gutter={[16, 16]}>
                <Col span={24}>
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
                </Col>
              </Row>
            )}

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Table dataSource={users} rowKey="id">
                  <Table.Column
                    title="S/N"
                    dataIndex="serial"
                    key="serialnumber"
                  />
                  <Table.Column
                    title="Username"
                    dataIndex="username"
                    key="username"
                  />
                  <Table.Column title="Email" dataIndex="email" key="email" />
                </Table>
              </Col>
              <Col span={12}>
                <Table dataSource={products} rowKey="id">
                  <Table.Column
                    title="S/N"
                    dataIndex="serial"
                    key="serialnumber"
                  />
                  <Table.Column
                    title="Product Name"
                    dataIndex="name"
                    key="name"
                  />
                  <Table.Column
                    title="Description"
                    dataIndex="description"
                    key="description"
                  />
                  <Table.Column title="Price" dataIndex="price" key="price" />
                </Table>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
