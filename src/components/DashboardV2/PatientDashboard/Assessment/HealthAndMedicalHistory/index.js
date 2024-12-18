import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Slider,
  Input,
  Select,
  InputNumber,
  message,
  Checkbox,
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";

const { Option } = Select;

const questions = [
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "Overall",
    name: "overll_wellbeing",
  },
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "At school",
    name: "school_wellbeing",
  },
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "In your job",
    name: "job_wellbeing",
  },
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "In your social life",
    name: "social_life_wellbeing",
  },

  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With close friends",
    name: "close_friends_wellbeing",
  },

  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With Sex",
    name: "sex_wellbeing",
  },

  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your attitude",
    name: "attitude_wellbeing",
  },

  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your boyfriend/girlfriend",
    name: "relationship_wellbeing",
  },

  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your children",
    name: "children_wellbeing",
  },
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your parents",
    name: "parents_wellbeing",
  },
  {
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your spouse",
    name: "spouse_wellbeing",
  },

  {
    question: "You were born:",
    type: "radio",
    name: "mode_of_own_birth",
    options: ["Term", "Premature", "Don’t know"],
  },
  {
    question: "Were there any pregnancy or birth complications?",
    type: "long_radio",
    name: "birth_complications",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: Explain",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "You were:",
    type: "checkbox_with_input",
    options: [
      {
        label: "Breast-fed/How long?",
        name: "breast_fed",
        inputName: "breast_fed_duration",
      },
      {
        label: "Bottle-fed/Type of formula:",
        name: "bottle_fed",
        inputName: "bottle_fed_type",
      },
      { label: "Don't know", name: "dont_know" },
    ],
  },
  {
    question: "Age of introduction of: Solid food",
    type: "select",
    name: "age_of_solid_food_intro",
    options: Array.from({ length: 48 }, (_, i) => 1 + i),
  },
  {
    question: "Age of introduction of: Wheat",
    type: "select",
    name: "age_of_wheat_food_intro",
    options: Array.from({ length: 48 }, (_, i) => 1 + i),
  },
  {
    question: "Age of introduction of: Diary",
    type: "select",
    name: "age_of_diary_food_intro",
    options: Array.from({ length: 48 }, (_, i) => 1 + i),
  },
  {
    question:
      "As a child, were there any foods that were avoided because they gave you symptoms?",
    type: "long_radio",
    name: "allergic_food",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question:
          "If yes, what foods and what symptoms? (Example: milk—gas and diarrhea)",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "Did you eat a lot of sugar or candy as a child?",
    type: "radio",
    name: "do_you_feel_stress",
    options: ["Yes", "No"],
  },
  {
    question:
      "Check if you have any of the following, and provide number if applicable:",
    type: "checkbox_with_select",
    options: [
      {
        label: "Silver mercury fllings",
        name: "Silver_mercury_fllings",
        selectName: "Silver_mercury_fllings",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Gold fllings",
        name: "Gold_fllings",
        selectName: "Gold_fllings",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Root canals",
        name: "Root_canals",
        selectName: "Root_canals",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Implants",
        name: "Implants",
        selectName: "Implants",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Caps/Crowns",
        name: "Caps/Crowns",
        selectName: "Caps/Crowns",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Tooth pain",
        name: "Tooth_pain",
        selectName: "Tooth_pain",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
    ],
  },
  {
    question: "Have you had any mercury fllings removed?",
    type: "long_radio",
    name: "mercury_filings",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, when?",
        type: "text",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "How many fllings did you have as a kid?",
    type: "select",
    name: "fillings_removed",
    options: Array.from({ length: 48 }, (_, i) => 13 + i),
  },
  {
    question: "Do you brush regularly?",
    type: "radio",
    name: "do_you_brush_regularly",
    options: ["Yes", "No"],
  },
  {
    question: "Do you floss regularly?",
    type: "radio",
    name: "do_you_floss_regularly",
    options: ["Yes", "No"],
  },
  {
    question: "Do any of these signifcantly affect you?",
    type: "checkbox",
    name: "smoke_irritants",
    options: [
      "Cigarette smoke",
      "Perfume/colognes",
      "Auto exhaust fumes",
      "Other",
    ],
  },
  {
    question:
      "In your work or home environment are you regularly exposed to: (Check all that apply)",
    type: "checkbox",
    name: "work_env_smoke_irritants",
    options: [
      "Mold",
      "Renovations",
      "Electromagnetic radiation",
      "Carpets or rugs",
      "Stagnant or stuffy air",
      "Pesticides",
      "Cleaning chemicals",
      "Heavy metals (lead, mercury, etc.)",
      "Water leaks",
      "Chemicals",
      "Damp environments",
      "Old paint",
      "Smokers",
      "Herbicides",
      "Harsh chemicals (solvents, glues, gas, acids, etc)",
      "Paints",
      "Airplane travel",
      "Other",
    ],
  },
  {
    question: "Have you had a signifcant exposure to any harmful chemicals?",
    type: "long_radio",
    name: "harmful_chemicals",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Chemical Name",
        type: "text",
        name: "how_often_reaxation",
      },
      {
        question: "Length of Exposure",
        type: "select",
        options: Array.from({ length: 48 }, (_, i) => 13 + i),
      },
      {
        question: "Date:",
        type: "date",
        name: "how_often_reaxation",
      },
    ],
  },
  {
    question: "Do you have any pets or farm animals?",
    type: "long_radio",
    name: "resources_for_emotional_support",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, do they live:",
        type: "radio",
        name: "resources_list",
        options: ["Inside", "Outside", "Both inside and outside"],
      },
    ],
  },
];

