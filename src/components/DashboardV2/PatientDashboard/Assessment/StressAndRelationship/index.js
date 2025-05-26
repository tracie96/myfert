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
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import { getStressPatient } from "../../../../redux/AssessmentController"; // Import the action
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

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
    subQuestions: [
      {
        type: "long_textarea",
        name: "health_stress_other_input",
      },
    ],
    
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
        name: "how_often_relaxation",
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
      "What are your hobbies and leisure activities?",
    type: "long_textarea",
    name: "hobbies_and_leisure_activities",
  },
  {
    question: "Marital Status",
    type: "checkbox",
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
        name: "duration_per_cycle_pelvic_pain",
      },
     
      {
        question: "Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe","None"],
        name: "duration_per_cycle_severity_pelvic_pain",
      },
    ],
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
  // {
  //   question: "Based on your current occupation:",
  //   type: "occupation_schedule",
  //   name: "occupation_schedule",
  //   subQuestions: [
  //     {
  //       question: "Weekly schedule",
  //       type: "inputNumber",
  //       name: "occupation_weekly_hours",
  //       suffix: "hours"
  //     },
  //     {
  //       question: "Type",
  //       type: "radio",
  //       name: "occupation_type",
  //       options: [
  //         "Daytime",
  //         "Evening",
  //         "Nighttime",
  //         "Rotating Shift",
  //         "On-call"
  //       ]
  //     }
  //   ]
  // },
];

