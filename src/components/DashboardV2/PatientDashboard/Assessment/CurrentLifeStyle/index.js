import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Form,
  Input,
  Select,
  message,
  Table,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "./styles.css";
import { useMediaQuery } from "react-responsive";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import { getHealthLifestylePatient } from "../../../../redux/AssessmentController";

const { Option } = Select;

const questions = [
  {
    question: "Do you have any current and/or ongoing health concerns?",
    type: "radio",
    name: "do_you_have_current_health_concern",
    options: ["Yes", "No"],
  },
  {
    question: "Rank your current health concerns",
    type: "ranking",
    sub: "Curent Health Concerns",
    name: "health_concerns",
  },
  {
    question: "Do you have any allergies?",
    type: "radio",
    name: "do_you_have_any_allergies",
    options: ["Yes", "No"],
  },
  {
    question: "Please list allergies below:",
    type: "allergies",
    sub: "Allergies",
    name: "allergies",
  },
  {
    question: "How many hours of sleep do you get each night on average?",
    type: "select",
    sub: "Lifestyle Review - Sleep",
    name: "sleep_hours",
    options: Array.from({ length: 24 }, (_, i) => 1 + i),
  },
  {
    question: "Do you have problems falling asleep?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "problems_falling_asleep",
    options: ["Yes", "No"],
  },
  {
    question: "Do you have problems staying asleep?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "problems_staying_asleep",
    options: ["Yes", "No"],
  },
  {
    question: "Do you have problems with insomnia?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "problems_with_insomnia",
    options: ["Yes", "No"],
  },
  {
    question: "Do you snore?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "do_you_snore",
    options: ["Yes", "No"],
  },
  {
    question: "Do you feel rested upon awakening?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "do_you_feel_rested",
    options: ["Yes", "No"],
  },
  {
    question: "Do you use sleeping aids?",
    type: "radio",
    sub: "Lifestyle Review - Sleep",
    name: "do_you_use_sleeping_aids",
    options: ["Yes", "No"],
  },
  {
    question: "For your current exercise program, do you do ",
    type: "long_radio",
    postname: "Cardio/Aerobic ?",
    name: "cardio_aerobic",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "cardio_aerobic_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "cardio_aerobic_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "cardio_aerobic_time_duration",
      },
    ],
  },

  {
    question: "For your current exercise program, do you do ",
    type: "long_radio",
    postname: "Strength/ Resistance?",
    name: "sport_participated_in_strength",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "strength_resistance_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "strength_resistance_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "strength_resistance_time_duration",
      },
    ],
  },

  {
    question: "For your current exercise program, do you do",
    type: "long_radio",
    name: "sport_participated_in_flexibility",
    postname: "Flexibility/ Stretching?",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "flexibility_stretching_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "flexibility_stretching_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "flexibility_stretching_time_duration",
      },
    ],
  },

  {
    question: "For your current exercise program, do you do",
    type: "long_radio",
    name: "sport_participated_in_balance",
    postname: " Balance?",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "sport_participated_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "sport_participated_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "sport_participated_time_duration",
      },
    ],
  },

  {
    question: "For your current exercise program, do you do ",
    type: "long_radio",
    postname: "Sports/ Leisure (e.g., golf)?",
    name: "sport_participated_in_leisure",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "sports_leisure_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "sports_leisure_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "sports_leisure_time_duration",
      },
    ],
  },

  {
    question:
      "For your current exercise program, do you do any Other activity?",
    type: "long_radio",
    name: "sport_participated_in_others",
    sub: "Lifestyle Review - Exercise",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "sport_participated_in_describe",
      },
      {
        type: "select",
        label: "Number of Times Per Week",
        options: Array.from({ length: 7 }, (_, i) => 1 + i),
        name: "sport_participated_in_number",
      },
      {
        type: "select",
        label: "Time/Duration (Minutes)",
        options: Array.from({ length: 20 }, (_, i) => (i + 1) * 10),
        name: "sport_participated_in_time_duration",
      },
    ],
  },

  {
    question: "Do you feel motivated to exercise?",
    type: "radio",
    sub: "Lifestyle Review - Exercise",
    name: "motivated_to_exercise",
    options: ["Yes", "A little", "No"],
  },
  {
    question: "Are there any problems that limit exercise?",
    type: "radio",
    sub: "Lifestyle Review - Exercise",
    name: "problems_limiting_exercise",
    options: ["Yes", "No"],
  },
  {
    question: "Do you feel unusually fatigued or sore after exercise?",
    type: "radio",
    sub: "Lifestyle Review - Exercise",
    name: "sore_after_exercise",
    options: ["Yes", "No"],
  },
];

