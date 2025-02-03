import React, { useState, useEffect } from "react";
import { Progress, Button, Col, Row, Input, message } from "antd";
import { useNavigate } from "react-router-dom"; 
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
    name: "modify_diet",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Take several nutritional supplements each day",
    name: "supplements",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",

    sub: "Keep a record of everything you eat each day",
    name: "keep_record_meal",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Modify your lifestyle (e.g., work demands, sleep habits)",
    name: "modify_lifestyle",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Practice a relaxation technique",
    name: "practice_relaxation",
  },
  {
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    type: "rating_scale",
    title: "In order to improve your health, how willing are you to:",
    sub: "Engage in regular exercise",
    name: "engage_in_regular_exercise",
  },
  {
    title: "How confident are you of your ability to organize and follow through on the previous question’s health-related activities?",
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
    title: "How much ongoing support (e.g., telephone consults, email correspondence) from our professional staff would be helpful to you as you implement your personal health program?",
    type: "rating_scale",
    question: "Rate on a scale of 5 (very willing), to 1 (not willing):",
    name: "ongoing_support",
  },
  {
    title: "Comments",
    type: "long_textarea",
    name: "add_commnets"
  },
  {
    title: "What do you hope to achieve in your visit with us?",
    type: "long_textarea",
    name: "achieve_your_goals"
  },
  {
    title: "When was the last time you felt well?",
    type: "long_textarea",
    name: "felt_well_last_time"
  },
  {
    title: "Did something trigger your change in health?",
    type: "long_textarea",
    name: "health_issue"
  },
  {
    title: "What makes you feel better?",
    type: "long_textarea",
    name: "feel_better"
  },
  
  {
    title: "What makes you feel worse?",
    type: "long_textarea",
    name: "feel_worse"
  },
  {
    title: "How does your condition affect you?",
    type: "long_textarea",
    name: "current_state"
  },
  {
    title: "What do you think is happening and why?",
    type: "long_textarea",
    name: "happening_and_why"
  },
  {
    title: "What do you feel needs to happen for you to get better?",
    type: "long_textarea",
    name: "get_better"
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

  const transformReadinessData = (answers) => {
    console.log('baibhav-answer', answers)
    return {
      modifyDiet: answers.modify_diet || 0,
      takeDailySupplement: answers.supplements || 0,
      recordEverythingEat: answers.keep_record_meal || 0,
      modifyLifestyle: answers.modify_lifestyle || 0,
      practiceRelaxation: answers.practice_relaxation || 0,
      engageRegularExercise: answers.engage_in_regular_exercise || 0,
      readinessConfident: {
        level: answers.confidence_follow_through || 0,
        name: answers.confidence_follow_through_details || ""
      },
      readinessSupportive: answers.health_stress_7 || 0,
      readinessFrequency: answers.ongoing_support || 0,
      comment: answers.add_commnets || "",
      healthAchieve: answers.achieve_your_goals || "",
      healthLastTime: answers.felt_well_last_time || "",
      healthChangeTrigger: answers.health_issue || "",
      healthFeelBetter: answers.feel_better || "",
      healthFeelWorse: answers.feel_worse || "",
      healthCondition: answers.current_state || "",
      healthThinkHappening: answers.happening_and_why || "",
      healthHappenGetBetter: answers.get_better || ""
    };
  };

  const handleSubmit = () => {
    localStorage.setItem("currentQuestionIndex10", 0);
    localStorage.setItem("answers-readiness", JSON.stringify(answers));
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo.obj.token || "";
      const transformedData = transformReadinessData(answers)

    fetch(
      "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddReadiness",
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(transformedData),
      },
    )
    .then((response)=>response.json())
    .then((data)=>{
      console.log("Transformed Readiness Data:", transformedData);
      dispatch(completeCard("/questionnaire/10"));
      localStorage.setItem("currentQuestionIndex10", 0);
      localStorage.setItem("answers", JSON.stringify(answers));
      navigate("/assessment");
      console.log("Readiness Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
                {/* {question.title} */}
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
            <p style={{ marginTop: "10px", color: "#000", fontWeight:"600", }}>
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
        <i style={{ margin: "20px 0", color: "#000", fontWeight:"400", fontSize: "15px" }}>
          {questions[currentQuestionIndex].question}
        </i>
        <h5 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
          {label}{questions[currentQuestionIndex]?.title}
        </h5>
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