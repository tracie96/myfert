import React, { useEffect, useState } from "react";
import { Row, Col, Button, Spin, Steps, Avatar, Divider, Modal } from "antd";
// import PeriodCycleTracker from "../../../screens/PatientDashboard/Cycle/cycle";
import { useDispatch } from "react-redux";
import { getMiraInfo } from "../../redux/AuthController";
import { LoadingOutlined } from "@ant-design/icons";
import "../dashboard.css";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import MiraButton from "../../../assets/images/mirabutton.svg";
import IFM from "../../../assets/images/mira_error.png";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DownOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  UpOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CircleWithArc from "./periodchart";
import { getPatientStatus } from "../../redux/patientSlice";
const cycleData = {
  cycleInfo: {
    cycle_length: 29,
    period_start: "2024-07-08",
    period_end: "2024-07-13",
    fertile_window_start: "2024-07-17",
    fertile_window_end: "2024-07-24",
    ovulation: "2024-07-21",
  },
  dailyLog: {
    symptoms: [
      {
        value: "Headache",
        level: "Mild",
      },
      {
        value: "Nausea",
        level: "Mild",
      },
      {
        value: "Cravings",
        level: "Mild",
      },
    ],
    mood: "Happy",
    sex: "Yes, unprotected",
    cervical_mucous: {
      description: "Raw Egg White",
      volume: "Medium",
    },
    cervical_position: {
      height: "Middle",
      openness: "Closed",
      texture: "Medium",
    },
    flow_spotting: "Spotting",
  },
  statusCode: "200",
  status: true,
  message: "Successful",
};

const customDot = (dot, { status, index }) => (
  <span
    style={{
      backgroundColor: status === "process" ? "#3182CE" : "#E2E8F0",
      padding: "5px",
      borderRadius: "50%",
      color: status === "process" ? "#fff" : "#000",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "24px",
      height: "24px",
    }}
  >
    {index + 1}
  </span>
);
const assessCustomDot = (dot, { status, index }) => (
  <span
    style={{
      backgroundColor: status === "process" ? "#008000" : "#E2E8F0",
      padding: "5px",
      borderRadius: "50%",
      color: status === "process" ? "#fff" : "#000",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "24px",
      height: "24px",
    }}
  >
    {index + 1}
  </span>
);

