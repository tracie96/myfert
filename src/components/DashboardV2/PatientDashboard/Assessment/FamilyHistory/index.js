import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  Select,
  InputNumber,
  message,
  Checkbox,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";

const { Option } = Select;

const questions = [
  {
    question: "(Check box and provide number if applicable)",
    title: "Obstetric History",
    type: "checkbox_with_select",
    options: [
      {
        label: "Pregnancies",
        name: "pregnancies",
        selectName: "pregnancies",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Miscarriages",
        name: "miscarriages",
        selectName: "miscarriages",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Abortions",
        name: "Root_canals",
        selectName: "Root_canals",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Living children",
        name: "living_children",
        selectName: "living_children",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Vaginal deliveries",
        name: "vaginal_deliveries",
        selectName: "vaginal_deliveries",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Caeseran",
        name: "caeseran",
        selectName: "caeseran",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Term births",
        name: "term_births",
        selectName: "term_births",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Premature birth",
        name: "premature_birth",
        selectName: "premature_birth",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
    ],
  },
  {
    question: "(Check box and provide number if applicable)",
    type: "unit_toggle",
    name: "weight_unit",
    title: "Obstetric History",
    options: ["Metric", "Imperial"],
    subQuestions: [
      {
        question: "Birth weight of smallest baby",
        type: "checkbox_with_number",
        name: "smallest_baby_weight",
        unit: "kg",
      },
      {
        question: "Birth weight of largest baby",
        type: "checkbox_with_number",
        name: "largest_baby_weight",
        unit: "kg",
      },
    ],
  },
  {
    question:
      "Did you develop any problems in or after pregnancy, for example, toxemia (high blood pressure), diabetes, post-partum depression, issues with breast feeding, etc.?",
    type: "long_radio",
    title: "Obstetric History",
    name: "pregnancy_problems",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please explain",
        type: "text",
        name: "pregnancy_problems_sub",
      },
    ],
  },

  {
    question: "Age at first period",
    title: "Menstrual History",
    type: "select",
    name: "age_of_period",
    options: Array.from({ length: 30 }, (_, i) => 0 + i),
  },
  {
    question: "Date of last menstrual period",
    type: "date",
    title: "Menstrual History",
    name: "date_of_last_period",
  },
  {
    question: "Length of cycle",
    type: "select",
    title: "Menstrual History",
    name: "length_of_cycle",
    options: Array.from({ length: 30 }, (_, i) => 0 + i),
  },
  {
    question: "Times between cycles",
    type: "select",
    title: "Menstrual History",
    name: "times_between_of_cycle",
    options: Array.from({ length: 30 }, (_, i) => 0 + i),
  },

  {
    question: "Cramping?",
    type: "radio",
    title: "Menstrual History",
    name: "cramping",
    options: ["Yes", "No"],
  },

  {
    question: "Pain?",
    type: "radio",
    title: "Menstrual History",
    name: "pain",
    options: ["Yes", "No"],
  },
  {
    question:
      "Have you ever had premenstrual problems (bloating, breast tenderness, irritability, etc.)?",
    type: "long_radio",
    name: "premenstrual_problems",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question:
      "Do you have other problems with your periods (heavy, irregular, spotting, skipping, etc.)?",
    type: "long_radio",
    name: "other_premenstrual_problems",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Please describe",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },

  {
    question: "Use of hormonal birth control:",
    type: "long_radio",
    title: "Menstrual History",
    name: "hormonal_birthcontrol",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: How Often",
        type: "text",
        name: "how_often_reaxation",
      },
      {
        question: "How long?",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "Any problems with hormonal birth control?",
    type: "long_radio",
    name: "other_hormonal_problems",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: explain",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "Use of other contraception?",
    type: "long_radio",
    name: "use_of_contraception",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes:",
        type: "radio",
        name: "use_of_contraception",
        options: ["Condoms", "Diaphgram", "IUD", "Partner Vasectomy"],
      },
    ],
  },
  {
    question: "Are you in menopause?",
    type: "long_radio",
    name: "is_menopause",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: age at last period",
        type: "select",
        name: "age_at_last_period",
        options: Array.from({ length: 50 }, (_, i) => 0 + i),
      },
    ],
  },
  {
    question: "Was it surgical menopause?",
    type: "long_radio",
    name: "surgical_menopause",
    title: "Menstrual History",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: explain surgery",
        type: "text",
        name: "surgical_menopause",
      },
    ],
  },
  {
    question:
      "Do you currently have symptomatic problems with menopause? (Check all that apply)",
    type: "checkbox",
    title: "Menstrual History",

    name: "symptomatic_problems_menopause",
    options: [
      "Hot flashes",
      "Mood swings",
      "Concentation/ memory problems",
      "Headaches",
      "Joint pain",
      "Vaginal dryness",
      "Weight gain",
      "Decreased libido",
      "Loss of control of urine",
      "Palpitations",
    ],
  },

  {
    question: "Are you on hormone replacement therapy?",
    type: "long_radio",
    name: "hormone_replacement_therapy",
    title: "Menstrual History",

    options: ["Yes", "No"],
    subQuestions: [
      {
        question:
          "If yes, for how long and for what reason (hot flashes, osteoporosis prevention, etc.)?",
        type: "text",
        name: "hormone_replacement_therapy_sub",
      },
    ],
  },
  {
    question: "(Check if applicable)",
    type: "checkbox",
    title: "Other Gynecological Symptoms",
    name: "symptomatic_problems_menopause",
    options: [
      "Endometriosis",
      "Infertility",
      "Infertility",
      "Vaginal infection",
      "Fibroids",
      "Ovarian cysts",
      "Ovarian cysts",
      "Sexually transmitted disease (describe)",
    ],
  },
  {
    type: "date_radio",
    name: "lastPapTest",
    question: "If applicable, provide date",
    buttonText: "Last Pap Test",
    dateName: "papTestDate",
    title: "Gynecological Screening/Procedures",
    radioName: "papTestResult",
    radioOptions: [
      { label: "Normal", value: "normal" },
      { label: "Abnormal", value: "abnormal" },
    ],
  },
  {
    type: "date_radio",
    name: "lastPapTest",
    question: "If applicable, provide date",
    buttonText: "Last Mammogram",
    dateName: "papTestDate",
    title: "Gynecological Screening/Procedures",
    radioName: "last_mammogram",
    radioOptions: [
      { label: "Normal", value: "normal" },
      { label: "Abnormal", value: "abnormal" },
    ],
  },
  {
    type: "date_radio",
    name: "lastPapTest",
    question: "If applicable, provide date",
    buttonText: "Last bone density",
    dateName: "papTestDate",
    title: "Gynecological Screening/Procedures",
    radioName: "last_bone_density",
    radioOptions: [
      { label: "Normal", value: "normal" },
      { label: "Abnormal", value: "abnormal" },
    ],
  },
  {
    question: "Other tests/procedures (list type and dates):",
    type: "long_textarea",
    sub: "other_test_procedures",
    name: "other_test_procedures",
  },
];

