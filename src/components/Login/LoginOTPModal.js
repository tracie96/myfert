import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, message, Typography, Select } from "antd";
import { useDispatch } from "react-redux";
import { validateLoginOtp } from "../redux/AuthController";
// import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

const { Text } = Typography;

const LoginOTPModal = ({ visible, onCancel, emailOrUsername, onSuccess }) => {
  const [otpFields, setOtpFields] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [bypassHours, setBypassHours] = useState(1);
  const dispatch = useDispatch();
//   const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    let intervalId;

    if (visible && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [visible, timer]);

  useEffect(() => {
    if (visible) {
      setTimer(60);
      setOtpFields(["", "", "", "", ""]);
    }
  }, [visible]);

  const handleInputChange = (index, value) => {
    // Allow pasting of multiple digits
    if (value.length > 1) {
      // Distribute the pasted digits across the fields
      const updatedOtpFields = [...otpFields];
      let pasteIndex = index;
      for (let i = 0; i < value.length; i++) {
        if (pasteIndex >= otpFields.length) break;
        if (/^\d$/.test(value[i])) {
          updatedOtpFields[pasteIndex] = value[i];
          pasteIndex++;
        }
      }
      setOtpFields(updatedOtpFields);
      // Focus on the next field if necessary
      if (pasteIndex < otpFields.length) {
        inputRefs.current[pasteIndex].focus();
      }
    } else {
      // Handle single digit input
      if (/^\d$/.test(value) || value === "") {
        const updatedOtpFields = [...otpFields];
        updatedOtpFields[index] = value;
        setOtpFields(updatedOtpFields);

        if (value !== "" && index < otpFields.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleVerify = async () => {
    const otp = otpFields.join("");
    
    if (otp.length !== 5) {
      message.error("Please enter a 5-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(
        validateLoginOtp({ 
          emailOrUsername, 
          otp, 
          validPeriod: bypassHours 
        })
      ).unwrap();
      
      if (result?.status) {
        message.success("OTP verification successful!");
        // Store the user data in localStorage if it's provided in the response
        if (result.obj) {
          localStorage.setItem("userInfo", JSON.stringify(result));
        }
        onSuccess(result);
        onCancel();
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      message.error("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleResendOtp = () => {
    // This would typically call an API to resend OTP
    message.info("OTP resend functionality would be implemented here");
    setTimer(60);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title="Enter Verification Code"
      width={500}
      centered
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <Player
          src="https://lottie.host/1f2eb8bb-26af-4a36-a27b-2d5ce293e7f9/2eQX4bLODe.json"
          className="player"
          loop
          autoplay
          style={{ width: "30%" }}
        />
        
        <div style={{ marginBottom: "20px" }}>
          <Text>
            Enter the 5-digit verification code sent to <br />
            <strong>{emailOrUsername}</strong>
          </Text>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          {otpFields.map((otp, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={{
                width: 50,
                height: 50,
                textAlign: "center",
                margin: "0 5px",
                borderColor: "#b0b0b0",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              value={otp}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={1}
            />
          ))}
        </div>

        <Button
          type="primary"
          size="large"
          onClick={handleVerify}
          loading={loading}
          disabled={otpFields.join("").length !== 5}
          style={{
            width: "100%",
            height: "45px",
            borderRadius: "8px",
            background: "#01ADF0",
            border: "none",
            marginBottom: "10px",
          }}
        >
          Verify OTP
        </Button>

        <div style={{ marginBottom: "15px" }}>
          <div style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
            Bypass duration for next login:
          </div>
          <Select
            value={bypassHours}
            onChange={setBypassHours}
            style={{ width: "100%" }}
            size="large"
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map(hour => (
              <Select.Option key={hour} value={hour}>
                {hour} hour{hour > 1 ? 's' : ''}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          {timer > 0 ? (
            <Text type="secondary">
              Resend code in {timer} seconds
            </Text>
          ) : (
            <Text
              type="link"
              style={{ cursor: "pointer", color: "#01ADF0" }}
              onClick={handleResendOtp}
            >
              Resend Code
            </Text>
          )}
        </div>

        <Text type="secondary" style={{ fontSize: "12px" }}>
          Didn't receive the code? Check your spam folder or contact support.
        </Text>
      </div>
    </Modal>
  );
};

export default LoginOTPModal; 