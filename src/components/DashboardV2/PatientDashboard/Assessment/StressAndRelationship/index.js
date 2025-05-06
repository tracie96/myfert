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
  Form,
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
    sub: "Social",
    name: "health_stress_social",
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
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false);
  const [questionLoadError, setQuestionLoadError] = useState(null);
  const totalQuestions = questions?.length || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    // Validate questions array is not empty
    if (questions && Array.isArray(questions) && questions.length > 0) {
      console.log("Questions loaded successfully: ", questions.length);
      setIsQuestionsLoaded(true);
      setQuestionLoadError(null);
    } else {
      const errorMsg = 'Questions array is empty or invalid';
      console.error(errorMsg, questions);
      setIsQuestionsLoaded(false);
      setQuestionLoadError(errorMsg);
    }

    // Load saved data
    try {
      const savedIndex = parseInt(
        localStorage.getItem("currentQuestionIndex5"),
        10,
      );
      const savedAnswers = JSON.parse(localStorage.getItem("answers"));
      if (!isNaN(savedIndex) && savedAnswers) {
        setCurrentQuestionIndex(savedIndex < totalQuestions ? savedIndex : 0);
        setAnswers(savedAnswers);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      // Reset to defaults
      localStorage.setItem("currentQuestionIndex5", "0");
      setCurrentQuestionIndex(0);
    }
  }, [totalQuestions]);

  // Add a safety check to prevent accessing an invalid question
  const getCurrentQuestion = () => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return null;
    }
    
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      console.error(`Invalid question index: ${currentQuestionIndex}`);
      return null;
    }
    
    return questions[currentQuestionIndex];
  };

  const validateQuestion = () => {
    const question = getCurrentQuestion();
  
    switch (question.type) {
      case "checkbox": {
        if (!answers[question.name] || answers[question.name].length === 0) {
          return false; 
        }
  
        if (answers[question.name].includes("Other")) {
          const otherInputName = `${question.name}_other`;
          if (!answers[otherInputName] || answers[otherInputName] === "") {
            console.log("Validation Failed: Other is checked, but input field is empty.");
            return false;
          }
        }
  
        return true;
      }
      case "checkbox_with_select":
        break;
  
      case "radio": {
        if (answers[question.name] === undefined) {
          return false;
        }
  
        if (answers[question.name] === "Yes" && (
          question.name === "do_you_use_sleeping_aids" ||
          question.name === "problems_limiting_exercise" ||
          question.name === "sore_after_exercise"
        )) {
          const inputFieldName = `${question.name}_other`;
          if (!answers[inputFieldName] || answers[inputFieldName] === "") {
            console.log(`Validation Failed: ${question.name} is Yes, but input field is empty.`);
            return false;
          }
        }
  
        return true;
      }
  
      case "long_radio": {
        if (answers[question.name] === undefined) {
          return false; 
        }
  
        if (answers[question.name] === "Yes") {
          if (!question.subQuestions) return true; 
  
          for (const subQuestion of question.subQuestions) {
            if (answers[subQuestion.name] === undefined || answers[subQuestion.name] === "") {
              console.log(
                `Validation Failed: Sub-question ${subQuestion.name} is not answered.`
              );
              return false; 
            }
          }
        }
  
        return true; 
      }
  
      case "long_textarea":
        return (
          answers[question.name] !== undefined && answers[question.name] !== ""
        );
  
      default:
        return true;
    }
  };
  
  
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const handleSave = () => {
    if (!getCurrentQuestion()) {
      message.error("Cannot save: Question data is not properly loaded. Please refresh the page.");
      return;
    }
    
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    
    try {
      localStorage.setItem("currentQuestionIndex5", currentQuestionIndex.toString());
      localStorage.setItem("answers", JSON.stringify(answers));
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      
      message.success("Progress saved successfully!");
    } catch (error) {
      console.error("Error saving progress:", error);
      message.error("Failed to save progress. Please try again.");
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
    if (!getCurrentQuestion()) {
      message.error("Cannot submit: Question data is not properly loaded. Please refresh the page.");
      return;
    }
    
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }
    
    // Map form data to API structure
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj?.token || "";
      
      if (!token) {
        message.error("Authentication failed. Please log in again.");
        return;
      }
      
      const mappedData = {
        excessStress: answers.do_you_feel_stress === "Yes",
        easyToHandleStress: answers.can_you_handle_stress === "Yes",
        stressFromWork: answers.health_stress_work || 0,
        stressFromFamily: answers.health_stress_family || 0,
        stressFromSocial: answers.health_stress_social || 0,
        stressFromFinances: answers.health_stress_financies || 0,
        stressFromHealth: answers.health_stress_health || 0,
        stressFromOther: answers.health_stress_other || 0,
        relaxationTechniques: answers.relaxation_techniques === "Yes",
        oftenRelaxationTechniques: answers.how_often_reaxation || "N/A",
        typeRelaxationTechniques: answers.special_nutritional_program?.join(", ") || "N/A",
        soughtCounselling: answers.have_you_sought_counselling === "Yes",
        currentlyInTherapy: answers.current_therapy === "Yes",
        describeTherapy: answers.where_and_where_received_medical_care || "N/A",
        abused: answers.been_abused === "Yes",
        hobbiesLeisure: "N/A", 
        maritalStatus: answers.marital_status || "N/A",
        whoDoYouLiveWith: answers.who_do_you_live_with || "N/A",
        currentOccupation: answers.current_occupation?.trim() || "N/A",
        previousOccupation: answers.previous_occupation?.trim() || "N/A",
        emotionalSupport: answers.resourcces_for_emotional_support || [],
        religiousPractice: answers.spiritual_practice === "Yes",
        typeReligiousPractice:answers.spiritual_practice_desciption || "N/A",
      };
  
      // Send data to API
      fetch("https://myfertilitydevapi-prod.azurewebsites.net/api/Patient/AddStress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
          Authorization: `${token}`,
        },
        body: JSON.stringify(mappedData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to submit the form: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(() => {
          message.success("Form submitted successfully!");
          dispatch(completeCard("/questionnaire/5"));
          localStorage.setItem("currentQuestionIndex5", "0");
          localStorage.setItem("answers", JSON.stringify(answers));
          navigate("/assessment");
        })
        .catch((error) => {
          console.error("Error:", error);
          message.error("Failed to submit the form. Please try again.");
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit the form. Please try again.");
    }
  };
  
  const renderSubQuestions = (subQuestions) => {
    if (!subQuestions || !Array.isArray(subQuestions) || subQuestions.length === 0) {
      console.warn('No valid subQuestions provided:', subQuestions);
      return null;
    }
    
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p>{subQuestion.type !== "text" && subQuestion.question}</p>
        {subQuestion.type === "text" && (
         <Form.Item
         name={subQuestion.name}
         rules={[
           { required: true, message: "This field is required." },
         ]}
       >
         <Input
           placeholder={subQuestion.question || ""}
           value={answers[subQuestion.name] || ""}
           onChange={(e) => handleChange(e.target.value, subQuestion.name)}
           className="input_questtionnaire"
         />
       </Form.Item>
       
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
            {(subQuestion.options || []).map((option, idx) => (
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
    if (!question || !question.type) {
      console.error('Invalid question or question type:', question);
      return null;
    }
    
    switch (question.type) {
      case "radio":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {(question.options || []).map((option, index) => (
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
            {(question.options || []).map((option, index) => (
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
              {question.sub || ""}
            </Button>
            <br />
            <Select
              className="select_questtionnaire"
              name={question.name}
              value={answers[question.name] || ""}
              onChange={(value) => handleChange(value, question.name)}
              style={{ marginTop: "10px", width: "100%" }}
            >
              {(question.selectOptions || []).map((option, index) => (
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
            {(question.options || []).map((option, index) => (
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
              {(question.options || []).map((option, index) => (
                <Radio
                  key={index}
                  value={option}
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  {option}
                </Radio>
              ))}
            </Radio.Group>
            {answers[question.name] === "Yes" && question.subQuestions &&
              renderSubQuestions(question.subQuestions)}
          </div>
        );

      default:
        console.warn('Unknown question type:', question.type);
        return null;
    }
  };

  const progressColor =
    currentQuestionIndex === totalQuestions - 1 ? "#01ACEE" : "#C2E6F8";
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        
        {!isQuestionsLoaded ? (
          <div style={{ margin: "40px 0", textAlign: "center" }}>
            <h3>Loading questions...</h3>
            <p>If questions don't appear, please try refreshing the page.</p>
            {questionLoadError && (
              <p style={{ color: "red" }}>Error: {questionLoadError}</p>
            )}
          </div>
        ) : (
          <>
            <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>   
              {label}
              {getCurrentQuestion()?.title || "Stress"}
            </h3>

            {getCurrentQuestion() ? (
              <>
                <h3 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
                  {getCurrentQuestion().question || ""}
                  {getCurrentQuestion().sub && (
                    <i style={{ color: "#335CAD", fontWeight: "bold" }}>
                      {" "}
                      {getCurrentQuestion().sub}
                    </i>
                  )}
                </h3>
                {renderInput(getCurrentQuestion())}
              </>
            ) : (
              <div style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
                No question available. This could be due to an error loading the questions.
                Please try refreshing the page or contact support if the issue persists.
              </div>
            )}
          </>
        )}

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