export default function PatDash() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointmentList = [] } = useSelector((state) => state?.doctor);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userCurrentStep] = useState(0);
  const { userAuth } = useSelector((state) => state.authentication);
  const { status } = useSelector((state) => state.patient);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [viewAll, setViewAll] = useState(false);
  const filteredAppointments = appointmentList.filter(
    (app) => app.roleId === 0
  );
  const visibleAppointments = viewAll
    ? filteredAppointments
    : filteredAppointments.slice(0, 2);

  const handleViewAll = () => {
    setViewAll(!viewAll);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showCyleModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    let intervalId;

    if (userAuth?.obj?.token) {
      dispatch(getPatientStatus());

      // Fetch status only if it needs updating based on the statLevel
      if (status?.statLevel <= 1 || status?.statLevel === '' || status?.statLevel === undefined) {
        intervalId = setInterval(() => {
          dispatch(getPatientStatus());
        }, 10000);
      }
    }

    return () => {
      // Clear the interval if set
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userAuth?.obj?.token, status?.statLevel, dispatch]);

  useEffect(() => {
    const fetchMiraInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Dispatching getMiraInfo");

        const resultAction = await dispatch(getMiraInfo());

        console.log(resultAction, "Result Action");

        if (getMiraInfo.fulfilled.match(resultAction)) {
          setCycleInfo(resultAction.payload);
        } else {
          setError(resultAction.payload || "Failed to fetch Mira Info");
        }
      } catch (err) {
        console.error("Error occurred:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMiraInfo();
  }, [dispatch]);

  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    if (storedStep) {
      setCurrentStep(parseInt(storedStep, 10));
    }
  }, []);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    localStorage.setItem("currentStep", step);
  };
  return (
    <div>
      <Row gutter={16} style={{ padding: "0 5%" }}>
        <div style={{ color: "#000000" }}>
          <p>
            Fertility is not just a journey; it's a testament to the strength
            and resilience of the human spirit. Keep it up and improve your
            health!
          </p>
        </div>
      </Row>
      <div
        style={{
          background: "#F0F8FF",
          padding: isMobile ? "8%" : "10px",
          borderRadius: isMobile ? "0px" : "15px",
          marginRight: isMobile ? "-25px" : 0,
          marginLeft: isMobile ? "-25px" : 0,
          boxSizing: "unset",
          width: isMobile ? "auto" : "100%",
        }}
      >
        {status === undefined &&
          <>
            <h3 style={{ color: "#335CAD", fontSize: "20px" }}>
              Initial Sign Up Steps:
            </h3>
          </>}
        {status === "" || status?.statLevel <= 2 || status === undefined ?
          <Steps
            current={currentStep}
            progressDot={customDot}
            direction={isMobile ? "horizontal" : "horizontal"}
            responsive={false}
            size="small"
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: isMobile ? "row" : "row",
              alignItems: isMobile ? "flex-start" : "center",

            }}
            items={[
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', width: isMobile ? 'auto' : '200px' }}>
                    <span>Complete Reproductive Health Assessment Form</span>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        onClick={() => {
                          navigate("/assessment");
                        }}
                        type="primary"
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        ASSESS
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', width: isMobile ? 'auto' : '200px' }}>
                    <span>Book Free 15-minute Consult with Fertility Coach</span>
                    <div style={{ marginTop: isMobile ? "30px" : "10px" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/patient/calendar");
                        }}
                        disabled={currentStep < 1 || currentStep === null}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        APPT
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', width: isMobile ? 'auto' : '200px' }}>
                    <span>Continue Care by visiting the Plan section for Initial Assessment</span>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/plans");
                        }}
                        disabled={currentStep !== 2 || currentStep === null}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        PLAN
                      </Button>
                    </div>
                  </div>
                ),

              },

            ]
            }
          />

          :

          <Steps
            current={userCurrentStep}
            progressDot={assessCustomDot}
            direction={isMobile ? "horizontal" : "horizontal"}
            responsive={false}

            size="small"
            style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "row",
              alignItems: isMobile ? "flex-start" : "",
              overflowX: "auto",
              padding: isMobile ? 0 : '5px 2%'
            }}
            items={[
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Complete General Intake Form</span>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "row", gap: "10px" }}>
                      <Button
                        onClick={() => {
                          handleStepChange(1);
                          navigate("/assessment");
                        }}
                        type="primary"
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        ASSESS
                      </Button>
                    </div>
                  </div>

                ),
              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Watch the Cycle Tracking Video</span>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "row", gap: "10px" }}> {/* Adjusted this line */}
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/learn");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        LEARN
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <ul>
                      <li>Book appt #1 with Fertility Coach</li>
                      <li>Book 1 hour appt with Clinician</li>
                    </ul>
                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/appointment");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '100%' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        APPT
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Day 3 Bloodwork</span>
                    <div style={{ marginTop: "auto" }}> {/* Adjusted this line */}
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/labs");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        LABS
                      </Button>
                    </div>
                  </div>

                ),

              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Book appt #2 with Fertility Coach</span>
                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/appointment");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        APPT
                      </Button>
                    </div>
                  </div>

                ),

              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Peak +7 Bloodwork</span>
                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/labs");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        LABS
                      </Button>
                    </div>
                  </div>

                ),

              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Book 30 minute appt with Clinician</span>
                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/appointment");
                        }}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        APPT
                      </Button>
                    </div>
                  </div>

                ),

              },
              {
                title: (
                  <div style={{ textAlign: "left", fontSize: isMobile ? '12px' : '14px', display: "flex", flexDirection: "column", height: "100%" }}>
                    <span>Continue Care</span>
                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/plans");
                        }}
                        disabled={status?.statLevel !== 3}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          width: isMobile ? '80px' : '',
                          fontSize: isMobile ? '8px' : ''
                        }}
                      >
                        PLANS
                      </Button>
                    </div>
                  </div>

                ),

              },
            ]
            }
          />
        }
      </div>
      <Row gutter={16}>

        <Col xs={24} md={12} style={{ paddingBottom: "16px", paddingTop: 20 }}>
          <div>
            <div
              style={{
                width: "100%",
                backgroundColor: "#335CAD",
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
                  fontSize: "14px",
                  padding: 20,
                  marginBottom: 0,
                }}
              >
                Appointments
              </h3>
            </div>
            <div
              style={{
                padding: "16px 16px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#C2E6F8",
                borderStyle: "solid",
              }}
            >
              {isMobile ? (
                <div
                  style={{
                    order: isMobile ? 2 : 1,
                  }}
                >


                  {filteredAppointments.length > 0 ? (
                    <div>
                      {visibleAppointments.map((appointment, index) => (
                        <>
                          <div
                            key={index} // Add a unique key for each appointment
                            style={{
                              width: "100%",
                              background: index % 2 === 0 ? "#F2AA9380" : "#B46DB8",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                background: "#fff",
                                display: "flex",
                                justifyContent: "space-between",
                                boxSizing: "border-box",
                                float: 'right',
                                marginBottom: '20px'
                              }}
                            >
                              {/* Column 1 - Clinician Info */}
                              <Col style={{ fontSize: "8px" }} span={8}>
                                <div style={{ fontSize: "8px", display: "flex", alignItems: "center" }}>
                                  <Avatar style={{ marginRight: "10px" }} icon={<UserOutlined />} />
                                  <div style={{ fontWeight: "bold", color: "#F2AA93" }}>Doctor Doctor</div>
                                </div>
                                <div style={{ color: "#7D7D7D" }}>Ongoing Care Plan - Initial Care Team Appointment</div>
                              </Col>

                              {/* Column 2 - Date and Time Info */}
                              <Col style={{ flex: 1, textAlign: "left", fontSize: '10px' }} span={10}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                  <CalendarOutlined style={{ marginRight: "8px" }} />
                                  {new Date(appointment.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                  <ClockCircleOutlined style={{ marginRight: "8px" }} /> 9:00 AM - 9:30 AM
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <EnvironmentOutlined style={{ marginRight: "8px" }} /> Virtual or In-person
                                </div>
                              </Col>

                              {/* Column 3 - Join Button */}
                              <Col span={4} style={{ display: "flex", flexDirection: 'column', alignItems: "center", fontSize: '8px' }}>
                                <MoreOutlined style={{ fontSize: '10px' }} />
                                <Button type="primary" style={{ width: 60, marginTop: '10px', borderRadius: 5 }} icon={<VideoCameraOutlined />}>
                                  <span style={{ fontSize: '8px' }}>JOIN</span>
                                </Button>
                              </Col>
                            </div>
                          </div>
                          <Divider />
                        </>
                      ))}

                      {filteredAppointments.length > 2 && (
                        <div
                          onClick={handleViewAll}
                          style={{ color: "#1E90FF", cursor: "pointer" }} // Added cursor for better UX
                        >
                          {viewAll ? (
                            <UpOutlined style={{ marginRight: "10px" }} />
                          ) : (
                            <DownOutlined style={{ marginRight: "10px" }} />
                          )}
                          {viewAll ? "View Less" : "View All"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>You have no upcoming appointments.</p>
                      <p>Earliest appointment you can schedule with your provider is:</p>
                    </div>
                  )}
                </div>
              ) :
                <div

                >
                  <p>
                    You have no upcoming appointments.
                  </p>

                  <Button
                    type="primary"
                    style={{
                      height: 46,
                      boxShadow: "0px 4px 4px 0px #00000040",
                      background: "#00ADEF",
                    }}
                  >
                    <div
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      Book Appointment
                    </div>
                  </Button>
                </div>
              }
            </div>
          </div>
          <div className="mt-4">
            <div
              style={{
                width: "100%",
                backgroundColor: "#335CAD",
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
                  fontSize: "14px",
                  padding: 20,
                  marginBottom: 0,
                }}
              >
                UPCOMING BLOODWORK
              </h3>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#C2E6F8",
                borderStyle: "solid",
              }}
            >
              <p>You have no upcoming bloodwork.</p>
            </div>
          </div>

          <div className="mt-4">
            <div
              style={{
                width: "100%",
                backgroundColor: "#335CAD",
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
                  fontSize: "14px",
                  padding: 20,
                  marginBottom: 0,
                }}
              >
                DOCUMENTS
              </h3>
            </div>

            <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#C2E6F8",
                borderStyle: "solid",
              }}
            >
              <p>You have no documents available.</p>
            </div>
          </div>
        </Col>
        {isMobile ? <>

          {/* Fixed button on the right */}
          <img
            onClick={showCyleModal}
            src={MiraButton}
            style={{
              position: "fixed",
              right: "0px",
              bottom: "20px",
              top: "320px",
              backgroundColor: "#C2E6F8",
              borderColor: "none",
              color: "#00ADEF",
              transform: "rotateY(360deg)",
            }}
            alt="mira"
          >
          </img>

          {/* Modal for cycle info */}
          <Modal
            title="Cycle Information"
            visible={isModalVisible}
            onOk={handleOk}
            centered
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
            ]}
          >
            {cycleInfo && cycleInfo.cycleInfo ? (
              <CircleWithArc cycleInfo={cycleInfo} dummyInfo={cycleData} />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <p style={{ textAlign: "center", color: "red", width: '70%' }}>
                    It looks like your Mira account hasn't been set up yet, or the email you used for Mira doesn't match the one for MFL.
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={IFM} alt="ifm" style={{ width: "50%", margin: 'auto' }} />
                </div>
              </div>
            )}
          </Modal>
        </> :
          <Col
            xs={24}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 100,
                      }}
                      spin
                    />
                  }
                />
              ) : error ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center',width: '100%', marginTop:-80 }}>
                    <p style={{ textAlign: "center", color: "#FF0000", width: '70%' }}>
                      It looks like your Mira account hasn't been set up yet, or the email you used for Mira doesn't match the one for MFL.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={IFM} alt="ifm" style={{ width: "50%", margin: 'auto' }} />
                  </div>
                </div>


              ) : cycleInfo && cycleInfo.cycleInfo ? <CircleWithArc cycleInfo={cycleInfo} />
                : (
                  <div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <p style={{ textAlign: "center", color: "red", width: '70%' }}>
                      It looks like your Mira account hasn't been set up yet, or the email you used for Mira doesn't match the one for MFL.
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={IFM} alt="ifm" style={{ width: "50%", margin: 'auto' }} />
                  </div>
                </div>
              
                )}
            </div>
          </Col>}
      </Row>

    </div>
  );
}
