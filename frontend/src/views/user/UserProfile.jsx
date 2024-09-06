import { useState, useEffect } from "react";
import { Button, Form, Input, Spin, notification, Card } from "antd";
import { axiosInstance } from "../../api/axiosInstance.config";
import { endpoints } from "../../api/endpoints";
import UserSidebar from "../../components/UserSidebar";

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      setProfile(values);
      setIsEditing(false);
    } catch (error) {
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-grow">
        <div style={{ padding: "20px" }}>
          <h2 className="text-2xl mb-4">Profile</h2>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={profile}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item label="Role" name="role">
                  <Input disabled />
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

export default UserProfile;
