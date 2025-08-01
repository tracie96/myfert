import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  InputNumber,
  message,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import { getSubstancePatient } from "../../../../redux/AssessmentController";
import { baseUrl } from "../../../../../utils/envAccess";

const questions = [
  {
    question: "Do you smoke currently?",
    type: "long_radio",
    name: "smoke_currently",
    options: ["Yes", "No"],
    sub: "Smoking",
    subQuestions: [
      {
        question: "Packs per day:",
        type: "inputNumber",
        name: "packs_per_day",
      },
      {
        question: "Number of years:",
        type: "inputNumber",
        name: "number_of_years",
      },
      {
        question: "What type?",
        type: "radio",
        name: "smoke_type",
        options: ["Cigarettes", "Smokeless", "Pipe", "Cigar", "E-cig", "Other"],
      },
    ],
  },
  {
    question: "Have you attempted to quit?",
    type: "long_radio",
    sub: "Smoking",
    name: "attempted_to_quit",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, using what methods:",
        type: "text",
        name: "methods_to_stop_smoking",
      },
    ],
  },
  {
    question: "Have you smoked previously:",
    type: "smoked_previously",
    sub: "Smoking",
    name: "smoked_previously",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Packs per day:",
        type: "inputNumber",
        name: "packs_per_day_previous",
      },
      {
        question: "Number of years:",
        type: "inputNumber",
        name: "number_of_years_previous",
      },
    ],
  },
  {
    question: "Are you regularly exposed to second-hand smoke?",
    type: "radio",
    sub: "Smoking",
    name: "exposed_to_second_hand_smoke",
    options: ["Yes", "No"],
  },
  {
    question:
      "How many alcoholic beverages do you drink in a week? (1 drink = 5 ounces wine, 12 ounces beer, 1.5 ounces spirits)",
    type: "radio",
    sub: "Alcohol",
    name: "exposed_to_smoke",
    options: ["1-3", "4-6", "7-10", "More than 10", "None"],
  },
  {
    question: "Previous alcohol intake?",
    type: "long_radio",
    name: "previous_alcohol_intake",
    sub: "Alcohol",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes:",
        type: "radio",
        name: "previous_packs_per_day",
        options: ["Mild", "Moderate", "High"],
      },
    ],
  },
  {
    question: "Have you ever had a problem with alcohol?",
    type: "long_radio",
    sub: "Alcohol",
    name: "alcohol_problem",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: when?",
        type: "text",
        name: "packs_per_day_when",
      },
      {
        question: "Explain the problem",
        type: "text",
        name: "packs_per_day_expain",
      },
    ],
  },
  {
    question:
      "Have you ever thought about getting help to control or stop your drinking?",
    type: "radio",
    sub: "Alcohol",
    name: "considered_help_for_alcohol",
    options: ["Yes", "No"],
  },
  {
    question: "Are you currently using any recreational drugs?",
    type: "long_radio",
    sub: "Other Substances",
    name: "using_recreational_drugs",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Please specify which recreational drugs:",
        type: "text",
        name: "recreational_drugs_type",
      },
    ],
  },
  {
    question: "Have you ever used IV or inhaled recreational drugs?",
    type: "radio",
    sub: "Other Substances",
    name: "inhaled_drugs",
    options: ["Yes", "No"],
  },
];

