import { App } from "antd";


const useNotification = () => {
  const { notification } = App.useApp();

  const onNotify = (
    type,
    message,
    description
  ) => {
    switch (type) {
      case "success":
        notification.success({
          message,
          description,
          placement: "topLeft",
        });
        break;

      case "error":
        notification.error({
          message,
          description,
          placement: "topLeft",
        });
        break;
      case "warning":
        notification.warning({
          message,
          description,
          placement: "topLeft",
        });
        break;
      default:
        notification.info({
          message,
          description,
          placement: "topLeft",
        });
        break;
    }
  };

  return { onNotify };
};

export default useNotification;
