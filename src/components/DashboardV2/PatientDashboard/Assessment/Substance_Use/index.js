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
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";

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
        options: ["Cigarettes", "Smokeless", "Pipe", "Cigar", "E-cig"],
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
    question: "If you smoked previously:",
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
        name: "packs_per_day",
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
    type: "radio",
    sub: "Other Substances",
    name: "using_recreational_drugs",
    options: ["Yes", "No"],
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

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex4"),
      10,
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
    }
  }, []);
  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
    return (
      answers[question.name] !== undefined && answers[question.name] !== ""
    );
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
    }
    if (currentQuestionIndex === 6) {
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
    setAnswers({
      ...answers,
      [name]: value,
    });
  };

  const transformAnswers = (answers) => {
    return {
      smokePresently: answers.smoke_currently === "Yes",
      smokingCurrently:
        answers.smoke_currently === "Yes"
          ? {
              packsDay: answers.packs_per_day || 0,
              years: answers.number_of_years || 0,
              type: answers.smoke_type || "",
            }
          : {},
      attempedToQuit: {
        yesNo: answers.attempted_to_quit === "Yes",
        describe: "",
      },
      smokedInPast:
        answers.smoked_previously === "Yes"
          ? {
              packsDay: answers.packs_per_day_previous || 0,
              years: answers.number_of_years_previous || 0,
              type: "",
            }
          : {},
      exposedTo2ndSmoke: answers.exposed_to_second_hand_smoke === "Yes",
      howManyAlcoholWeek: answers.exposed_to_smoke || "",
      previousAlcoholIntake: {
        yesNo: answers.alcohol_problem === "Yes",
        describe: "",
      },
      problemAlcohol: answers.alcohol_problem === "Yes",
      problemAlcoholWhen: answers.problem_alcohol_when || "",
      problemAlcoholExplain: answers.problem_alcohol_explain || "",
      getHelpForDrinking: answers.considered_help_for_alcohol === "Yes",
      currentlyRecreationalDrugs: answers.using_recreational_drugs === "Yes",
      currentlyRecreationalDrugsType: "",
      everUsedRecreationalDrugs: answers.inhaled_drugs === "Yes",
    };
  };

  const handleSubmit = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    const transformedAnswers = transformAnswers(answers);
    const token = userInfo.obj.token || "";

    fetch(
      "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddSubstanceUse",
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
        <p style={{ fontWeight: "bold", color: "#000" }}>
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
            name={subQuestion.question}
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
                {option}
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
        <p>{subQuestion.question}</p>
        {subQuestion.type === "inputNumber" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
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
                  option
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
                  {option}
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
                  {option}
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
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={16} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {label}
          {questions[currentQuestionIndex].sub}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
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

export default SubstanceUse;