const HealthAndMedicalHistory = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex6"),
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
    localStorage.setItem("currentQuestionIndex6", 0);
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
    dispatch(completeCard("/questionnaire/6"));
    localStorage.setItem("currentQuestionIndex6", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    navigate("/assessment");
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
            style={{ width: isMobile ? "100%" : "50%" }}
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
        {subQuestion.type === "select" && (
          <Select
            placeholder="Select an option"
            value={answers[subQuestion.name] || ""}
            onChange={(value) => handleChange(value, subQuestion.name)}
            style={{ width: isMobile ? "100%" : "50%" }}
          >
            {subQuestion.options.map((option, idx) => (
              <Option key={idx} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        )}
        {subQuestion.type === "date" && (
          <DatePicker
            format="YYYY-MM-DD"
            value={
              answers[subQuestion.name]
                ? moment(answers[subQuestion.name])
                : null
            }
            onChange={(date) =>
              handleChange(
                date ? date.format("YYYY-MM-DD") : "",
                subQuestion.name,
              )
            }
            style={{ width: isMobile ? "100%" : "50%" }}
          />
        )}
        {subQuestion.type === "checkbox" && (
          <Checkbox.Group
            name={subQuestion.name}
            onChange={(checkedValues) =>
              handleChange(checkedValues, subQuestion.name)
            }
            value={answers[subQuestion.name] || []}
          >
            {subQuestion.options.map((option, idx) => (
              <Checkbox
                key={idx}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
              >
                {option}
                {option === "Other" &&
                  answers[subQuestion.name]?.includes("Other") && (
                    <>
                      <br />
                      <Input
                        className="input_questtionnaire"
                        placeholder="Please specify"
                        value={answers[`${subQuestion.name}_other`] || ""}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            `${subQuestion.name}_other`,
                          )
                        }
                      />
                    </>
                  )}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )}
      </div>
    ));
  };

  const renderInput = (question) => {
    switch (question.type) {
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
            <div style={{ padding: "0 10px" }}>
              <div style={{ marginTop: "10px" }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={10}
                      value={answers[question.name] || 1}
                      onChange={(value) => handleChange(value, question.name)}
                      style={{ width: isMobile ? "100%" : "80%" }}
                      disabled={answers[`${question.name}_na`] || false} 
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={1}
                      max={10}
                      value={answers[question.name] || 1}
                      onChange={(value) => handleChange(value, question.name)}
                      style={{ width: "100%" }}
                      disabled={answers[`${question.name}_na`] || false} 
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col>
                    <Checkbox
                      checked={answers[`${question.name}_na`] || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        handleChange(isChecked, `${question.name}_na`);
                        if (isChecked) {
                          handleChange(null, question.name);
                        }
                      }}
                    >
                      N/A
                    </Checkbox>
                  </Col>
                </Row>
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
              style={{ marginTop: "10px", width: isMobile ? "100%" : "50%" }}
            >
              {question.selectOptions.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        );
      case "checkbox_with_input":
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
                        option.inputName,
                        question.options,
                      )
                    }
                    checked={answers[option.name] || false}
                  >
                    {option.label}
                  </Checkbox>
                </div>
                {option.inputName && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      name={option.inputName}
                      value={answers[option.inputName] || ""}
                      onChange={(e) =>
                        handleSelectCheckChange(
                          e.target.value,
                          option.inputName,
                        )
                      }
                      style={{ width: isMobile ? "100%" : "50%" }}
                      disabled={!answers[option.name]}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
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
            <p style={{ gridColumn: "span 2" }}>{question.question}</p>
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
                      style={{ width: isMobile ? "100%" : "50%" }}
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
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const HighlightedQuestion = ({ question }) => {
    const highlightWords = ['poorly', 'fine', 'very well', 'N/A'];
    const regex = new RegExp(`\\b(${highlightWords.join('|')})\\b`, 'gi');
  
    const highlightedQuestion = question.split(regex).map((part, index) => {
      if (highlightWords.includes(part.toLowerCase())) {
        return (
          <i key={index} style={{ color: '#335CAD', fontWeight: 'bold' }}>
            {part}
          </i>
        );
      }
      return part;
    });
  
    return <p>{highlightedQuestion}</p>;
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
          Parent’s Birth/Childhood History
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight: "600", fontSize: "15px" }}>
  {label && (
    <span>
      {label}
      {questions[currentQuestionIndex]?.sub && (
        <span style={{ color: "#335CAD", fontWeight: "bold" }}>
          {questions[currentQuestionIndex]?.sub}
        </span>
      )}
      <br />
    </span>
  )}
<HighlightedQuestion question={questions[currentQuestionIndex].question} />
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

export default HealthAndMedicalHistory;
