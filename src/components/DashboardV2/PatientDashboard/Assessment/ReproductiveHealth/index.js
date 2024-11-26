import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  Select,
  InputNumber,
  message,
  Checkbox,
  DatePicker,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

const { Option } = Select;

const questions = [
  {
    question: "Are you currently using birth control?",
    type: "long_radio",
    name: "relaxation_techniques",
    prefix:
      "In this survey, trying to conceive means engaging in regular, unprotected sex without any form of birth control or preventative measures to avoid pregnancy.",
    title: "Reproductive Health Assessment",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Hormonal Birth Control (please specify the type)",
        type: "text",
        name: "how_often_hormonal_bc",
      },
      {
        question: "Non-Hormonal Birth Control (please specify the type)",
        type: "text",
        name: "how_often_non_hormonal_bc",
      },
    ],
  },
  {
    question: "Are you currently pregnant?",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "isPregnant",
    options: ["Yes", "No"],
  },
  {
    question: "Are you currently trying to conceive?",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_trying_to_conceive",
    options: ["Yes", "No"],
  },
  {
    question: "Have you experienced difficulty trying to conceive? ",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_difficulty_to_conceive",
    options: ["Yes", "No"],
  },
  {
    question:
      "Do any of your biological family members have a history of reproductive health concerns (such as infertility, miscarriage, or conditions like PCOS, endometriosis, uterine fibroids, or PMDD)?  ",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_family_health_concern",
    options: ["Yes", "No", "Unsure"],
  },
  {
    question: "For approximately how long have you been trying to conceive?",
    type: "date",
    title: "Trying to Conceive",
    name: "is_trying_to_conceive_time",
  },

  {
    question:
      "What methods have you tried to conceive in the past? (Check all that apply)",
    type: "checkbox",
    title: "Trying to Conceive",
    name: "methods_trying_to_conceive",
    options: [
      "Cycle tracking",
      "Ovulation induction",
      "IVF",
      "Artificial Insemination",
      "Acupuncture",
      "Naturopath",
      "Homeopath",
      "None",
      "Unsure",
      "Other",
    ],
  },
  {
    question:
      "Are you currently charting your cycles using biomarkers/ symptom tracking? (Check all that apply)",
    type: "checkbox",
    title: "Trying to Conceive",
    name: "is_charting_cycles",
    options: [
      "LH urine strips",
      "Estrogen urine strips",
      "Cervical mucus",
      "Basal Body Temperature (BBT)",
      "Calendar/ rhythm method",
      "Cervical Position",
      "Cervical Firmness",
      "Other",
    ],
  },
  {
    question:
      "Are you utilizing a Fertility Awareness Based Method (FABM/FAM) for charting your cycles?",
    type: "long_radio",
    name: "current_therapy",
    title: "Trying to Conceive",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "What method are you using?",
        type: "text",
        name: "charting_method",
      },
      {
        question:
          "How long have you been using fertility awareness based method(s)?",
        type: "select_two",
      },
    ],
  },

  {
    question:
    "How frequently do you have intercourse during your fertile window?",
    type: "number_with_radio",
    title: "Trying to Conceive",
    name: "",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "longest_cycle",
        },
      ],
  },

  {
    question: "How much do you have intercourse each cycle?",
    type: "radio",
    title: "Trying to Conceive",
    name: "is_frequent_intercourse_cycle",
    options: [
      "Daily",
      "Every other week",
      "Twice a week",
      "Once a week",
      "Less than once a week",
    ],
  },

  {
    question:
      "Do you have menstrual pain around the time of your period? (Check all that apply)?",
    type: "radio",
    title: "Cycle Information",
    name: "is_menstrual_pain",
    options: [
      "No",
      "Yes - at the beginning",
      "Yes - during",
      "Yes - at the end",
    ],
  },

  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    name: "duration_per_cycle",
    sub_question: "Period Pain: PELVIC PAIN/ CRAMPS",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        name: "duration_per_cycle",
      },
     
      {
        question: "Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe"],
        name: "duration_per_cycle_severity",
      },
    ],
  },
  {
    question:
      "Do you experience low backache or pelvic pain around the middle of your cycle (when you are not bleeding)? ",
    type: "radio",
    title: "Cycle Information",
    name: "is_lower_back_pain",
    options: ["Yes", "No"],
  },

  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    sub_question: "Mid-Cycle Pain: PELVIC PAIN (not during menstrual bleeding)",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        name: "duration_per_cycle",
      },
  
      {
        question: "Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe"],
        name: "duration_per_mild_cycle_severity",
      },
    ],
  },

  {
    question: "",
    type: "info",
    title: "Cycle Information",
    name: "info",
  },

  {
    question: "Do you experience PMS symptoms?   ℹ️ ",
    type: "radio",
    title: "Cycle Information",
    name: "is_pms_symptom",
    options: ["Yes", "No"],
  },

  {
    question: "PMS Symptoms (Check all that apply)",
    prefix:
      "Describe the duration and severity of PMS symptoms you experience.",
    type: "number_with_radio",
    title: "Cycle Information",
    name: "pms_sympton",
    sub_question: "Mid-Cycle Pain: PELVIC PAIN (not during menstrual bleeding)",
    subQuestions: [
      {
        type: "checkbox",
        name: "pms_sympton",
        options: [
          "Bloating",
          "Bowel Movement changes",
          "Acne",
          "Breast tenderness",
          "Mood Changes",
          "Headache/ Migraine",
          "Nausea",
          "Migraine",
          "Fatigue",
          "Poor Sleep",
          "Energy Increase",
          "Energy Decrease",
        ],
      },
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "pms_sympton_check",
      },
      {
        question: "PMS Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe"],
        name: "pms_sympton_severity",
      },
    ],
  },

  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: LONGEST CYCLE",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "longest_cycle",
      },
    ],
  },
  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: SHORTEST CYCLE",
    name: "",

    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "shortest_cycle",
      },
    ],
  },
  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: AVERAGE CYCLE LENGTH",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "average_cycle",
      },
    ],
  },
  //
  {
    question:
      "With whom do you live? (Include children, parents, relatives, friends, pets)",
    type: "long_textarea",
    title: "Relationships",
    name: "who_do_you_live_with",
  },

  {
    question: "Current occupation:",
    title: "Relationships",
    type: "long_textarea",
    name: "current_occupation",
  },
  {
    question: "Previous occupation:",
    type: "long_textarea",
    title: "Relationships",
    name: "previous_occupation",
  },
  {
    question:
      "Do you have resources for emotional support? (Check all that apply)",
    type: "checkbox",
    title: "Relationships",
    name: "resourcces_for_emotional_support",
    options: [
      "Spouse/Partner",
      "Family",
      "Friends",
      "Religious/Spiritual",
      "Pets",
      "Other",
    ],
  },
  {
    question: "Do you have a religious or spiritual practice?",
    type: "long_radio",
    title: "Relationships",
    name: "spiritual_practice",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: what kind",
        type: "text",
        name: "spiritual_practice_desciption",
      },
    ],
  },
];

