import React, { useEffect, useState } from "react";
import { Row, Col, Button, Spin, Steps } from "antd";
import PeriodCycleTracker from "../../../screens/PatientDashboard/Cycle/cycle";
import { useDispatch } from "react-redux";
import { getMiraInfo } from "../../redux/AuthController"; // Ensure this path is correct
import { LoadingOutlined } from "@ant-design/icons";
import "../dashboard.css";
import { useNavigate } from "react-router-dom";
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
export default function PatDash() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMiraInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        // Debug: Confirm that dispatch and getMiraInfo are being called
        console.log("Dispatching getMiraInfo");

        const resultAction = await dispatch(getMiraInfo());

        console.log(resultAction, "Result Action"); // Debug: Check resultAction

        if (getMiraInfo.fulfilled.match(resultAction)) {
          setCycleInfo(resultAction.payload);
        } else {
          setError(resultAction.payload || "Failed to fetch Mira Info");
        }
      } catch (err) {
        console.error("Error occurred:", err); // Debug: Log error
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMiraInfo();
  }, [dispatch]);

  localStorage.setItem("currentStep", 1);
  
  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    if (storedStep) {
      setCurrentStep(parseInt(storedStep, 10)); // Parse as integer
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
        <div
          style={{
            background: "#F0F8FF",
            padding: "30px",
            borderRadius: "15px",
            width: "100%",
          }}
        >
          <h3 style={{ color: "#335CAD", fontSize: "20px" }}>
            Initial Sign Up Steps:
          </h3>
          <Steps
            current={currentStep}
            progressDot={customDot}
            direction="horizontal"
            size="small"
            style={{
              marginTop: "20px",
              justifyContent: "center",
            }}
            items={[
              {
                title: (
                  <div style={{ textAlign: "left" }}>
                    <span>Complete Reproductive Health Assessment Form</span>
                    <div style={{ marginTop: "10px" }}>
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
                  <div style={{ textAlign: "left" }}>
                    <span>Book Free 15-minute Consult with Fertility Coach</span>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/patient/appointment");
                        }}
                        disabled={currentStep < 1 ? true : false}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
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
                  <div style={{ textAlign: "left" }}>
                    <span>Continue Care by visiting the Plan section for Initial Assessment</span>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/plans");
                        }}
                        disabled={currentStep < 2 ? true : false}
                        style={{
                          backgroundColor: "#C2E6F8",
                          borderColor: "none",
                          color: "#00ADEF",
                          opacity: "",
                        }}
                      >
                        PLAN
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
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
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#C2E6F8",
                borderStyle: "solid",
              }}
            >
              <p>
                To schedule your appointment with your coach and clinician,
                click on the ‘Book Appointment’ link below.
              </p>
              <p>
                You’ll be redirected to the Jane App, where you can efficiently
                schedule and manage your appointment!
              </p>
              <Button
                type="primary"
                style={{
                  height: 46,
                  boxShadow: "0px 4px 4px 0px #00000040",
                  background: "#00ADEF",
                }}
              >
                <a
                  href="https://myfertilitylabs.janeapp.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Book Appointment
                </a>
              </Button>
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
        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            {loading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 100,
                      alignItems: "center",
                      margin: "auto",
                    }}
                    spin
                  />
                }
              />
            ) : error ? (
              <p style={{ color: "red" }}>Error: {error}</p>
            ) : cycleInfo && cycleInfo.cycleInfo ? ( // Correct condition to check if cycleInfo is available
              <PeriodCycleTracker cycleInfo={cycleInfo} dummyInfo={cycleData} />
            ) : (
              <p style={{ textAlign: "center" }}>
                No cycle information available.
              </p> // This message shows when cycleInfo is null or undefined
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
