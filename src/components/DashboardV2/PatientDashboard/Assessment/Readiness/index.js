import React, { useState, useEffect } from "react";
import { Progress, Button, Col, Row, Input, message } from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";

const questions = [
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Signifcantly modify your diet",
    name: "health_stress_one",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Take several nutritional supplements each day",
    name: "health_stress_two",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",

    sub: "Keep a record of everything you eat each day",
    name: "health_stress_3",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Modify your lifestyle (e.g., work demands, sleep habits)",
    name: "health_stress_4",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Practice a relaxation technique",
    name: "health_stress_5",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Engage in regular exercise",
    name: "health_stress_6",
  },
  {
    sub: "How confident are you of your ability to organize and follow through on the above health-related activities?",
    type: "confidence_scale_with_textarea",
    question:
      "Rate on a scale of 5 (very confident), to 1 (not confident at all):",
    name: "confidence_follow_through",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title:
      "At the present time, how supportive do you think the people in your household will be to your implementing the above changes?",
    name: "health_stress_7",
  },

  {
    question:
      "When, where and from whom did you last receive medical or health care?",
    type: "long_textarea",
    name: "where_and_where_received_medical_care",
  },

  {
    question:
      "With whom do you live? (Include children, parents, relatives, friends, pets)",
    type: "long_textarea",
    name: "who_do_you_live_with",
  },

  {
    question: "Current occupation:",
    type: "long_textarea",
    name: "current_occupation",
  },
  {
    question: "Previous occupation:",
    type: "long_textarea",
    name: "previous_occupation",
  },
];

const Readiness = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex10"),
      10,
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
    }
  }, []);

  const handleExit = () => {
    navigate("/assessment");
  };
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
    localStorage.setItem("currentQuestionIndex10", 0);
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

  const handleSubmit = () => {
    dispatch(completeCard("/questionnaire/10"));
    localStorage.setItem("currentQuestionIndex10", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    navigate("/assessment");
  };
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const renderInput = (question) => {
    switch (question.type) {
      case "rating_scale":
        return (
          <div>
            {question.sub ? (
              <p
                style={{
                  color: "#335CAD",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {question.sub}
              </p>
            ) : (
              <p style={{ marginBottom: "10px", color: "#000" }}>
                {question.title}
              </p>
            )}
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
                width: isMobile ? "100%" : 400,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleChange(i + 1, question.name)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #00ADEF",
                    display: "flex",
                    padding: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 5,
                    background:
                      answers[question.name] === i + 1
                        ? "#00ADEF"
                        : "transparent",
                    color:
                      answers[question.name] === i + 1 ? "#fff" : "#00ADEF",
                  }}
                >
                  {i + 1}
                </div>
              ))}
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
              style={{ marginTop: "10px" }}
            />
          </div>
        );
      case "confidence_scale_with_textarea":
        return (
          <div style={{ marginTop: "20px" }}>
            <p style={{ marginBottom: "10px", color: "#000" }}>
              {question.sub}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
                width: 400,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleChange(i + 1, question.name)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #00ADEF",
                    display: "flex",
                    padding: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 5,
                    background:
                      answers[question.name] === i + 1
                        ? "#00ADEF"
                        : "transparent",
                    color:
                      answers[question.name] === i + 1 ? "#fff" : "#00ADEF",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p style={{ marginTop: "10px", color: "#000" }}>
              If you are not confident of your ability, what aspects of yourself
              or your life lead you to question your capacity to follow through?
            </p>
            <Input.TextArea
              className="input_questionnaire"
              name={`${question.name}_details`}
              value={answers[`${question.name}_details`] || ""}
              onChange={(e) =>
                handleChange(e.target.value, `${question.name}_details`)
              }
              rows={4}
              style={{ marginTop: "10px", width: "100%" }}
            />
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
          Readiness Assessment
        </h3>
        <h3 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
          {label} {questions[currentQuestionIndex].question}
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

export default Readiness;