const StressAndRelationship = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false);
  const [questionLoadError, setQuestionLoadError] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true); // Add loading state for prefetch
  
  const totalQuestions = questions?.length || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Get stress data from Redux store
  const { patientStressInfo } = useSelector((state) => state.intake);

  const subQuestions_question = [
    { name: 'days light bleeding' },
    { name: 'days moderate bleeding' },
    { name: 'days heavy bleeding' },
    { name: 'days very heavy bleeding' }
  ];

  // Function to map API response to form format
  const mapApiToFormData = (apiData) => {
    if (!apiData) return {};
    const normalizeYesNo = (value) => {
      if (value === true) return "Yes";
      if (value === false) return "No";
      return null;
    };
    const formData = {
      // Map boolean values back to "Yes"/"No"
      do_you_feel_stress: normalizeYesNo(apiData.excessStress),
      can_you_handle_stress: normalizeYesNo(apiData.easyToHandleStress),
      
      // Map stress ratings
      health_stress_work: apiData.stressFromWork || 0,
      health_stress_family: apiData.stressFromFamily || 0,
      health_stress_social: apiData.stressFromSocial || 0,
      health_stress_financies: apiData.stressFromFinances || 0,
      health_stress_health: apiData.stressFromHealth || 0,
      health_stress_other: apiData.stressFromOther || 0,
      health_stress_other_input: apiData.stressFromOtherName || "",
      
      // Map relaxation techniques
      relaxation_techniques: normalizeYesNo(apiData.relaxationTechniques),
      how_often_relaxation: apiData.oftenRelaxationTechniques !== "N/A" ? apiData.oftenRelaxationTechniques : "",
      
      // Map technique types (convert string back to array)
      special_nutritional_program: apiData.typeRelaxationTechniques && apiData.typeRelaxationTechniques !== "N/A" 
        ? apiData.typeRelaxationTechniques.split(", ") 
        : [],
      
      // Map counseling and therapy
      have_you_sought_counselling: normalizeYesNo(apiData.soughtCounselling),
      current_therapy: normalizeYesNo(apiData.currentlyInTherapy),
      therapy_description: apiData.describeTherapy !== "N/A" ? apiData.describeTherapy : "",
      
      // Map abuse question
      been_abused: normalizeYesNo(apiData.abused),
      
      // Map hobbies (this field seems to be missing in the API mapping, using a default)
      hobbies_and_leisure_activities: apiData.hobbiesLeisure !== "N/A" ? apiData.hobbiesLeisure : "",
      
      // Map relationship info
      marital_status: Array.isArray(apiData.maritalStatus) ? apiData.maritalStatus : (apiData.maritalStatus !== "N/A" ? [apiData.maritalStatus] : []),
      who_do_you_live_with: apiData.whoDoYouLiveWith !== "N/A" ? apiData.whoDoYouLiveWith : "",
      current_occupation: apiData.currentOccupation !== "N/A" ? apiData.currentOccupation : "",
      previous_occupation: apiData.previousOccupation !== "N/A" ? apiData.previousOccupation : "",
      
      // Map emotional support
      resourcces_for_emotional_support: Array.isArray(apiData.emotionalSupport) ? apiData.emotionalSupport : [],
      
      // Map spiritual practice
      spiritual_practice: normalizeYesNo(apiData.religiousPractice),
      spiritual_practice_desciption: apiData.typeReligiousPractice !== "N/A" ? apiData.typeReligiousPractice : "",
    };

    return formData;
  };

  // Fetch stress data on component mount
  useEffect(() => {
    const fetchStressData = async () => {
      try {
        await dispatch(getStressPatient());
      } catch (error) {
        console.error("Error fetching stress data:", error);
      }
    };
    fetchStressData();
  }, [dispatch]);

  // Map API data to form format when patientStressInfo changes
  useEffect(() => {
    if (patientStressInfo && Object.keys(patientStressInfo).length > 0) {
      const formData = mapApiToFormData(patientStressInfo);
      setAnswers(formData);
    }
    setIsDataLoading(false);
  }, [patientStressInfo]);

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

    // Load saved data from localStorage only if no prefetched data
    if (!isDataLoading && Object.keys(answers).length === 0) {
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
    }
  }, [totalQuestions, isDataLoading, answers]);

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
        const value = answers[question.name];
      
        // Check if a value was selected
        if (value === undefined || value === null || value === "") {
          console.log(`Validation failed: '${question.name}' radio question not answered.`);
          return false;
        }
      
        // If "Yes" is selected, and this radio has a corresponding input field, validate it
        const requiresFollowUp = [
          "do_you_use_sleeping_aids",
          "problems_limiting_exercise",
          "sore_after_exercise"
        ];
      
        if (value === "Yes" && requiresFollowUp.includes(question.name)) {
          const inputFieldName = `${question.name}_other`;
          if (!answers[inputFieldName] || answers[inputFieldName].trim() === "") {
            return false;
          }
        }
      
        return true;
      }
      
      case "rating_scale": {
        const value = answers[question.name];
        if (value === undefined || value === null || value === 0) {
          return false;
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
        stressFromOtherName: answers.health_stress_other_input || "",
        relaxationTechniques: answers.relaxation_techniques === "Yes",
        oftenRelaxationTechniques: answers.how_often_relaxation || "N/A",
        typeRelaxationTechniques: answers.special_nutritional_program?.join(", ") || "N/A",
        soughtCounselling: answers.have_you_sought_counselling === "Yes",
        currentlyInTherapy: answers.current_therapy === "Yes",
        describeTherapy: answers.therapy_description || "N/A", // Fixed mapping
        abused: answers.been_abused === "Yes",
        hobbiesLeisure: answers.hobbies_and_leisure_activities || "N/A", // Fixed mapping
        maritalStatus: Array.isArray(answers.marital_status) ? answers.marital_status.join(", ") : (answers.marital_status || "N/A"),
        whoDoYouLiveWith: answers.who_do_you_live_with || "N/A",
        currentOccupation: answers.current_occupation?.trim() || "N/A",
        previousOccupation: answers.previous_occupation?.trim() || "N/A",
        emotionalSupport: answers.resourcces_for_emotional_support || [],
        religiousPractice: answers.spiritual_practice === "Yes",
        typeReligiousPractice: answers.spiritual_practice_desciption || "N/A",
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
          localStorage.setItem("answers", JSON.stringify({})); // Clear localStorage after successful submission
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
        <p style={{ fontWeight: "bold" }}>{subQuestion.question}</p>
        { subQuestion.type === "number_with_radio_sub" && subQuestion.name === "menstrual_bleeding_sub" && (
          <>
            <div>
              {subQuestions_question && subQuestions_question.map((subQuestion, index) => {
                const nameSubQuestion = subQuestion.name.replace(/ /g, '_');
                return(
                <div key={nameSubQuestion || index} className="question-container">
                  <InputNumber
                    name={nameSubQuestion}
                    value={answers[nameSubQuestion] || undefined}
                    min={ 0 }
                    onChange={(value) => handleChange(value, nameSubQuestion)}
                    className="input_questionnaire"
                  />
                  <span className="question-text">
                    {" "+subQuestion.name || 'Default Name'} 
                  </span>
                  <div style={{ marginBottom: '10px' }}></div>
                </div>
                )})}
            </div>
          </>
        )}
        { subQuestion.type === "number_with_radio_sub" && subQuestion.name !== "menstrual_bleeding_sub" && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputNumber
              name={subQuestion.name}
              value={answers[subQuestion.name] || 0}
              onChange={(value) => handleChange(value, subQuestion.name)}
              className="input_questtionnaire"
              style={{ marginRight: 8 }}
            />
            <span>{subQuestion.suffix || ""}</span>
          </div>
        )}
        {subQuestion.type === "text" && (
          <Input
            className="input_questtionnaire"
            name={subQuestion.name}
            value={answers[subQuestion.name] || ""}
            onChange={(e) => handleChange(e.target.value, subQuestion.name)}
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
              <p style={{color:"#000"}}>{question.sub_question}</p>
              {renderSubQuestions(question.subQuestions)}
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
          <div style={{ padding: "0 10px", marginBottom: "30px" }}>
            {/* Slider Section */}
            <div style={{ marginTop: "10px", marginBottom: "20px" }}>
              <Slider
                min={0}
                max={10}
                marks={{
                  0: "0",
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
                value={answers[question.name] || 0}
                onChange={(value) => handleChange(value, question.name)}
                style={{ width: isMobile ? "100%" : "50%" }}
              />
            </div>

            {/* Subquestions: long_textarea */}
            {question.subQuestions &&
              question.subQuestions.length > 0 &&
              question.subQuestions.map((subQuestion, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginTop: "5%",
                      color: "#000",
                    }}
                  >
                    {subQuestion.question}
                  </label>
                  {subQuestion.type === "long_textarea" && (
                    <Input.TextArea
                      className="input_questtionnaire"
                      name={subQuestion.name}
                      value={answers[subQuestion.name] || ""}
                      onChange={(e) => handleChange(e.target.value, subQuestion.name)}
                      rows={5}
                      style={{
                        width: isMobile ? "100%" : "40%",
                        resize: "vertical",
                        minHeight: "100px",
                        borderColor: "#00ADEF",
                      }}
                    />
                  )}
                </div>
              ))}
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
      case "occupation_schedule":
        return (
          <div>
            {question.subQuestions.map((subQ, idx) => {
              if (subQ.type === "inputNumber") {
                return (
                  <div key={subQ.name} style={{ marginBottom: 16 }}>
                    <label>
                      <span style={{ color: "red" }}>* </span>
                      {subQ.question}
                    </label>
                    <InputNumber
                      min={0}
                      value={answers[subQ.name] || undefined}
                      onChange={(value) => handleChange(value, subQ.name)}
                      style={{ marginLeft: 8, marginRight: 8 }}
                    />
                    {subQ.suffix}
                  </div>
                );
              }
              if (subQ.type === "radio") {
                return (
                  <div key={subQ.name} style={{ marginBottom: 16 }}>
                    <label>
                      <span style={{ color: "red" }}>* </span>
                      {subQ.question}
                    </label>
                    <Radio.Group
                      value={answers[subQ.name]}
                      onChange={(e) => handleChange(e.target.value, subQ.name)}
                      style={{ display: "block", marginTop: 8 }}
                    >
                      {subQ.options.map((option, i) => (
                        <Radio key={i} value={option} style={{ display: "block" }}>
                          {option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>
                );
              }
              return null;
            })}
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

  // Show loading state while fetching data
  // if (isDataLoading || loading) {
  //   return (
  //     <Row gutter={16} style={{ padding: "0 5%" }}>
  //       <Col xs={24} sm={24} md={24} lg={24} xl={24}>
  //         <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
  //         <div style={{ margin: "40px 0", textAlign: "center" }}>
  //           <h3>Loading existing data...</h3>
  //           <p>Please wait while we fetch your previously saved information.</p>
  //         </div>
  //       </Col>
  //     </Row>
  //   );
  // }

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
            
              {getCurrentQuestion()?.title || "Stress"}
            </h3>

            {getCurrentQuestion() ? (
              <>
                <h3 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
                {label}
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
