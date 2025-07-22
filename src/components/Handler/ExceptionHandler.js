import { message } from "antd";
import { logoutAction } from "../redux/AuthController";
import { toast } from "react-toastify";

export const handleApiError = (error, dispatch, data) => {
  if (error) {
    let statusCode = "";
    error.status
      ? (statusCode = error.status)
      : (statusCode = error.statusCode);
    const errorMessage = error.message || "An error occurred on the server";
    switch (statusCode) {
      case 401:
        UnauthorizedErrorHandler(error, dispatch, data);
        break;
      default:
        console.log(
          `Server returned error with status ${statusCode}: ${errorMessage}`,
        );
        console.log({ errorMessage });
        message.error(errorMessage)
        if (errorMessage !== "Operation Successful") {
          toast.error(errorMessage);
        }
        if (errorMessage === "Operation Successful") {
        }
        break;
    }
  } else if (error.request) {
    toast.error("No response received from the server");
  } else {
  }
};

const UnauthorizedErrorHandler = (error, dispatch, data) => {
  if (error.status === 401 || error.statusCode === 401) {
    const currentTime = Date.now() / 1000;
    const tokenExpiryTime =
      new Date(parseInt(data?.tokenExpiry)).getTime() / 1000;

    if (tokenExpiryTime && tokenExpiryTime < currentTime) {
      toast.error("Session has expired, Login Again");
      dispatch(logoutAction());
    } else {
      toast.error("Unauthorized error, redirecting to login");
      dispatch(logoutAction());
    }
  } else {
    toast.error("Non-401 error occurred:", error);
  }
};

export const getResponse = (response, dispatch, user) => {
  console.log(response?.data, "resp");
  if (!response?.data?.status) {
    handleApiError(response?.data, dispatch, user);
  } else {
    if (response?.data?.data) {
      
      return response?.data?.data;
    } else {
      return response?.data;
    }
  }
};
