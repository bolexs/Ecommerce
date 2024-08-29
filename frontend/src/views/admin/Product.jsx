// import { useState, useEffect } from "react";
// import { Table, Spin, notification, Button } from "antd";
// import { axiosInstance } from "../../api/axiosInstance.config";
// import { endpoints } from "../../api/endpoints";

// const Product = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = sessionStorage.getItem("***");

//     if (!token) {
//       notification.error({
//         message: "Error",
//         description: "No token found. Please log in again.",
//       });
//       setLoading(false);
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.get(
//           endpoints.products.allproducts,
//           { headers }
//         );
//         console.log("Response:", response.data.data);
//         setProducts(response.data.data);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         notification.error({
//           message: "Error",
//           description:
//             error.response?.data?.message ||
//             "An error occurred while fetching products.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const columns = [
//     {
//       title: "S/N",
//       dataIndex: "serial",
//       key: "serial",
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Product Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Product Image",
//       dataIndex: "image",
//       key: "image",
//       render: (image) => (
//         <img
//           src={image} // Assuming the image URL is directly usable
//           alt="Product"
//           style={{ width: 100, height: 100, objectFit: "cover" }}
//         />
//       ),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (price) => `$${price.toFixed(2)}`,
//     },
//     {
//       title: "Created By",
//       dataIndex: "createdBy",
//       key: "createdBy",
//       render: (createdBy) => createdBy?.username || "Unknown",
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (text, record) => (
//         <Button type="link" onClick={() => handleEdit(record)}>
//           Edit
//         </Button>
//       ),
//     },
//   ];

//   const handleEdit = (product) => {
//     console.log("Edit product:", product);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Products List</h2>
//       {loading ? (
//         <Spin size="large" />
//       ) : (
//         <Table
//           dataSource={products}
//           columns={columns}
//           rowKey="_id"
//           pagination={{ pageSize: 10 }}
//         />
//       )}
//     </div>
//   );
// };

// export default Product;

import { useState, useEffect } from "react";
import {
  Table,
  Spin,
  notification,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = sessionStorage.getItem("***");

    if (!token) {
      notification.error({
        message: "Error",
        description: "No token found. Please log in again.",
      });
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          endpoints.products.allproducts,
          { headers }
        );
        setProducts(response.data.data);
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching products.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Product Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image} // Assuming the image URL is directly usable
          alt="Product"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => createdBy?.username || "Unknown",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axiosInstance.put(
        `${endpoints.products.updateProduct}/${editingProduct._id}`,
        values,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("***")}` },
        }
      );
      notification.success({
        message: "Success",
        description: "Product updated successfully.",
      });
      setIsModalVisible(false);
      setEditingProduct(null);
      // Refresh product list
      const response = await axiosInstance.get(endpoints.products.allproducts, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("***")}` },
      });
      setProducts(response.data.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to update product.",
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products List</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Product Image URL"
            rules={[
              {
                required: true,
                message: "Please enter the product image URL!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter the product description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter the product price!" },
            ]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
