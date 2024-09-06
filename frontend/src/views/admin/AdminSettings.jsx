import { useState } from "react";
import { Form, Input, Button, Modal, notification, Spin } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";
import AdminSidebar from "../../components/AdminSidebar";

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdatePassword = async (values) => {
    Modal.confirm({
      title: "Confirm Password Update",
      content: "Are you sure you want to update your password?",
      onOk: async () => {
        setLoading(true);
        try {
          const token = sessionStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };

          await axiosInstance.put(endpoints.settings.updatepassword, values, {
            headers,
          });

          notification.success({
            message: "Success",
            description: "Password updated successfully.",
          });
          form.resetFields();
        } catch (error) {
          console.error("Failed to update password:", error);
          notification.error({
            message: "Error",
            description:
              error.response?.data?.responseMessage ||
              "An error occurred while updating the password.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow flex items-center justify-center min-h-screen">
        <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Update Password
          </h2>
          <Spin spinning={loading}>
            <Form form={form} layout="vertical" onFinish={handleUpdatePassword}>
              <Form.Item
                name="currentPassword"
                label="Current Password"
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
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full"
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
