import React from "react";
import { Row, Col, Button } from "antd";

const SubscriptionPage = () => {
  return (
    <div style={{ height: "100vh", backgroundColor: "#f0f2f5" }}>
      <Row style={{ height: "100%" }} align="middle">
        {/* Left Column - Image */}
        <Col xs={24} md={12} style={{ textAlign: "center", padding: "20px" }}>
          <img
            src="/path/to/your/image.jpg" // Replace with your image path
            alt="Subscription"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>

        {/* Right Column - Text */}
        <Col
          xs={24}
          md={12}
          style={{ padding: "20px", backgroundColor: "#fff" }}
        >
          <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Subscribe to Our Service
            </h1>
            <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
              Enjoy exclusive content, updates, and more when you subscribe to
              our service. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Curabitur vel sapien nulla.
            </p>
            <Button type="primary" size="large">
              Subscribe Now
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SubscriptionPage;
