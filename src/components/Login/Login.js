import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postLogin, updateEmail } from "../redux/AuthController";
import {
  Button,
  Input,
  Form,
  Row,
  Col,
  Divider,
  Typography,
  Modal,
  message,
} from "antd";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import Login_one from "../../assets/images/auth/login_one.png";
import Login_two from "../../assets/images/auth/login_two.png";
import Login_three from "../../assets/images/auth/login_three.png";
import Login_four from "../../assets/images/auth/login_four.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import EmailInputModal from "../Register/SignUpPages/UpdateEmailModal";
import EmailVerificationModal from "../Register/SignUpPages/OTPModal";
import LoginOTPModal from "./LoginOTPModal";

const { Text } = Typography;

const initialValues = {
  email: "",
  password: "",
};

const validateLogin = Yup.object().shape({
  email: Yup.string().required("Please enter User Name or Email"),
  password: Yup.string().min(3, "Password must be at least 3 characters"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showEmailInputModal, setShowEmailInputModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [showLoginOTPModal, setShowLoginOTPModal] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues,
    validationSchema: validateLogin,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(postLogin(values)).unwrap();
        if (resultAction?.status) {
          console.log(resultAction, "result");
          
          // Check if OTP verification is required (status code 410)
          if (resultAction.statusCode === "410") {
            // Store the login data and show OTP modal
            setPendingLoginData(resultAction);
            setShowLoginOTPModal(true);
            message.success(resultAction.message || 'Please enter the verification code sent to your email/phone');
          } else if (resultAction.statusCode === "200" || !resultAction.statusCode) {
            // Show success message and navigate directly (only for successful login without OTP)
            message.success('Login successful!');
            handleSuccessfulLogin(resultAction);
          }
        }
      } catch (error) {
        console.log("login-page api call error: " + error);
        // Show error message
        message.error('Login failed. Please check your credentials and try again.');
      }
    },
  });

  const data = useSelector((state) => state?.authentication?.userAuth);
  const { loading } = useSelector((state) => state?.authentication);

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCancelForgotPassword = () => {
    setShowForgotPasswordModal(false);
  };

  const handleSuccessfulLogin = (resultAction) => {
    // Check if resultAction has the user object with role
    if (resultAction?.obj?.role) {
      if (resultAction.obj.role === "Patient") {
        navigate("/patient");
      } else if (resultAction.obj.role === "SuperAdmin") {
        navigate("/users");
      } else if (resultAction.obj.role === "Nurse") {
        navigate("/nurse");
      } else if (resultAction.obj.role) {
        navigate("/doctor");
      }
    } else {
      // Fallback navigation if role is not available
      navigate("/patient");
    }
  };

  const handleOTPSuccess = (otpResult) => {
    // Handle successful OTP verification
    message.success('Login successful!');
    // The OTP verification response should contain the user data with role
    if (otpResult?.obj?.role) {
      handleSuccessfulLogin(otpResult);
    } else {
      // If OTP response doesn't have role, try to use pending data or navigate to default
      handleSuccessfulLogin(pendingLoginData || otpResult);
    }
  };

  const handleEmailInputSubmit = async (email) => {
    const session = JSON.parse(localStorage.getItem("userInfo"))?.session;

    if (!session) {
      message.error("Session not found. Please try again.");
      return;
    }

    try {
      await dispatch(updateEmail({ email, session, newEmail: email })).unwrap();
      // await dispatch(sendEmailOtp({ email, session })).unwrap();

      setResendEmail(email);
      setShowEmailInputModal(false);
      setShowEmailVerificationModal(true);
      message.success(`Verification code sent to ${email}`);
    } catch (error) {
      message.error("Failed to update email or send OTP. Please try again.");
    }
  };

  if (data && data.id) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Row className="login-container">
      <Col xs={24} md={12} className="left-section">
        <div className="circle-image">
          <img src={Login_one} alt="Login One" />
        </div>
        <div className="circle-image">
          <img src={Login_two} alt="Login Two" />
        </div>
        <div className="circle-image">
          <img src={Login_three} alt="Login Three" />
        </div>
        <div className="circle-image">
          <img src={Login_four} alt="Login Four" />
        </div>
      </Col>
      <Col xs={24} md={12} className="right-section">
        <img src={fertilityImage} alt="Fertility" className="logo-image" />
        <div className="form-container">
          <Form className="user" onFinish={handleSubmit}>
            <Form.Item
              validateStatus={errors.email ? "error" : ""}
              help={errors.email}
            >
              <Input
                type="text"
                placeholder="Username or Email"
                value={values.email}
                onBlur={handleBlur("email")}
                onChange={handleChange("email")}
                style={{
                  height: "41px",
                  fontSize: "16px",
                  background: "#E4E5E7",
                  border: "none",
                  touchAction: "manipulation",
                  WebkitAppearance: "none",
                }}
              />
            </Form.Item>
            <Form.Item
              validateStatus={errors.password ? "error" : ""}
              help={errors.password}
            >
              <Input.Password
                placeholder="Password"
                value={values.password}
                onBlur={handleBlur("password")}
                onChange={handleChange("password")}
                style={{
                  height: "41px",
                  background: "#E4E5E7",
                  border: "none",
                  textAlign: "center",
                  display: "flex",
                  fontSize: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                  touchAction: "manipulation",
                  WebkitAppearance: "none",
                }}
              />
            </Form.Item>
            <Form.Item style={{ paddingTop: 50 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  background: "#01ADF0",
                  height: "50px",
                  fontSize: "16px",
                }}
              >
                Sign In
              </Button>
            </Form.Item>
            <Divider className="divider" />
            <div className="links">
              <Text
                onClick={handleForgotPassword}
                style={{ cursor: "pointer", color: "#01ADF0" }}
              >
                Forgot Password?
              </Text>
              {/* <Text onClick={handleResendOtp} style={{ cursor: 'pointer', color: '#01ADF0' }}>Resend OTP?</Text> */}
              <Text className="sign-up-link">
                Don't have an account? <NavLink to="/patientSignup">Sign Up</NavLink>
              </Text>
            </div>
          </Form>
        </div>
      </Col>

      <Modal
        width={1000}
        visible={showForgotPasswordModal}
        onCancel={handleCancelForgotPassword}
        footer={null}
      >
        <ForgotPassword closeModal = {handleCancelForgotPassword}/>
      </Modal>

      <EmailInputModal
        visible={showEmailInputModal}
        onCancel={() => setShowEmailInputModal(false)}
        onSubmit={handleEmailInputSubmit}
        title="Enter a new email address"
        initialEmail={values.email}
      />

      <EmailVerificationModal
        visible={showEmailVerificationModal}
        onCancel={() => setShowEmailVerificationModal(false)}
        onVerify={() => setShowEmailVerificationModal(false)}
        email={resendEmail}
      />

      <LoginOTPModal
        visible={showLoginOTPModal}
        onCancel={() => setShowLoginOTPModal(false)}
        emailOrUsername={values.email}
        onSuccess={handleOTPSuccess}
      />
    </Row>
  );
}

export default Login;
