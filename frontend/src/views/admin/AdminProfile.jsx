import { useState, useEffect } from "react";
import { Button, Form, Input, Card, notification, Spin } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";
import AdminSidebar from "../../components/AdminSidebar";

const AdminProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Extract token from session storage
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch user profile using the token
        const response = await axiosInstance.get(
          endpoints.settings.getprofile,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.data);
        form.setFieldsValue(response.data.data);
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            error.response?.data?.responseMessage ||
            "Failed to fetch user profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await axiosInstance.put(endpoints.settings.updateprofile, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({
        message: "Success",
        description: "Profile updated successfully.",
      });
      setUser(values);
      setIsEditing(false);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.responseMessage || "Failed to update profile.",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <div style={{ padding: "20px" }}>
          <h2>Profile</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Card>
              <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={handleSave}
              >
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name!" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number!",
                    },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter your username!" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="role" label="Role">
                  <Input disabled value={user?.role} />
                </Form.Item>
                {isEditing ? (
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                ) : (
                  <Button type="primary" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                )}
              </Form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
