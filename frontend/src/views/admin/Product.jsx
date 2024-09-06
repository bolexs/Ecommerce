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
  Upload,
} from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";
import AdminSidebar from "../../components/AdminSidebar";
import { jwtDecode } from "jwt-decode";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Extract userId from the token
  const token = sessionStorage.getItem("token");
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id; // Assuming the userId is stored as 'id' in the token
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          endpoints.products.allproducts,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
  }, [token]);

  const handleView = async (product) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.products.singleproduct}/${product._id}`, // Correct endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setViewProduct(response.data.data);
      setIsViewModalOpen(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch product details.",
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: [
        {
          uid: "-1",
          name: "product image",
          status: "done",
          url: product.image,
        },
      ],
    });
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      if (values.image && values.image[0].originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      const productId = editingProduct._id;
      console.log("productId", productId);
      await axiosInstance.put(
        `${endpoints.products.updateproduct}/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notification.success({
        message: "Success",
        description: "Product updated successfully.",
      });

      setIsEditModalOpen(false);
      setEditingProduct(null);
      refreshProductList();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to update product.",
      });
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(
        `${endpoints.products.deleteproduct}/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notification.success({
        message: "Success",
        description: "Product deleted successfully.",
      });
      refreshProductList();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete product.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsViewModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
    addForm.resetFields();
  };

  const refreshProductList = async () => {
    const response = await axiosInstance.get(endpoints.products.allproducts, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(response.data.data);
  };

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
          src={image}
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
        <>
          <Button type="link" onClick={() => handleView(record)}>
            <EyeOutlined /> View
          </Button>
          {record.createdBy._id === userId && (
            <>
              <Button type="link" onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleDelete(record._id)}
              >
                <DeleteOutlined /> Delete
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <div style={{ padding: "20px" }}>
          <h2>Products List</h2>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            Add Product
          </Button>
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

          {/* View Product Modal */}
          <Modal
            title="View Product"
            open={isViewModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            {viewProduct && (
              <>
                <p>
                  <strong>Name:</strong> {viewProduct.name}
                </p>
                <p>
                  <strong>Description:</strong> {viewProduct.description}
                </p>
                <p>
                  <strong>Price:</strong> ${viewProduct.price.toFixed(2)}
                </p>
                <img
                  src={viewProduct.image}
                  alt="Product"
                  style={{ width: "100%", objectFit: "cover" }}
                />
                <p>
                  <strong>Created By:</strong> {viewProduct.createdBy.username}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(viewProduct.createdAt).toLocaleDateString()}
                </p>
              </>
            )}
          </Modal>

          {/* Edit Product Modal */}
          <Modal
            title="Edit Product"
            open={isEditModalOpen}
            onOk={handleEditOk}
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
                label="Product Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: false }]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description!" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter the price!" }]}
              >
                <InputNumber prefix="$" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Add Product Modal */}
          <Modal
            title="Add Product"
            open={isAddModalOpen}
            onOk={async () => {
              try {
                const values = await addForm.validateFields();
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("price", values.price);
                if (values.image && values.image[0].originFileObj) {
                  formData.append("image", values.image[0].originFileObj);
                }
                await axiosInstance.post(
                  endpoints.products.createproduct,
                  formData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                notification.success({
                  message: "Success",
                  description: "Product added successfully.",
                });
                setIsAddModalOpen(false);
                refreshProductList();
              } catch (error) {
                notification.error({
                  message: "Error",
                  description:
                    error.response?.data?.message || "Failed to add product.",
                });
              }
            }}
            onCancel={handleCancel}
            okText="Add"
            cancelText="Cancel"
          >
            <Form form={addForm} layout="vertical">
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
                label="Product Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  { required: true, message: "Please upload a product image!" },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description!" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter the price!" }]}
              >
                <InputNumber prefix="$" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Product;
