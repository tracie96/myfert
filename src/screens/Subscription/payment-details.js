import React, { useEffect } from "react";
import { Row, Col, Button, Typography, Divider, message } from "antd";
import { useMediaQuery } from "react-responsive";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markSubscriptionSuccess } from "../../components/redux/subscriptionSlice";
const { Title, Text } = Typography;

const PaymentDetails = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { state } = location;
  
  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get('success');
  const isCanceled = searchParams.get('canceled');

  const handleBack = () => {
    navigate(-1);
  };
  
  useEffect(() => {
    const paymentSuccess = isSuccess === "true";
    if (paymentSuccess) {
      dispatch(markSubscriptionSuccess(true)); 
    } else if (isCanceled === "true") {
      dispatch(markSubscriptionSuccess(false)); 
    }
  }, [dispatch, isSuccess, isCanceled]);


  const handleConfirmPurchase = (id) => {
    console.log(id)
    localStorage.setItem("currentStep", 4)
    message.success("Payment disaled temporily for testing purpose")
    navigate("/")
    // dispatch(checkoutSubscription(id)).then((result) => {
    //   console.log({result})
    //   if (result.payload) {
    //     window.location.href = result.payload; 
    //   }
    // });
  };

  return (
    <div style={{ padding: isMobile ? "10px" : "20px", maxWidth: isMobile? "100%":"90%" }}>
      <Button
        type="link"
        style={{ marginBottom: "10px" }}
        onClick={() => handleBack()}
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
          <Col span={24} style={{width: '100%'}}>
            <Title level={4} style={{ color: "#335CAD" , marginLeft:'3%'}}>
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
                <p>January 11, 2024</p>
              </Col>
              <Col span={12}>
                <p>Email Address: </p>
              </Col>
              <Col span={12}>
                <p>j.smith@email.com</p>
              </Col>
              <Col span={12}>
                <p>Phone Number: </p>
              </Col>
              <Col span={12}>
                <p>(123) 123-4567</p>
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
              onClick={()=>handleConfirmPurchase(state.id)}
            >
              CONFIRM PURCHASE
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentDetails;