const ReproductiveHealth = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex5"),
      10
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (!isNaN(savedIndex) && savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, []);

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
      const mainAnswer = answers[question.name];
  
    const isMainAnswered = mainAnswer !== undefined && mainAnswer !== "";
  
    if (question.subQuestions && !question.options && question.subQuestions.length > 0) {
      const subQuestion = question.subQuestions[0]; 
      const subQuestionNumberAnswer = answers[subQuestion.name];
      const subQuestionRadioAnswer = answers[`${subQuestion.name}_radio`];
      console.log(subQuestionNumberAnswer,subQuestionRadioAnswer,'dd')

      const isSubAnswered = 
        (subQuestionNumberAnswer !== undefined && subQuestionNumberAnswer !== 0) || 
        subQuestionRadioAnswer === "Unsure";
        
        console.log({isMainAnswered, isSubAnswered})
      return isSubAnswered;
    }
  
    return isMainAnswered;
  };
  
  

  const handleSave = () => {
    const question = questions[currentQuestionIndex];
    if (!validateQuestion() && question.name !== "info") {
      message.error("Please answer the current question before saving.");
      return;
    }
    localStorage.setItem("currentQuestionIndex5", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleChange = (value, name) => {
    setAnswers({
      ...answers,
      [name]: value,
    });
  };
  const handleExit = () => {
    navigate("/assessment");
  };
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const handleSubmit = async () => {
    try {
        // Add your form submission logic here
        message.success("Form submitted successfully!");
        dispatch(completeCard("/questionnaire/11"));
        localStorage.setItem("currentQuestionIndex11", 0);
        localStorage.setItem("currentStep", 1);
        localStorage.setItem("answers", JSON.stringify(answers));

        // Prepare the data for API request
        const requestData = {
            birthControl: true,
            hormonalBirthControl: "string",
            nonHormonalBirthControl: "string",
            currentlyPregnant: true,
            tryingToConceive: true,
            difficultyTryingToConceive: true,
            familyMemberWithReproductiveConcerns: "string",
            howLongTryingToConceive: "string",
            methodToConceive: ["string"],
            chartingToConceive: ["string"],
            utilizingFertilityAwareness: true,
            methodFertilityAwareness: "string",
            intercouseDays: "string",
            intercouseEachCycle: "string",
            menstrualPainDuringPeriod: ["string"],
            menstralBleedingPelvicPain: {
                duration: "string",
                colour: "string"
            },
            experiencePelvicPain: true,
            duringCirclePelvicPain: {
                duration: "string",
                colour: "string"
            },
            doYouPmsSymptoms: true,
            pmsSymptoms: ["string"],
            pms: {
                duration: "string",
                colour: "string"
            },
            longestCycleLenght: "string",
            shortestCycleLenght: "string",
            averageCycleLenght: "string",
            midCycleSpotting: true,
            menstralCycleFrequency: "string",
            menstralCycleDuration: "string",
            menstralCycleColour: "string",
            cycleDischargeCreamy: {
                duration: "string",
                colour: "string"
            },
            cycleDischargeWatery: {
                duration: "string",
                colour: "string"
            },
            cycleDischargeEggWhite: {
                duration: "string",
                colour: "string"
            },
            cycleDischargePrePeriod: {
                duration: "string",
                colour: "string"
            },
            cycleDischargeMenstralBleeding: {
                duration: "string",
                colour: "string",
                clots: "string"
            },
            cycleDischargeAfterPeriodSpotting: {
                duration: "string",
                colour: "string"
            },
            chartBase64: "string"
        };
        const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        const token = userInfo.obj.token || "";
        const response = await fetch(
            "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddReproductiveHealth",
            {
                method: "POST",
                headers: {
                  accept: "text/plain",
                  "Content-Type": "application/json", 
                  Authorization: `Bearer ${token}`,
              },
                body: JSON.stringify(requestData)
            }
        );

        if (response.ok) {
            const result = await response.json();
            console.log("API response:", result);
        } else {
            console.error("API error:", response.statusText);
        }
    } catch (error) {
        console.error("Error during API call:", error);
    }

    navigate("/assessment");
};

  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p>{subQuestion.question}</p>
        {subQuestion.type === "text" && (
          <Input
            value={answers[subQuestion.name] || ""}
            onChange={(e) => handleChange(e.target.value, subQuestion.name)}
            className="input_questtionnaire"
          />
        )}
        {subQuestion.type === "inputNumber" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
            onChange={(value) => handleChange(value, subQuestion.name)}
            className="input_questtionnaire"
          />
        )}
        {subQuestion.type === "number_with_radio_sub" && (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* InputNumber should have its own state key */}
              <InputNumber
                name={subQuestion.name}
                value={answers[subQuestion.name] || 0}
                onChange={(value) => handleChange(value, subQuestion.name)}
                className="input_questtionnaire"
                />

              {/* Radio.Group should use a different key in the state */}
              <Radio.Group
                name={`${subQuestion.name}_radio`} // Use a different key for the Radio.Group
                value={answers[`${subQuestion.name}_radio`] || null} // Default selection or null
                onChange={
                  (e) =>
                    handleChange(e.target.value, `${subQuestion.name}_radio`) // Handle radio separately
                }
              >
                <Radio name="Unsure" value="Unsure">Unsure</Radio>
              </Radio.Group>
            </div>
          </>
        )}

        {subQuestion.type === "multi_number_with_radio" && (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {subQuestion.subQuestions.slice(0, 4).map((item, index) => (
                <div key={index}>
                  <label>{item.label}</label>
                  <InputNumber
                    name={item.name}
                    value={answers[item.name] || 0}
                    onChange={(value) => handleChange(value, item.name)}
                    className="input_questionnaire"
                    style={{ width: "100%" }}
                  />
                </div>
              ))}

              {/* Radio group for yes/no accuracy question */}
              <div>
                <label>{subQuestion.subQuestions[4].label}</label>
                <Radio.Group
                  name={`${subQuestion.subQuestions[4].name}_radio`}
                  value={
                    answers[`${subQuestion.subQuestions[4].name}_radio`] || null
                  }
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      `${subQuestion.subQuestions[4].name}_radio`
                    )
                  }
                >
                  {subQuestion.subQuestions[4].options.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </>
        )}
        {subQuestion.type === "select_two" && (
          <Space size="large">
            {/* Input for Years */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <InputNumber
                min={0}
                max={100}
                onChange={(value) => handleChange(value, subQuestion.name)}
                value={answers[subQuestion.name] || 0}
                name="charting_years"
                style={{
                  height: 35,
                  borderColor: "#00ADEF",
                  width: isMobile ? "100%" : "50%",
                }}
              />
              <span style={{ marginLeft: "8px" }}>Years</span>
            </div>

            {/* Input for Months */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <InputNumber
                min={0}
                max={11}
                value={answers[subQuestion.name] || 0}
                name="charting_months"
                onChange={(value) => handleChange(value, subQuestion.name)}
                style={{
                  height: 35,
                  borderColor: "#00ADEF",
                  width: isMobile ? "100%" : "50%",
                }}
              />
              <span style={{ marginLeft: "8px" }}>Months</span>
            </div>
          </Space>
        )}
        {subQuestion.type === "date" && (
          <DatePicker
            format="YYYY-MM-DD"
            value={
              answers[subQuestion.name]
                ? moment(answers[subQuestion.name])
                : null
            }
            onChange={(date) =>
              handleChange(
                date ? date.format("YYYY-MM-DD") : "",
                subQuestion.name
              )
            }
            style={{ width: isMobile ? "100%" : "50%" }}
          />
        )}
        {subQuestion.type === "radio" && (
          <Radio.Group
            name={subQuestion.name}
            onChange={(e) => handleChange(e.target.value, subQuestion.name)}
            value={answers[subQuestion.name]}
            style={{ width: "100%" }}
          >
            {subQuestion.options.map((option, idx) => (
              <Radio
                key={idx}
                value={option}
                name={option}
                style={{ display: "block", marginBottom: "10px" }}
              >
                {option}
              </Radio>
            ))}
          </Radio.Group>
        )}
        {subQuestion.type === "checkbox" && (
          <Col>
            <Checkbox.Group
              style={{ display: "flex", flexDirection: "column" }} // Force column layout for checkboxes
              name={subQuestion.name}
              onChange={(checkedValues) =>
                handleChange(checkedValues, subQuestion.name)
              }
              value={answers[subQuestion.name] || []}
            >
              {subQuestion.options.map((option, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  {" "}
                  {/* Ensure consistent spacing */}
                  <Checkbox value={option}>{option}</Checkbox>
                  {option === "Other" &&
                    answers[subQuestion.name]?.includes("Other") && (
                      <Input
                        className="input_questionnaire"
                        placeholder="Please specify"
                        value={answers[`${subQuestion.name}_other`] || ""}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            `${subQuestion.name}_other`
                          )
                        }
                        style={{ marginTop: "5px" }} // Adjust margin for the input field
                      />
                    )}
                </div>
              ))}
            </Checkbox.Group>
          </Col>
        )}
      </div>
    ));
  };

  const renderInput = (question) => {
    switch (question.type) {
      case "radio":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {question.options.map((option, index) => (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
              >
                {option === "Other" ? (
                  <>
                    {option}
                    {answers[question.name] === "Other" && (
                      <>
                        <br />
                        <Input
                          className="input_questtionnaire"
                          placeholder="Please specify"
                          value={answers[`${question.name}_other`] || ""}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              `${question.name}_other`
                            )
                          }
                        />
                      </>
                    )}
                  </>
                ) : (
                  option
                )}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "date":
        return (
          <Input
            type="date"
            className="input_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "info":
        return (
          <div className="info-box">
            <div className="info-header">
              <InfoCircleOutlined className="info-icon" />
              <Title
                level={5}
                className="info-title"
                style={{ color: "#335CAD" }}
              >
                What is Premenstrual Syndrome (PMS)?
              </Title>
            </div>
            <Paragraph>
              PMS refers to physical and emotional symptoms experienced 1-2
              weeks before a menstrual period. Common symptoms include:
            </Paragraph>
            <ul className="info-list">
              <li>
                <strong>Mood Changes:</strong> Mood swings, irritability,
                anxiety, or depression.
              </li>
              <li>
                <strong>Physical Discomfort:</strong> Bloating, breast
                tenderness, headaches, joint or muscle pain.
              </li>
              <li>
                <strong>Other Symptoms:</strong> Fatigue, trouble sleeping,
                changes in appetite, acne, constipation, or diarrhea.
              </li>
            </ul>
          </div>
        );
      case "radiowithselect":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {question.options.map((option, index) => (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
              >
                {option}
              </Radio>
            ))}
            {answers[question.name] === "No" && (
              <Select
                placeholder="Please specify"
                value={answers[`${question.name}_detail`] || ""}
                onChange={(value) =>
                  handleChange(value, `${question.name}_detail`)
                }
                style={{ width: "100%", marginTop: "10px" }}
              >
                <Option value=" 1"> 1</Option>
                <Option value=" 2"> 2</Option>
                <Option value=" 3"> 3</Option>
              </Select>
            )}
          </Radio.Group>
        );
      case "number":
        return (
          <Col style={{ marginBottom: "20px", display: "block" }}>
            {/* Number Input */}
            <Input
              type="number"
              className="input_questtionnaire"
              name={question.name}
              value={answers[question.name] || ""}
              onChange={(e) => handleChange(e.target.value, question.name)}
              style={{ marginBottom: "10px", width: isMobile ? "100%" : "10%" }}
            />
            <br />
            {/* Checkbox */}
            <Checkbox
              name={`${question.name}_checkbox`}
              checked={answers[`${question.name}_checkbox`] || false}
              onChange={(e) =>
                handleChange(e.target.checked, `${question.name}_checkbox`)
              }
            >
              {/* Checkbox Label */}
              Unsure
            </Checkbox>
          </Col>
        );
      case "number_with_radio":
        return (
          <div className="input_container" style={{ marginBottom: "20px" }}>
            {question.isCyleInfo && (
              <div className="info-box">
                <Title
                  level={5}
                  className="info-title"
                  style={{ color: "#335CAD" }}
                >
                  Cycle Length
                </Title>
                <Paragraph>
                  For this form, your cycle length is counted from the first day
                  of menstrual bleeding (any days of spotting will remain in the
                  previous cycle) until the day before your next period begins.
                </Paragraph>
              </div>
            )}
            <p>{question.sub_question}</p>
            {renderSubQuestions(question.subQuestions)}
          </div>
        );
      case "long_textarea":
        return (
          <div style={{ flexDirection: "column" }}>
            <Input.TextArea
              className="input_questtionnaire"
              name={question.name}
              value={answers[question.name] || ""}
              onChange={(e) => handleChange(e.target.value, question.name)}
              rows={4}
              style={{ marginTop: "10px" }} // Ensure there's some spacing between the button and textarea
            />
          </div>
        );
      case "long_select":
        return (
          <div style={{ flexDirection: "column" }}>
            <Button
              type="primary"
              style={{ background: "#335CAD", padding: 20 }}
            >
              {question.sub}
            </Button>
            <br />
            <Select
              className="select_questtionnaire"
              name={question.name}
              value={answers[question.name] || ""}
              onChange={(value) => handleChange(value, question.name)}
              style={{ marginTop: "10px", width: "100%" }}
            >
              {question.selectOptions.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <Checkbox.Group
            name={question.name}
            onChange={(checkedValues) =>
              handleChange(checkedValues, question.name)
            }
            value={answers[question.name] || []}
            className="checkbox-group"
          >
            {question.options.map((option, index) => (
              <Checkbox key={index} value={option} className="checkbox-item">
                {option === "Other" ? (
                  <>
                    {option}
                    {answers[question.name] &&
                      answers[question.name].includes("Other") && (
                        <>
                          <br />
                          <Input
                            className="input_questtionnaire"
                            placeholder="Please specify"
                            value={answers[`${question.name}_other`] || ""}
                            onChange={(e) =>
                              handleChange(
                                e.target.value,
                                `${question.name}_other`
                              )
                            }
                          />
                        </>
                      )}
                  </>
                ) : (
                  option
                )}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "long_radio":
        return (
          <div style={{ flexDirection: "column" }}>
            <Radio.Group
              name={question.name}
              onChange={(e) => handleChange(e.target.value, question.name)}
              value={answers[question.name]}
              style={{ width: "100%" }}
            >
              {question.options.map((option, index) => (
                <Radio
                  key={index}
                  value={option}
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  {option}
                </Radio>
              ))}
            </Radio.Group>
            {answers[question.name] === "Yes" &&
              renderSubQuestions(question.subQuestions)}
          </div>
        );

      default:
        return null;
    }
  };

  const progressColor =
    currentQuestionIndex === totalQuestions - 1 ? "#01ACEE" : "#C2E6F8";
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
<Row gutter={16} style={{ padding: "0 5%" }}>
  <Col
    xs={24}
    sm={24}
    md={16}
    lg={24}
    xl={24}
  >
    <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE"/>
    <Progress
      percent={Math.round(progressPercentage)}
      strokeColor={progressColor}
      style={{
        top: 10,                  
        width: "90%",            
        zIndex: 1000            
      }}
    />

    <div
      style={{
        overflowY: "auto", 
        marginTop: "2%", 
        paddingRight: "20px",
      }}
    >
      <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
        {questions[currentQuestionIndex].sub}
      </h3>

      <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
        {label}
        {questions[currentQuestionIndex].question}{" "}
        {questions[currentQuestionIndex].postname && (
          <span style={{ color: "#335CAD", fontWeight: "bold" }}>
            {` ${questions[currentQuestionIndex].postname}`}
          </span>
        )}
      </h3>
      {renderInput(questions[currentQuestionIndex])}
    </div>

    {/* Fixed Button Group */}
    <div
    style={{ marginTop: isMobile ? '10%' : '1%' ,background:'#fff'}}
          className="button_group"
        >
      {isMobile ? (
        <Button
          onClick={handlePrevious}
          className="back-button"
          disabled={currentQuestionIndex === 0}
        >
          Back
        </Button>
      ) : (
        <Button onClick={handleExit} className="previous-button">
          Exit
        </Button>
      )}

      {currentQuestionIndex === totalQuestions - 1 ? (
        <>
          <Button
            type="primary"
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {isMobile ? (
            <Button onClick={handleExit} className="previous-button">
              Exit
            </Button>
          ) : (
            <Button
              onClick={handlePrevious}
              className="back-button"
              disabled={currentQuestionIndex === 0}
            >
              Back
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            type="primary"
            className="save-button"
            onClick={handleSave}
          >
            Save & Continue
          </Button>
          {isMobile ? (
            <Button onClick={handleExit} className="previous-button">
              Exit
            </Button>
          ) : (
            <Button
              onClick={handlePrevious}
              className="back-button"
              disabled={currentQuestionIndex === 0}
            >
              Back
            </Button>
          )}
        </>
      )}
    </div>
  </Col>
</Row>

  
  );
};

export default ReproductiveHealth;
