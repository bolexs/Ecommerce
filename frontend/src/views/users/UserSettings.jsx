import { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const UserSettings = () => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axiosInstance.put(endpoints.auth.updatePassword, values, {
        headers,
      });
      message.success("Password updated successfully.");
      form.resetFields(); // Reset form fields after successful update
    } catch (error) {
      console.error("Failed to update password:", error);
      message.error("Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Settings</h2>
      {saving ? (
        <Spin size="large" />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UserSettings;
