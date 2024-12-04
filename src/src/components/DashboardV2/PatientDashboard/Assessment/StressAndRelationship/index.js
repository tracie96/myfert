import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  Select,
  Slider,
  InputNumber,
  message,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";

const { Option } = Select;

const questions = [
  {
    question:
      "Do you feel you have an excessive amount of stress in your life?",
    type: "radio",
    name: "do_you_feel_stress",
    options: ["Yes", "No"],
  },
  {
    question: "Do you feel you can easily handle the stress in your life?",
    type: "radio",
    name: "can_you_handle_stress",
    options: ["Yes", "No"],
  },
  {
    question:
      "How much stress do each of the following cause on a daily basis (Rate on scale of 1-10, 10 being highest) :",
    type: "rating_scale",
    sub: "Work",
    name: "health_stress_work",
  },
  {
    question:
      "How much stress do each of the following cause on a daily basis? :",
    type: "rating_scale",
    sub: "Family",
    name: "health_stress_family",
  },
  {
    question:
      "How much stress do each of the following cause on a daily basis? :",
    type: "rating_scale",
    sub: "Sport",
    name: "health_stress_sport",
  },
  {
    question:
      "How much stress do each of the following cause on a daily basis? :",
    type: "rating_scale",
    sub: "Finances",
    name: "health_stress_financies",
  },
  {
    question:
      "How much stress do each of the following cause on a daily basis? :",
    type: "rating_scale",
    sub: "Health",
    name: "health_stress_health",
  },

  {
    question:
      "How much stress do each of the following cause on a daily basis? :",
    type: "rating_scale",
    sub: "Other",
    name: "health_stress_other",
  },
  {
    question: "Do you use relaxation techniques?",
    type: "long_radio",
    name: "relaxation_techniques",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: How Often",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "Which techniques do you use? (Check all that apply)",
    type: "checkbox",
    name: "special_nutritional_program",
    options: ["Meditation", "Breathing", "Tai Chi", "Yoga", "Prayer", "Other"],
  },
  {
    question: "Have you ever sought counseling?",
    type: "radio",
    name: "have_you_sought_counselling",
    options: ["Yes", "No"],
  },

  {
    question: "Are you currently in therapy?",
    type: "long_radio",
    name: "current_therapy",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Describe",
        type: "text",
        name: "therapy_description",
      },
    ],
  },

  {
    question:
      "Have you ever been abused, a victim of crime, or experienced a signifcant trauma?",
    type: "radio",
    name: "been_abused",
    options: ["Yes", "No"],
  },
  {
    question:
      "When, where and from whom did you last receive medical or health care?",
    type: "long_textarea",
    name: "where_and_where_received_medical_care",
  },
  {
    question: "Marital Status",
    type: "radio",
    title: "Relationships",
    name: "marital_status",
    options: [
      "Single",
      "Married",
      "Divorced",
      "Gay/Lesbian",
      "Long-Term Partner",
      "Widow/er",
    ],
  },

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

const StressAndRelationship = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex5"),
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

  const handleSave = () => {
    if (!validateQuestion()) {
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
  const handleSubmit = () => {
    // Handle form submission logic
    message.success("Form submitted successfully!");
    dispatch(completeCard("/questionnaire/5"));
    localStorage.setItem("currentQuestionIndex5", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    navigate("/assessment");
  };
  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p>{subQuestion.type !== "text" && subQuestion.question}</p>
        {subQuestion.type === "text" && (
          <Input
            placeholder={subQuestion.question}
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
      case "rating_scale":
        return (
          <div style={{ padding: "0 10px" }}>
            <div style={{ marginTop: "10px" }}>
              <Slider
                min={1}
                max={10}
                marks={{
                  1: "1",
                  2: "2",
                  3: "3",
                  4: "4",
                  5: "5",
                  6: "6",
                  7: "7",
                  8: "8",
                  9: "9",
                  10: "10",
                }}
                value={answers[question.name] || 1}
                onChange={(value) => handleChange(value, question.name)}
                style={{ width: isMobile ? "100%" : "50%" }}
              />
            </div>
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
      <Col xs={24} sm={24} md={16} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {questions[currentQuestionIndex].title
            ? questions[currentQuestionIndex].title
            : "Stress"}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
          {questions[currentQuestionIndex].question}
          <i style={{ color: "#335CAD", fontWeight: "bold" }}>
            {" "}
            {questions[currentQuestionIndex]?.sub}
          </i>
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

export default StressAndRelationship;
