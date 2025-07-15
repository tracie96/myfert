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
import { useNavigate } from "react-router-dom";
import FormWrapper from "../FormWrapper";
import EmergencyContactInput from "./EmergencyContactInput";
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { submitGeneralInformation, getGeneralInformationPatient } from "../../../../redux/AssessmentController";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
// import CryptoJS from "crypto-js";

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
      "Middle East",
      "Other",
    ],
  },
  {
    question:
      "When did you last receive medical or health care?",
    type: "date",
    name: "when_received_medical_care",
  },
  {
    question:
      "Where did you last receive medical or health care?",
    type: "text",
    name: "where_received_medical_care",
  },
  {
    question:
      "Whom did you last receive medical or health care?",
    type: "text",
    name: "whom_received_medical_care",
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
];

const GeneralIntakeForm = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dataLoadedFromAPI, setDataLoadedFromAPI] = useState(false);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  // const SECRET_KEY = "default_secret_key";
  const patientGeneralInfo = useSelector((state) => state.intake?.patientGeneralInfo);

  useEffect(() => {
    dispatch(getGeneralInformationPatient());
  }, [dispatch]);

  useEffect(() => {
    if (!dataLoadedFromAPI) {
      const savedAnswers = JSON.parse(localStorage.getItem("answers"));
      const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex"), 10);
  
      if (patientGeneralInfo && Object.keys(patientGeneralInfo).length > 0) {
        const howDidYouHearOptions = questions.find(
          (q) => q.name === "how_did_you_hear"
        )?.options || [];

        const geneticBackgroundOptions = questions.find(
          (q) => q.name === "geneticBackground"
        )?.options || [];
  
        const mappedAnswers = {
          age: patientGeneralInfo.age || "",
          geneticBackground: patientGeneralInfo.geneticBackground || "",
          where_received_medical_care: patientGeneralInfo.whereMedicalCare || "",
          when_received_medical_care: patientGeneralInfo.whenMedicalCare || "",
          whom_received_medical_care: patientGeneralInfo.whomMedicalCare || "",
          emergency_contact: {
            contact: patientGeneralInfo.emergencyContact || "",
            relationship: patientGeneralInfo.emergencyRelationship || "",
            phoneHome: patientGeneralInfo.emergencyPhoneHome || "",
            phoneCell: patientGeneralInfo.emergencyPhoneCell || "",
            phoneType: patientGeneralInfo.emergencyPhoneWork || "",
          },
          how_did_you_hear: patientGeneralInfo.howDidHearAbout || "",
        };
  
        if (
          mappedAnswers.how_did_you_hear &&
          !howDidYouHearOptions.includes(mappedAnswers.how_did_you_hear)
        ) {
          mappedAnswers.how_did_you_hear = "Other";
          mappedAnswers["how_did_you_hear_other"] =
            patientGeneralInfo.howDidHearAbout;
        }

        if (
          mappedAnswers.geneticBackground &&
          !geneticBackgroundOptions.includes(mappedAnswers.geneticBackground)
        ) {
          mappedAnswers["geneticBackground_other"] = mappedAnswers.geneticBackground;
          mappedAnswers.geneticBackground = "Other";
        }

        setAnswers(mappedAnswers);
        setCurrentQuestionIndex(0);
        setDataLoadedFromAPI(true);
      } else if (!patientGeneralInfo && savedAnswers && !isNaN(savedIndex)) {
        setAnswers(savedAnswers);
        setCurrentQuestionIndex(savedIndex);
        setDataLoadedFromAPI(true);
      }
    }
  }, [patientGeneralInfo, dataLoadedFromAPI]);

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
  //   const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex"), 10);
  //   const savedAnswers = JSON.parse(localStorage.getItem("answers"));
  
  //   if (!isNaN(savedIndex) && savedAnswers && !dataLoadedFromAPI) {
  //     setCurrentQuestionIndex(savedIndex);
  //     setAnswers(savedAnswers);
  //   }
  // }, [dataLoadedFromAPI]);

  // useEffect(() => {
  //   // Save state to localStorage
  //   localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  //   localStorage.setItem('answers', JSON.stringify(answers));
  // }, [currentQuestionIndex, answers]);

  const handleExit = () => {
    navigate("/assessment");
  };

  // Old code-
  // ToDo: Remove this commented code if testing goes fine
  // const validateQuestion = () => {
  //   const question = questions[currentQuestionIndex];

  //   if (question.type === "emergency_contact") {
  //     const contact = answers[question.name];
  //     return (
  //       contact && contact.contact && contact.relationship && contact.phoneHome
  //     );
  //   }

    // return (
    //   answers[question.name] !== undefined && answers[question.name] !== ""
    // );
  // };

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];

    if (question.type === "emergency_contact") {
      const contact = answers[question.name];
      return (
        contact && contact.contact && contact.relationship && contact.phoneHome
      );
    }
  
    if (question.type === "radio") {
      if (answers[question.name] === "Other") {
        const otherValue = answers[`${question.name}_other`];
        if (!otherValue || otherValue.trim() === "") {
          return false;
        }
      }
    }
  
    return answers[question.name] !== undefined && answers[question.name] !== "";
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
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === 'radio') {
      // Always remove the _other value when changing selection
      const newAnswers = {
        ...answers,
        [name]: value
      };
      // Delete the _other field entirely instead of setting it to empty string
      delete newAnswers[`${name}_other`];
      setAnswers(newAnswers);
    } else {
      setAnswers({
        ...answers,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before submitting.");
      return;
    }
  
    const transformedData = {
      geneticBackground: answers["geneticBackground"] === "Other" ? answers["geneticBackground_other"] : answers["geneticBackground"] || "",
      whereMedicalCare: answers["where_received_medical_care"] || "",
      whenMedicalCare: answers["when_received_medical_care"] || "",
      whomMedicalCare: answers["whom_received_medical_care"] || "",
      emergencyContact: answers["emergency_contact"]?.contact || "",
      emergencyRelationship: answers["emergency_contact"]?.relationship || "",
      emergencyPhoneHome: answers["emergency_contact"]?.phoneHome || "",
      emergencyPhoneCell: answers["emergency_contact"]?.phoneCell || "",
      emergencyPhoneWork: answers["emergency_contact"]?.phoneType || "",
      howDidHearAbout: answers["how_did_you_hear"] === "Other" ? answers["how_did_you_hear_other"] : answers["how_did_you_hear"] || "",
      age:answers["age"] || "",
    };
  
    const encryptedData = 
      transformedData

      // const encryptedData = CryptoJS.AES.encrypt(
      //   JSON.stringify(transformedData),
      //   SECRET_KEY
      // ).toString();
    
    try {
      const response = await dispatch(
        submitGeneralInformation({ payload: encryptedData }) 
      ).unwrap();
      console.log(response)


      if (response.success) {
        message.success("Data saved successfully.");
      } else {
        message.error("Failed to save data.");
      }
    } 
    catch (error) {
      console.log("did i get")
      console.log(error);
      message.error("An error occurred while submitting the data.");
    }
  
    dispatch(completeCard("/questionnaire/1"));
    localStorage.setItem("currentQuestionIndex", "0");
 
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
            style={{ width: "100%", maxWidth: isMobile?"100%":"300px", borderColor: "#bcbcbc" }}
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
            style={{ width: "292px", borderColor: "#bcbcbc" }}
            name={question.name}
            value={answers[question.name] || ""}
            required
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "select":
        return (
          <Select
          style={{ width: "292px" }}
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
                    <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
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
                <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>

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
    const percentProgressBar = Math.round(100/totalQuestions);

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress percent={Math.round(progressPercentage)- percentProgressBar} strokeColor={progressColor}  style={{ width: '100%' }}/>
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          General Information
        </h3>
        <h3 style={{ margin: "20px 0", fontWeight:"600", color: "#000", fontSize: "15px" }}>
          {questions[currentQuestionIndex].name === "emergency_contact" ? (
            questions[currentQuestionIndex].question
          ) : (
            <>
              {label}
              {questions[currentQuestionIndex].question}
            </>
          )}
        </h3>{" "}
        {dataLoadedFromAPI && renderInput(questions[currentQuestionIndex])}
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

export default GeneralIntakeForm;
