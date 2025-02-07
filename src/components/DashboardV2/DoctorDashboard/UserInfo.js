import React, { useEffect, useState } from "react";
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
} from "../../redux/AssessmentController";
import { Tag } from "antd";

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
    "Reproductive Health",

  ];
  console.log({personalFamily})
  console.log(useSelector((state) => state.intake));
  useEffect(() => {
    console.log("useEffect is running");

    if (visibleModal !== null) {
      console.log(`Modal ${visibleModal} is visible`);
      switch (visibleModal) {
        case 0:
          console.log("Dispatching getGeneralInformation");
          dispatch(getGeneralInformation(userInfo?.user?.id));
          break;
        case 1:
          console.log("Dispatching getCurrentHealthLifestyle");
          dispatch(getCurrentHealthLifestyle(userInfo?.user?.id));
          break;
        case 2:
          console.log("Dispatching getNutritionAndDietaryHabits");
          dispatch(getNutritionAndDietaryHabits(userInfo?.user?.id));
          break;
        case 3:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSubstanceAbuse(userInfo?.user?.id));
          break;

        case 4:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getGetStress(userInfo?.user?.id));
          break;
        case 5:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getHealthandMedical(userInfo?.user?.id));
          break;
        case 6:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getPersonalFamily(userInfo?.user?.id));
          break;
        case 7:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getIllnessCondition(userInfo?.user?.id));
          break;
        case 8:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getSymptomReview(userInfo?.user?.id));
          break;
        case 9:
          console.log("Dispatching getSubstanceAbuse");
          dispatch(getReadiness(userInfo?.user?.id));
          break;
        case 10:
          console.log("Dispatching Reproductive");
          dispatch(getReproductiveReview(userInfo?.user?.id));
          break;
        default:
          break;
      }
    }
  }, [visibleModal, dispatch, userInfo]);

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
                  <strong>Client</strong> :
                  {userInfo?.user?.lastname || "N/A"}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Age</strong> : {userInfo?.user?.age}
                </p>
              </Col>
              <Col span={12} md={6}>
                <p>
                  <strong>Preferred Phone</strong> :{" "}
                  {userInfo?.user?.phoneNumber || "N/A"}
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
                xs={24}
                sm={12}
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
  reproductiveInfo,
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
      <Descriptions.Item label="Where Medical Care">
        {generalInfo.whereMedicalCare || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="When Medical Care">
        {generalInfo.whenMedicalCare || "N/A"}
      </Descriptions.Item>
      <Descriptions.Item label="Whom Medical Care">
        {generalInfo.whomMedicalCare || "N/A"}
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
            <Col xs={24} md={12}>
              <Descriptions column={1} bordered>

                <Descriptions.Item label="Ongoing Health">
                  {currentHealth?.ongoingHealth?.length > 0 ? (
                    currentHealth.ongoingHealth.map((health, index) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <strong>Problem:</strong> {health.problem || "N/A"} <br />
                        <strong>Severity:</strong>{" "}
                        {health.severity ? (
                          <Tag color={health.severity === "High" ? "red" : health.severity === "Medium" ? "orange" : "green"}>
                            {health.severity}
                          </Tag>
                        ) : (
                          "N/A"
                        )}
                        <br />
                        <strong>Prior Treatment:</strong> {health.priorTreatment || "N/A"} <br />
                        <strong>Success:</strong>{" "}
                        {health.success ? (
                          <Tag color={health.success === "Yes" ? "green" : "green"}>{health.success}</Tag>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    ))
                  ) : (
                    "N/A"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Allergies">
                  {currentHealth?.allergies?.length > 0 ? (
                    currentHealth.allergies.map((allergy, index) => (
                      <div key={index} className="m-2">
                        <strong>Food:</strong>{" "}
                        <Tag color="magenta">{allergy.food || "N/A"}</Tag> <br />
                        <strong>Reaction:</strong>{" "}
                        <Tag color="volcano">{allergy.reaction || "N/A"}</Tag>
                      </div>
                    ))
                  ) : (
                    "N/A"
                  )}
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
                    <strong>Type:</strong> <Tag color="blue">{currentHealth?.cardio?.type || "Cardio"}</Tag>
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
                    <strong>Type:</strong> <Tag color="green">{currentHealth?.strength?.type || "Strength"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.strength?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.strength?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Flexibility">
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Type:</strong> <Tag color="purple">{currentHealth?.flexibility?.type || "Flexibility"}</Tag>
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
                    <strong>Type:</strong> <Tag color="orange">{currentHealth?.balance?.type || "Balance"}</Tag>
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
                    <strong>Type:</strong> <Tag color="red">{currentHealth?.sport?.type || "Sport"}</Tag>
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
                    <strong>Type:</strong> <Tag color="grey">{currentHealth?.other?.type || "Other"}</Tag>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Frequency:</strong> {currentHealth?.other?.timesWeek || 0} times per week
                  </div>
                  <div>
                    <strong>Duration:</strong> {currentHealth?.other?.duration || 0} minutes
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Motivated to Exercise">
                  {currentHealth?.motivatedToExercise || "N/A"}
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
                    {nutrition.specialDietProgram && nutrition.specialDietProgram.length > 0 ? (
                      nutrition.specialDietProgram.map((diet, index) => (
                        <Tag color="blue" key={index} className="m-1">
                          {diet}
                        </Tag>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </Descriptions.Item>


                  <Descriptions.Item label="Sensitive to Food">
                    {nutrition.sensitiveToFood?.yesNo
                      ? nutrition.sensitiveToFood.describe
                      : "No" || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aversion to Food">
                    {nutrition.aversionToFood?.yesNo === true
                      ? "Yes"
                      : nutrition.aversionToFood?.yesNo === false
                        ? "No"
                        : "N/A"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Adverse List">
                    {nutrition.adverseList && nutrition.adverseList.length > 0 ? (
                      nutrition.adverseList.map((adverse, index) => (
                        <Tag color="red" key={index} className="m-1">
                          {adverse}
                        </Tag>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Any Food Craving">
                    {nutrition.anyFoodCraving?.yesNo === true
                      ? "Yes"
                      : nutrition.anyFoodCraving?.yesNo === false
                        ? "No"
                        : "N/A"}
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
                  <Descriptions.Item label="Eating Habits" style={{ width: '100%' }}>
                    {nutrition?.eatingHabits?.length > 0 ? (
                      nutrition.eatingHabits.map((habit, index) => (
                        <Tag color="green" key={index} className="m-1">
                          {habit || "N/A"}
                        </Tag>
                      ))
                    ) : (
                      "N/A"
                    )}
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
                  <Descriptions.Item label="Number of Fruits/Day">
                    {nutrition.noTypicalFruits || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Vegetables/Day">
                    {nutrition.noTypicalVegetables || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Col>

            {/* Additional Eating Habits Column for balance */}
            <Col xs={24} md={12}>
              {nutrition && (
                <Descriptions title="Additional Dietary Information" column={1} bordered>
                  <Descriptions.Item label="Number of Typical Legumes">
                    {nutrition.noTypicalLegumes || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Red Meat">
                    {nutrition.noTypicalRedMeat || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Fish">
                    {nutrition.noTypicalFish || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Dairy">
                    {nutrition.noTypicalDairy || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Nuts">
                    {nutrition.noTypicalNuts || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Typical Fats">
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
          {substance ? (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                  {[
                    { label: "Smoke Presently", value: substance.smokePresently !== null ? (substance.smokePresently ? "Yes" : "No") : "N/A" },
                    { label: "Smoking Currently", value: substance.smokingCurrently ? `Packs/Day: ${substance.smokingCurrently.packsDay}, Years: ${substance.smokingCurrently.years}, Type: ${substance.smokingCurrently.type}` : "N/A" },
                    { label: "Attempted to Quit", value: substance.attempedToQuit?.yesNo ? "Yes" : "No" },
                    { label: "Describe Quit Attempt", value: substance.attempedToQuit?.describe || "N/A" },
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
                    { label: "Describe Previous Alcohol Intake", value: substance.previousAlcoholIntake?.describe || "N/A" },
                    { label: "Problem with Alcohol", value: substance.problemAlcohol ? "Yes" : "No" },
                    { label: "Problem with Alcohol When", value: substance.problemAlcoholWhen || "N/A" },
                    { label: "Explain Problem with Alcohol", value: substance.problemAlcoholExplain || "N/A" },
                    { label: "Get Help for Drinking", value: substance.getHelpForDrinking ? "Yes" : "No" },
                    { label: "Currently Using Recreational Drugs", value: substance.currentlyRecreationalDrugs ? "Yes" : "No" },
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
            { Object.entries(personalFamily?.obstetricHistory || {}).map(([key, value]) => {
                  console.log("baibhav--", 'key',key,value);
                  return (value.level > 0 && <Descriptions.Item
                        label={value.name}
                        key={key}
                      >
                        {value.level || 'N/A'}
                        {/* <span className="font-medium">{value.name || 'N/A'}</span> */}
                      </Descriptions.Item>)
                })
                }
             


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
                <Descriptions.Item label="Lenght Of Cycle">
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
                <Descriptions.Item label="Health Last Time">
                {personalFamily?.everHadPreMenstrualProblems?.yesNo
                    ? personalFamily?.everHadPreMenstrualProblems?.describe || "No Description"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Birth Control Type">
                  {personalFamily?.hormonalBirthControlType?.name || "N/A"}
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
                <Descriptions.Item label="In Menopause">
                {personalFamily?.inMenopause?.yesNo
                    ? personalFamily.inMenopause.level || "No level"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Surgical Menopause">
                {personalFamily?.surgicalMenopause?.yesNo
                    ? personalFamily.surgicalMenopause.describe || "No describe"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Symptomic Problems">
                  <div>{personalFamily?.symptomicProblems || "N/A"}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Hormonal Replacement">
                {personalFamily?.hormonalReplacement?.yesNo
                    ? personalFamily.hormonalReplacement.describe || "No describe"
                    : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Gyn Symptoms">
                {personalFamily?.gynSymptoms || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Gyn Screening Last Pap Test">
                {personalFamily?.gynScreeningLastPapTest?.date || "N/A"}
                {personalFamily?.gynScreeningLastPapTest?.value || ""}
                </Descriptions.Item>
                <Descriptions.Item label="Gyn Screening Last Mammo">
                {personalFamily?.gynScreeningLastMammo?.date || "N/A"}
                {personalFamily?.gynScreeningLastMammo?.value || ""}
                </Descriptions.Item>
                <Descriptions.Item label="Gyn Screening Last Bone Desity">
                {personalFamily?.gynScreeningLastBoneDesity?.date || "N/A"}
                {personalFamily?.gynScreeningLastBoneDesity?.value || ""}
                </Descriptions.Item>
               
              </Descriptions> 
            </Col>
          </Row>
          {/* <Row gutter={16}>
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
          </Row> */}
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
                                    <strong>
                                      {subKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                    </strong> {subValue}
                                  </Tag>
                                ))}
                              </div>
                            ))
                          ) : (
                            <Typography.Text type="secondary">N/A</Typography.Text>
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
                                <Typography.Text strong>Description:</Typography.Text> {value.describe}
                              </div>
                            )}
                          </>
                        ) : (
                          <Typography.Text strong>{value !== null ? value : "N/A"}</Typography.Text>
                        )}
                      </Descriptions.Item>
                    ))}
                </Descriptions>
              </Col>
            ))}
          </Row>
        </div>
        
        )
        
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
          <p>{stress}</p>
        ) : (
          <div className="p-6 rounded-md shadow-md">
            <Row gutter={16}>
              {/* First Column */}
              <Col xs={24} md={12}>
                 <Descriptions column={1} bordered>
                  <Descriptions.Item label="Birth Control">
                  {
                    (reproductiveInfo.birthControl === null || reproductiveInfo.birthControl === undefined) ? '' :
                      (
                        (reproductiveInfo.birthControl ? 'Yes, ' : 'No') + '' +
                        (reproductiveInfo?.birthControl && reproductiveInfo?.hormonalBirthControl !== "N/A" ? reproductiveInfo?.hormonalBirthControl : ' ') + '' +
                        (reproductiveInfo?.birthControl && reproductiveInfo?.nonHormonalBirthControl !== "N/A" ? reproductiveInfo?.nonHormonalBirthControl : ' ')
                      )
                  }
                  </Descriptions.Item>
                  <Descriptions.Item label="Currently Pregnant">
                    {reproductiveInfo?.currentlyPregnant === null || reproductiveInfo.currentlyPregnant === undefined ? 'N/A' : (reproductiveInfo.currentlyPregnant ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trying to conceive">
                  {reproductiveInfo?.tryingToConceive === null || reproductiveInfo.tryingToConceive === undefined ? 'N/A' : (reproductiveInfo.tryingToConceive ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Difficulty Trying To Conceive">
                    {reproductiveInfo?.difficultyTryingToConceive === null || reproductiveInfo.difficultyTryingToConceive === undefined ? 'N/A' : (reproductiveInfo.difficultyTryingToConceive ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Family Member With Reproductive Concerns">
                    {reproductiveInfo?.familyMemberWithReproductiveConcerns || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="How Long Trying To Conceive">
                    {reproductiveInfo?.howLongTryingToConceive || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Method To Conceive">
                    {reproductiveInfo?.methodToConceive?.length ? reproductiveInfo.methodToConceive.join(', ') : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Charting To Conceive">
                    {reproductiveInfo?.chartingToConceive?.length ? reproductiveInfo.chartingToConceive.join(', ') : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Method Fertility Awareness">
                    {reproductiveInfo?.methodFertilityAwareness || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Intercouse Each Cycle">
                    {reproductiveInfo?.intercouseEachCycle || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Menstrual Pain During Period">
                    {reproductiveInfo?.menstrualPainDuringPeriod || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Menstral Bleeding Pelvic Pain Duration">
                    {reproductiveInfo?.menstralBleedingPelvicPain?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Menstral Bleeding Pelvic Pain Colour">
                    {reproductiveInfo?.menstralBleedingPelvicPain?.colour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Experience Pelvic Pain">
                    {reproductiveInfo?.experiencePelvicPain === null || reproductiveInfo.experiencePelvicPain === undefined ? 'N/A' : (reproductiveInfo.experiencePelvicPain ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  
                 <>
                  {/* <Descriptions.Item label="Utilizing Fertility Awareness">
                    {reproductiveInfo?.utilizingFertilityAwareness === null || reproductiveInfo.utilizingFertilityAwareness === undefined ? 'N/A' : (reproductiveInfo.utilizingFertilityAwareness ? 'Yes' : 'No')}
                  </Descriptions.Item> */}
                  {/* <Descriptions.Item label="Cycle Discharge After Period Spotting Duration">
                    {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.duration || "N/A"}
                  </Descriptions.Item> */}
                  {/* <Descriptions.Item label="Cycle Discharge After Period Spotting Color">
                    {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.color || "N/A"}
                  </Descriptions.Item> */}
                  {/* <Descriptions.Item label="Cycle Discharge Creamy Duration">
                    {reproductiveInfo?.cycleDischargeCreamy?.duration || "N/A"}
                  </Descriptions.Item>  */}
                  {/* <Descriptions.Item label="Cycle Discharge Creamy Colour">
                    {reproductiveInfo?.cycleDischargeCreamy?.colour || "N/A"}
                  </Descriptions.Item>  */}
                  {/* <Descriptions.Item label="Cycle Discharge Egg White Duration">
                    {reproductiveInfo?.cycleDischargeEggWhite?.duration || "N/A"}
                  </Descriptions.Item> */}
                  {/* <Descriptions.Item label="Cycle Discharge Egg White Colour">
                    {reproductiveInfo?.cycleDischargeEggWhite?.colour || "N/A"}
                  </Descriptions.Item> */}
                  {/* <Descriptions.Item label="Cycle Discharge Menstral Bleeding Duration">
                    {reproductiveInfo?.cycleDischargeMenstralBleeding?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Menstral Bleeding Colour">
                    {reproductiveInfo?.cycleDischargeMenstralBleeding?.colour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Pre Period Duration">
                    {reproductiveInfo?.cycleDischargePrePeriod?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Pre Period Colour">
                    {reproductiveInfo?.cycleDischargePrePeriod?.colour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Watery Duration">
                    {reproductiveInfo?.cycleDischargeWatery?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Watery Colour">
                    {reproductiveInfo?.cycleDischargeWatery?.colour || "N/A"}
                  </Descriptions.Item> */}
                  
                  {/* <Descriptions.Item label="Hormonal Birth Control">
                    {reproductiveInfo?.hormonalBirthControl || "N/A"}
                  </Descriptions.Item> */}
                 </>
                  
                </Descriptions> 
              </Col>
      
              {/* Second Column */}
              <Col xs={24} md={12}>
                <Descriptions column={1} bordered>
                <Descriptions.Item label="During Circle Pelvic Pain Duration">
                    {reproductiveInfo?.duringCirclePelvicPain?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="During Circle Pelvic Pain Colour">
                    {reproductiveInfo?.duringCirclePelvicPain?.colour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Do You Pms Symptoms">
                    {reproductiveInfo?.doYouPmsSymptoms === null || reproductiveInfo.doYouPmsSymptoms === undefined ? 'N/A' : (reproductiveInfo.doYouPmsSymptoms ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  <Descriptions.Item label="pms Symptoms">
                    {reproductiveInfo?.pmsSymptoms || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="pms Duration">
                    {reproductiveInfo?.pms?.duration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="pms Colour">
                    {reproductiveInfo?.pms?.colour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Longest Cycle Lenght">
                    {reproductiveInfo?.longestCycleLenght || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shortest Cycle Lenght">
                    {reproductiveInfo?.shortestCycleLenght || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Average Cycle Lenght">
                    {reproductiveInfo?.averageCycleLenght || "N/A"}
                  </Descriptions.Item>
                   {/* <Descriptions.Item label="Who Do You Live With?">
                  {reproductiveInfo.who_do_you_live_with || 'N/A'}
                  </Descriptions.Item> */}
                  <Descriptions.Item label="Mid Cycle Spotting">
                  {reproductiveInfo?.midCycleSpotting ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Creamy Duration">
                  {reproductiveInfo?.cycleDischargeCreamy?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Creamy Colour">
                  {reproductiveInfo?.cycleDischargeCreamy?.colour || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Watery Duration">
                  {reproductiveInfo?.cycleDischargeWatery?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Watery Colour">
                  {reproductiveInfo?.cycleDischargeWatery?.colour || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Egg White Duration">
                  {reproductiveInfo?.cycleDischargeEggWhite?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Egg White Colour">
                  {reproductiveInfo?.cycleDischargeEggWhite?.colour || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Pre Period Duration">
                  {reproductiveInfo?.cycleDischargePrePeriod?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Pre Period Colour">
                  {reproductiveInfo?.cycleDischargePrePeriod?.colour || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Menstral Bleeding Duration">
                  {reproductiveInfo?.cycleDischargeMenstralBleeding?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Menstral Bleeding Colour">
                  {reproductiveInfo?.cycleDischargeMenstralBleeding?.colour || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge Menstral Bleeding Clots">
                  {reproductiveInfo?.cycleDischargeMenstralBleeding?.clots ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge After Period Spotting Duration">
                  {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.duration || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cycle Discharge After Period Spotting">
                  {reproductiveInfo?.cycleDischargeAfterPeriodSpotting?.colour || 'N/A'}
                  </Descriptions.Item>




                  
                  {/* <Descriptions.Item label="Intercouse Days">
                    {reproductiveInfo?.intercouseDays || "N/A"}
                  <Descriptions.Item label="Menstral Cycle Colour">
                    {reproductiveInfo?.menstralCycleColour || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Menstral Cycle Duration">
                    {reproductiveInfo?.menstralCycleDuration || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Menstral Cycle Frequency">
                    {reproductiveInfo?.menstralCycleFrequency || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mid Cycle Spotting">
                    {reproductiveInfo?.midCycleSpotting === null || reproductiveInfo.midCycleSpotting === undefined ? 'N/A' : (reproductiveInfo.midCycleSpotting ? 'Yes' : 'No')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Non Hormonal Birth Control">
                    {reproductiveInfo?.nonHormonalBirthControl || "N/A"}
                  </Descriptions.Item> 
                  <Descriptions.Item label="Trying To Conceive">
                    {reproductiveInfo?.tryingToConceive === null || reproductiveInfo.tryingToConceive === undefined ? 'N/A' : (reproductiveInfo.tryingToConceive ? 'Yes' : 'No')}
                  </Descriptions.Item> */}
                  
                </Descriptions>
              </Col> 
            </Row>
          </div>
        );

    default:
      return <p style={{ textAlign: "center" }}> No Record available</p>;
  }
}  