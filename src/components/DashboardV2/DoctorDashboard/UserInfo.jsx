import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Modal, Descriptions, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentHealthLifestyle,
  getGeneralInformation,
  getGetStress,
  getHealthandMedical,
  getIllnessCondition,
  getNutritionAndDietaryHabits,
  getPersonalFamily,
  getReadiness,
  getReproductiveReview,
  getSubstanceAbuse,
  getSymptomReview,
  getAccessDetailsDoctor,
} from "../../redux/AssessmentController";
import { Tag } from "antd";
import Header from "./Components/Header";
import { LockOutlined } from "@ant-design/icons";

export default function UserInfo() {
  const location = useLocation();
  const userInfo = location.state;
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(null);
  const generalInfo = useSelector((state) => state.intake?.generalInfo);
  const reproductiveInfo = useSelector((state) => state.intake?.reproductiveInfo);
  const currentHealth = useSelector((state) => state.intake?.healthLifestyle);
  const nutrition = useSelector((state) => state.intake.nuritionInfo);
  const substance = useSelector((state) => state.intake?.substanceInfo);
  const stress = useSelector((state) => state.intake?.stressInfo);
  const healthMedical = useSelector((state) => state.intake?.healthMedicalInfo);
  const personalFamily = useSelector(
    (state) => state.intake?.personalFamilyInfo,
  );
  const illness = useSelector((state) => state.intake?.illnessInfo);
  const symptom = useSelector((state) => state.intake?.symptomInfo);
  const readiness = useSelector((state) => state.intake?.readinessInfo);
  const loading = useSelector((state) => state.user?.loading);
  const doctorAccessDetails = useSelector((state) => state.intake?.doctorAccessDetails);

  // Map modal content to their corresponding access detail keys
  const modalContentMapping = {
    "General Information": "generalInformation",
    "Current Health & Lifestyle": "healthLifestyle",
    "Nutrition & Dietary Habits": "nutrition",
    "Substance Use": "substanceUse",
    "Stress & Relationships": "stressRelationship",
    "Health & Medical History": "healthMedical",
    "Personal & Family History": "personalFamily",
    "Illness & Conditions": "illnessConditions",
    "Symptom Review & Medications": "symptomsReview",
    "Readiness & Health Goals": "readinessHealth",
    "Reproductive Health": "reproductiveHealth",
  };

  const modalContent = useMemo(() => [
    "General Information",
    "Current Health & Lifestyle",
    "Nutrition & Dietary Habits",
    "Substance Use",
    "Stress & Relationships",
    "Health & Medical History",
    "Personal & Family History",
    "Illness & Conditions",
    "Symptom Review & Medications",
    "Readiness & Health Goals",
    "Reproductive Health",
  ], []);

  // Add this useEffect for access details
  useEffect(() => {
    if (userInfo?.user?.userRef) {
      dispatch(getAccessDetailsDoctor(userInfo.user.userRef));
    }
  }, [dispatch, userInfo?.user?.userRef]);

  // Separate useEffect for modal content
  useEffect(() => {
    let isSubscribed = true;

    const fetchModalData = async () => {
      if (visibleModal === null || !userInfo?.user?.userRef || !modalContent[visibleModal]) {
        return;
      }

      const selectedContent = modalContent[visibleModal];
      
      if (!isSubscribed) return;

      switch (selectedContent) {
        case "General Information":
          await dispatch(getGeneralInformation(userInfo.user.userRef));
          break;
        case "Current Health & Lifestyle":
          await dispatch(getCurrentHealthLifestyle(userInfo.user.userRef));
          break;
        case "Nutrition & Dietary Habits":
          await dispatch(getNutritionAndDietaryHabits(userInfo.user.userRef));
          break;
        case "Substance Use":
          await dispatch(getSubstanceAbuse(userInfo.user.userRef));
          break;
        case "Stress & Relationships":
          await dispatch(getGetStress(userInfo.user.userRef));
          break;
        case "Health & Medical History":
          await dispatch(getHealthandMedical(userInfo.user.userRef));
          break;
        case "Personal & Family History":
          await dispatch(getPersonalFamily(userInfo.user.userRef));
          break;
        case "Illness & Conditions":
          await dispatch(getIllnessCondition(userInfo.user.userRef));
          break;
        case "Symptom Review & Medications":
          await dispatch(getSymptomReview(userInfo.user.userRef));
          break;
        case "Readiness & Health Goals":
          await dispatch(getReadiness(userInfo.user.userRef));
          break;
        case "Reproductive Health":
          await dispatch(getReproductiveReview(userInfo.user.userRef));
          break;
        default:
          break;
      }
    };

    fetchModalData();

    return () => {
      isSubscribed = false;
    };
  }, [visibleModal, userInfo?.user?.userRef, dispatch, modalContent]);

  const showModal = (index) => {
    setVisibleModal(index);
    console.log("Visible Modal Index:", index);
  };
  return (
    <Row gutter={16} justify="" style={{ padding: "0 5%" }}>

      <Col xs={24} sm={24} md={24} lg={24} xl={24}>      
      <Header />

      </Col>
      <Row gutter={18}>
        <Col xs={24} md={24} lg={24} style={{ paddingBottom: "16px" }}>
          <Row gutter={[16, 16]}>
            {modalContent.map((content, index) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={6}
                key={index}
              >
                <Card
                  hoverable
                  style={{
                    border: "1px solid #C2E6F8",
                    borderRadius: 10,
                    height: "100%",
                    background: doctorAccessDetails && doctorAccessDetails[modalContentMapping[content]] ? "#C2E6F8" : "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: doctorAccessDetails && doctorAccessDetails[modalContentMapping[content]] ? 1 : 0.7,
                  }}
                  onClick={() => showModal(index)}
                >
                  <div style={{ textAlign: "center" }}>
                    <h4 style={{ 
                      fontSize: 16, 
                      margin: 0,
                      color: doctorAccessDetails && doctorAccessDetails[modalContentMapping[content]] ? "#000" : "#666",
                      fontWeight: "500",
                      lineHeight: 1.4,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "center"
                    }}>
                      {content}
                      {doctorAccessDetails && !doctorAccessDetails[modalContentMapping[content]] && (
                        <LockOutlined style={{ fontSize: 14 }} />
                      )}
                    </h4>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Add back the modals */}
          {modalContent.map((content, index) => (
            <Modal
              key={index}
              title={`Details for ${content}`}
              visible={visibleModal === index}
              width={"1200px"}
              footer={null}
              onCancel={() => setVisibleModal(null)}
            >
              <SwitchContent
                index={index}
                content={content}
                generalInfo={generalInfo}
                currentHealth={currentHealth}
                nutrition={nutrition}
                substance={substance}
                stress={stress}
                healthMedical={healthMedical}
                personalFamily={personalFamily}
                illness={illness}
                symptom={symptom}
                readiness={readiness}
                reproductiveInfo={reproductiveInfo}
                loading={loading}
              />
            </Modal>
          ))}
        </Col>
        <Col xs={24} md={24} lg={24} style={{ paddingBottom: "16px", maxWidth: '570px' }}>
          <div>
            {/* FLAGS Section */}
            {/* <div
              style={{
                width: "100%",
                backgroundColor: "#335CAD",
                borderRadius: "12px 12px 0 0",
                height: "61px",
                display: "flex",
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
                  fontWeight: "bold",
                }}
              >
                FLAGS
              </h3>
            </div> */}
            {/* <div
              style={{
                padding: "16px 24px",
                borderRadius: 12,
                borderWidth: "1px",
                marginTop: -10,
                backgroundColor: "#fff",
                borderColor: "#C2E6F8",
                borderStyle: "solid",
              }}
            > */}
              {/* <div> */}
                {/* <h6 style={{ fontSize: "12px", fontWeight: "bold", color: '#111F4A' }}>
                  Date: June 1, 2024
                </h6> */}
                {/* <div style={{ marginTop: '25px' }}>
                  <div style={{ display: "flex", alignItems: "center",  justifyContent: 'space-between', borderBottom: '1px solid rgb(0,0,0, .2)', marginTop: '14px' }}>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>PCOS</h4>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>Intake Form</h4>
                    <h4 style={{ color: '#FF0000', fontSize: '13px', marginBottom: '12px' }}>Yes</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center",  justifyContent: 'space-between', borderBottom: '1px solid rgb(0,0,0, .2)', marginTop: '14px' }}>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>PCOS</h4>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>Intake Form</h4>
                    <h4 style={{ color: '#FF0000', fontSize: '13px', marginBottom: '12px' }}>Yes</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center",  justifyContent: 'space-between', borderBottom: '1px solid rgb(0,0,0, .2)', marginTop: '14px' }}>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>PCOS</h4>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>Intake Form</h4>
                    <h4 style={{ color: '#FF0000', fontSize: '13px', marginBottom: '12px' }}>Yes</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center",  justifyContent: 'space-between', borderBottom: '1px solid rgb(0,0,0, .2)', marginTop: '14px' }}>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>PCOS</h4>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>Intake Form</h4>
                    <h4 style={{ color: '#FF0000', fontSize: '13px', marginBottom: '12px' }}>Yes</h4>
                  </div>
                  <div style={{ display: "flex", alignItems: "center",  justifyContent: 'space-between', borderBottom: '1px solid rgb(0,0,0, .2)', marginTop: '14px' }}>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>PCOS</h4>
                    <h4 style={{ color: '#111F4A', fontSize: '13px', marginBottom: '12px' }}>Intake Form</h4>
                    <h4 style={{ color: '#FF0000', fontSize: '13px', marginBottom: '12px' }}>Yes</h4>
                  </div>
                </div> */}
              {/* </div> */}

              {/* Your flags data here */}
            {/* </div> */}

            {/* MOST RECENT BLOODWORK Section */}
            <div className="mt-4">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#335CAD",
                  borderRadius: "12px 12px 0 0",
                  height: "61px",
                  display: "flex",
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
                    fontWeight: "bold",
                  }}
                >
                  MOST RECENT BLOODWORK
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
          </div>

          {/* <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center" }}>
              No cycle information available.
            </p>
          </div> */}
        </Col>
      </Row>
    </Row>
  );
}

