// src/components/UpdateEmailModal.js

import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { Player } from "@lottiefiles/react-lottie-player";
import { useDispatch } from "react-redux";
import { updateEmail } from "../../../redux/AuthController"; // Import the sendEmailOtp thunk

const EmailInputModal = ({
  visible,
  onCancel,
  onSubmit,
  title,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          message.error("User information not found. Please try again.");
          return;
        }
        
        let userInfo;
        try {
          userInfo = JSON.parse(userInfoString);
        } catch (error) {
          message.error("Invalid user information. Please try again.");
          return;
        }
        
        const session = userInfo?.session;

        if (!session) {
          message.error("Session not found. Please try again.");
          return;
        }

        await dispatch(
          updateEmail({ email: initialEmail, session, newEmail: email }),
        ).unwrap();


        onSubmit(email);
      } catch (error) {
        message.error("Failed to update email or send OTP. Please try again.");
      }
    } else {
      message.error("Please enter a valid email");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={title}
      width={700}
      centered
      footer={null} // We'll move the footer buttons inside the modal content
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          paddingBottom: 20,
        }}
      >
        <p style={{ marginTop: 20 }}>
          Enter your email to receive a verification code
        </p>
        <Player
          src="https://lottie.host/f013ab6b-a8fe-496a-ab2d-c6fc9a3c0ef9/uDFJEgVrXm.json"
          className="player"
          loop
          autoplay
          style={{ width: "30%" }}
        />
        <Input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "50%", borderColor: "#ccc" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            style={{
              borderColor: "#00ADEF",
              borderRadius: 15,
              background: "#fff",
              color: "#00ADEF",
            }}
          >
            Send Verification Code
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailInputModal;