const CurrentLifeStyle = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentConcern, setCurrentConcern] = useState([]);
  const [currentAllergies, setCurrentAllergies] = useState([]);
  const [editingAllergies, setEditingAllergies] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [tempConcern, setTempConcern] = useState({});
  const [tempAllergy, setTempAllergy] = useState({});
  const patientHealthLifeStyleInfo = useSelector((state) => state.intake?.patientHealthLifestyle);
  const totalQuestions = questions.length;

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const mapHealthLifestyleInfoToState = (info) => {
    const normalizeYesNo = (value) => {
      if (value === true || value === "Yes" || value === "true") return "Yes";
      if (value === false || value === "No" || value === "false") return "No";
      return ""; // ← Fix: always return a string
    };
    const answersFromApi = {
      do_you_have_current_health_concern: normalizeYesNo(info.doYouOngoingHealth),
      do_you_have_any_allergies: normalizeYesNo(info.doYouAllergies),
      sleep_hours: info.sleepHours?.toString() || "",
      problems_falling_asleep: normalizeYesNo(info.problemSleeping),
      problems_staying_asleep: normalizeYesNo(info.stayingAsleep),
      problems_with_insomnia: normalizeYesNo(info.insomnia),
      do_you_snore: normalizeYesNo(info.doYouSnore),
      do_you_feel_rested: normalizeYesNo(info.restedUponAwake),
      do_you_use_sleeping_aids: normalizeYesNo(info.sleepingAids?.yesNo),
      do_you_use_sleeping_aids_other: info.sleepingAids?.describe || "",
  
      // Exercise: cardio
      cardio_aerobic: normalizeYesNo(info.cardio?.doYou),
      cardio_aerobic_describe: info.cardio?.type || "",
      cardio_aerobic_number: info.cardio?.timesWeek?.toString() || "",
      cardio_aerobic_time_duration: info.cardio?.duration?.toString() || "",

      sport_participated_in_strength: normalizeYesNo(info.strenght?.doYou),
      strength_resistance_describe: info.strenght?.type || "",
      strength_resistance_number: info.strenght?.timesWeek?.toString() || "",
      strength_resistance_time_duration: info.strenght?.duration?.toString() || "",

      sport_participated_in_flexibility: normalizeYesNo(info.flexibility?.doYou),
      flexibility_stretching_describe: info.flexibility?.type || "",
      flexibility_stretching_number: info.flexibility?.timesWeek?.toString() || "",
      flexibility_stretching_time_duration: info.flexibility?.duration?.toString() || "",
  
      sport_participated_in_balance: normalizeYesNo(info.balance?.doYou),
      sport_participated_describe: info.balance?.type || "",
      sport_participated_number: info.balance?.timesWeek?.toString() || "",
      sport_participated_time_duration: info.balance?.duration?.toString() || "",
  
      sport_participated_in_others: normalizeYesNo(info.other?.doYou),
      sport_participated_in_describe: info.other?.type || "",
      sport_participated_in_number: info.other?.timesWeek?.toString() || "",
      sport_participated_in_time_duration: info.other?.duration?.toString() || "",

      sport_participated_in_leisure: normalizeYesNo(info.sport?.doYou),
      sports_leisure_describe: info.sport?.type || "",
      sports_leisure_number: info.sport?.timesWeek?.toString() || "",
      sports_leisure_time_duration: info.sport?.duration?.toString() || "",
  
      motivated_to_exercise: info.motivatedToExercise || "",
  
      problems_limiting_exercise: normalizeYesNo(info.problemsThatLimitExercise?.yesNo),
      problems_limiting_exercise_other: info.problemsThatLimitExercise?.describe || "",
  
      sore_after_exercise: normalizeYesNo(info.soreAfterExercise?.yesNo),
      sore_after_exercise_other: info.soreAfterExercise?.describe || "",
    };

    return {
      answers: answersFromApi,
      concerns: info.ongoingHealth?.map((item, index) => ({
        key: index.toString(),
        problem: item.problem || "",
        severity: item.severity || "",
        priorTreatment: item.priorTreatment || "",
        success: item.success || "",
      })) || [],
      allergies: info.allergies?.map((item, index) => ({
        key: index.toString(),
        food: item.food || "",
        reaction: item.reaction || "",
      })) || [],
    };
  };

  
  useEffect(() => {
    dispatch(getHealthLifestylePatient());
  }, [dispatch]);
  
  useEffect(() => {
    const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex_LS"), 10);
    const savedAnswers = JSON.parse(localStorage.getItem("answers_LS")); // changed key
    const savedConcern = JSON.parse(localStorage.getItem("currentConcern_LS"));
    const savedAllergies = JSON.parse(localStorage.getItem("currentAllergies_LS"));
  
    const hasApiData = patientHealthLifeStyleInfo && Object.keys(patientHealthLifeStyleInfo).length > 0;
    const mapped = hasApiData ? mapHealthLifestyleInfoToState(patientHealthLifeStyleInfo) : null;
  
    if (!isNaN(savedIndex)) {
      setCurrentQuestionIndex(savedIndex);
    }
  
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      setAnswers(savedAnswers);
    } else if (mapped?.answers) {
      setAnswers(mapped.answers);
      localStorage.setItem("answers_LS", JSON.stringify(mapped.answers));
    }
  
    if (Array.isArray(savedConcern) && savedConcern.length > 0) {
      setCurrentConcern(savedConcern);
    } else if (mapped?.concerns) {
      setCurrentConcern(mapped.concerns);
      localStorage.setItem("currentConcern_LS", JSON.stringify(mapped.concerns));
    }
  
    if (Array.isArray(savedAllergies) && savedAllergies.length > 0) {
      setCurrentAllergies(savedAllergies);
    } else if (mapped?.allergies) {
      setCurrentAllergies(mapped.allergies);
      localStorage.setItem("currentAllergies_LS", JSON.stringify(mapped.allergies));
    }
  }, [patientHealthLifeStyleInfo]);
  
  

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];

    switch (question.type) {
      case "checkbox_with_select":
        break;
        case "radio": {
          const value = answers[question.name];
        
          // Step 1: Require a radio selection always
          if (!value || !question.options.includes(value)) {
            return false;
          }
        
          // Step 2: For specific radios that need extra input when value is "Yes"
          const needsOther = [
            "do_you_use_sleeping_aids",
            "problems_limiting_exercise",
            "sore_after_exercise",
          ];
        
          if (value === "Yes" && needsOther.includes(question.name)) {
            const inputFieldName = `${question.name}_other`;
            if (!answers[inputFieldName] || answers[inputFieldName].trim() === "") {
              return false;
            }
          }
        
          return true;
        }
        

      case "long_radio": {
        if (answers[question.name] === undefined) {
          return false; // Radio button must be selected
        }

        if (answers[question.name] === "Yes") {
          if (!question.subQuestions) return true; // no subquestions, then valid

          for (const subQuestion of question.subQuestions) {
            if (answers[subQuestion.name] === undefined || answers[subQuestion.name] === "") {
              console.log(
                `Validation Failed: Sub-question ${subQuestion.name} is not answered.`
              );
              return false; // A sub-question is not answered
            }
          }
        }

        return true; 
      }

      case "checkbox":
        // (previous logic for checkbox)
        break; // Placeholder: Implement correct validation for this later

      case "long_textarea":
        return (
          answers[question.name] !== undefined && answers[question.name] !== ""
        );
        case "select": {
          const value = answers[question.name];
          if (value === undefined || value === "") {
            return false;
          }
          return true;
        }
        
        case "ranking": {
          // Only validate if the user answered "Yes" to the preceding health concern question
          if (answers["do_you_have_current_health_concern"] === "Yes") {
            if (!currentConcern || currentConcern.length === 0) {
              return false;
            }
        
            // Optional: Ensure each concern has all fields filled before proceeding
            for (const concern of currentConcern) {
              if (
                !concern.problem ||
                !concern.severity ||
                !concern.priorTreatment ||
                !concern.success
              ) {
                message.error("Please complete all fields for each health concern.");
                return false;
              }
            }
          }
        
          return true;
        }

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
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }

    let nextQuestionIndex = currentQuestionIndex;

    if (currentQuestionIndex === 0) {
      if (answers["do_you_have_current_health_concern"] === "Yes") {
        nextQuestionIndex = 1; // Go to the 'Rank your current health concerns' question
      } else {
        nextQuestionIndex = 2; // Skip to the 'Do you have any allergies?' question
      }
    }

    if (currentQuestionIndex === 2) {
      if (answers["do_you_have_any_allergies"] === "Yes") {
        nextQuestionIndex = 3; // Go to the 'Allergies' question
      } else {
        nextQuestionIndex = 4; // Skip to the next section (e.g., 'Lifestyle Review - Sleep')
      }
    }

    localStorage.setItem("currentQuestionIndex_LS", nextQuestionIndex);
    localStorage.setItem("answers_LS", JSON.stringify(answers));
    localStorage.setItem("currentConcern_LS", JSON.stringify(currentConcern));
    localStorage.setItem("currentAllergies_LS", JSON.stringify(currentAllergies));

    // If no specific next question was determined, proceed to the next in sequence
    if (
      nextQuestionIndex === currentQuestionIndex &&
      currentQuestionIndex < totalQuestions - 1
    ) {
      nextQuestionIndex = currentQuestionIndex + 1;
    }

    setCurrentQuestionIndex(nextQuestionIndex);
  };

  const handleExit = () => {
    navigate("/assessment");
  };

  const addConcern = () => {
    const newConcern = {
      key: Date.now().toString(),
      problem: "",
      severity: "",
      priorTreatment: "",
      success: "",
    };

    setCurrentConcern((prev) => [...prev, newConcern]);
    setTempConcern(newConcern);
    setEditingKey(newConcern.key);
  };
  const removeConcern = (key) => {
    setCurrentConcern((prev) => prev.filter((concern) => concern.key !== key));
    if (editingKey === key) setEditingKey("");
  };
  const cancelConcern = () => {
    setCurrentConcern((prev) => {
      if (
        !tempConcern.problem &&
        !tempConcern.severity &&
        !tempConcern.priorTreatment &&
        !tempConcern.success
      ) {
        return prev.filter((concern) => concern.key !== editingKey);
      }
      return prev;
    });
    setEditingKey("");
    setTempConcern({});
  };

  const handleChangeTempConcern = (field, value) => {
    setTempConcern((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    console.log(record.key);
    setEditingKey(record.key);
    setTempConcern({ ...record });
  };

  const save = (key) => {
    const newData = [...currentConcern];
    const index = newData.findIndex((item) => key === item.key);

    if (
      !tempConcern.problem ||
      !tempConcern.severity ||
      !tempConcern.priorTreatment ||
      !tempConcern.success
    ) {
      message.error("All fields are required.");
      return;
    }

    if (index > -1) {
      const updatedConcern = { ...tempConcern };
      delete updatedConcern.isNew;
      newData[index] = tempConcern;

      setCurrentConcern(newData);
      setEditingKey("");
      setTempConcern({});
    }
  };

  const concerncolumns = [
    {
      title: "Describe Problem",
      dataIndex: "problem",
      editable: true,

      render: (text, record) =>
        isEditing(record) ? (
          <>
            <i>Example: Post Nasal Drip</i>
            <Input
              value={tempConcern.problem || ""}
              onChange={(e) => handleChangeTempConcern("problem", e.target.value)}
              placeholder="Describe Problem"
              style={{
                width: "100%",
                borderColor: tempConcern.problem ? undefined : "red",
                marginTop: "14px"
              }}
              required
            />
          </>

        ) : (
          <span data-label="problem">
            {isMobile && (
              <i style={{ fontWeight: "bold" }}>Describe Problem : </i>
            )}
            {text}
          </span>
        ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      editable: true,
      render: (text, record) =>
        isEditing(record) ? (
          <>
            <i>Moderate</i>
            <Select
              value={tempConcern.severity || ""}
              onChange={(value) => handleChangeTempConcern("severity", value)}
              placeholder="Select Severity"
              style={{
                width: "100%",
                height: 40,
                borderColor: tempConcern.severity ? undefined : "red",
                marginTop: "14px"
              }}
              required
            >
              <Option value="Mild">Mild</Option>
              <Option value="Moderate">Moderate</Option>
              <Option value="Severe">Severe</Option>
            </Select>
          </>
        ) : (
          <span data-label="severity">
            {isMobile && <i style={{ fontWeight: "bold" }}>Severity : </i>}
            {text}
          </span>
        ),
    },
    {
      title: "Prior Treatment",
      dataIndex: "priorTreatment",
      editable: true,
      render: (text, record) =>
        isEditing(record) ? (
          <>
            <i>Elimination Diet</i>
            <Input
              value={tempConcern.priorTreatment || ""}
              onChange={(e) =>
                handleChangeTempConcern("priorTreatment", e.target.value)
              }
              placeholder="Prior Treatment"
              data-label="Prior Treatment"
              style={{ width: "100%", borderColor: text ? undefined : "red", marginTop: "14px" }}
              required
            />
          </>
        ) : (
          <span data-label="Prior Treatment">
            {isMobile && (
              <i style={{ fontWeight: "bold" }}>Prior Treatment : </i>
            )}
            {text}
          </span>
        ),
    },
    {
      title: "Success",
      dataIndex: "success",
      editable: true,
      render: (text, record) =>
        isEditing(record) ? (
          <>
            <i>Excellent</i>
            <Select
              value={tempConcern.success || ""}
              onChange={(value) => handleChangeTempConcern("success", value)}
              placeholder="Select Success"
              data-label="Success"
              style={{
                width: "100%",
                height: 40,
                borderColor: text ? undefined : "red",
                marginTop: "14px"
              }}
              required
            >
              <Option value="Good">Good</Option>
              <Option value="Excellent">Excellent</Option>
              <Option value="Fair">Fair</Option>
            </Select>
          </>
        ) : (
          <span data-label="Success">
            {isMobile && (
              <i style={{ fontWeight: "bold" }}>Select Success : </i>
            )}
            {text}
          </span>
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.key)} type="link">
              Save
            </Button>
            <Button onClick={cancelConcern} type="link">
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button onClick={() => edit(record)} type="link">
              <EditTwoTone style={{ marginLeft: -10 }} />
            </Button>
            <Button onClick={() => removeConcern(record.key)} type="link">
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ fontSize: "18px" }}
              />
            </Button>
          </span>
        );
      },
    },
  ];

  const allergyColumns = [
    {
      title: "Name of Medication/Supplement/Food",
      dataIndex: "food", // ✅ updated from "supplement_name"
      editable: true,
      render: (text, record) =>
        editingAllergies === record.key ? (
          <Input
            value={tempAllergy.food || text} // ✅ updated
            onChange={(e) => handleChangeAllergy("food", e.target.value)}
            placeholder="Enter name"
            required
            style={{
              width: "100%",
              borderColor: tempAllergy.food ? undefined : "red", // ✅ updated
            }}
          />
        ) : (
          <span>
            {isMobile && (
              <i style={{ fontWeight: "bold" }}>
                Name of Medication/Supplement/Food:{" "}
              </i>
            )}
            {text}
          </span>
        ),
    },
    {
      title: "Reaction",
      dataIndex: "reaction",
      editable: true,
      render: (text, record) =>
        editingAllergies === record.key ? (
          <Input
            value={tempAllergy.reaction || text}
            onChange={(e) => handleChangeAllergy("reaction", e.target.value)}
            placeholder="Enter reaction"
            required
            style={{
              width: "100%",
              borderColor: tempAllergy.reaction ? undefined : "red",
            }}
          />
        ) : (
          <span>
            {isMobile && <i style={{ fontWeight: "bold" }}>Reaction: </i>}
            {text}
          </span>
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = editingAllergies === record.key;
        return editable ? (
          <span>
            <Button onClick={() => saveAllergy(record.key)} type="link">
              Save
            </Button>
            <Button onClick={() => cancelAllergy()} type="link">
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button onClick={() => editAllergy(record)} type="link">
              <EditTwoTone style={{ marginLeft: -10 }} />
            </Button>
            <Button onClick={() => removeAllergy(record.key)} type="link">
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ fontSize: "18px" }}
              />
            </Button>
          </span>
        );
      },
    },
  ];

  // Allergy Functions
  const addAllergy = () => {
    const newAllergy = {
      key: Date.now().toString(),
      food: "",
      reaction: "",
    };
    setCurrentAllergies((prev) => [...prev, newAllergy]);
    setEditingAllergies(newAllergy.key);
    setTempAllergy(newAllergy);
  };

  const removeAllergy = (key) => {
    setCurrentAllergies((prev) =>
      prev.filter((allergy) => allergy.key !== key),
    );
    if (editingAllergies === key) setEditingAllergies("");
  };

  const editAllergy = (record) => {
    console.log(record.key);
    setTempAllergy({ ...record });
    setEditingAllergies(record.key);
  };

  const cancelAllergy = () => {
    if (tempAllergy.food === "" && tempAllergy.reaction === "") {
      setCurrentAllergies((prev) =>
        prev.filter((allergy) => allergy.key !== editingAllergies),
      );
    }
    setEditingAllergies("");
    setTempAllergy({});
  };

  const handleChangeAllergy = (field, value) => {
    setTempAllergy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveAllergy = (key) => {
    const newData = [...currentAllergies];
    const index = newData.findIndex((item) => key === item.key);

    // Validation: Ensure required fields are filled
    if (!tempAllergy.food || !tempAllergy.reaction) {
      message.error("All fields are required.");
      return;
    }

    if (index > -1) {
      newData[index] = { ...newData[index], ...tempAllergy };
      setCurrentAllergies(newData);
      setEditingAllergies("");
      setTempAllergy({});
    }
  };
  const handlePrevious = () => {
    let previousQuestionIndex = currentQuestionIndex;
    if (currentQuestionIndex === 4) {
      if (answers["do_you_have_any_allergies"] === "No") {
        previousQuestionIndex = 2;
      } else {
        previousQuestionIndex = 3;
      }
    } else if (currentQuestionIndex === 2) {
      if (answers["do_you_have_current_health_concern"] === "No") {
        previousQuestionIndex = 0;
      } else {
        previousQuestionIndex = 1;
      }
    } else {
      previousQuestionIndex -= 1;
    }

    setCurrentQuestionIndex(previousQuestionIndex);
  };

  const handleChange = (value, name, field) => {
    setAnswers((prevAnswers) => {
      if (field) {
        return {
          ...prevAnswers,
          [name]: {
            ...prevAnswers[name],
            [field]: value,
          },
        };
      }
      return {
        ...prevAnswers,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo.obj.token || "";
    const transformedData = {
      restedUponAwake: answers["do_you_feel_rested"] === "Yes",
      doYouAllergies: answers["do_you_have_any_allergies"] === "Yes",
      doYouOngoingHealth: answers["do_you_have_current_health_concern"] === "Yes",
      ongoingHealth: currentConcern ? currentConcern : [],
      allergies: currentAllergies
      ? currentAllergies.map(({ key, food, reaction }) => ({
          food, // ✅ updated key
          reaction,
        }))
      : [],
      sleepHours: parseInt(answers["sleep_hours"], 10) || 0,
      problemSleeping: answers["problems_falling_asleep"] === "Yes",
      stayingAsleep: answers["problems_staying_asleep"] === "Yes",
      insomnia: answers["problems_with_insomnia"] === "Yes",
      doYouSnore: answers["do_you_snore"] === "Yes",
      sleepingAids: {
        yesNo: answers["do_you_use_sleeping_aids"] === "Yes",
        describe: answers["do_you_use_sleeping_aids_other"] || "",
      },
      cardio: {
        doYou: answers["cardio_aerobic"] === "Yes",
        type: answers["cardio_aerobic_describe"] || "",
        timesWeek: parseInt(answers["cardio_aerobic_number"], 10) || 0,
        duration: parseInt(answers["cardio_aerobic_time_duration"], 10) || 0,
      },
      strenght: {
        doYou: answers["sport_participated_in_strength"] === "Yes",
        type: answers["strength_resistance_describe"] || "",
        timesWeek: parseInt(answers["strength_resistance_number"], 10) || 0,
        duration: parseInt(answers["strength_resistance_time_duration"], 10) || 0,
      },
      flexibility: {
        doYou: answers["sport_participated_in_flexibility"] === "Yes",
        type: answers["flexibility_stretching_describe"] || "",
        timesWeek: parseInt(answers["flexibility_stretching_number"], 10) || 0,
        duration: parseInt(answers["flexibility_stretching_time_duration"], 10) || 0,
      },
      balance: {
        doYou: answers["sport_participated_in_balance"] === "Yes",
        type: answers["sport_participated_describe"] || "",
        timesWeek: parseInt(answers["sport_participated_number"], 10) || 0,
        duration: parseInt(answers["sport_participated_time_duration"], 10) || 0,
      },
      sport: {
        doYou: answers["sport_participated_in_leisure"] === "Yes",
        type: answers["sports_leisure_describe"] || "",
        timesWeek: parseInt(answers["sports_leisure_number"], 10) || 0,
        duration: parseInt(answers["sports_leisure_time_duration"], 10) || 0,
      },
      other: {
        doYou: answers["sport_participated_in_others"] === "Yes",
        type: answers["sport_participated_in_describe"] || "",
        timesWeek: parseInt(answers["sport_participated_in_number"], 10) || 0,
        duration: parseInt(answers["sport_participated_in_time_duration"], 10) || 0,
        other: answers["other_other"] || "",
      },
      motivatedToExercise: answers["motivated_to_exercise"] || "",
      problemsThatLimitExercise: {
        yesNo: answers["problems_limiting_exercise"] === "Yes",
        describe: answers["problems_limiting_exercise_other"] || "",
      },
      soreAfterExercise: {
        yesNo: answers["sore_after_exercise"] === "Yes",
        describe: answers["sore_after_exercise_other"] || "",
      },
    };

    fetch(
      "https://myfertilitydevapi-prod.azurewebsites.net/api/Patient/AddHealthLifestyle",
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Transformed Data:", transformedData);
        dispatch(completeCard("/questionnaire/2"));
        localStorage.setItem("currentQuestionIndex2", 0);
        localStorage.setItem("answers", JSON.stringify(answers));
        navigate("/assessment");
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p>{subQuestion.type !== "text" && subQuestion.question}</p>
        {subQuestion.type === "text" && (
          <>
            <p style={{color:"#000"}}>Type:</p>
            <Input
              value={answers[subQuestion.name] || ""}
              onChange={(e) => handleChange(e.target.value, subQuestion.name)}
              style={{ width: isMobile ? "100%" : "50%" }}
            />
          </>
        )}
        {subQuestion.type === "select" && (
          <>
            <p style={{color:"#000"}}>{subQuestion.label}</p>
            <Select
              placeholder="Select an option"
              value={answers[subQuestion.name] || ""}
              onChange={(value) => handleChange(value, subQuestion.name)}
              style={{ width: isMobile ? "100%" : "50%", height: "40px" }}
            >
              {subQuestion.options.map((option, idx) => (
                <Option key={idx} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </>
        )}
      </div>
    ));
  };
  const renderInput = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Input
            style={{ width: "292px", borderColor: "#bcbcbc" }}
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
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
      case "select":
        return (
          <Select
            style={{ width: "292px" }}
            className="select_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(value) => handleChange(value, question.name)}
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
            className="input_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(e) => handleChange(e.target.value, question.name)}
          />
        );
      case "radio":
        return (
          <>
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
              (question.name === "do_you_use_sleeping_aids" ||
                question.name === "problems_limiting_exercise" ||
                question.name === "sore_after_exercise") && (
                <Input
                  className="input_questtionnaire"
                  placeholder="If Yes, Please explain"
                  value={answers[`${question.name}_other`] || ""}
                  onChange={(e) =>
                    handleChange(e.target.value, `${question.name}_other`)
                  }
                  style={{ marginTop: "10px" }}
                />
              )}
          </>
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

      case "ranking":
        return (
          <>
            <Table
              dataSource={currentConcern}
              columns={concerncolumns}
              pagination={false}
              rowKey="key"
              rowClassName="editable-row"
              bordered={false}
              style={{ minWidth: "600px" }}
            />
            <Button
              type="primary"
              onClick={addConcern}
              style={{ background: "#01ACEE", marginTop: 10 }}
            >
              Add Concern
            </Button>
          </>
        );

      case "allergies":
        return (
          <>
            <Table
              dataSource={currentAllergies}
              columns={allergyColumns}
              pagination={false}
              rowKey="key" // Ensure each row has a unique key
              rowClassName="editable-row"
              bordered={false}
              style={{ minWidth: "600px" }}
            />
            <Button
              type="primary"
              onClick={addAllergy}
              style={{ background: "#01ACEE", marginTop: 10 }}
            >
              Create New
            </Button>
          </>
        );

      case "sports":
        return (
          <div style={{ margin: "20px 0" }}>
            <div>
              <p
                style={{
                  fontSize: "15px",
                  color: "#335CAD",
                  fontWeight: "bold",
                }}
              >
                Current Exercise Program:
              </p>
              <p style={{ color: "#000", fontWeight: "bold" }}>Activity</p>
              <Button style={{ background: "#183283", color: "white" }}>
                {question.activity}
              </Button>
            </div>
            <Form layout="vertical">
              <Form.Item label="Type">
                <Input
                  value={answers[question.name]?.type || ""}
                  onChange={(e) =>
                    handleChange(e.target.value, question.name, "type")
                  }
                  className="input_questtionnaire"
                />
              </Form.Item>
              <Form.Item label="Number of times per week">
                <Select
                  value={answers[question.name]?.timesPerWeek || ""}
                  className="select_questtionnaire"
                  onChange={(value) =>
                    handleChange(value, question.name, "timesPerWeek")
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                    <Option key={number} value={number}>
                      {number}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Time Duration (minutes)">
                <Select
                  value={answers[question.name]?.duration || ""}
                  className="select_questtionnaire"
                  onChange={(value) =>
                    handleChange(value, question.name, "duration")
                  }
                >
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((number) => (
                    <Option key={number} value={number}>
                      {number}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
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
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {questions[currentQuestionIndex].sub}
        </h3>

        <h3 style={{ margin: "20px 0", fontWeight: "600", color: "#000", fontSize: "15px" }}>
          {label}
          {questions[currentQuestionIndex].question}{" "}
          {questions[currentQuestionIndex].postname && (
            <span style={{ color: "#335CAD", fontWeight: "bold" }}>
              {` ${questions[currentQuestionIndex].postname}`}
            </span>
          )}
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

export default CurrentLifeStyle;
