import { useEffect, useState } from "react";
import { Spin, Row, Col, Table } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axiosInstance.get(endpoints.auth.userData, {
          headers,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error (e.g., notify the user)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Dashboard</h1>
      <h2>User Dashboard</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h3>Personal Information</h3>
            <Table dataSource={[userData]} pagination={false} rowKey="id">
              <Table.Column
                title="Username"
                dataIndex="username"
                key="username"
              />
              <Table.Column title="Email" dataIndex="email" key="email" />
              <Table.Column
                title="Joined Date"
                dataIndex="joinedDate"
                key="joinedDate"
              />
            </Table>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