const PersonalAndFamilyHistory = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unit, setUnit] = useState("Metric");
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex7"),
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
    localStorage.setItem("currentQuestionIndex7", 0);
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
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(completeCard("/questionnaire/7"));
    localStorage.setItem("currentQuestionIndex7", 0);
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

  const handleSelectCheckChange = (
    checked,
    name,
    inputName = null,
    options = [],
  ) => {
    const newAnswers = { ...answers };

    if (inputName) {
      newAnswers[inputName] = checked ? answers[inputName] : "";
    }

    if (checked) {
      // Uncheck all other checkboxes in the group
      options.forEach((option) => {
        if (option.name !== name) {
          newAnswers[option.name] = false;
          if (option.inputName) {
            newAnswers[option.inputName] = "";
          }
        }
      });
    }

    newAnswers[name] = checked;

    setAnswers(newAnswers);
  };

  const renderInput = (question) => {
    switch (question.type) {
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
      case "unit_toggle":
        return (
          <div>
            <div
              style={{
                background: "#C2E6F8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                color: "#000",
                marginBottom: 30,
                borderRadius: 10,
                width: "50%",
                fontSize: "15px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginLeft: 10,
                  fontSize: "15px",
                }}
              >
                Metric
              </p>
              <Switch
                checked={unit === "Metric"}
                onChange={(checked) => setUnit(checked ? "Metric" : "Imperial")}
                checkedChildren=""
                unCheckedChildren=""
              />
              <p
                style={{
                  margin: 0,
                  marginRight: 10,
                  fontSize: "15px",
                }}
              >
                Imperial
              </p>
            </div>

            {question.subQuestions.map((subQuestion) =>
              renderInput(subQuestion),
            )}
          </div>
        );

      case "checkbox_with_number":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Checkbox
              onChange={(e) =>
                handleChange(e.target.checked, `${question.name}_checked`)
              }
              checked={answers[`${question.name}_checked`] || false}
            >
              {question.question}
            </Checkbox>
            {answers[`${question.name}_checked`] && (
              <Input
                type="number"
                className="input_questionnaire"
                placeholder="Enter value"
                onChange={(e) => handleChange(e.target.value, question.name)}
                value={answers[question.name] || ""}
                style={{ marginLeft: "10px", width: "100px" }}
              />
            )}
            {answers[`${question.name}_checked`] && (
              <span style={{ marginLeft: "10px" }}>
                {unit === "Metric" ? "kg" : "lbs"}
              </span>
            )}
          </div>
        );
      case "checkbox_with_select":
        return (
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "10px",
            }}
          >
            {question.options.map((option, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    onChange={(e) =>
                      handleSelectCheckChange(
                        e.target.checked,
                        option.name,
                        option.selectName,
                        question.options,
                      )
                    }
                    checked={answers[option.name] || false}
                  >
                    {option.label}
                  </Checkbox>
                </div>
                {option.selectName && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Select
                      name={option.selectName}
                      value={answers[option.selectName] || undefined}
                      onChange={(value) =>
                        handleSelectCheckChange(value, option.selectName)
                      }
                      style={{ width: "100%" }}
                      disabled={!answers[option.name]}
                    >
                      {option.selectOptions.map((selectOption, idx) => (
                        <Option key={idx} value={selectOption}>
                          {selectOption}
                        </Option>
                      ))}
                    </Select>
                  </div>
                )}
              </React.Fragment>
            ))}
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
                <Option value="1"> 1</Option>
                <Option value="2"> 2</Option>
                <Option value="3"> 3</Option>
              </Select>
            )}
          </Radio.Group>
        );

      case "rating_scale":
        return (
          <div>
            <Button
              type="primary"
              style={{ background: "#335CAD", padding: 20 }}
            >
              {question.sub}
            </Button>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleChange(i + 1, question.name)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #00ADEF",
                    display: "flex",
                    padding: 20,
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
      case "date_radio":
        return (
          <div key={question.name} style={{ marginBottom: "20px" }}>
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                background: "#335CAD",
                padding: 10,
              }}
            >
              {question.buttonText}
            </Button>
            <div style={{ marginBottom: "10px" }}>
              <label>Date:</label>
              <br />
              <Input
                type="date"
                className="input_questionnaire"
                name={question.dateName}
                value={answers[question.dateName] || ""}
                onChange={(e) =>
                  handleChange(e.target.value, question.dateName)
                }
                style={{ width: "200px" }}
              />
            </div>
            {question.radioOptions.map((option, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                <Radio
                  name={question.radioName}
                  value={option.value}
                  checked={answers[question.radioName] === option.value}
                  onChange={(e) =>
                    handleChange(e.target.value, question.radioName)
                  }
                >
                  {option.label}
                </Radio>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );

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
          {questions[currentQuestionIndex].title}
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

export default PersonalAndFamilyHistory;
