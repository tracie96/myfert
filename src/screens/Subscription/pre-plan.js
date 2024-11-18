import React from "react";
import { Row, Col, Button } from "antd";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
const PrePlan = () => {
  const navigate = useNavigate();
  const handleClick = (price) => {
    const state = { price: price };
    navigate("/assessment", { state });
  };
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const subscriptionStatus = useSelector(
    (state) => state?.authentication?.userAuth.obj.isPaymentComplete
  );
  return (
    <Row gutter={16}>

      {!subscriptionStatus && (
        <Col xs={24} sm={24}>
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
              {isMobile ? <>
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
                      style={{ color: "#B46DB8", fontSize: "1rem" }}
                    >
                     Fertility Coach Assessment (Incomplete)
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
                  <Col xs={18} sm={12} md={4}>
                    <p style={{ fontWeight: "bold" }}>Prerequisite:</p>
                    <p>Complete the Reproductive Health Assessment - ASSESS section</p>
                    <p style={{ marginTop: "2.3rem", fontWeight: "bold" }}>Description:</p>
                    <p>Schedule a consultation with a Fertility Coach by visiting to review the Reproductive Health Assessment, the benefits of ongoing care, and to address any questions you may have</p>
                    <p style={{ fontWeight: "bold" }}>Duration:</p>
                    <p>15 minutes</p>
                    <p style={{ fontWeight: "bold" }}>Care Provider:</p>
                    <p>Fertility Coach</p>
                  </Col>

                  <Col xs={4} sm={4} md={4} style={{ textAlign: "center" }}>
                    <Typography.Title
                      level={3}
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#000000",
                        textAlign:"center"
                      }}
                    >
                      FREE
                    </Typography.Title>
                    <Button
                      type="primary"
                      style={{
                        background: "#00000080",
                        borderColor: "#00000080",
                        border: "none",
                      }}
                      onClick={() => handleClick(0)}
                    >
                     Continue
                    </Button>
                  </Col>
                </Row>
              </> :
                <>
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
                        FREE
                      </Typography.Title>
                      <Button
                        type="primary"
                        style={{
                          background: "#00000080",
                          borderColor: "#00000080",
                          border: "none",
                          marginTop: "2rem",
                        }}
                        onClick={() => handleClick(0)}
                      >
                        Save & Continue
                      </Button>
                    </Col>
                  </Row>
                </>
              }
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default PrePlan;
