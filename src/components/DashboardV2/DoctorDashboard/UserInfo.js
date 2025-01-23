import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Modal, Descriptions } from "antd";
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
  getSubstanceAbuse,
  getSymptomReview,
} from "../../redux/AssessmentController";

export default function UserInfo() {
  const location = useLocation();
  const userInfo = location.state?.user;
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(null);
  const generalInfo = useSelector((state) => state.intake?.generalInfo);
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
console.log("General Info", symptom);
  const modalContent = [
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
  ];

  console.log(useSelector((state) => state.intake));
  useEffect(() => {
    console.log("useEffect is running");

    if (visibleModal !== null) {
      console.log(`Modal ${visibleModal} is visible`);
      switch (visibleModal) {
        case 0:
          console.log("Dispatching getGeneralInformation");
          dispatch(getGeneralInformation(userInfo.id));
          break;
        case 1:
          console.log("Dispatching getCurrentHealthLifestyle");
          dispatch(getCurrentHealthLifestyle(userInfo.id));
          break;
        case 2:
          console.log("Dispatching getNutritionAndDietaryHabits");
          dispatch(getNutritionAndDietaryHabits(userInfo.id));
          break;
        case 3:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSubstanceAbuse(userInfo.id));
          break;
          
        case 4:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getGetStress(userInfo.id));
          break;
        case 5:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getHealthandMedical(userInfo.id));
          break;
        case 6:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getPersonalFamily(userInfo.id));
          break;
        case 7:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getIllnessCondition(userInfo.id));
          break;
        case 8:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSymptomReview(userInfo.id));
          break;
        case 9:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getReadiness(userInfo.id));
          break;
        default:
          break;
      }
    }
  }, [visibleModal, dispatch, userInfo.id]);

  const showModal = (index) => {
    setVisibleModal(index);
    console.log("Visible Modal Index:", index); 
  };
  return (
    <Row gutter={16} justify="" style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={20} lg={24} xl={24}>
        <div style={{ padding: "2% 0" }}>
          <Card
            style={{
              border: "1px solid #DAA520",
              borderRadius: 10,
              maxWidth: "100%",
            }}
          >
            <Row gutter={16}>
              <Col span={12} md={6}>
                <p>
                  <strong>Client</strong> : {userInfo?.firstname || "N/A"}{" "}
                  {userInfo?.lastname || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Age</strong> : {userInfo?.age}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Preferred Phone</strong> :{" "}
                  {userInfo?.phoneNumber || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>RRM</strong> : {userInfo?.rrm || "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={12} md={6}>
                <p>
                  <strong>Partner</strong> : {userInfo?.partner || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Weeks in Program</strong> :{" "}
                  {userInfo?.weeksInProgram || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>#RRM Visits</strong> : {userInfo?.rrmVisits || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Coach</strong> : {userInfo?.coach || "N/A"}
                </p>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={12} md={6}>
                <p>
                  <strong>Care Type</strong> : {userInfo?.careType || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>LMP</strong> : {userInfo?.lmp || "N/A"}
                </p>
              </Col>
            </Row>
          </Card>
        </div>
      </Col>
      <Row gutter={18}>
        <Col xs={24} md={24} lg={24} style={{ paddingBottom: "16px" }}>
          <Row gutter={16}>
            {modalContent.map((_, index) => (
              <Col
                xs={24} // Full width on extra small screens
                sm={12} // Half width on small screens
                md={8} // One-third width on medium screens
                lg={6} // One-fourth width on large screens
                xl={4} // One-sixth width on extra large screens
                key={index}
                style={{ paddingBottom: "16px" }}
              >
                <Card
                  hoverable
                  style={{
                    border: "1px solid #C2E6F8",
                    borderRadius: 10,
                    textAlign: "center",
                    height: 100,
                    background: "#C2E6F8",
                    color: "#000",
                  }}
                  onClick={() => showModal(index)}
                >
                  <h4 style={{ fontSize: 18 }}>{modalContent[index]}</h4>
                </Card>
              </Col>
            ))}
          </Row>

          {modalContent.map((content, index) => (
            <Modal
              key={index}
              title={`Details for ${modalContent[index]}`}
              visible={visibleModal === index}
              // onOk={() => setVisibleModal(null)}
              width={"1000px"}
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
                loading={loading}
              />
            </Modal>
          ))}
        </Col>
        <Col xs={24} md={24} lg={24} style={{ paddingBottom: "16px" }}>
          <div>
            {/* FLAGS Section */}
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
                FLAGS
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
              {/* Your flags data here */}
            </div>

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

          <div style={{ width: "100%" }}>
            <p style={{ textAlign: "center" }}>
              No cycle information available.
            </p>
          </div>
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
  loading,
}) {
  switch (index) {
    case 0: // General Information section
    return loading ? (
      <p>Loading...</p>
    ) : (
      <div className="p-6 rounded-md shadow-md">
        <Row gutter={16}>
          {/* First Column */}
          <Col xs={24} md={12}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Genetic Background">
                {generalInfo.geneticBackground || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Last Medical Care">
                {generalInfo.lastMedicalCare || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Contact">
                {generalInfo.emergencyContact || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Relationship">
                {generalInfo.emergencyRelationship || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
  
          <Col xs={24} md={12}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Emergency Phone (Home)">
                {generalInfo.emergencyPhoneHome || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Phone (Cell)">
                {generalInfo.emergencyPhoneCell || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Emergency Phone (Work)">
                {generalInfo.emergencyPhoneWork || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="How Did You Hear About Us?">
                {generalInfo.howDidHearAbout || "N/A"}
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
              {/* First Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Ongoing Health">
                    {currentHealth?.ongoingHealth?.map(health => health.problem).join(', ') || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Allergies">
                    {currentHealth?.allergies?.map(allergy => allergy.reaction).join(', ') || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sleep Hours">
                    {currentHealth?.sleepHours || "N/A"}
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
                    {currentHealth.sleepingAids?.yesNo ? currentHealth.sleepingAids.describe : "No" || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              {/* Second Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Cardio">
                    {currentHealth?.cardio?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Strength">
                    {currentHealth?.strength?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Flexibility">
                    {currentHealth?.flexibility?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Balance">
                    {currentHealth?.balance?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sport">
                    {currentHealth?.sport?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Other">
                    {currentHealth?.other?.other?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Motivated to Exercise">
                    {currentHealth.motivatedToExercise || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Problems That Limit Exercise">
                    {currentHealth.problemsThatLimitExercise?.yesNo ? currentHealth.problemsThatLimitExercise.describe : "No" || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sore After Exercise">
                    {currentHealth.soreAfterExercise?.yesNo ? currentHealth.soreAfterExercise.describe : "No" || "N/A"}
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
            {/* Dietary Information Column */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Dietary Information" column={1} bordered>
                  <Descriptions.Item label="Special Diet Program">
                    {nutrition.specialDietProgram || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sensitive to Food">
                    {nutrition.sensitiveToFood?.yesNo
                      ? nutrition.sensitiveToFood.describe
                      : "No" || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aversion to Food">
                    {nutrition.aversionToFood?.yesNo
                      ? nutrition.aversionToFood.describe
                      : "No" || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adverse List">
                    {nutrition.adverseList || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Any Food Craving">
                    {nutrition.anyFoodCraving?.yesNo
                      ? nutrition.anyFoodCraving.describe
                      : "No" || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Have 3 Meals a Day">
                    {nutrition.have3MealADay?.yesNo
                      ? nutrition.have3MealADay.level
                      : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Skipping a Meal">
                    {nutrition.skippingAMeal ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Many Eat Out Per Week">
                    {nutrition.howManyEatOutPerWeek || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>
    
            {/* Eating Habits Column */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Eating Habits" column={1} bordered>
                  <Descriptions.Item label="Eating Habits">
                    {nutrition.eatingHabits || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Breakfast">
                    {nutrition.typicalBreakfast || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Lunch">
                    {nutrition.typicalLunch || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Dinner">
                    {nutrition.typicalDinner || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Snacks">
                    {nutrition.typicalSnacks || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Typical Fluid">
                    {nutrition.typicalFluid || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Fruits">
                    {nutrition.noTypicalFruits || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Vegetables">
                    {nutrition.noTypicalVegetables || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>
    
            {/* Additional Eating Habits Column for balance */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Additional Dietary Information" column={1} bordered>
                  <Descriptions.Item label="No Typical Legumes">
                    {nutrition.noTypicalLegumes || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Red Meat">
                    {nutrition.noTypicalRedMeat || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Fish">
                    {nutrition.noTypicalFish || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Dairy">
                    {nutrition.noTypicalDairy || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Nuts">
                    {nutrition.noTypicalNuts || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="No Typical Fats">
                    {nutrition.noTypicalFats || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Caffeinated Beverages">
                    {nutrition.caffeinatedBeverages || "N/A"}
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
            <Row gutter={16}>
              {/* First Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Smoke Presently">
                    {substance?.smokePresently !== null
                      ? substance.smokePresently
                        ? "Yes"
                        : "No"
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Smoking Currently">
                    {substance.smokingCurrently || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Attempted to Quit">
                    {substance.attempedToQuit ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Smoked in Past">
                    {substance.smokedInPast ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Exposed to 2nd Hand Smoke">
                    {substance.exposedTo2ndSmoke ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Many Alcoholic Drinks per Week">
                    {substance.howManyAlcoholWeek || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ever Used Recreational Drugs">
                    {substance.everUsedRecreationalDrugs ? "Yes" : "No"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              {/* Second Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Previous Alcohol Intake">
                    {substance.previousAlcoholIntake || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Problem with Alcohol">
                    {substance.problemAlcohol ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Problem with Alcohol When">
                    {substance.problemAlcoholWhen || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Explain Problem with Alcohol">
                    {substance.problemAlcoholExplain || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Get Help for Drinking">
                    {substance.getHelpForDrinking ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Currently Using Recreational Drugs">
                    {substance.currentlyRecreationalDrugs ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type of Recreational Drugs">
                    {substance.currentlyRecreationalDrugsType || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
          
      
            </Row>
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
                    {stress.abused !== null ? (stress.abused ? "Yes" : "No") : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Current Occupation">
                    {stress.currentOccupation || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Currently in Therapy">
                    {stress.currentlyInTherapy ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Describe Therapy">
                    {stress.describeTherapy || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Easy to Handle Stress">
                    {stress.easyToHandleStress ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Emotional Support">
                    {stress.emotionalSupport || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Excess Stress">
                    {stress.excessStress ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hobbies/Leisure Activities">
                    {stress.hobbiesLeisure || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stress from Health">
                    {stress.stressFromHealth || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stress from Social Situations">
                    {stress.stressFromSocial || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stress from Work">
                    {stress.stressFromWork || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              {/* Second Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Marital Status">
                    {stress.maritalStatus || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Often Use Relaxation Techniques">
                    {stress.oftenRelaxationTechniques || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Previous Occupation">
                    {stress.previousOccupation || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Use Relaxation Techniques">
                    {stress.relaxationTechniques ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Religious Practice">
                    {stress.religiousPractice ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sought Counseling">
                    {stress.soughtCounselling ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stress from Family">
                    {stress.stressFromFamily || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stress from Finances">
                    {stress.stressFromFinances || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type of Relaxation Techniques">
                    {stress.typeRelaxationTechniques || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type of Religious Practice">
                    {stress.typeReligiousPractice || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Who Do You Live With">
                    {stress.whoDoYouLiveWith || "N/A"}
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
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="How Well Things Going Overall">
                    {healthMedical.howWellThingsGoingOverall || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going in School">
                    {healthMedical.howWellThingsGoingSchool || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going at Job">
                    {healthMedical.howWellThingsGoingJob || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going in Social Life">
                    {healthMedical.howWellThingsGoingSocialLife || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Close Friends">
                    {healthMedical.howWellThingsGoingCloseFriends || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Sex">
                    {healthMedical.howWellThingsGoingSex || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Attitude">
                    {healthMedical.howWellThingsGoingAttitude || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Partner">
                    {healthMedical.howWellThingsGoingPartner || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="How Well Things Going with Kids">
                    {healthMedical.howWellThingsGoingKids || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Parents">
                    {healthMedical.howWellThingsGoingParents || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Well Things Going with Spouse">
                    {healthMedical.howWellThingsGoingSpouse || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Were You Born">
                    {healthMedical.howWereYouBorn || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Were You Born With Complications">
                    {healthMedical.wereYouBornWithComplication !== null
                      ? healthMedical.wereYouBornWithComplication
                        ? "Yes"
                        : "No"
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Breast Fed and How Long">
                    {healthMedical.breastFedHowLong || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Breast Fed Formula">
                    {healthMedical.breastFedFormula || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              {/* Diet and Feeding History */}
              <Col xs={24} md={12}>
                <Descriptions title="Diet and Feeding History" column={1} bordered>
                  <Descriptions.Item label="Don't Know Breast Food">
                    {healthMedical.breastFoodDontKnow ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age Introduction of Solid Food">
                    {healthMedical.ageIntroductionSolidFood || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age Introduction of Wheat">
                    {healthMedical.ageIntroductionWheat || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age Introduction of Dairy">
                    {healthMedical.ageIntroductionDiary || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Foods Avoided">
                    {healthMedical.foodsAvoided !== null
                      ? healthMedical.foodsAvoided
                        ? "Yes"
                        : "No"
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Foods Avoided Type and Symptoms">
                    {healthMedical.foodsAvoidTypeSymptoms || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="A Lot of Sugar">
                    {healthMedical.alotSugar ? "Yes" : "No"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
              {/* Dental and Environmental History */}
              <Col xs={24} md={12}>
                <Descriptions title="Dental and Environmental History" column={1} bordered>
                  <Descriptions.Item label="Dental History">
                    {healthMedical.dentalHistory || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mercury Filling Removed">
                    {healthMedical.mercuryFillingRemoved ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="When Mercury Filling Removed">
                    {healthMedical.mercuryFillingRemovedWhen || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fillings as Kid">
                    {healthMedical.fillingsAsKid || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Brush Regularly">
                    {healthMedical.brushRegularly ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Floss Regularly">
                    {healthMedical.flossRegularly ? "Yes" : "No"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
      
            </Row>
          </div>
        );
      
      case 6:
        return loading ? (
          <p>{stress}</p>
        ) : (
          <div className="p-6 rounded-md shadow-md">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {Object.entries(personalFamily).map(([key, value]) => (
                    <Descriptions.Item 
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      key={key}
                    >
                      <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
      
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {Object.entries(personalFamily).map(([key, value]) => (
                    <Descriptions.Item 
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      key={key}
                    >
                      <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
            </Row>
          </div>
        );
      
      case 7:
        return loading ? (
          <p>{stress}</p>
        ) : (
          <div className="p-6 rounded-md shadow-md">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {Object.entries(illness).map(([key, value]) => (
                    <Descriptions.Item 
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      key={key}
                    >
                      <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
      
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {Object.entries(illness).map(([key, value]) => (
                    <Descriptions.Item 
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      key={key}
                    >
                      <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
            </Row>
          </div>
        );
      
        case 8:
          return loading ? (
            <p>{symptom}</p>
          ) : (
            <div className="p-6 rounded-md shadow-md">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Descriptions column={1} bordered>
                    {Object.entries(symptom).slice(0, Math.ceil(Object.entries(symptom).length / 2)).map(([key, value]) => (
                      <Descriptions.Item 
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        key={key}
                      >
                        <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Col>
        
                <Col xs={24} md={12}>
                  <Descriptions column={1} bordered>
                    {Object.entries(symptom).slice(Math.ceil(Object.entries(symptom).length / 2)).map(([key, value]) => (
                      <Descriptions.Item 
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        key={key}
                      >
                        <span className="font-medium">{value !== null ? value : 'N/A'}</span>
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Col>
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
          
    default:
      return <p style={{ textAlign: "center" }}> No Record available</p>;
  }
}  