function SwitchContent({
  index,
  content,
  generalInfo,
  currentHealth,
  nutrition,
  substance,
  stress,
  healthMedical,
  personalFamily,
  illness,
  symptom,
  readiness,
  reproductiveInfo,
  loading,
}) {
  // Map content to case
  const contentToCase = {
    "General Information": 0,
    "Current Health & Lifestyle": 1,
    "Nutrition & Dietary Habits": 2,
    "Substance Use": 3,
    "Stress & Relationships": 4,
    "Health & Medical History": 5,
    "Personal & Family History": 6,
    "Illness & Conditions": 7,
    "Symptom Review & Medications": 8,
    "Readiness & Health Goals": 9,
    "Reproductive Health": 10,
  };

  const caseIndex = contentToCase[content];
  
  switch (caseIndex) {
    case 0: // General Information section
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Age">
                  {generalInfo.age || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Genetic Background">
                  {generalInfo.geneticBackground || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Location of Medical Care">
                  {generalInfo.whereMedicalCare || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Last Medical Visit">
                  {generalInfo.whenMedicalCare || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Primary Healthcare Provider">
                  {generalInfo.whomMedicalCare || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Contact">
                  {generalInfo.emergencyContact || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Emergency Relationship">
                  {generalInfo.emergencyRelationship || "Not Provided"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>

                  <Descriptions.Item label={`Emergency Phone (${generalInfo.emergencyPhoneWork})`}>
                    {generalInfo.emergencyPhoneHome || "N/A"}
                  </Descriptions.Item>

                <Descriptions.Item label="How Did You Hear About Us?">
                  {generalInfo.howDidHearAbout || "Not Provided"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );

    case 1:
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16} justify="center">
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Ongoing Health">
                  {currentHealth?.ongoingHealth?.length > 0 ? (
                    currentHealth.ongoingHealth.map((health, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <strong>Problem:</strong> {health.problem || "Not Provided"} <br />
                        <strong>Severity:</strong>{" "}
                        {health.severity ? (
                          <Tag color={health.severity === "High" ? "red" : health.severity === "Medium" ? "orange" : "green"}>
                            {health.severity}
                          </Tag>
                        ) : (
                          "Not Provided"
                        )}
                        <br />
                        <strong>Prior Treatment:</strong> {health.priorTreatment || "Not Provided"} <br />
                        <strong>Success:</strong>{" "}
                        {health.success ? (
                          <Tag color={health.success === "Yes" ? "green" : "green"}>{health.success}</Tag>
                        ) : (
                          "Not Provided"
                        )}
                      </div>
                    ))
                  ) : (
                    "Not Provided"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Allergies">
                  {currentHealth?.allergies?.length > 0 ? (
                    currentHealth.allergies.map((allergy, index) => (
                      <div key={index} className="m-2">
                        <strong>Food:</strong>{" "}
                        <Tag color="magenta">{allergy.food || "Not Provided"}</Tag> <br />
                        <strong>Reaction:</strong>{" "}
                        <Tag color="volcano">{allergy.reaction || "Not Provided"}</Tag>
                      </div>
                    ))
                  ) : (
                    "Not Provided"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Sleep Hours">
                  {currentHealth?.sleepHours || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Problem Sleeping">
                  {currentHealth?.problemSleeping ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Staying Asleep">
                  {currentHealth?.stayingAsleep ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Insomnia">
                  {currentHealth?.insomnia ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Do You Snore">
                  {currentHealth?.doYouSnore ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Rested Upon Awake">
                  {currentHealth?.restedUponAwake ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Sleeping Aids">
                  {currentHealth?.sleepingAids?.yesNo
                    ? currentHealth.sleepingAids.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Cardio">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="blue">{currentHealth?.cardio?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.cardio?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.cardio?.duration || 0} minutes
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Strength">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="green">{currentHealth?.strenght?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.strenght?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.strenght?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Flexibility">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="purple">{currentHealth?.flexibility?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.flexibility?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.flexibility?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Balance">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="orange">{currentHealth?.balance?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.balance?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.balance?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Sport">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="red">{currentHealth?.sport?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.sport?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.sport?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Other">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="grey">{currentHealth?.other?.type || "Not Provided"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.other?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.other?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Motivated to Exercise">
                  {currentHealth?.motivatedToExercise || "Not Provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems That Limit Exercise">
                  {currentHealth?.problemsThatLimitExercise?.yesNo
                    ? currentHealth.problemsThatLimitExercise.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Sore After Exercise">
                  {currentHealth?.soreAfterExercise?.yesNo
                    ? currentHealth.soreAfterExercise.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );


    case 2: // Nutrition & Dietary Habits section
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Dietary Information" column={1} bordered>
                  <Descriptions.Item label="Special Diet Program">
                    <div className="inside-table-content">
                      {nutrition.specialDietProgram && nutrition.specialDietProgram.length > 0 ? (
                        nutrition.specialDietProgram.map((diet, index) => (
                          <Tag color="blue" style={{display: 'flex'}} key={index} className="m-1">
                            {diet}
                          </Tag>
                        ))
                      ) : (
                        "Not Provided"
                      )}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Special Diet Reason">
                    {nutrition.specialDietReason || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sensitive to Food">
                    {nutrition.sensitiveToFood ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sensitive to Food Describe">
                    {nutrition.sensitiveToFood?.describe || ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aversion to Food">
                    {nutrition.aversionToFood?.yesNo === true
                      ? "Yes"
                      : nutrition.aversionToFood?.yesNo === false
                        ? "No"
                        : "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aversion To Food Describe">
                    {nutrition.aversionToFood?.describe || ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Adverse List">
                    <div className="inside-table-content">
                      {nutrition.adverseList && nutrition.adverseList.length > 0 ? (
                        nutrition.adverseList.map((adverse, index) => (
                          <Tag color="red" key={index} className="m-1">
                            {adverse}
                          </Tag>
                        ))
                      ) : (
                        "Not Provided"
                      )}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Adverse React Other">
                    {nutrition.adverseReactOther || ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Any Food Craving">
                    {nutrition.anyFoodCraving?.yesNo === true
                      ? "Yes"
                      : nutrition.anyFoodCraving?.yesNo === false
                        ? "No"
                        : "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Any Food Craving Describe">
                    {nutrition.anyFoodCraving?.describe || ""}
                  </Descriptions.Item>

                  <Descriptions.Item label="Have 3 Meals a Day">
                    {nutrition.have3MealADay?.yesNo === "True" ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Have 3 Meals a Day">
                    {nutrition.have3MealADay?.level || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Skipping a Meal">
                    {nutrition.skippingAMeal ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reason Skip Meal">
                    {nutrition.reasonSkipMeal || ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Many Eat Out Per Week">
                    {nutrition.howManyEatOutPerWeek || "Not Provided"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>

            {/* Eating Habits Column */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Eating Habits" column={1} bordered>
                  <Descriptions.Item label="Eating Habits" style={{ width: '100%' }}>
                    <div className="inside-table-content">
                      {nutrition?.eatingHabits?.length > 0 ? (
                        nutrition.eatingHabits.map((habit, index) => (
                          <Tag color="green" key={index} className="m-1">
                            {habit || "Not Provided"}
                          </Tag>
                        ))
                      ) : (
                        "Not Provided"
                      )}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Break Fast Time">
                    {nutrition.breakfastTime || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Breakfast">
                    {nutrition.typicalBreakfast || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lunch Time">
                    {nutrition.lunchTime || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Lunch">
                    {nutrition.typicalLunch || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dinner Time">
                    {nutrition.dinnerTime || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Dinner">
                    {nutrition.typicalDinner || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Snacks Time">
                    {nutrition.snacksTime || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Snacks">
                    {nutrition.typicalSnacks || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Drink">
                    {nutrition.typicalFluid || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Fruits/Day">
                    {nutrition.noTypicalFruits || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Vegetables/Day">
                    {nutrition.noTypicalVegetables || "Not Provided"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>

            {/* Additional Eating Habits Column for balance */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Additional Dietary Information" column={1} bordered>
                  <Descriptions.Item label="Number of Typical Legumes">
                    {nutrition.noTypicalLegumes || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Red Meat">
                    {nutrition.noTypicalRedMeat || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Fish">
                    {nutrition.noTypicalFish || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Dairy">
                    {nutrition.noTypicalDairy || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Nuts">
                    {nutrition.noTypicalNuts || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Fats">
                    {nutrition.noTypicalFats || "Not Provided"}
                  </Descriptions.Item> 
                  <Descriptions.Item label="Number Typical Can Soda">
                    {nutrition.noTypicalCanSoda || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number Typical Sweets">
                    {nutrition.noTypicalSweets || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Caffeinated Beverages">
                    {nutrition.caffeinatedBeverages ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Coffee Cups">
                    {nutrition.coffeeCups || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tea Cups">
                    {nutrition.teaCups || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Soda Cups">
                    {nutrition.sodaCups || "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adverse Reaction To Coffee">
                    {nutrition.adverseReactionToCoffee?.yesNo === true
                      ? "Yes"
                      : nutrition.adverseReactionToCoffee?.yesNo === false
                        ? "No"
                        : "Not Provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adverse Reaction To Coffee">
                    {nutrition.adverseReactionToCoffee?.describe || ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reaction To Caffeine">
                    {nutrition.reactionToCaffeine || ""}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>

          </Row>
        </div>
      );

    case 3:
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          {substance ? (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {[
                    { label: "Smoke Presently", value: substance.smokePresently !== null ? (substance.smokePresently ? "Yes" : "No") : "N/A" },
                    ...(substance.smokeCurrently ? [{ label: "Smoke Presently Other", value: substance.smokeCurrently }] : []),
                    { label: "Smoking Currently", value: substance.smokingCurrently ? `Packs/Day: ${substance.smokingCurrently.packsDay}, Years: ${substance.smokingCurrently.years}, Type: ${substance.smokingCurrently.type}` : "N/A" },
                    { label: "Attempted to Quit", value: substance.attempedToQuit?.yesNo ? "Yes" : "No" },
                    { label: "Describe Quit Attempt", value: substance.attempedToQuit?.describe || "Not Attempted to Quit" },
                    { label: "Smoked in Past", value: substance.smokedInPast ? `Packs/Day: ${substance.smokedInPast.packsDay}, Years: ${substance.smokedInPast.years}` : "N/A" },
                    { label: "Exposed to 2nd Hand Smoke", value: substance.exposedTo2ndSmoke ? "Yes" : "No" },
                    { label: "How Many Alcoholic Drinks per Week", value: substance.howManyAlcoholWeek || "N/A" },
                    { label: "Ever Used Recreational Drugs", value: substance.everUsedRecreationalDrugs ? "Yes" : "No" },
                  ].map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>
                      {item.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>

              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {[
                    { label: "Previous Alcohol Intake", value: substance.previousAlcoholIntake?.yesNo ? "Yes" : "No" },
                    { label: "Describe Previous Alcohol Intake", value: substance.previousAlcoholIntake?.describe || "No description Provided" },
                    { label: "Problem with Alcohol", value: substance.problemAlcohol ? "Yes" : "No" },
                    { label: "Problem with Alcohol When", value: substance.problemAlcoholWhen || "No Problem given" },
                    { label: "Explain Problem with Alcohol", value: substance.problemAlcoholExplain || "No Problem given" },
                    { label: "Get Help for Drinking", value: substance.getHelpForDrinking ? "Yes" : "No" },
                    { label: "Currently Using Recreational Drugs", value: substance.currentlyRecreationalDrugs ? "Yes" : "No" },
                    { label: "Currently Using Recreational Drugs type", value: substance.currentlyRecreationalDrugsType || "" },
                    // { label: "Type of Recreational Drugs", value: substance.currentlyRecreationalDrugsType || "N/A" },
                  ].map((item, index) => (
                    <Descriptions.Item key={index} label={item.label}>
                      {item.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
            </Row>
          ) : (
            <p>No substance information available.</p>
          )}
        </div>


      );

    case 4:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Abused">
                  {stress?.abused !== null ? (stress.abused ? "Yes" : "No") : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Current Occupation">
                  {stress?.currentOccupation || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Currently in Therapy">
                  {stress?.currentlyInTherapy ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Describe Therapy">
                  {stress?.describeTherapy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Easy to Handle Stress">
                  {stress?.easyToHandleStress ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Emotional Support">
                  {stress?.emotionalSupport || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Excess Stress">
                  {stress?.excessStress ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Hobbies/Leisure Activities">
                  {stress?.hobbiesLeisure || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress from Health">
                  {stress?.stressFromHealth || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress from Social Situations">
                  {stress?.stressFromSocial || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress from Work">
                  {stress?.stressFromWork || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress From Other">
                  {stress?.stressFromOther || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress From Other Name">
                  {stress?.stressFromOtherName || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Marital Status">
                  {stress?.maritalStatus || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Often Use Relaxation Techniques">
                  {stress?.oftenRelaxationTechniques || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Previous Occupation">
                  {stress?.previousOccupation || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Use Relaxation Techniques">
                  {stress?.relaxationTechniques ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Religious Practice">
                  {stress?.religiousPractice ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Sought Counseling">
                  {stress?.soughtCounselling ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress from Family">
                  {stress?.stressFromFamily || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Stress from Finances">
                  {stress?.stressFromFinances || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Type of Relaxation Techniques">
                  {stress?.typeRelaxationTechniques || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Type of Religious Practice">
                  {stress?.typeReligiousPractice || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Who Do You Live With">
                  {stress?.whoDoYouLiveWith || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Duration Menstral">
                  {stress?.durationMenstral   || ""}
                </Descriptions.Item>
                <Descriptions.Item label="Severity Menstral">
                  {stress?.severityMenstral || ""}
                </Descriptions.Item>
                <Descriptions.Item label="Resources Emotional Support">
                  {stress?.resourcesEmotionalSupport || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>


          </Row>
        </div>
      );

    case 5:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="How Well Things Going Overall">
                  {healthMedical?.howWellThingsGoingOverall || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going in School">
                  {healthMedical?.howWellThingsGoingSchool || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going at Job">
                  {healthMedical?.howWellThingsGoingJob || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going in Social Life">
                  {healthMedical?.howWellThingsGoingSocialLife || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Close Friends">
                  {healthMedical?.howWellThingsGoingCloseFriends || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Sex">
                  {healthMedical?.howWellThingsGoingSex || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Attitude">
                  {healthMedical?.howWellThingsGoingAttitude || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Partner">
                  {healthMedical?.howWellThingsGoingPartner || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="How Well Things Going with Kids">
                  {healthMedical?.howWellThingsGoingKids || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Parents">
                  {healthMedical?.howWellThingsGoingParents || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Well Things Going with Spouse">
                  {healthMedical?.howWellThingsGoingSpouse || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="How Were You Born">
                  {healthMedical?.howWereYouBorn || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Were You Born With Complications">
                  {healthMedical?.wereYouBornWithComplication?.yesNo !== null
                    ? healthMedical?.wereYouBornWithComplication?.yesNo
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Were You Born With Complications describe">
                  {healthMedical?.wereYouBornWithComplication?.describe || ""}
                </Descriptions.Item>
                <Descriptions.Item label="Breast Fed and How Long">
                  {healthMedical?.breastFedHowLong || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Breast Fed Formula">
                  {healthMedical?.breastFedFormula || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            {/* Environmental and Exposure History */}
            <Col xs={24} md={12}>
              <Descriptions title="Environmental and Exposure History" column={1} bordered>
                <Descriptions.Item label="Environmental Effects">
                  {healthMedical.environmentEffect?.length > 0 ? (
                    <ul>
                      {healthMedical.environmentEffect.map((effect, index) => (
                        <li key={index}>{effect}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Environmental Exposures">
                  {healthMedical.environmentExposed?.length > 0 ? (
                    <ul>
                      {healthMedical.environmentExposed.map((exposure, index) => (
                        <li key={index}>{exposure}</li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Exposed to Harmful Chemicals">
                  {healthMedical.exposedHarmfulChemical ? "Yes" : "No"}
                </Descriptions.Item>
                {healthMedical.exposedHarmfulChemical && (
                  <Descriptions.Item label="Details of Exposure">
                    Chemical Name: {healthMedical.whenExposedHarmfulChemical?.chemicalName || "N/A"},
                    Length of Exposure: {healthMedical.whenExposedHarmfulChemical?.lenghtExposure || "N/A"} days,
                    Date of Exposure: {healthMedical.whenExposedHarmfulChemical?.dateExposure || "N/A"}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Pets or Farm Animals">
                  {healthMedical.petsFarmAnimal ? "Yes" : "No"}
                </Descriptions.Item>
                {healthMedical.petsFarmAnimal && (
                  <Descriptions.Item label="Where Animals Live">
                    {healthMedical.petsAnimalLiveWhere || "N/A"}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Col>

            {/* Diet and Feeding History */}
            <Col xs={24} md={12}>
              <Descriptions title="Diet and Feeding History" column={1} bordered>
                <Descriptions.Item label="Don't Know Breast Food">
                  {healthMedical?.breastFoodDontKnow ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Age Introduction of Solid Food">
                  {healthMedical?.ageIntroductionSolidFood || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Age Introduction of Wheat">
                  {healthMedical?.ageIntroductionWheat || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Age Introduction of Dairy">
                  {healthMedical?.ageIntroductionDiary || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Foods Avoided">
                  {healthMedical?.foodsAvoided !== null
                    ? healthMedical?.foodsAvoided
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Foods Avoided Type and Symptoms">
                  {healthMedical?.foodsAvoidTypeSymptoms || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="A Lot of Sugar">
                  {healthMedical?.alotSugar ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Dental and Environmental History */}
            <Col xs={24} md={12}>
              <Descriptions title="Dental and Environmental History" column={1} bordered>
                <Descriptions.Item label="Dental History">
                  {healthMedical.dentalHistory && healthMedical.dentalHistory.length > 0 ? (
                    <ul>
                      {healthMedical.dentalHistory.map((entry, index) => (
                        <li key={index}>
                          Level: {entry.level}, Name: {entry.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Mercury Filling Removed">
                  {healthMedical?.mercuryFillingRemoved ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="When Mercury Filling Removed">
                  {healthMedical?.mercuryFillingRemovedWhen || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Fillings as Kid">
                  {healthMedical?.fillingsAsKid || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Brush Regularly">
                  {healthMedical?.brushRegularly ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Floss Regularly">
                  {healthMedical?.flossRegularly ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

          </Row>
        </div>
      );

    case 6:
      return loading ? (
        <p>{personalFamily}</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              {/* First Column */}
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Birth Weight Information">
                  <div>
                    <p><strong>Unit System:</strong> {personalFamily?.weightChild?.metricImperialScale ? "Metric (kg)" : "Imperial (lbs)"}</p>
                    <p><strong>Smallest Baby:</strong> {personalFamily?.weightChild?.weightSmallest || 'N/A'} {personalFamily?.weightChild?.metricImperialScale ? "kg" : "lbs"}</p>
                    <p><strong>Largest Baby:</strong> {personalFamily?.weightChild?.weightLargest || 'N/A'} {personalFamily?.weightChild?.metricImperialScale ? "kg" : "lbs"}</p>
                  </div>
                </Descriptions.Item>

                {/* Obstetric History */}
                <Descriptions.Item label="Obstetric History">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(personalFamily?.obstetricHistory || {}).map(([key, value]) => (
                      value.level > 0 && (
                        <Tag key={key} color="blue" style={{ margin: '2px', padding: '4px 8px' }}>
                          {value.name}: {value.level}
                        </Tag>
                      )
                    ))}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Problems After Pregnancy">
                  {personalFamily?.problemsAfterPregnancy ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems After Pregnancy Explain">
                  {personalFamily?.problemsAfterPregnancyExplain || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Age Start Menstrual">
                  {personalFamily?.ageStartMenstrual || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date Last Menstrual">
                  {personalFamily?.startDateLastMenstrual || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Length Of Cycle">
                  {personalFamily?.lenghtOfCycle || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Time Between Cycles">
                  {personalFamily?.timeBtwCycles || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cramping">
                  {personalFamily?.cramping ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Pain In Period">
                  {personalFamily?.painInPeriod ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Ever Had Pre Menstrual Problems">
                  {personalFamily?.everHadPreMenstrualProblems?.yesNo
                    ? personalFamily.everHadPreMenstrualProblems.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Other Menstrual Problems">
                  {personalFamily?.otherMenstrualProblems?.yesNo
                    ? personalFamily.otherMenstrualProblems.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Birth Control">
                  {personalFamily?.hormonalBirthControlType?.name ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Birth Control Type">
                  {personalFamily?.hormonalBirthControlType?.level || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems With Hormonal Birth Control">
                  {personalFamily?.problemsWithHormonalBirthControl?.yesNo
                    ? personalFamily.problemsWithHormonalBirthControl.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Use Contraception">
                  {personalFamily?.useContraception?.yesNo
                    ? personalFamily.useContraception.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Aversion to Food">
                    {personalFamily.inMenopause?.yesNo === true
                      ? "Yes"
                      : personalFamily.inMenopause?.yesNo === false
                        ? "No"
                        : "N/A"}
                  </Descriptions.Item>
                <Descriptions.Item label="In Menopause Level">
                  { personalFamily.inMenopause?.level || " "
                  }
                </Descriptions.Item>
                {/* <Descriptions.Item label="Surgical Menopause">
                  {personalFamily?.surgicalMenopause?.yesNo
                    ? personalFamily.surgicalMenopause.describe || "No describe"
                    : "No"}
                </Descriptions.Item> */}
                <Descriptions.Item label="Symptomic Problems">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Array.isArray(personalFamily?.symptomicProblems) ? 
                      personalFamily.symptomicProblems.map((problem, index) => (
                        <Tag key={index} color="green">{problem}</Tag>
                      ))
                      : "N/A"
                    }
                  </div>
                </Descriptions.Item>


                <Descriptions.Item label="Surgical Menopause">
                {personalFamily.surgicalMenopause?.yesNo === true
                      ? "Yes"
                      : personalFamily.surgicalMenopause?.yesNo === false
                        ? "No"
                        : "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Surgical Menopause describe">
                  {  personalFamily.surgicalMenopause?.describe || " "}
                </Descriptions.Item>
            


                <Descriptions.Item label="Hormonal Replacement">
                  {personalFamily?.hormonalReplacement?.yesNo
                    ? personalFamily.hormonalReplacement.describe || "No describe"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Gyn Symptoms">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Array.isArray(personalFamily?.gynSymptoms) ? 
                      personalFamily.gynSymptoms.map((symptom, index) => (
                        <Tag key={index} color="purple">{symptom}</Tag>
                      ))
                      : "N/A"
                    }
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );

      case 7:
        return loading ? (
          <p>Loading...</p>
        ) : (
          <div className="p-6 rounded-md shadow-md">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {/* First show all the condition categories */}
                  {[
                    'gastroIntestinal',
                    'respiratory',
                    'urinary',
                    'endocrine',
                    'inflammatory',
                    'musculoskeletal',
                    'skin',
                    'cardiovascular',
                    'neurologic',
                    'cancer'
                  ].map((category) => {
                    const displayName = category
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();

                    const conditions = illness?.[category] || [];
                    
                    return (
                      <Descriptions.Item 
                        label={displayName} 
                        key={category}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {conditions.length > 0 ? (
                            conditions.map((condition, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag color={condition.yesNoNA === 'yes' ? 'green' : condition.yesNoNA === 'no' ? 'red' : 'default'}>
                                  {condition.typeName}: {condition.yesNoNA || 'Answer not provided'}
                                </Tag>
                              </div>
                            ))
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Tag color="default">Answer not provided</Tag>
                            </div>
                          )}
                        </div>
                      </Descriptions.Item>
                    );
                  })}

                  {Object.entries(illness || {}).map(([category, data]) => {
                  // Skip categories that were handled above
                  if (
                    ['gastroIntestinal', 'respiratory', 'urinary', 'endocrine', 'inflammatory',
                    'musculoskeletal', 'skin', 'cardiovascular', 'neurologic', 'cancer'].includes(category)
                  ) {
                    return null;
                  }

                  // Handle string fields like "respiratoryOther"
                  if (typeof data === 'string') {
                    return (
                      <Descriptions.Item
                        label={category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        key={category}
                      >
                        <Tag> {data}</Tag>
                      </Descriptions.Item>
                    );
                  }
                  
                  return null; // Add explicit return for any other case
                })}

                </Descriptions>
              </Col>

              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>  
                  {Object.entries(illness || {}).map(([category, data]) => {
                    // Only handle diagnostic, surgery, and injury categories
                    if ((data && !data.date) || (category === "gastroIntestinal")) {
                      return null;
                    }
                    if (typeof data === 'object' && data !== null) {
                      const value =  data.value || '';
                      const date = data.date || '';
                      const otherName = data.otherName;

                      return (
                        <Descriptions.Item
                          label={category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          key={category}
                        >
                          {(!date && !value && !otherName) ? (
                            <Tag color="default">Answer not provided</Tag>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {date ? (
                                <Tag color="purple">Date: {date}</Tag>
                              ) : (
                                <Tag color="default">Date: Answer not provided</Tag>
                              )}
                              {value ? (
                                <Tag color="cyan">Comment: {value}</Tag>
                              ) : (
                                <Tag color="default">Comment: Answer not provided</Tag>
                              )}
                            </div>
                          )}
                        </Descriptions.Item>
                      );
                    }
                    return null; // Add explicit return for any other case
                  })}

                  {/* Handle addNew array separately */}
                  {illness?.addNew && illness.addNew.length > 0 && illness.addNew.some(record => record.date || record.value) && (
                    <Descriptions.Item label="Additional Records">
                      {illness.addNew.map((record, index) => {
                        if (!record.date && !record.value) return null;
                        return (
                          <div key={index} style={{ marginBottom: '8px' }}>
                            {record.date ? (
                              <Tag color="blue">Date: {record.date}</Tag>
                            ) : (
                              <Tag color="cyan">Date: Answer not provided</Tag>
                            )}
                            {record.value ? (
                              <Tag color="green">Comment: {record.value}</Tag>
                            ) : (
                              <Tag color="cyan">Comment: Answer not provided</Tag>
                            )}
                          </div>
                        );
                      })}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Col>
            </Row>
          </div>
        );
      
    case 8:
      return loading ? (
        <p>{symptom}</p>
      ) : (
        <div className="p-6 rounded-md shadow-md bg-white">
          <Row gutter={16}>
            {[0, Math.ceil(Object.entries(symptom).length / 2)].map((startIndex, colIndex) => (
              <Col xs={24} md={12} key={colIndex}>
                <Descriptions column={1} bordered>
                  {Object.entries(symptom)
                    .slice(startIndex, startIndex + Math.ceil(Object.entries(symptom).length / 2))
                    .map(([key, value]) => (
                      <Descriptions.Item
                        label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        key={key}
                      >
                        {Array.isArray(value) ? (
                          value.length > 0 ? (
                            value.map((item, index) => (
                              <div key={index} className="mb-2">
                                {Object.entries(item).map(([subKey, subValue]) => (
                                  <Tag color="blue" key={subKey} className="mr-2 mb-2">
                                    {subKey === "level" ? (
                                      subValue === 0 ? "None" :
                                      subValue === 1 ? "Mild" :
                                      subValue === 2 ? "Moderate" :
                                      subValue === 3 ? "Severe" :
                                      subValue || "Not Provided"
                                    ) : (
                                      <>
                                        <strong>
                                          {subKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                        </strong>{" "}
                                        {subValue || "Not Provided"}
                                      </>
                                    )}
                                  </Tag>
                                ))}
                              </div>
                            ))
                          ) : (
                            <Typography.Text type="secondary">Not Provided</Typography.Text>
                          )
                        ) : typeof value === "object" && value !== null ? (
                          <>
                            {value.yesNo ? (
                              <Tag color="green">Yes</Tag>
                            ) : (
                              <Tag color="red">No</Tag>
                            )}
                            {value.describe && (
                              <div>
                                <Typography.Text strong>Description:</Typography.Text> {value.describe || "Not Provided"}
                              </div>
                            )}
                          </>
                        ) : (
                          <Typography.Text>
                            {typeof value === "boolean" ? (
                              <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
                            ) : (
                              <Typography.Text>
                                {value !== null && value !== undefined ? String(value) : "Not Provided"}
                              </Typography.Text>
                            )}
                          </Typography.Text>
                        )}
                      </Descriptions.Item>
                    ))}
                </Descriptions>
              </Col>
            ))}
          </Row>
        </div>
      );

    case 9:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Modify Diet">
                  {readiness?.modifyDiet || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Take Daily Supplement">
                  {readiness?.takeDailySupplement || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Record Everything Eat">
                  {readiness?.recordEverythingEat || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Modify Lifestyle">
                  {readiness?.modifyLifestyle || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Practice Relaxation">
                  {readiness?.practiceRelaxation || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Engage Regular Exercise">
                  {readiness?.engageRegularExercise || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Achieve">
                  {readiness?.healthAchieve || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Change Trigger">
                  {readiness?.healthChangeTrigger || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Readiness Supportive">
                  {readiness?.readinessSupportive || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Health Happen Get Better">
                  {readiness?.healthHappenGetBetter || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Last Time">
                  {readiness?.healthLastTime || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Think Happening">
                  {readiness?.healthThinkHappening || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Condition">
                  {readiness?.healthCondition || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Comment">
                  {readiness?.comment || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Feel Better">
                  {readiness?.healthFeelBetter || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Health Feel Worse">
                  {readiness?.healthFeelWorse || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Readiness Confident Level">
                  <div>{readiness?.readinessConfident?.level || 0}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Readiness Confident">
                  <div>{readiness?.readinessConfident?.name || "N/A"}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Readiness Frequency">
                  {readiness?.readinessFrequency || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );
    case 10:
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-6 rounded-md shadow-md">
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Birth Control">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Tag color={reproductiveInfo?.birthControl ? "green" : "red"}>
                      {reproductiveInfo?.birthControl ? "Yes" : "No"}
                    </Tag>
                    {reproductiveInfo?.birthControl && reproductiveInfo?.hormonalBirthControl !== "Not Provided" && (
                      <Tag color="blue">{reproductiveInfo?.hormonalBirthControl}</Tag>
                    )}
                    {reproductiveInfo?.birthControl && reproductiveInfo?.nonHormonalBirthControl !== "Not Provided" && (
                      <Tag color="purple">{reproductiveInfo?.nonHormonalBirthControl}</Tag>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Currently Pregnant">
                  <Tag color={reproductiveInfo?.currentlyPregnant ? "green" : "red"}>
                    {reproductiveInfo?.currentlyPregnant === null || reproductiveInfo?.currentlyPregnant === undefined ? 'Not Provided' : (reproductiveInfo?.currentlyPregnant ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trying to conceive">
                  <Tag color={reproductiveInfo?.tryingToConceive ? "green" : "red"}>
                    {reproductiveInfo?.tryingToConceive === null || reproductiveInfo?.tryingToConceive === undefined ? 'Not Provided' : (reproductiveInfo?.tryingToConceive ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Difficulty Trying To Conceive">
                  <Tag color={reproductiveInfo?.difficultyTryingToConceive ? "red" : "green"}>
                    {reproductiveInfo?.difficultyTryingToConceive === null || reproductiveInfo?.difficultyTryingToConceive === undefined ? 'Not Provided' : (reproductiveInfo?.difficultyTryingToConceive ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Family Member With Reproductive Concerns">
                  <Tag color={reproductiveInfo?.familyMemberWithReproductiveConcerns === "Yes" ? "red" : "green"}>
                    {reproductiveInfo?.familyMemberWithReproductiveConcerns || "Not Provided"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Method To Conceive">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {reproductiveInfo?.methodToConceive?.length || reproductiveInfo?.otherMethodsConceive ? (
                      [...(reproductiveInfo.methodToConceive || []), ...(reproductiveInfo.otherMethodsConceive ? [reproductiveInfo.otherMethodsConceive] : [])]
                        .filter(method => !method.toLowerCase().includes('other'))
                        .map((method, index) => (
                          <Tag color="blue" key={index}>
                            {method}
                          </Tag>
                        ))
                    ) : (
                      <Tag color="default">Not Provided</Tag>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Biomarkers / Symptom">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {reproductiveInfo?.chartingToConceive?.length ? 
                      reproductiveInfo.chartingToConceive.map((method, index) => (
                        <Tag color="cyan" key={index}>
                          {method}
                        </Tag>
                      )) : 
                      <Tag color="default">Not Provided</Tag>
                    }
                  </div>
                </Descriptions.Item>
                {/* {reproductiveInfo?.otherChartingCycle && (
                  <Descriptions.Item label="Other Charting Methods">
                    <Tag color="purple">{reproductiveInfo.otherChartingCycle}</Tag>
                  </Descriptions.Item>
                )} */}
                <Descriptions.Item label="Current Therapy">
                  <Tag color={reproductiveInfo?.currentTherapy ? "green" : "red"}>
                    {reproductiveInfo?.currentTherapy === null || reproductiveInfo?.currentTherapy === undefined ? 'Not Provided' : (reproductiveInfo?.currentTherapy ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Method Fertility Awareness">
                  <Tag color="blue">{reproductiveInfo?.methodFertilityAwareness || "Not Provided"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Intercouse Each Cycle">
                  <Tag color="blue">{reproductiveInfo?.intercouseEachCycle || "Not Provided"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Menstrual Pain During Period">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Array.isArray(reproductiveInfo?.menstrualPainDuringPeriod) && reproductiveInfo.menstrualPainDuringPeriod.length > 0 ? 
                      reproductiveInfo.menstrualPainDuringPeriod.map((pain, index) => (
                        <Tag color="red" key={index}>
                          {pain}
                        </Tag>
                      )) : 
                      <Tag color="default">Not Provided</Tag>
                    }
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Menstral Bleeding Pelvic Pain">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Tag color="blue">Duration: {reproductiveInfo?.menstralBleedingPelvicPain?.duration || "Not Provided"}</Tag>
                    <Tag color="purple">Severity: {reproductiveInfo?.menstralBleedingPelvicPain?.colour || "Not Provided"}</Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Experience Pelvic Pain">
                  <Tag color={reproductiveInfo?.experiencePelvicPain ? "red" : "green"}>
                    {reproductiveInfo?.experiencePelvicPain === null || reproductiveInfo?.experiencePelvicPain === undefined ? 'Not Provided' : (reproductiveInfo.experiencePelvicPain ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="During Circle Pelvic Pain">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Tag color="blue">Duration: {reproductiveInfo?.duringCirclePelvicPain?.duration || "Not Provided"}</Tag>
                    <Tag color="purple">Severity: {reproductiveInfo?.duringCirclePelvicPain?.colour || "Not Provided"}</Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Do You Have PMS Symptoms">
                  <Tag color={reproductiveInfo?.doYouPmsSymptoms ? "red" : "green"}>
                    {reproductiveInfo?.doYouPmsSymptoms === null || reproductiveInfo?.doYouPmsSymptoms === undefined ? 'Not Provided' : (reproductiveInfo?.doYouPmsSymptoms ? 'Yes' : 'No')}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="PMS Symptoms">
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Array.isArray(reproductiveInfo?.pmsSymptoms) && reproductiveInfo.pmsSymptoms.length > 0 ? 
                      reproductiveInfo.pmsSymptoms.map((symptom, index) => (
                        <Tag color="orange" key={index}>
                          {symptom}
                        </Tag>
                      )) : 
                      <Tag color="default">Not Provided</Tag>
                    }
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="PMS Details">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Tag color="blue">Duration: {reproductiveInfo?.pms?.duration || "Not Provided"}</Tag>
                    <Tag color="purple">Severity: {reproductiveInfo?.pms?.colour || "Not Provided"}</Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Cycle Lengths">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Tag color="blue">Longest: {reproductiveInfo?.longestCycleLenght || "Not Provided"}</Tag>
                    <Tag color="cyan">Shortest: {reproductiveInfo?.shortestCycleLenght || "Not Provided"}</Tag>
                    <Tag color="geekblue">Average: {reproductiveInfo?.averageCycleLenght || "Not Provided"}</Tag>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Mid Cycle Spotting">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Tag color={reproductiveInfo?.midCycleSpotting ? "red" : "green"}>
                      {reproductiveInfo?.midCycleSpotting === null || reproductiveInfo?.midCycleSpotting === undefined ? 'Not Provided' : (reproductiveInfo.midCycleSpotting ? 'Yes' : 'No')}
                    </Tag>
                    {reproductiveInfo?.midCycleSpotting && (
                      <>
                        <Tag color="blue">Frequency: {reproductiveInfo?.midCycleSpottingFrequency?.frequency || 'Not Provided'}</Tag>
                        <Tag color="purple">Duration: {reproductiveInfo?.midCycleSpottingFrequency?.duration || 'Not Provided'}</Tag>
                        <Tag color="cyan">Color: {reproductiveInfo?.midCycleSpottingFrequency?.colour || 'Not Provided'}</Tag>
                      </>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Discharge Details">
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <div>
                      <Typography.Text strong>Creamy:</Typography.Text>
                      <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                        <Tag color="blue">Duration: {reproductiveInfo?.cycleDischargeCreamy?.duration || 'Not Provided'}</Tag>
                        <Tag color="purple">Color: {reproductiveInfo?.cycleDischargeCreamy?.colour || 'Not Provided'}</Tag>
                      </div>
                    </div>
                    <div>
                      <Typography.Text strong>Watery:</Typography.Text>
                      <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                        <Tag color="blue">Duration: {reproductiveInfo?.cycleDischargeWatery?.duration || 'Not Provided'}</Tag>
                        <Tag color="purple">Color: {reproductiveInfo?.cycleDischargeWatery?.colour || 'Not Provided'}</Tag>
                      </div>
                    </div>
                    <div>
                      <Typography.Text strong>Egg White:</Typography.Text>
                      <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                        <Tag color="blue">Duration: {reproductiveInfo?.cycleDischargeEggWhite?.duration || 'Not Provided'}</Tag>
                        <Tag color="purple">Color: {reproductiveInfo?.cycleDischargeEggWhite?.colour || 'Not Provided'}</Tag>
                      </div>
                    </div>
                    <div>
                      <Typography.Text strong>Pre Period:</Typography.Text>
                      <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                        <Tag color="blue">Duration: {reproductiveInfo?.cycleDischargePrePeriod?.duration || 'Not Provided'}</Tag>
                        <Tag color="purple">Color: {reproductiveInfo?.cycleDischargePrePeriod?.colour || 'Not Provided'}</Tag>
                      </div>
                    </div>
                    <div>
                      <Typography.Text strong>After Period:</Typography.Text>
                      <div style={{ marginLeft: '8px', marginTop: '4px' }}>
                        <Tag color="blue">Duration: {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.duration || 'Not Provided'}</Tag>
                        <Tag color="purple">Color: {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.colour || 'Not Provided'}</Tag>
                      </div>
                    </div>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );

    default:
      return <p style={{ textAlign: "center" }}> No Record available</p>;
  }
}  