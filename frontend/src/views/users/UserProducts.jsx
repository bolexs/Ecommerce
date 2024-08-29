import { useState, useEffect } from "react";
import { Table, Spin, message } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axiosInstance.get(
          endpoints.products.allproducts,
          { headers }
        );
        setProducts(response.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products.");
        message.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Spin size="large" />;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Products</h2>
      <Table dataSource={products} rowKey="_id">
        <Table.Column title="Product Name" dataIndex="name" key="name" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Price"
          dataIndex="price"
          key="price"
          render={(price) => `$${price}`}
        />
        <Table.Column
          title="Created At"
          dataIndex="createdAt"
          key="createdAt"
          render={(date) => new Date(date).toLocaleDateString()}
        />
      </Table>
    </div>
  );
};

export default UserProducts;
