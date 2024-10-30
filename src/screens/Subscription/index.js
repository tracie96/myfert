import React, { useEffect,useState } from "react";
import { Row, Col, Typography } from "antd";

import SubscriptionBanner from "../../assets/images/bg/subscription_home-logo.png";
import SecondPlan from "./second-plan";
import CompletePlan from "./complete_plan";
import PrePlan from "./pre-plan";

import "./subscription.css"



const SubscriptionPlanV2 = () => {

  const [currentStep, setCurrentStep] = useState(0); // Default value is 0
  // Retrieve currentStep from localStorage on component mount
  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    if (storedStep) {
      setCurrentStep(parseInt(storedStep)); // Set currentStep from localStorage
    }
  }, []);
  const { Title, Text } = Typography;
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <SecondPlan />;
      case 2:
        return <CompletePlan />;
      default:
        return (
          <Row gutter={16} style={{ padding: "0 5%" }}>
            <Col xs={20} sm={14}>
              <p style={{ color: "#335CAD", fontSize: "16px" }}>
                SUBSCRIPTION PLANS
              </p>
              <p style={{ padding: "5% 0" }}>
                Explore all our available plans for exclusive access to
                personalized support tailored to your preferences, needs, and
                goals.
              </p>
              <div style={{ background: "#3BC15640" }}>
                <div style={{ padding: "3% 5%" }}>
                  <p>Don’t forget to purchase Mira!</p>
                  <p>
                    Before choosing a plan, users are advised to acquire Mira,
                    as it's essential for screening and treating hormonal
                    imbalances and conditions affecting fertility.
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
            <PrePlan/>
          </Row>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default SubscriptionPlanV2;

