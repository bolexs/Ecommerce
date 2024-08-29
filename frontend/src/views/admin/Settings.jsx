import { useState, useEffect } from "react";
import { Form, Input, Button, Switch, Spin, notification } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axiosInstance.get(endpoints.admin.settings, {
          headers,
        });
        setSettings(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        notification.error({
          message: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred while fetching settings.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axiosInstance.put(endpoints.admin.updateSettings, values, {
        headers,
      });
      notification.success({
        message: "Success",
        description: "Settings updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while updating settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Settings</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={settings}
        >
          <Form.Item
            label="Site Title"
            name="siteTitle"
            rules={[
              { required: true, message: "Please input the site title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Enable User Registration"
            name="userRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[{ type: "email", message: "Please enter a valid email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Settings
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Settings;
