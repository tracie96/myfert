import React, { useEffect, useState } from "react";
import { Row, Col, Button, Typography, Divider, Modal } from "antd";
import { useMediaQuery } from "react-responsive";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkoutSubscription, markSubscriptionSuccess } from "../../components/redux/subscriptionSlice";
import moment from "moment";
import { increaseUserStep } from "../../components/redux/patientSlice";

const { Title, Text } = Typography;

const PaymentDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { state } = location;
  const { userAuth } = useSelector((state) => state.authentication);

  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get("success");
  const isCanceled = searchParams.get("canceled");

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePaymentStatus = async () => {
      const paymentSuccess = isSuccess === "true";
      if (paymentSuccess) {
        dispatch(markSubscriptionSuccess(true));
        try {        console.log("Calling increaseUserStep API...");
          await dispatch(increaseUserStep({ step :  2 }));
          console.log(
            `stage switch ${
              paymentSuccess ? "enabled" : "disabled"
            } for record:`          );
  
          setIsModalVisible(true);
        } catch (error) {
          console.error("Error while increasing user step:", error);
        }
      } else if (isCanceled === "true") {
        dispatch(markSubscriptionSuccess(false));
      }
    };
  
    handlePaymentStatus();
  }, [dispatch, isSuccess, isCanceled]);
  

  const handleConfirmPurchase = (id) => {
    dispatch(checkoutSubscription(id)).then((result) => {
      console.log({ result });
      if (result.payload) {
        window.location.href = result.payload;
      }
    });
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    handleStepChange()
    navigate("/patient"); 
  };

  const handleStepChange = () => {
    localStorage.setItem("currentStep", 3);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: isMobile ? "10px" : "20px", maxWidth: isMobile ? "100%" : "90%" }}>
      <Button
        type="link"
        style={{ marginBottom: "10px" }}
        onClick={handleBack}
      >
        <LeftOutlined /> Back to Payment Method
      </Button>
      <div
        style={{
          border: "1px solid #000",
          borderRadius: "8px",
          padding: isMobile ? "10px" : "20px",
          maxWidth: "800px",
        }}
      >
        <Row>
          <Col span={24} style={{ width: "100%" }}>
            <Title level={4} style={{ color: "#335CAD", marginLeft: "3%" }}>
              Summary
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{ margin: "0 3%" }}>
            <Row>
              <Col span={12}>
                <p>Selected Plan: </p>
              </Col>
              <Col span={12}>
                <p>Initial Assessment - Clinician Assessment</p>
              </Col>
              <Col span={12}>
                <p>Date of Purchase: </p>
              </Col>
              <Col span={12}>
                <p>{moment().format("YYYY-MM-DD")}</p>
              </Col>
              <Col span={12}>
                <p>Email Address: </p>
              </Col>
              <Col span={12}>
                <p>{userAuth?.obj.email}</p>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ marginLeft: "50%" }}>
            <Row style={{ marginTop: "20px" }}>
              <Col span={24}>
                <Title
                  level={5}
                  style={{ color: "#335CAD", textAlign: "left" }}
                >
                  Billing Total
                </Title>
                <Divider style={{ margin: "8px 0" }} />
              </Col>
              <Col span={12}>
                <Text strong>Subtotal</Text>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
                  ${state?.price}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px", textAlign: "center" }}>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              style={{ width: "100%", background: "#00ADEF" }}
              onClick={() => handleConfirmPurchase(state.id)}
            >
              CONFIRM PURCHASE
            </Button>
          </Col>
        </Row>
      </div>

      <Modal
        title="Payment Confirmed"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Go to Dashboard"
        cancelText="Close"
      >
        <p>We have confirmed your payment, and Account would be updated Shortly Thank you for your purchase!</p>
      </Modal>
    </div>
  );
};

export default PaymentDetails;
