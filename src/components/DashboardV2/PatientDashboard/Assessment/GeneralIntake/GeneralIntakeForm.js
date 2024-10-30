import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  Select,
  message,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import FormWrapper from "../FormWrapper";
import EmergencyContactInput from "./EmergencyContactInput";
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { submitGeneralInformation } from "../../../../redux/AssessmentController";

const { Option } = Select;

const questions = [
  {
    question: "Age?",
    type: "select",
    name: "age",
    options: Array.from({ length: 48 }, (_, i) => 13 + i),
  },
  {
    question: "Genetic Background?",
    type: "radio",
    name: "geneticBackground",
    options: [
      "African American",
      "Native American",
      "Hispanic",
      "Caucasian",
      "Mediterranean",
      "Northern European",
      "Asian",
      "Other",
    ],
  },
  {
    question:
      "When, where and from whom did you last receive medical or health care?",
    type: "text",
    name: "where_and_where_received_medical_care",
  },
  {
    question: "",
    type: "emergency_contact",
    name: "emergency_contact",
  },
  {
    question: "How did you hear about our practice?",
    type: "radio",
    name: "how_did_you_hear",
    options: [
      "Clinic Website",
      "IFM website",
      "Referral from doctor",
      "Referral from friend/family member",
      "Social media",
      "Other",
    ],
  },
  // Add more questions as needed
];

const GeneralIntakeForm = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex"),
      0,
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));

    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
    }
  }, []);

  // useEffect(() => {
  //   // Save state to localStorage
  //   localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  //   localStorage.setItem('answers', JSON.stringify(answers));
  // }, [currentQuestionIndex, answers]);

  const handleExit = () => {
    navigate("/assessment");
  };

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];

    if (question.type === "emergency_contact") {
      const contact = answers[question.name];
      return (
        contact && contact.contact && contact.relationship && contact.phoneHome
      );
    }

    return (
      answers[question.name] !== undefined && answers[question.name] !== ""
    );
  };

  const handleSave = async () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    localStorage.setItem("currentQuestionIndex", 0);
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

  const handleSubmit = async () => {
    const transformedData = {
      geneticBackground: answers["geneticBackground"] || "",
      lastMedicalCare: answers["where_and_where_received_medical_care"] || "",
      emergencyContact: answers["emergency_contact"]?.contact || "",
      emergencyRelationship: answers["emergency_contact"]?.relationship || "",
      emergencyPhoneHome: answers["emergency_contact"]?.phoneHome || "",
      emergencyPhoneCell: answers["emergency_contact"]?.phoneCell || "",
      emergencyPhoneWork: answers["emergency_contact"]?.phoneWork || "",
      howDidHearAbout: answers["how_did_you_hear"] || "",
    };
    try {
      const response = await dispatch(
        submitGeneralInformation(transformedData),
      ).unwrap();
      if (response.data.success) {
      } else {
        message.error("Failed to save data.");
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(completeCard("/questionnaire/1"));
    localStorage.setItem("currentQuestionIndex", 0);
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
      case "text":
        return (
          <Input
            style={{ width: "100%", maxWidth: "300px", borderColor: "#bcbcbc" }}
            name={question.name}
            className="input_questtionnaire"
            value={answers[question.name] || ""}
            required
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            style={{ width: "300px", borderColor: "#bcbcbc" }}
            name={question.name}
            value={answers[question.name] || ""}
            required
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "select":
        return (
          <Select
            className="select_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(value) => handleChange(value, question.name)}
            required
          >
            {question.options.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      case "textarea":
        return (
          <Input.TextArea
            style={{ width: "300px" }}
            name={question.name}
            required
            value={answers[question.name] || ""}
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "radio":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
            required
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
                          style={{
                            marginTop: 10,
                            marginLeft: 50,
                            borderColor: "#00ADEF",
                            width: "30%",
                          }}
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
      case "emergency_contact":
        return (
          <EmergencyContactInput
            value={answers[question.name] || {}}
            onChange={(value) => handleChange(value, question.name)}
          />
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
        <Progress percent={progressPercentage} strokeColor={progressColor} />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          General Information
        </h3>
        <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
          {questions[currentQuestionIndex].name === "emergency_contact" ? (
            questions[currentQuestionIndex].question
          ) : (
            <>
              {label}
              {questions[currentQuestionIndex].question}
            </>
          )}
        </h3>{" "}
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

export default GeneralIntakeForm;
