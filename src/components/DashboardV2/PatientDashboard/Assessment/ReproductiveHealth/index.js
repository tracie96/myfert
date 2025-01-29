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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { backBtnTxt, exitBtnTxt, reproductiveGeneralHeading, reproductiveGeneralInfo, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import InfoModal from "./InfoModal";

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
      // {
      //   question:
      //   "How long have you been using fertility awareness based method(s)?",
      //   type: "select_two",
      // },
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
    type: "checkbox",
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
    question: "Describe the duration and severity of pain during menstrual bleeding.",
    type: "number_with_radio",
    title: "Cycle Information",
    name: "duration_per_cycle",
    sub_question: "Duration per Cycle",
    question_description: "Period Pain: ",
    question_description_answer: "PELVIC PAIN/ CRAMPS",
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
    question: "Do you experience PMS symptoms?",
    infoIconBtn:"   ℹ️ ",
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
  const [showInfoMoal,setShowInfoMoal] = useState(false);
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

    // Ensure the main question is answered
    if (!mainAnswer) {
        return false; // Prevent proceeding if the main question is empty
    }

    // Handle "Other" selection with an additional input
    const isCheckbox = Array.isArray(mainAnswer);
    const isOtherSelected = isCheckbox
        ? mainAnswer.includes("Other")
        : mainAnswer === "Other";
    const otherAnswerKey = `${question.name}_other`;
    const otherAnswer = answers[otherAnswerKey];

    if (isOtherSelected && (!otherAnswer || otherAnswer.trim() === "")) {
        return false;
    }

    // Special Handling for Birth Control Question
    if (question.name === "relaxation_techniques" && mainAnswer === "Yes") {
        
        const isHormonalAnswered = answers["how_often_hormonal_bc"]?.trim() !== "";
        const isNonHormonalAnswered = answers["how_often_non_hormonal_bc"]?.trim() !== "";


        if (!isHormonalAnswered && !isNonHormonalAnswered) {
            return false;
        }

    }

    // Validate "number_with_radio" with multiple subQuestions
    if (question.type === "number_with_radio" && question.subQuestions) {
        for (const subQuestion of question.subQuestions) {
            const subAnswer = answers[subQuestion.name];
            const radioAnswer = answers[`${subQuestion.name}_radio`];

            if (subQuestion.type === "number_with_radio_sub") {
                // Either the number input or "Unsure" must be selected
                const isSubAnswered =
                    (typeof subAnswer === "number" && subAnswer >= 0) || radioAnswer === "Unsure";
                if (!isSubAnswered) {
                    return false;
                }
            } else if (subQuestion.type === "radio") {
                // Validate radio questions
                if (!subAnswer || subAnswer.trim() === "") {
                    return false;
                }
            }
        }
    }

    // Validate Other Sub-Questions (for all other questions)
    if (question.subQuestions && mainAnswer === "Yes") {
        for (const subQuestion of question.subQuestions) {
            const subAnswer = answers[subQuestion.name];

            // Skip already validated birth control sub-questions
            if (question.name === "relaxation_techniques") continue;

            if (!subAnswer || subAnswer.trim() === "") {
                return false;
            }
        }
    }

    // Validate Checkbox Answers
    if (isCheckbox) {
        return mainAnswer.length > 0;
    }

    // Validate Number Inputs
    if (typeof mainAnswer === "number") {
        return !isNaN(mainAnswer) && mainAnswer >= 0;
    }

    return true;
};





  const handleSave = () => {
    const question = questions[currentQuestionIndex];
  
    // Allow skipping validation if "Unsure" is selected for subQuestions
    if (
      question.type === "number_with_radio" &&
      question.subQuestions &&
      answers[`${question.subQuestions[0].name}_radio`] === "Unsure"
    ) {
      localStorage.setItem("currentQuestionIndex5", currentQuestionIndex + 1);
      localStorage.setItem("answers", JSON.stringify(answers));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return; // Exit early
    }
  
    // Validate the question before proceeding
    if (!validateQuestion() && question.name !== "info") {
      message.error("Please answer the current question before saving.");
      return;
    }
  
    localStorage.setItem("currentQuestionIndex5", currentQuestionIndex + 1);
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
    const question = questions[currentQuestionIndex];
    let updatedAnswers = { ...answers };

    if (name === "relaxation_techniques") { 
      // Main question: Are you currently using birth control?
      if (value === "Yes") {
          updatedAnswers[name] = "Yes";
      } else {
          updatedAnswers[name] = "No";
          updatedAnswers["how_often_hormonal_bc"] = ""; 
          updatedAnswers["how_often_non_hormonal_bc"] = "";
      }
  } 
  else if (name === "how_often_hormonal_bc") {
      // If the first subquestion is answered, clear the second
      updatedAnswers["how_often_hormonal_bc"] = value;
      updatedAnswers["how_often_non_hormonal_bc"] = "";
  } 
  else if (name === "how_often_non_hormonal_bc") {
      // If the second subquestion is answered, clear the first
      updatedAnswers["how_often_non_hormonal_bc"] = value;
      updatedAnswers["how_often_hormonal_bc"] = "";
  }
  
    if (Array.isArray(value)) {
      // Check if "Unsure" or "None" is selected
      const isUnsureOrNoneSelected = value.includes("Unsure") || value.includes("None");
  
      if (isUnsureOrNoneSelected) {
        // Keep only "Unsure" or "None" and remove all other selections
        updatedAnswers[name] = value.filter(opt => opt === "Unsure" || opt === "None");
      } else {
        // Otherwise, update normally
        updatedAnswers[name] = value;
      }
    } 
    else if (value === "Unsure" || value === "None") {
      // If "Unsure" or "None" is selected, clear other answers
      updatedAnswers = {
        ...updatedAnswers,
        [name]: value, // Keep the selected answer
      };
  
      // Reset sub-answers and other inputs for this question
      if (question.subQuestions) {
        question.subQuestions.forEach(subQ => {
          updatedAnswers[subQ.name] = subQ.type === "number" ? 0 : "";
        });
      }
    } 
    else {
      // Normal case when selecting other options
      updatedAnswers[name] = value;
    }
  
    setAnswers(updatedAnswers);
  }; 
  const handleExit = () => {
    navigate("/assessment");
  };

  const handleInfoModal = () => {
    setShowInfoMoal(!showInfoMoal)
  }
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const handleSubmit = async () => {
    try {
      const requestData = {
        birthControl: answers.do_you_have_current_health_concern === "Yes",
        hormonalBirthControl: answers.how_often_hormonal_bc || "N/A",
        nonHormonalBirthControl: answers.how_often_non_hormonal_bc || "N/A",
        currentlyPregnant: answers.isPregnant === "Yes",
        tryingToConceive: answers.is_trying_to_conceive === "Yes",
        difficultyTryingToConceive: answers.is_difficulty_to_conceive === "Yes",
        familyMemberWithReproductiveConcerns: 
          answers.is_family_health_concern === "Yes"
            ? "Yes"
            : answers.is_family_health_concern || "No",
        howLongTryingToConceive: answers.is_trying_to_conceive_time || "Unknown",
        methodToConceive: answers.methods_trying_to_conceive || [],
        chartingToConceive: answers.is_charting_cycles || [],
        utilizingFertilityAwareness: false, 
        methodFertilityAwareness: answers.charting_method || "None",
        intercouseDays: answers.intercouseDays || "Unknown",
        intercouseEachCycle: answers.is_frequent_intercourse_cycle || "Unknown",
        menstrualPainDuringPeriod: answers.is_menstrual_pain || ["None"],
        menstralBleedingPelvicPain: {
          duration: `${answers.duration_per_cycle}` || "N/A",
          colour: answers.duration_per_cycle_severity, 
        },
        experiencePelvicPain: answers.is_lower_back_pain === "Yes",
        duringCirclePelvicPain: {
          duration: answers.duration_per_mild_cycle_radio || "N/A",
          colour: "N/A",
        },
        doYouPmsSymptoms: answers.is_pms_symptom === "Yes",
        pmsSymptoms: answers.pms_sympton || ["None"],
        pms: {
          duration: "N/A", 
          colour: answers.pms_sympton_severity || "Mild",
        },
        longestCycleLenght: answers.longest_cycle_radio || "Unknown",
        shortestCycleLenght: answers.shortest_cycle_radio || "Unknown",
        averageCycleLenght: answers.average_cycle_radio || "Unknown",
        midCycleSpotting: false,
        menstralCycleFrequency: "Unknown", // Example default
        menstralCycleDuration: "Unknown", // Example default
        menstralCycleColour: "Unknown", // Example default
        cycleDischargeCreamy: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
        },
        cycleDischargeWatery: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
        },
        cycleDischargeEggWhite: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
        },
        cycleDischargePrePeriod: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
        },
        cycleDischargeMenstralBleeding: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
          clots: "Unknown", // Example default
        },
        cycleDischargeAfterPeriodSpotting: {
          duration: "Unknown", // Example default
          colour: "Unknown", // Example default
        },
        chartBase64: answers.charting_method || "",
      };
  
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj?.token || "";
  
      const response = await fetch(
        "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddReproductiveHealth",
        {
          method: "POST",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        console.log("API response:", result);
        message.success("Form submitted successfully!");
        dispatch(completeCard("/questionnaire/11"));
        localStorage.setItem("currentQuestionIndex11", 0);
        localStorage.setItem("currentStep", 1);
        localStorage.setItem("answers", JSON.stringify(answers));
        navigate("/assessment");
      } else {
        console.error("API error:", response.statusText);
        message.error("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      message.error("An error occurred. Please try again.");
    }
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
            disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
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
                disabled={answers[`${subQuestion.name}_radio`] === "Unsure"}
                />

              {/* Radio.Group should use a different key in the state */}
              <Radio.Group
                name={`${subQuestion.name}_radio`} // Use a different key for the Radio.Group
                className="radioGroup-baibhav"
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
                    name={`${item.name}_input_questionnaire`}
                    value={answers[item.name] || 0}
                    onChange={(value) => handleChange(value, item.name)}
                    className="input_questionnaire"
                    style={{ width: "100%" }}
                    disabled={answers[item.name] === "Unsure" || answers[item.name] === "None"}
                  />
                </div>
              ))}

              {/* Radio group for yes/no accuracy question */}
              <div>
                <label>{subQuestion.subQuestions[4].label}</label>
                <Radio.Group
                  name={`${subQuestion.subQuestions[4].name}_radio`}
                  className="radioGroup-baibhav-1"
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
           onChange={(value) => handleChange(value || 0, `${subQuestion.name}_years`)}
           value={answers[`${subQuestion.name}_years`] || ""}
           name={`${subQuestion.name}_years`}
           disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
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
           onChange={(value) => handleChange(value || 0, `${subQuestion.name}_months`)}
           value={answers[`${subQuestion.name}_months`] || ""}
           name={`${subQuestion.name}_months`}
           disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
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
            className="radioGroup-baibhav-2"
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
            className="radioGroup-baibhav-3"
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {question.options.map((option, index) => {
              const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
              return (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
                // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
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
            )})}
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
            className="radioGroup-baibhav-4"
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {question.options.map((option, index) => {
              const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
              return (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
                // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
              >
                {option}
              </Radio>
            )})}
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
            {question.options.map((option, index) => {
              const isUnsureOrNoneSelected = (answers[question.name] || []).includes("Unsure") || 
              (answers[question.name] || []).includes("None");
              return (
              <Checkbox 
                key={index} 
                value={option} 
                disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
                className="checkbox-item"
              >
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
            )})}
          </Checkbox.Group>
        );
      case "long_radio":
        return (
          <div style={{ flexDirection: "column" }}>
            <Radio.Group
              name={question.name}
              className="radioGroup-baibhav-5"
              onChange={(e) => handleChange(e.target.value, question.name)}
              value={answers[question.name]}
              style={{ width: "100%" }}
            >
              {question.options.map((option, index) => {
                const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
                const isBirthControlQuestion = question.name === "relaxation_techniques";
                const isHormonalAnswered = answers["how_often_hormonal_bc"];
                const isNonHormonalAnswered = answers["how_often_non_hormonal_bc"];
                return (
                <Radio
                  key={index}
                  value={option}
                  style={{ display: "block", marginBottom: "10px" }}
                  // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
                >
                  {option}
                </Radio>
              )})}
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
<Row gutter={16} style={{ padding: "0 5%", height:"80vh" }}>
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
        height:"70%",
      }}
    >
      <div 
        style={{
          font: "inter",
          fontWeight:"700",
          fontSize: "20px",
          lineHeight:"24.25px",
          color: "#F2AA93"
        }}>
          {reproductiveGeneralHeading}
      </div>
      <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
        {questions[currentQuestionIndex].sub}
      </h3>

      <i 
        style={{
          font: "inter",
          fontWeight:"600",
          fontSize: "16px",
          lineHeight:"18.15px",
          color: "#FF0000"
        }}>
          {reproductiveGeneralInfo}
      </i>

      <h3 style={{ margin: "20px 0", fontWeight:"600", color: "#000", fontSize: "15px" }}>
        {label}
        {questions[currentQuestionIndex].question}{" "}
        <span style={{cursor: "pointer"}} onClick={handleInfoModal}>{questions[currentQuestionIndex]?.infoIconBtn}</span>
        <div>{
          questions[currentQuestionIndex]?.question_description}
          <span style={{color:"#325cae", fontWeight:"600", fontSize: "15px"}}>{questions[currentQuestionIndex]?.question_description_answer}</span>
        </div>
        {questions[currentQuestionIndex].postname && (
          <span style={{ color: "#335CAD", fontWeight: "bold" }}>
            {` ${questions[currentQuestionIndex].postname}`}
          </span>
        )}
      </h3>
      {showInfoMoal && 
        <InfoModal
          showInfoMoal={showInfoMoal} 
          handleInfoModal={handleInfoModal} 
        />
      }
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
         {backBtnTxt}
        </Button>
      ) : (
        <Button onClick={handleExit} className="previous-button">
          {exitBtnTxt}
        </Button>
      )}

      {currentQuestionIndex === totalQuestions - 1 ? (
        <>
          <Button
            type="primary"
            className="submit-button"
            onClick={handleSubmit}
          >
            {submitBtn}
          </Button>
          {isMobile ? (
            <Button onClick={handleExit} className="previous-button">
              {exitBtnTxt}
            </Button>
          ) : (
            <Button
              onClick={handlePrevious}
              className="back-button"
              disabled={currentQuestionIndex === 0}
            >
             {backBtnTxt}
            </Button>
          )}
        </>
      ) : (
        <span className="save_and_exit_group_btn">
          <Button
            type="primary"
            className="save-button"
            onClick={handleSave}
          >
            {saveAndContinueBtn}
          </Button>
          {isMobile ? (
            <Button onClick={handleExit} className="previous-button">
              {exitBtnTxt}
            </Button>
          ) : (
            <Button
              onClick={handlePrevious}
              className="back-button"
              disabled={currentQuestionIndex === 0}
            >
             {backBtnTxt}
            </Button>
          )}
        </span>
      )}
    </div>
  </Col>
</Row>

  
  );
};

export default ReproductiveHealth;
