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

  const modalContent = [
    "Reproductive Health",
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
    "Additional Inquiries",
  ];

  console.log(useSelector((state) => state.intake));
  useEffect(() => {
    console.log("useEffect is running"); // This should fire on component mount/update

    if (visibleModal !== null) {
      console.log(`Modal ${visibleModal} is visible`);
      switch (visibleModal) {
        case 1:
          console.log("Dispatching getGeneralInformation");
          dispatch(getGeneralInformation(userInfo.id));
          break;
        case 2:
          console.log("Dispatching getCurrentHealthLifestyle");
          dispatch(getCurrentHealthLifestyle(userInfo.id));
          break;
        case 3:
          console.log("Dispatching getNutritionAndDietaryHabits");
          dispatch(getNutritionAndDietaryHabits(userInfo.id));
          break;
        case 4:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSubstanceAbuse(userInfo.id));
          break;
        case 5:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getGetStress(userInfo.id));
          break;
        case 6:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getHealthandMedical(userInfo.id));
          break;
        case 7:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getPersonalFamily(userInfo.id));
          break;
        case 8:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getIllnessCondition(userInfo.id));
          break;
        case 9:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSymptomReview(userInfo.id));
          break;
        case 10:
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
    console.log("Visible Modal Index:", index); // Debugging log
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
              onOk={() => setVisibleModal(null)}
              width={"1000px"}
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
    case 1: // General Information section
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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
              <Descriptions column={1}>
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
          </Row>{" "}
        </div>
      );
    case 2:
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Row gutter={16} justify="center">
            {/* First Row */}
            <Col xs={24} md={12}>
               <Descriptions column={1}>
                <Descriptions.Item label="Ongoing Health">
                  { currentHealth?.ongoingHealth?.map(health => health.problem) ?? "N/A"}
                </Descriptions.Item>
               <Descriptions.Item label="Allergies">
               { currentHealth?.allergies?.map(allergies => allergies.reaction) ?? "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Sleep Hours">
                  {currentHealth?.sleepHours ?? "N/A"}
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

            {/* Second Row */}
            <Col xs={24} md={12}>
               <Descriptions column={1}>
                <Descriptions.Item label="Cardio">
                  {currentHealth?.cardio?.duration  ?? "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Strength">
                 {currentHealth?.strength?.duration  ?? "N/A"} 
                </Descriptions.Item>
                <Descriptions.Item label="Flexibility">
                {currentHealth?.flexibility?.duration  ?? "N/A"} 
                </Descriptions.Item>
                <Descriptions.Item label="Balance">
                {currentHealth?.balance?.duration  ?? "N/A"} 
                </Descriptions.Item>
                <Descriptions.Item label="Sport">
                  {currentHealth?.sport?.duration  ?? "N/A"} 
                </Descriptions.Item>
                <Descriptions.Item label="Other">
                   {currentHealth?.other?.other?.duration  ?? "N/A"} 
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
    case 3: // Nutrition & Dietary Habits section
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {" "}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              {nutrition && <Descriptions title="Dietary Information" column={1}>
                <Descriptions.Item label="Special Diet Program">
                  {nutrition.specialDietProgram || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Sensitive to Food">
                  {nutrition.sensitiveToFood?.yesNo ? nutrition.sensitiveToFood.describe : "No" || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Aversion to Food">
                  {nutrition.aversionToFood?.yesNo ? nutrition.aversionToFood.describe : "No" || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Adverse List">
                  {nutrition.adverseList || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Any Food Craving">
                  {nutrition.anyFoodCraving?.yesNo ? nutrition.anyFoodCraving.describe : "No" || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Have 3 Meals a Day">
                  {nutrition.have3MealADay?.yesNo ? nutrition.have3MealADay.level : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Skipping a Meal">
                  {nutrition.skippingAMeal ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="How Many Eat Out Per Week">
                  {nutrition.howManyEatOutPerWeek || "N/A"}
                </Descriptions.Item>
              </Descriptions>}
            </Col>

            {/* Second Row */}
            <Col xs={24} md={12}>
              {nutrition && <Descriptions title="Eating Habits" column={1}>
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
                <Descriptions.Item label="No Typical Can Soda">
                  {nutrition.noTypicalCanSoda || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="No Typical Sweets">
                  {nutrition.noTypicalSweets || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Caffeinated Beverages">
                  {nutrition.caffeinatedBeverages || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Coffee Cups">
                  {nutrition.coffeeCups || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tea Cups">
                  {nutrition.teaCups || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Soda Cups">
                  {nutrition.sodaCups || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Adverse Reaction to Coffee">
                  {nutrition.adverseReactionToCoffee || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Explain Adverse Reaction to Coffee">
                  {nutrition.explainAdverseReactionToCoffee || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Reaction to Caffeine">
                  {nutrition.reactionToCaffeine || "N/A"}
                </Descriptions.Item>
              </Descriptions>}
            </Col>
          </Row>
        </div>
      );
    case 4:
      return loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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
                <Descriptions.Item label="Ever Used Recreational Drugs">
                  {substance.everUsedRecreationalDrugs ? "Yes" : "No"}
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
        <div>
          <Row gutter={16}>
            {/* First Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Abused">
                  {stress.abused !== null
                    ? stress.abused
                      ? "Yes"
                      : "No"
                    : "N/A"}
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
              </Descriptions>
            </Col>

            {/* Second Column */}
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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

                <Descriptions.Item label="Stress from Health">
                  {stress.stressFromHealth || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Stress from Social Situations">
                  {stress.stressFromSocial || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Stress from Work">
                  {stress.stressFromWork || "N/A"}
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
    case 6:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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
              <Descriptions column={1}>
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

            {/* Additional Column */}
            <Col xs={24} md={12}>
              <Descriptions title="Diet and Feeding History" column={1}>
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

            {/* Last Column */}
            <Col xs={24} md={12}>
              <Descriptions title="Dental and Environmental History" column={1}>
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
                <Descriptions.Item label="Environmental Effects">
                  {healthMedical.environmentEffect || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Environmental Exposures">
                  {healthMedical.environmentExposed || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Exposed to Harmful Chemicals">
                  {healthMedical.exposedHarmfulChemical ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="When Exposed to Harmful Chemicals">
                  {healthMedical.whenExposedHarmfulChemical || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Pets/Farm Animals">
                  {healthMedical.petsFarmAnimal ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Where Pets/Animals Live">
                  {healthMedical.petsAnimalLiveWhere || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );
    case 7:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Age When Menstrual Cycle Started">
                  {personalFamily.ageStartMenstrual || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cramping During Periods">
                  {personalFamily.cramping ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Ever Had Pre-Menstrual Problems">
                  {personalFamily.everHadPreMenstrualProblems !== null
                    ? personalFamily.everHadPreMenstrualProblems
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="GYN Screening Last Bone Density">
                  {personalFamily.gynScreeningLastBoneDesity || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="GYN Screening Last Mammogram">
                  {personalFamily.gynScreeningLastMammo || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="GYN Screening Last Pap Test">
                  {personalFamily.gynScreeningLastPapTest || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="GYN Symptoms">
                  {personalFamily.gynSymptoms || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Birth Control Type">
                  {personalFamily.hormonalBirthControlType || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Replacement">
                  {personalFamily.hormonalReplacement || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="In Menopause">
                  {personalFamily.inMenopause !== null
                    ? personalFamily.inMenopause
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Length of Cycle">
                  {personalFamily.lenghtOfCycle || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Obstetric History">
                  {personalFamily.obstetricHistory || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Other Menstrual Problems">
                  {personalFamily.otherMenstrualProblems || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Other Tests">
                  {personalFamily.otherTest || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Pain During Periods">
                  {personalFamily.painInPeriod ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems After Pregnancy">
                  {personalFamily.problemsAfterPregnancy !== null
                    ? personalFamily.problemsAfterPregnancy
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems After Pregnancy Explanation">
                  {personalFamily.problemsAfterPregnancyExplain || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Problems with Hormonal Birth Control">
                  {personalFamily.problemsWithHormonalBirthControl || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date of Last Menstrual Cycle">
                  {personalFamily.startDateLastMenstrual || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Surgical Menopause">
                  {personalFamily.surgicalMenopause !== null
                    ? personalFamily.surgicalMenopause
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Symptomatic Problems">
                  {personalFamily.symptomicProblems || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Time Between Cycles">
                  {personalFamily.timeBtwCycles || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Use Contraception">
                  {personalFamily.useContraception !== null
                    ? personalFamily.useContraception
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Weight of Child">
                  {personalFamily.weightChild || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );
    case 8:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Add New">
                  {illness.addNew || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cancer">
                  {illness.cancer || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cardiovascular">
                  {illness.cardiovascular || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Barium Diagnostic">
                  {illness.diagnosticBarium || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Bone Density Diagnostic">
                  {illness.diagnosticBoneDensity || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="CT Scan Diagnostic">
                  {illness.diagnosticCTScan || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Cardiac Stress Diagnostic">
                  {illness.diagnosticCardiacStress || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Chest X-ray Diagnostic">
                  {illness.diagnosticChestXray || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Colonoscopy Diagnostic">
                  {illness.diagnosticColonoscopy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="EKG Diagnostic">
                  {illness.diagnosticEKG || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="MRI Diagnostic">
                  {illness.diagnosticMRI || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Other Diagnostic">
                  {illness.diagnosticOther || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={12}>
              <Descriptions column={1}>
                <Descriptions.Item label="Other X-ray Diagnostic">
                  {illness.diagnosticOtherXray || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Upper Endoscopy Diagnostic">
                  {illness.diagnosticUpperEndoscopy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Upper GI Diagnostic">
                  {illness.diagnosticUpperGI || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Endocrine">
                  {illness.endocrine || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Gall Bladder">
                  {illness.gallBladder || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Gastrointestinal">
                  {illness.gastroIntestinal || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Heart Surgery">
                  {illness.heartSurgery || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Hernia">
                  {illness.hernia || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Hysterectomy">
                  {illness.hysterectomy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Inflammatory">
                  {illness.inflammatory || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Back Injuries">
                  {illness.injuriesBack || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Broken Bones Injuries">
                  {illness.injuriesBrokenBones || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      );
      case 10:
      return loading ? (
        <p>{stress}</p>
      ) : (
        <div>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions column={1}>
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
 
         <Col xs={24} md={12}>
              <Descriptions column={1}>
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