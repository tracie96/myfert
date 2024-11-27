import React, { useEffect, useState } from "react";
import { Row, Col, Button, Typography, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./subscription.css"
import SubscriptionBanner from "../../assets/images/bg/subscription_home-logo.png";
import { fetchSubscriptionPlans } from "../../components/redux/subscriptionSlice";
import { useMediaQuery } from "react-responsive";

const CompletePlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.subscription);
  const isPaymentComplete = useSelector((state) => state.authentication.userAuth.obj.isPaymentComplete);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const { Title, Text } = Typography;

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  const handleClick = (price, id) => {
    const state = { price: price, id: id };
    navigate("/payment-details", { state });
  };
  return (
    <Row gutter={16} style={{ padding: "0 2%" }}>
      <Modal
  title="Complete Learning and Assessments"
  visible={isModalVisible}
  onCancel={handleModalCancel}
  footer={[
    <Button key="cancel" onClick={handleModalCancel}>
      Later
    </Button>,
      <Button key="ok" type="primary" onClick={()=>navigate('/assessment')}>
      Go to Assessment
    </Button>,
    <Button key="ok" type="primary" onClick={()=>navigate('/learn')}>
      Go to Learning
    </Button>,
  ]}
>
        <p>
          You haven't completed the required learning materials and assessments. 
          Please complete them to proceed further.
        </p>
      </Modal>
      <Col xs={20} sm={14}>
        <p style={{ color: "#335CAD", fontSize: "16px" }}>SUBSCRIPTION PLANS</p>
        <p style={{ padding: "5% 0" }}>
          Explore all our available plans for exclusive access to personalized
          support tailored to your preferences, needs and goals.
        </p>
        <div style={{ background: "#3BC15640" }}>
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
        {/* Second column, same as above */}
        <img src={SubscriptionBanner} alt="subscription" className="subscription-image" />
        <div style={{ padding: "20px" }}>
          <Title style={{ color: "#1d4db5", fontSize: "14px" }}>
            What are the different Care Providers?
          </Title>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              <Text strong>Clinician</Text>
              <br />
              <Text type="secondary">
                (Doctor, Pharmacist, and Nurse Practitioner)
              </Text>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Text strong>Nutritionist</Text>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Text strong>Fertility Coach</Text>
              <br />
              <Text type="secondary">
                (Fertility Support Practitioner and Fertility Educator)
              </Text>
            </li>
          </ul>
        </div>
      </Col>

      {!isPaymentComplete && (
        <>
          <Col xs={24} sm={24}>
            {" "}
            <div bordered={false} style={{ borderRadius: 12 }}>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#DAA520",
                  borderRadius: 12,
                  marginTop: 40,
                  height: "61px",
                  display: "flex",
                  alignItems: "left",
                  justifyContent: "left",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "14px",
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  CURRENT PLANS
                </h3>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: 12,
                  marginTop: "-15px",
                  borderWidth: "1px",
                  backgroundColor: "#fff",
                  borderColor: "#C2E6F8",
                  borderStyle: "solid",
                }}
              >
                <p>No active Plans</p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24}>
            <div style={{ borderRadius: 12 }}>
              {/* Section Header */}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#335CAD",
                  borderRadius: "12px 12px 0 0",
                  height: "61px",
                  marginTop: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  paddingLeft: 24,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ONGOING CARE PLANS
                </h3>
              </div>
              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: 12,
                  borderWidth: "1px",
                  color: "#000",
                  backgroundColor: "#fff",
                  borderColor: "#C2E6F8",
                  borderStyle: "solid",
                  marginTop: -10,
                }}
              >
                {/* Plan Cards */}
                {plans?.map((plan, index) => (
                  <div key={index}>
                    {/* Plan Header (Months) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                        flexWrap: "wrap", 
                      }}
                    >
                      <div style={{ flex: "1 1 300px", marginBottom: "10px" }}>
                        <h3
                          style={{
                            color: "#335CAD",
                            fontSize: "24px",
                            fontWeight: "bold",
                          }}
                        >
                          6 Months
                        </h3>
                        <p style={{ fontWeight: "bold" }}>Description:</p>
                      </div>
                      <div
                        style={{
                          flex: "2 1 300px",
                          alignContent: "center",
                          marginTop: isMobile?0:40,
                          marginBottom: "10px",
                        }}
                      >
                        <p>
                          Complete Holistic Nutrition Form <em>(if not completed)</em> - ASSESS section
                        </p>
                        <p>
                          Includes:
                          <ul>
                            <li>3 clinician appointments</li>
                            <li>
                              3 nutritionist appointments <em>(1 hr + two 30 minutes)</em>
                            </li>
                            <li>6 fertility coach appointments</li>
                            <li>
                              1 diagnosis appointment <em>(anytime when ordered by clinician)</em>
                            </li>
                          </ul>
                        </p>
                      </div>
                      <div
                        style={{
                          flex: "1 1 200px",
                          textAlign: "right",
                          marginBottom: "10px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            margin: 0,
                          }}
                        >
                          Price
                        </p>
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            margin: 0,
                          }}
                        >
                          ${plan.monthlyAmount}/mo
                        </p>
                        <Button
                          onClick={() => handleClick(plan.monthlyAmount, plan.id)}
                          style={{
                            marginTop: "10px",
                            fontSize: "14px",
                            background: "#00ADEF",
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                    <hr style={{ border: "2px solid #C2E6F8", width: "30%" }} />
                  </div>
                ))}
              </div>

            </div>
          </Col>

          <Col xs={24} sm={24}>
            <div className="mt-4">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#F2AA93",
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
                      Clinician Assessment (Complete)
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
                          color: "#F2AA93",
                          marginRight: 15,
                          marginTop: -7,
                        }}
                      />

                      <Typography.Title
                        level={4}
                        style={{
                          color: "#F2AA93",
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
        </>
      )}
    </Row>
  );
};

export default CompletePlan;