const SubstanceUse = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const patientSubstanceInfo = useSelector((state) => state.intake?.patientSubstanceInfo);
  const hasSubmittedBefore = useSelector((state) => state.intake?.accessDetails?.substanceUse);

  useEffect(() => {
    dispatch(getSubstancePatient());
  }, [dispatch]);
  
  useEffect(() => {
    console.log("Effect triggered. patientSubstanceInfo =", patientSubstanceInfo);
    const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex4"), 10);
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
  
    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
    } else if (patientSubstanceInfo && Object.keys(patientSubstanceInfo).length > 0) {
      const mapSubstanceInfoToAnswers = (info) => {
        const normalizeYesNo = (value) => {
          if (value === true) return "Yes";
          if (value === false) return "No";
          return null;
        };
    
        // Handle smokedInPast type based on previous submission
        let smokedInPastValue = null;
        if (info.smokedInPast) {
          if (info.smokedInPast.type === null && hasSubmittedBefore) {
            smokedInPastValue = "No";
          } else {
            smokedInPastValue = info.smokedInPast.type ? "Yes" : "No";
          }
        }

        // Check if smoke type is a standard option or custom
        const standardSmokeTypes = ["Cigarettes", "Smokeless", "Pipe", "Cigar", "E-cig"];
        const smokeType = info.smokingCurrently?.type || "";
        const isCustomSmokeType = smokeType && !standardSmokeTypes.includes(smokeType);
    
        return {
          smoke_currently: normalizeYesNo(info.smokePresently),
          smoke_type: isCustomSmokeType ? "Other" : smokeType,
          smoke_type_other: isCustomSmokeType ? smokeType : "",
          packs_per_day: info.smokingCurrently?.packsDay || 0,
          number_of_years: info.smokingCurrently?.years || 0,
    
          attempted_to_quit: normalizeYesNo(info.attempedToQuit?.yesNo),
          methods_to_stop_smoking: info.attempedToQuit?.describe || "",
    
          smoked_previously: smokedInPastValue,
          packs_per_day_previous: info.smokedInPast?.packsDay || 0,
          number_of_years_previous: info.smokedInPast?.years || 0,
    
          exposed_to_second_hand_smoke: normalizeYesNo(info.exposedTo2ndSmoke),
    
          exposed_to_smoke: info.howManyAlcoholWeek || "",
    
          previous_alcohol_intake: info.previousAlcoholIntake?.yesNo ? "Yes" : "No",
          previous_packs_per_day: info.previousAlcoholIntake?.describe || "",
    
          alcohol_problem: normalizeYesNo(info.problemAlcohol),
          packs_per_day_when: info.problemAlcoholWhen || "",
          packs_per_day_expain: info.problemAlcoholExplain || "",
    
          considered_help_for_alcohol: normalizeYesNo(info.getHelpForDrinking),
    
          using_recreational_drugs: normalizeYesNo(info.currentlyRecreationalDrugs),
          recreational_drugs_type: info.currentlyRecreationalDrugsType || "",
    
          inhaled_drugs: normalizeYesNo(info.everUsedRecreationalDrugs),
        };
      };
      const prefilled = mapSubstanceInfoToAnswers(patientSubstanceInfo);
      setAnswers(prefilled);
    }
  }, [patientSubstanceInfo, hasSubmittedBefore]);
  // ToDo: remove this commented code after testing
  // const validateQuestion = () => {
  //   const question = questions[currentQuestionIndex];
  //   return (
  //     answers[question.name] !== undefined && answers[question.name] !== ""
  //   );
  // };
  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
    const mainAnswer = answers[question.name];

    const isMainValid =
      mainAnswer !== undefined && mainAnswer !== "" && mainAnswer !== null;

    const isOtherOptionValid = question.options?.includes("Other")
      ? mainAnswer !== "Other" || !!answers[`${question.name}_other`]
      : true;

    if (!isMainValid || !isOtherOptionValid) return false;

    // Special validation for "Do you smoke currently?"
    if (question.name === "smoke_currently" && mainAnswer === "Yes") {
      const requiredFields = ["packs_per_day", "number_of_years", "smoke_type"];
      for (const field of requiredFields) {
        const value = answers[field];
        if (value === undefined || value === "") {
          return false;
        }

        // Handle "Other" option for smoke_type
        if (
          field === "smoke_type" &&
          value === "Other" &&
          (!answers["smoke_type_other"] || answers["smoke_type_other"].trim() === "")
        ) {
          return false;
        }
      }
    }

    // Normal subquestion validation (for all other Yes cases)
    if (!question.subQuestions || mainAnswer !== "Yes") {
      return true;
    }

    const areSubQuestionsValid = question.subQuestions.every((sub) => {
      const subAnswer = answers[sub.name];

      if (sub.type === "inputNumber") {
        return subAnswer !== undefined;
      }

      if (sub.type === "radio" && sub.options?.includes("Other")) {
        const subOtherAnswer = answers[`${sub.name}_other`];
        return subAnswer !== undefined && (subAnswer !== "Other" || !!subOtherAnswer);
      }

      return subAnswer !== undefined && subAnswer !== "";
    });

    return areSubQuestionsValid;
  };
  
  
  const handleExit = () => {
    navigate("/assessment");
  };

  const handleSave = () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    let nextQuestionIndex = currentQuestionIndex;

    if (currentQuestionIndex === 0) {
      if (answers["smoke_currently"] === "Yes") {
        nextQuestionIndex = 1;
      } else {
        nextQuestionIndex = 2;
      }
    } else if (currentQuestionIndex === 1) {
      // After answering "Have you attempted to quit?"
      if (answers["attempted_to_quit"] === "Yes") {
        console.log("Attempted to quit:");
        // If currently smoking, skip the "smoked previously" question
        nextQuestionIndex = 2; // Skip to "Are you regularly exposed to second-hand smoke?"
      } else {
        nextQuestionIndex = 3; // Go to "Have you smoked previously"
      }
    } else if (currentQuestionIndex === 2) {
      // After "Have you smoked previously"
      nextQuestionIndex = 3;
    } else if (currentQuestionIndex === 4) {
      // After answering weekly alcohol consumption
      if (answers["exposed_to_smoke"] === "None") {
        nextQuestionIndex = 5; // Go to "Previous alcohol intake"
      } else {
        nextQuestionIndex = 6; // Skip to "Have you ever had a problem with alcohol?"
      }
    } else if (currentQuestionIndex === 5) {
      // After "Previous alcohol intake"
      nextQuestionIndex = 6;
    } else if (currentQuestionIndex === 6) {
      if (answers["alcohol_problem"] === "Yes") {
        nextQuestionIndex = 7;
      } else {
        nextQuestionIndex = 8;
      }
    }

    localStorage.setItem("currentQuestionIndex4", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    if (
      nextQuestionIndex === currentQuestionIndex &&
      currentQuestionIndex < totalQuestions - 1
    ) {
      nextQuestionIndex = currentQuestionIndex + 1;
    }

    setCurrentQuestionIndex(nextQuestionIndex);
  };
  const handlePrevious = () => {
    let previousQuestionIndex = currentQuestionIndex;

    if (currentQuestionIndex === 2) {
      if (answers["smoke_currently"] === "No") {
        previousQuestionIndex = 0;
      } else {
        previousQuestionIndex = 1;
      }
    } else if (currentQuestionIndex === 6) {
      if (answers["exposed_to_smoke"] === "None") {
        previousQuestionIndex = 5;
      } else {
        previousQuestionIndex = 4;
      }
    } else if (currentQuestionIndex === 8) {
      if (answers["alcohol_problem"] === "No") {
        previousQuestionIndex = 6;
      } else {
        previousQuestionIndex = 7;
      }
    } else {
      previousQuestionIndex -= 1;
    }

    setCurrentQuestionIndex(previousQuestionIndex);
  };

  const handleChange = (value, name) => {
    const updatedAnswers = {
      ...answers,
    };

    // If it's a radio input, delete any existing _other value
    if (name.endsWith('_other')) {
      updatedAnswers[name] = value;
    } else {
      updatedAnswers[name] = value;
      // Delete the _other field entirely
      delete updatedAnswers[`${name}_other`];
    }
    if (name === "alcohol_problem" && value === "No") {
      updatedAnswers["packs_per_day_when"] = "";
      updatedAnswers["packs_per_day_expain"] = "";
    }
    if (name === "using_recreational_drugs" && value === "No") {
      updatedAnswers["recreational_drugs_type"] = "";
    }
    
  
    // If user answers NO to smoking, clear related fields
    if (name === "smoke_currently" && value === "No") {
      const requiredFields = ["packs_per_day", "number_of_years", "smoke_type"];
      requiredFields.forEach((field) => {
        updatedAnswers[field] = ""; // Clear the value
        delete updatedAnswers[`${field}_other`]; // Also clear any _other values
      });
    }
    if (name === "attempted_to_quit" && value === "No") {
      const requiredFields = ["methods_to_stop_smoking"];
      requiredFields.forEach((field) => {
        updatedAnswers[field] = ""; // Clear the value
        delete updatedAnswers[`${field}_other`]; // Also clear any _other values
      });
    }
    if (name === "smoked_previously" && value === "No") {
      const fieldsToClear = ["packs_per_day_previous", "number_of_years_previous"];
      fieldsToClear.forEach((field) => {
        updatedAnswers[field] = "";
        delete updatedAnswers[`${field}_other`]; // Also clear any _other values
      });
    }
    
    setAnswers(updatedAnswers);
  };

  const transformAnswers = (answers) => {
    return {
      smokePresently: answers.smoke_currently === "Yes",
      smokeCurrently: answers.smoke_currently === "Yes" ? (answers.smoke_type === "Other" ? answers.smoke_type_other || "" : "") : "",
      smokingCurrently:
        answers.smoke_currently === "Yes"
          ? {
              packsDay: answers.packs_per_day || 0,
              years: answers.number_of_years || 0,
              type: answers.smoke_type === "Other" ? answers.smoke_type_other : answers.smoke_type || "",
            }
          : {},
      attempedToQuit: {
        yesNo: answers.attempted_to_quit === "Yes",
        describe: answers.methods_to_stop_smoking || '',
      },
      smokedInPast: {
        type: answers.smoked_previously === "Yes" ? "Yes" : "No",
        ...(answers.smoked_previously === "Yes" ? {
          packsDay: answers.packs_per_day_previous || 0,
          years: answers.number_of_years_previous || 0,
        } : {})
      },
      exposedTo2ndSmoke: answers.exposed_to_second_hand_smoke === "Yes",
      howManyAlcoholWeek: answers.exposed_to_smoke || "",
      previousAlcoholIntake: {
        yesNo: answers.previous_alcohol_intake === "Yes",
        describe:answers.previous_packs_per_day || "",
      },
      problemAlcohol: answers.alcohol_problem === "Yes",
      problemAlcoholWhen: answers.packs_per_day_when || "",
      problemAlcoholExplain: answers.packs_per_day_expain || "",
      getHelpForDrinking: answers.considered_help_for_alcohol === "Yes",
      currentlyRecreationalDrugs: answers.using_recreational_drugs === "Yes",
      currentlyRecreationalDrugsType: answers.recreational_drugs_type || "",
      everUsedRecreationalDrugs: answers.inhaled_drugs === "Yes",
    };
  };

  const handleSubmit = () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    const transformedAnswers = transformAnswers(answers);
    const token = userInfo.obj.token || "";

    fetch(
      `${baseUrl}Patient/AddSubstanceUse`,
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedAnswers),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", transformedAnswers);
        message.success("Form submitted successfully!");
        dispatch(completeCard("/questionnaire/4"));
        localStorage.setItem("currentQuestionIndex4", 0);
        localStorage.setItem("answers", JSON.stringify(answers));
        navigate("/assessment");
        console.log("Success:", data);
      })
      .catch((error) => {
        message.error("Failed to submit the form. Please try again.");
        console.error("Error:", error);
      });
  };

  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p style={{ color: "#000" }}>
          {subQuestion.type !== "text" && subQuestion.question}
        </p>
        {subQuestion.type === "text" && (
          <Input
            placeholder={subQuestion.question}
            value={answers[subQuestion.name] || ""}
            onChange={(e) => handleChange(e.target.value, subQuestion.name)}
            className="input_questtionnaire"
            style={{
              height: 50,
              borderColor: "#00ADEF",
              width: isMobile ? "100%" : "50%",
            }}
            height={20}
          />
        )}
        {subQuestion.type === "inputNumber" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
            min={0}
            onChange={(value) => handleChange(value, subQuestion.name)}
            className="select_questtionnaire"
            style={{
              height: 35,
              borderColor: "#00ADEF",
              width: isMobile ? "100%" : "50%",
            }}
          />
        )}
         {subQuestion.type === "inputNumberX" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
            min={0}
            onChange={(value) => handleChange(value, subQuestion.name)}
            className="select_questtionnaire"
            style={{
              height: 35,
              borderColor: "#00ADEF",
              width: isMobile ? "100%" : "50%",
            }}
          />
        )}

