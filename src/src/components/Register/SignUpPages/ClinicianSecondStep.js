import React, { useState } from "react";
import { Row, Col, Button, Modal, Input } from "antd";
import { NavLink } from "react-router-dom";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import janeImg from "../../../assets/images/jane.svg";
import { useNavigate } from "react-router-dom";

const ClinicianSecondStep = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleProceedToSignup = () => {
    navigate("/clinicianSignup");
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ margin: "auto 20%", background: "#fff", padding: "20px" }}>
      <Row justify="space-between" align="middle">
        <Col xs={12} sm={6} md={4} lg={3} xl={6} style={{ textAlign: "left" }}>
          <img
            src={fertilityImage}
            alt="Fertility"
            style={{ width: "100%", maxWidth: "100%", marginBottom: 20 }}
          />
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} style={{ textAlign: "right" }}>
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              style={{ width: "80%", background: "#00ADEF" }}
            >
              <NavLink to="/" style={{ color: "#fff" }}>
                Sign In
              </NavLink>
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ color: "#335CAD", fontSize: "20px", fontWeight: "bold" }}>
        {" "}
        Welcome!
      </div>
      <p style={{ fontSize: "15px", color: "#000" }}>
        To proceed with the sign up page, you will need to provide the same
        email used for both Mira and the Jane app.
      </p>
      <p style={{ fontSize: "15px", color: "#000" }}>
        If you don’t have an account, please access the links below to create
        your account!
      </p>
      <hr style={{ background: "#EFD0BD", width: "200px", height: "2px" }} />
      <div
        style={{
          textAlign: "center",
          background: "#335CAD",
          color: "#fff",
          padding: 10,
          width: "90%",
          margin: "auto",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        Please use the same email you signed up with for both Mira and the Jane
        app
      </div>

      <Row justify="" style={{ marginTop: "20px" }}>
        <Col span={12} style={{ marginBottom: "20px" }}>
          <div style={{ width: "100%", textAlign: "" }}>
            <div
              style={{ color: "#02BFCC", fontSize: "15px", fontWeight: "bold" }}
            >
              Jane
            </div>
            <p style={{ color: "#000" }}>
              An online booking system that allows you to schedule and manage
              your appointments
            </p>
            <Button
              style={{
                background: "#02BFCC",
                color: "#fff",
                border: "none",
                height: "41px",
              }}
            >
              {" "}
              Create Account
            </Button>
          </div>
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <img
            src={janeImg}
            alt="Jane"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>
      </Row>

      <Row justify="">
        <Col span={24} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            style={{
              width: "200px",
              marginTop: "20%",
              background: "#00ADEF",
              float: "right",
            }}
            onClick={handleProceedToSignup}
          >
            Proceed to Signup
          </Button>
        </Col>
      </Row>

      <Modal
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null}
        centered
        style={{
          width: "600px",
          maxWidth: "90%",
        }}
        bodyStyle={{
          height: "400px",
          padding: "40px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "38px", color: "#00ADEF", marginBottom: 30 }}>
            Hello!
          </p>
          <p style={{ fontSize: "20px", marginBottom: 30 }}>
            To register, kindly enter access code:
          </p>
          <Input
            placeholder="Enter Access Code"
            style={{ width: "70%", borderColor: "#A0A0A0" }}
          />
        </div>
        <p
          style={{
            textAlign: "center",
            color: "#00ADEF",
            fontSize: "18px",
            marginBottom: 50,
          }}
        >
          Didn't have an access code?
        </p>

        <Button
          type="primary"
          onClick={handleModalOk}
          style={{
            width: "200px",
            display: "block",
            margin: "0 auto",
            background: "#00ADEF",
          }}
        >
          <NavLink
            to="/clinicianSignup"
            style={{ color: "#fff", background: "#00ADEF" }}
          >
            Continue
          </NavLink>
        </Button>
      </Modal>
    </div>
  );
};

export default ClinicianSecondStep;
