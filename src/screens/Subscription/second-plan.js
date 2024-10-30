import React from "react";
import { Row, Col, Button } from "antd";
import SubscriptionBanner from "../../assets/images/bg/subscription_home-logo.png";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import "./subscription.css"

const SecondPlan = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const subscriptionStatus = useSelector(
    (state) => state?.authentication?.userAuth.obj.isPaymentComplete
  );
  const navigate = useNavigate();
  const handleClick = (price) => {
    const state = { price: price, id:1 };
    navigate("/payment-details", { state });
  };

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={20} sm={16}>
        <p style={{ color: "#335CAD", fontSize: "16px" }}>SUBSCRIPTION PLANS</p>
        <p style={{ padding: "5% 0" }}>
          Explore all our available plans for exclusive access to personalized
          support tailored to your preferences, needs and goals.
        </p>
        <div style={{ background: "#3BC15640", display: "none" }}>
          <div style={{ padding: "3% 5%" }}>
            <p>Don’t forget to purchase Mira!</p>
            <p>
              Before choosing a plan, users are advised to acquire Mira, as it's
              essential for screening and treating hormonal imbalances and
              conditions affecting fertility.
            </p>
            <p>
              Mira devices and test strips are sold separately and can be
              purchased through the Mira website.
            </p>
          </div>
        </div>
      </Col>
      <Col xs={12} sm={8}>
      <img src={SubscriptionBanner} alt="subscription" className="subscription-image" />
      </Col>
      {!subscriptionStatus && (
        <Col xs={24} sm={24}>
          <div className="mt-4">
            <div
              style={{
                width: "100%",
                backgroundColor: "#F2AA93",
                borderRadius: "12px 12px 0 0",
                height: "61px",
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "18px",
                  padding: 20,
                  marginBottom: 0,
                  fontWeight: "bold",
                }}
              >
                INITIAL ASSESSMENT
              </h3>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#F2AA93",
                borderStyle: "solid",
                color: "#000",
              }}
            >
              <Row
                style={{
                  padding: "0",
                  marginBottom: 20,
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Col span={24} md={12}>
                  <Typography.Title
                    level={4}
                    style={{ color: "#F2AA93", fontSize: "1.2rem" }}
                  >
                    Fertility Coach Assessment (Incomplete)
                  </Typography.Title>
                </Col>
                <Col
                  span={24}
                  md={12}
                  style={{ textAlign: isMobile ? "left" : "right" }}
                >
                  <Typography.Title
                    level={4}
                    style={{
                      color: "#B46DB8",
                      fontSize: "1.2rem",
                      marginRight: isMobile ? 0 : 80,
                    }}
                  >
                    Price
                  </Typography.Title>
                </Col>
              </Row>

              <Row
                style={{
                  padding: "0",
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Col xs={24} sm={12} md={4}>
                  <p>Prerequisite:</p>
                  <p>Description:</p>
                  <p style={{ marginTop: "2.3rem" }}>Duration:</p>
                  <p>Care Provider:</p>
                </Col>

                <Col xs={24} sm={12} md={16}>
                  <p>
                    Complete the Reproductive Health Assessment - ASSESS section
                  </p>
                  <p>
                    Schedule a consultation with a Fertility Coach by visiting
                    to review the Reproductive Health Assessment, the benefits
                    of ongoing care, and to address any questions you may have
                  </p>
                  <p>15 minutes</p>
                  <p>Fertility Coach</p>
                </Col>

                <Col xs={24} sm={12} md={4} style={{ textAlign: "center" }}>
                  <Typography.Title
                    level={3}
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "#000000",
                    }}
                  >
                    $500
                  </Typography.Title>
                  <Button
                    type="primary"
                    onClick={() => handleClick(500)}
                    style={{
                      background: "#00000080",
                      borderColor: "#00000080",
                      border: "none",
                      marginTop: "2rem",
                    }}
                  >
                    Save & Continue
                  </Button>
                </Col>
              </Row>
            </div>
          </div>

          <div className="mt-4">
            <div
              style={{
                width: "100%",
                backgroundColor: "#B46DB8",
                borderRadius: "12px 12px 0 0",
                height: "61px",
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: "18px",
                  padding: 20,
                  marginBottom: 0,
                  fontWeight: "bold",
                }}
              >
                INITIAL SIGN UP
              </h3>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#B46DB8",
                borderStyle: "solid",
                color: "#000",
              }}
            >
              <Row
                style={{
                  padding: "0",
                  marginBottom: 20,
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Col span={24} md={12}>
                  <Typography.Title
                    level={4}
                    style={{ color: "#B46DB8", fontSize: "1.2rem" }}
                  >
                    Fertility Coach Assessment (Complete)
                  </Typography.Title>
                </Col>
                <Col span={24} md={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isMobile ? "flex-start" : "flex-end",
                    }}
                  >
                    <DownOutlined
                      style={{
                        fontSize: "1rem",
                        color: "#B46DB8",
                        marginRight: 15,
                        marginTop: -7,
                      }}
                    />

                    <Typography.Title
                      level={4}
                      style={{
                        color: "#B46DB8",
                        fontSize: "1.2rem",
                        marginRight: isMobile ? 0 : 20,
                      }}
                    >
                      View More
                    </Typography.Title>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default SecondPlan;
