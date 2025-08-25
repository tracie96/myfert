import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../utils/envAccess";
import { handleApiError } from "../Handler/ExceptionHandler";

const ChangeEmail = ({ isOpen, setOpen, account, email }) => {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  useEffect(() => {
    if (isOpen === "Email") {
      setOldEmail(email || "");
      setNewEmail("");
    }
  }, [isOpen, email]);

  const handleSubmit = async () => {
    if (!account || !oldEmail || !newEmail) {
      message.error("Please fill in all fields.");
      return;
    }

    const payload = {
      userRef: account,
      oldEmail,
      newEmail
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.obj?.token}`,
          "Content-Type": "application/json"
        }
      };

      const response = await axios.post(`${baseUrl}Admin/ChangeEmail`, payload, config);

      if (response.status === 200 || response.data?.success) {
        message.success("Email updated successfully.");
        setOpen("");
      } else {
        message.error("Failed to update email.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Modal
      title="Change Email"
      open={isOpen === "Email"}
      onCancel={() => setOpen("")}
      onOk={handleSubmit}
      okText="Confirm"
    >
      <Input
        placeholder="Old email"
        value={oldEmail}
        readOnly
        style={{ marginBottom: '1rem' }}
      />
      <Input
        placeholder="Enter new email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
    </Modal>
  );
};

export default ChangeEmail;
