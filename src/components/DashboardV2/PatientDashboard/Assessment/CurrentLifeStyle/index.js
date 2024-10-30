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
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "./styles.css";
import { useMediaQuery } from "react-responsive";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

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
    question: "",
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
    name: "cardio/aerobic",
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
        options: Array.from({ length: 60 }, (_, i) => 1 + i),
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
        options: Array.from({ length: 60 }, (_, i) => 1 + i),
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
        options: Array.from({ length: 60 }, (_, i) => 1 + i),
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
        options: Array.from({ length: 60 }, (_, i) => 1 + i),
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
        options: Array.from({ length: 48 }, (_, i) => 1 + i),
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
        options: Array.from({ length: 48 }, (_, i) => 1 + i),
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

  const totalQuestions = questions.length;

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex2"),
      10,
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    const savedConcern = JSON.parse(localStorage.getItem("currentConcern"));
    const savedAllergies = JSON.parse(localStorage.getItem("currentAllergies"));

    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
    }
    if (savedConcern) {
      setCurrentConcern(savedConcern);
    }
    if (savedAllergies) {
      setCurrentAllergies(savedAllergies);
    }
  }, []);

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];

    // Skip validation for these question types
    if (question.name === "health_concerns" || question.name === "allergies") {
      return true;
    }

    // Validate for all other question types
    return (
      answers[question.name] !== undefined && answers[question.name] !== ""
    );
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

    localStorage.setItem("currentQuestionIndex2", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("currentAllergies", JSON.stringify(currentAllergies));
    localStorage.setItem("currentConcern", JSON.stringify(currentConcern));

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
          <Input
            value={tempConcern.problem || ""}
            onChange={(e) => handleChangeTempConcern("problem", e.target.value)}
            placeholder="Describe Problem"
            style={{
              width: "100%",
              borderColor: tempConcern.problem ? undefined : "red",
            }}
            required
          />
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
          <Select
            value={tempConcern.severity || ""}
            onChange={(value) => handleChangeTempConcern("severity", value)}
            placeholder="Select Severity"
            style={{
              width: "100%",
              height: 40,
              borderColor: tempConcern.severity ? undefined : "red",
            }}
            required
          >
            <Option value="Mild">Mild</Option>
            <Option value="Moderate">Moderate</Option>
            <Option value="Severe">Severe</Option>
          </Select>
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
          <Input
            value={tempConcern.priorTreatment || ""}
            onChange={(e) =>
              handleChangeTempConcern("priorTreatment", e.target.value)
            }
            placeholder="Prior Treatment"
            data-label="Prior Treatment"
            style={{ width: "100%", borderColor: text ? undefined : "red" }}
            required
          />
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
          <Select
            value={tempConcern.success || ""}
            onChange={(value) => handleChangeTempConcern("success", value)}
            placeholder="Select Success"
            data-label="Success"
            style={{
              width: "100%",
              height: 40,
              borderColor: text ? undefined : "red",
            }}
            required
          >
            <Option value="Good">Good</Option>
            <Option value="Excellent">Excellent</Option>
            <Option value="Fair">Fair</Option>
          </Select>
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
      dataIndex: "supplement_name",
      editable: true,
      render: (text, record) =>
        editingAllergies === record.key ? (
          <Input
            value={tempAllergy.supplement_name || text}
            onChange={(e) =>
              handleChangeAllergy("supplement_name", e.target.value)
            }
            placeholder="Enter name"
            required
            style={{
              width: "100%",
              borderColor: tempAllergy.supplement_name ? undefined : "red",
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
    if (tempAllergy.supplement_name === "" && tempAllergy.reaction === "") {
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
    if (!tempAllergy.supplement_name || !tempAllergy.reaction) {
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo.obj.token || "";
    console.log({ currentAllergies });
    const transformedData = {
      ongoingHealth: currentConcern ? currentConcern : [],
      allergies: currentAllergies ? currentAllergies : [],
      sleepHours: parseInt(answers["sleep_hours"], 10) || 0,
      problemSleeping: answers["problems_falling_asleep"] === "Yes",
      stayingAsleep: answers["problems_staying_asleep"] === "Yes",
      insomnia: answers["problems_with_insomnia"] === "Yes",
      doYouSnore: answers["do_you_snore"] === "Yes",
      restedUponAwake: answers["rested_upon_awakening"] === "Yes",
      sleepingAids: {
        yesNo: answers["sleeping_aids_yesNo"] === "Yes",
        describe: answers["sleeping_aids_describe"] || "",
      },
      cardio: {
        type: answers["cardio_type"] || "",
        timesWeek: parseInt(answers["cardio_times_week"], 10) || 0,
        duration: parseInt(answers["cardio_duration"], 10) || 0,
      },
      strenght: {
        type: answers["strenght_type"] || "",
        timesWeek: parseInt(answers["strenght_times_week"], 10) || 0,
        duration: parseInt(answers["strenght_duration"], 10) || 0,
      },
      flexibility: {
        type: answers["flexibility_type"] || "",
        timesWeek: parseInt(answers["flexibility_times_week"], 10) || 0,
        duration: parseInt(answers["flexibility_duration"], 10) || 0,
      },
      balance: {
        type: answers["balance_type"] || "",
        timesWeek: parseInt(answers["balance_times_week"], 10) || 0,
        duration: parseInt(answers["balance_duration"], 10) || 0,
      },
      sport: {
        type: answers["sport_type"] || "",
        timesWeek: parseInt(answers["sport_times_week"], 10) || 0,
        duration: parseInt(answers["sport_duration"], 10) || 0,
      },
      other: {
        type: answers["other_type"] || "",
        timesWeek: parseInt(answers["other_times_week"], 10) || 0,
        duration: parseInt(answers["other_duration"], 10) || 0,
        other: answers["other_other"] || "",
      },
      motivatedToExercise: answers["motivated_to_exercise"] || "",
      problemsThatLimitExercise: {
        yesNo: answers["problems_limit_exercise_yesNo"] === "Yes",
        describe: answers["problems_limit_exercise_describe"] || "",
      },
      soreAfterExercise: {
        yesNo: answers["sore_after_exercise_yesNo"] === "Yes",
        describe: answers["sore_after_exercise_describe"] || "",
      },
    };

    fetch(
      "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddHealthLifestyle",
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
            <p>Type:</p>
            <Input
              value={answers[subQuestion.name] || ""}
              onChange={(e) => handleChange(e.target.value, subQuestion.name)}
              style={{ width: isMobile ? "100%" : "50%" }}
            />
          </>
        )}
        {subQuestion.type === "select" && (
          <>
            <p>{subQuestion.label}</p>
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
            style={{ width: "300px", borderColor: "#bcbcbc" }}
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
                  {option}
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
                  {option}
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
      <Col xs={24} sm={24} md={16} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {questions[currentQuestionIndex].sub}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
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
          style={{ margin: "20px 0", marginTop: isMobile ? 50 : 200,height:40 ,position:'fixed'}}
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

export default CurrentLifeStyle;
