import React from "react";
import { Modal, message } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../utils/envAccess";

const SetUserPassword = ({ isOpen, setOpen, account }) => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);
  const token = userAuth?.obj?.token;

  const handleSendResetLink = async () => {
    if (!account) return message.warning("No patient selected.");

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { userRef: account }, // Send 'account' as query parameter
      };

      const response = await axios.get(
        `${baseUrl}Admin/ResetUserPassword/${account}`, // Ensure account is part of the URL path
        config // Pass the config with headers and params
      );

      // Check if the response indicates success
      if (response.data && response.data.success) { 
        message.success("Successfully sent the password reset email.");
      } else {
        message.error("Failed to send reset link. Please try again.");
      }

      setOpen('');
    } catch (error) {
      console.error(error);
      message.error("Failed to send reset link.");
    }
  };

  return (
    <Modal
      title="Send Password Reset Link"
      open={isOpen === 'Password'}
      onOk={handleSendResetLink}
      onCancel={() => setOpen('')}
      okText="Send Link"
    >
      <p>
        Are you sure you want to send a password reset link to this patient?
        They will receive an email with a secure link to reset their password.
      </p>
    </Modal>
  );
};

export default SetUserPassword;
