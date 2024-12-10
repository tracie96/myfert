import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { validateEmailOtp } from "../../redux/AuthController";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import EmailInputModal from "./UpdateEmailModal";

const EmailVerificationModal = ({ visible, onCancel, email }) => {
  const [otpFields, setOtpFields] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [new_email, setEmail] = useState(email);
  const [newEmailModalVisible, setNewEmailModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    setEmail(email);
  }, [email]);
  // const handleResendOtp = useCallback(async () => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   const session = userInfo?.session;

  //   if (!session) {
  //     message.error("Session not found. Please try again.");
  //     return;
  //   }

  //   try {
  //     await dispatch(sendEmailOtp({ email: new_email, session })).unwrap();
  //     setTimer(60);
  //     message.success(`Verification code sent to ${new_email}`);
  //   } catch (error) {
  //     message.error("Failed to resend OTP. Please try again.");
  //   }
  // }, [dispatch, new_email]);
  // useEffect(() => {
  //   let intervalId;

  //   if (visible && timer > 0) {
  //     intervalId = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer === 1) {
  //           handleResendOtp();
  //           setTimer(60);
  //         }
  //         return prevTimer - 1;
  //       });
  //     }, 1000);
  //   } else if (timer === 0) {
  //     clearInterval(intervalId);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [visible, timer, handleResendOtp]);

  useEffect(() => {
    if (visible) {
      setTimer(60);
    }
  }, [visible]);

  const handleInputChange = (index, value) => {
    if (/^\d$/.test(value) || value === "") {
      const updatedOtpFields = [...otpFields];
      updatedOtpFields[index] = value;
      setOtpFields(updatedOtpFields);

      if (value !== "" && index < otpFields.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const otp = otpFields.join("");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const session = userInfo?.session;

    if (!session) {
      message.error("Session not found. Please try again.");
      return;
    }

    try {
      const result = await dispatch(
        validateEmailOtp({ email: new_email, code: otp, session }),
      ).unwrap();
      if (result.statusCode === "200" && result?.status) {
        message.success("Verification successful, Please login!");
        navigate("/");
      } else {
        message.error("Verification Unsuccessful!");
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleNewEmailSubmit = (newEmail) => {
    setEmail(newEmail);
    setNewEmailModalVisible(false);
    setOtpFields(["", "", "", "", ""]);
    setTimer(60);
    message.success(`Verification code sent to ${newEmail}`);
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={onCancel}
        width={700}
        centered
        title="PLEASE VERIFY YOUR EMAIL ADDRESS"
        footer={[
          <div
            key="buttons"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <p style={{ marginBottom: 10 }}>
              {timer > 0 ? `Resend in ${timer}s` : "Resend"}
            </p>
            <Button
              key="verify"
              type="primary"
              onClick={handleVerify}
              style={{
                width: "100%",
                height: "42.82px",
                borderRadius: 20,
                background: "#00ADEF",
                border: "none",
                color: "#fff",
                marginBottom: 50,
              }}
            >
              Verify
            </Button>
            <p style={{ width: "100%", textAlign: "center" }}>
              Didn't receive a code? Check your spam folder, or{" "}
              <span
                onClick={() => setNewEmailModalVisible(true)}
                style={{
                  color: "#01ACEE",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                try a different email address
              </span>
            </p>
          </div>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <Player
            src="https://lottie.host/1f2eb8bb-26af-4a36-a27b-2d5ce293e7f9/2eQX4bLODe.json"
            className="player"
            loop
            autoplay
            style={{ width: "30%" }}
          />
          <div>
            <p>
              Enter the verification code we sent to <br /> {new_email}
            </p>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            {otpFields.map((otp, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={{
                  width: 63,
                  height: 63,
                  textAlign: "center",
                  margin: "0 5px",
                  borderColor: "#b0b0b0",
                }}
                maxLength={1}
                value={otp}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      </Modal>

      <EmailInputModal
        visible={newEmailModalVisible}
        onCancel={() => setNewEmailModalVisible(false)}
        onSubmit={handleNewEmailSubmit}
        title="Enter a new email address"
        initialEmail={email}
      />
    </>
  );
};

export default EmailVerificationModal;
