import React from "react";
import { Row, Col, Button } from "antd";
import SubscriptionBanner from "../../assets/images/bg/subscription_home-logo.svg";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./subscription.css"

const SecondPlan = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const subscriptionStatus = useSelector(
    (state) => state?.authentication?.userAuth.obj.isPaymentComplete
  );
  const navigate = useNavigate();
  const handleClick = (price) => {
    const state = { price: price, id: 3 };
    navigate("/payment-details", { state });
  };

  return (
    <Row gutter={16} >
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
              {isMobile ?
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
                        style={{ color: "#F2AA93", fontSize: "1rem" }}
                      >
                        Clinician Assessment
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
                    <Col xs={24} sm={24} md={24}>
                      <p style={{ fontWeight: "bold" }}>Prerequisite:</p>
                      <p>Complete all the General Intake Forms (except Holistic Nutrition) - ASSESS section</p>
                      <p>Watch Fertility Coach Video - LEARN section</p>
                      <p style={{ marginTop: "2.3rem", fontWeight: "bold" }}>Description:</p>
                      <p>Schedule a consultation with a clinician to review the General Intake Forms. Two requisition (Day 3 bloodwork and Peak +7 bloodwork) will be provided with a follow-up to discuss the results  </p>
                      <p>Includes two appointments with the Fertility Coach</p>
                      <p style={{ fontWeight: "bold" }}>Duration:</p>
                      <p>Clinician (1 hour consultation + 30 min follow-up), Fertility Coach (two 30 minute appointment)</p>
                      <p style={{ fontWeight: "bold" }}>Care Provider:</p>
                      <p>Clinician, Fertility Coach</p>
                    </Col>


                    <Col xs={24} sm={24} md={24} style={{display:'flex'}}>
                     
                      <Button
                        type="primary"
                        onClick={() => handleClick(500)}
                        style={{
                          background: "#00ADEF",
                          borderColor: "#00000080",
                          border: "none",
                          width:"70%",
                          borderRadius: "10px",
                        }}
                      >
                        Select
                      </Button>
                      <Typography.Title
                        level={3}
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          marginLeft: 10,
                          color: "#000000",
                          textAlign: "center"
                        }}
                      >
                        $500
                      </Typography.Title>
                    </Col>
                  </Row>
                </>
                : <>
                  <Row
                    style={{
                      padding: "0",
                      marginBottom: 20,
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <Col span={24} md={20}>
                      <Typography.Title
                        level={4}
                        style={{ color: "#F2AA93", fontSize: "1.2rem",    
                      }}
                      >
                        Fertility Coach Assessment (Incomplete)
                      </Typography.Title>
                    </Col>
                    <Col
                      span={24}
                      md={4}
                      style={{ textAlign: isMobile ? "left" : "right" }}
                    >
                      <Typography.Title
                        level={4}
                        style={{
                          color: "#B46DB8",
                          fontSize: "1.2rem",
                          textAlign: "center",
                          marginRight: isMobile ? 0 : 0,
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
                      <p style={{height:'30px'}}></p>

                      <p style={{ marginTop: "2.3rem" }}>Duration:</p>
                      <p>Care Provider:</p>
                    </Col>

                    <Col xs={24} sm={12} md={16}>
                      <p>
                        Complete all the General Intake Forms (except Holistic Nutrition) - ASSESS section
                        Watch Fertility Coach Video - LEARN section                      </p>
                      <p>
                        Schedule a consultation with a clinician to review the General Intake Forms. Two requisition (Day 3 bloodwork and Peak +7 bloodwork) will be provided with a follow-up to discuss the results
                      </p>
                      <p>Includes two appointments with the Fertility Coach</p>
                      <p>Clinician (1 hour consultation + 30 min follow-up), Fertility Coach (two 30 minute appointment)</p>
                      <p>Clinician, Fertility Coach</p>
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
                        onClick={() => handleClick(500, 3)}
                        style={{
                          background: "#00000080",
                          borderColor: "#00000080",
                          border: "none",
                          marginTop: "2rem",
                        }}
                      >
                        Select
                      </Button>
                    </Col>
                  </Row>
                </>
              }
            </div>
          </div>

          <div className="mt-4" style={{ display: 'none' }}>
            <div
              style={{
                width: "100%",
                backgroundColor: "#B46DB8",
                borderRadius: "12px 12px 0 0",
                height: "61px",
                display: "none",
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