{subQuestion.type === "radio" && (
  <Radio.Group
    name={subQuestion.name}
    onChange={(e) => handleChange(e.target.value, subQuestion.name)}
    value={answers[subQuestion.name]}
    style={{ width: isMobile ? "100%" : "50%" }}
  >
    {subQuestion.options.map((option, idx) => (
      <Radio
        key={idx}
        value={option}
        style={{ display: "block", marginBottom: "10px" }}
      >
        {option === "Other" ? (
          <>
            {option}
            {answers[subQuestion.name] === "Other" && (
              <div style={{ marginTop: "10px", display:"contents", alignItems:"baseline" }}>
                <Input
                  className="input_questtionnaire"
                  placeholder="Please specify"
                  value={answers[`${subQuestion.name}_other`] || ""}
                  onChange={(e) =>
                    handleChange(e.target.value, `${subQuestion.name}_other`)
                  }
                  style={{
                    height: 50,
                    borderColor: "#00ADEF",
                    marginTop: 5,
                    width: isMobile ? "100%" : "50%",
                    marginLeft:"5px"
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <span style={{ verticalAlign: "text-bottom" }}>{option}</span>
        )}
      </Radio>
    ))}
  </Radio.Group>
)}

      </div>
    ));
  };

  const renderNewSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p style={{color:"#000"}}>{subQuestion.question}</p>
        {subQuestion.type === "inputNumber" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
            min={0}
            onChange={(value) => handleChange(value, subQuestion.name)}
            className="select_questtionnaire"
          />
        )}
      </div>
    ));
  };

  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
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
                          style={{ height: 50, borderColor: "#00ADEF" }}
                          value={answers[`${question.name}_other`] || ""}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              `${question.name}_other`,
                            )
                          }
                        />
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                )}
              </Radio>
            ))}
          </Radio.Group>
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
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                </Radio>
              ))}
            </Radio.Group>
            {answers[question.name] === "Yes" &&
              renderSubQuestions(question.subQuestions)}
          </div>
        );
     
        case "smoked_previously":
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
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                </Radio>
              ))}
            </Radio.Group>
            {answers[question.name] === "Yes" &&
              renderNewSubQuestions(question.subQuestions)}
          </div>
        );

      default:
        return null;
    }
  };

  const progressColor =
    currentQuestionIndex === totalQuestions - 1 ? "#01ACEE" : "#C2E6F8";
    const progressPercent = Math.round((currentQuestionIndex / (totalQuestions - 1)) * 100);
  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={progressPercent}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", fontSize:"15px", fontWeight:"600", color: "#F2AA93" }}>
          {questions[currentQuestionIndex].sub}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
          {label}
          {questions[currentQuestionIndex].question}
        </h3>
        {renderInput(questions[currentQuestionIndex])}

        <div
          style={{ margin: "20px 0", marginTop: isMobile ? 50 : 200 }}
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

export default SubstanceUse;
