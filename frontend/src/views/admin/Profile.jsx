import { useState, useEffect } from "react";
import { Form, Input, Button, Spin, notification } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axiosInstance.get(endpoints.auth.profile, {
          headers,
        });
        setProfile(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        notification.error({
          message: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching profile data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axiosInstance.put(endpoints.auth.updateProfile, values, {
        headers,
      });
      notification.success({
        message: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while updating profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Profile</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={profile}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Input disabled />{" "}
            {/* Role is typically not editable by the user */}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Profile;
