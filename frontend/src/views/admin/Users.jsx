import { useState, useEffect } from "react";
import {
  Table,
  Spin,
  notification,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from "antd"; // Import Select for the role dropdown
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";
import AdminSidebar from "../../components/AdminSidebar";

const { Option } = Select; // Destructure Select.Option

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [form] = Form.useForm(); // Form instance for editing user
  const [addForm] = Form.useForm(); // Form instance for adding user

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        notification.error({
          message: "Error",
          description: "No token found. Please log in again.",
        });
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const { data } = await axiosInstance.get(endpoints.admin.allusers, {
          headers,
        });
        setUsers(data.data);
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching users.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "S/N",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleAddOk = async () => {
    try {
      const values = await addForm.validateFields();
      await axiosInstance.post(endpoints.admin.createuser, values, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      notification.success({
        message: "Success",
        description: "User created successfully.",
      });
      setIsAddModalOpen(false);
      refreshUserList();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.responseMessage || "Failed to create user.",
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber, // Ensure phoneNumber is included
      username: user.username,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        _id: editingUser._id, // Include _id in the request body
        ...values,
      };
      await axiosInstance.put(endpoints.admin.updateuser, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      notification.success({
        message: "Success",
        description: "User updated successfully.",
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
      refreshUserList();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.responseMessage || "Failed to update user.",
      });
    }
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = async () => {
    try {
      const payload = { _id: deletingUser._id }; // Send _id in the request body
      await axiosInstance.delete(endpoints.admin.deleteuser, {
        data: payload,
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      notification.success({
        message: "Success",
        description: "User deleted successfully.",
      });
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      refreshUserList();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.responseMessage || "Failed to delete user.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingUser(null);
    setDeletingUser(null);
    form.resetFields();
    addForm.resetFields();
  };

  const refreshUserList = async () => {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const { data } = await axiosInstance.get(endpoints.admin.allusers, {
        headers,
      });
      setUsers(data.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.responseMessage ||
          "Failed to refresh user list.",
      });
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <div style={{ padding: "20px" }}>
          <h2>Users List</h2>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            Add User
          </Button>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={users}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          )}

          {/* Edit User Modal */}
          <Modal
            title="Edit User"
            open={isEditModalOpen}
            onOk={handleEditOk}
            onCancel={handleCancel}
            okText="Save"
            cancelText="Cancel"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the full name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number" // Add phoneNumber field
                rules={[
                  { required: true, message: "Please enter the phone number!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter the username!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please enter the role!" }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Add User Modal */}
          <Modal
            title="Add User"
            open={isAddModalOpen}
            onOk={handleAddOk}
            onCancel={handleCancel}
            okText="Add"
            cancelText="Cancel"
          >
            <Form form={addForm} layout="vertical">
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the full name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter the phone number!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter the username!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter the password!",
                    min: 8,
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete User Modal */}
          <Modal
            title="Delete User"
            open={isDeleteModalOpen}
            onOk={handleDeleteOk}
            onCancel={handleCancel}
            okText="Delete"
            cancelText="Cancel"
          >
            <p>
              Are you sure you want to delete user {deletingUser?.fullName}?
            </p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Users;
