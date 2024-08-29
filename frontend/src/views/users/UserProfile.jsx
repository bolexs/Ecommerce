import { useEffect, useState } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axiosInstance.get(endpoints.auth.userData, {
          headers,
        });
        setUserData(response.data);
        form.setFieldsValue(response.data); // Set initial form values
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        message.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axiosInstance.put(endpoints.auth.updateProfile, values, {
        headers,
      });
      message.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Profile</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={userData}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: false,
                message:
                  "You can leave this blank if you do not want to change your password.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UserProfile;
