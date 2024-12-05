import React, { useState, useEffect } from "react";
import { Progress, Button, Radio, Col, Row, Input, message } from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { DeleteOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";

const questions = [
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Respiratory",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "irritableBowel", text: "Irritable bowel syndrome" },
      { name: "gerd", text: "GERD (reflux)" },
      { name: "crohns", text: "Crohn’s disease/ulcerative colitis" },
      { name: "peptic_ulcer", text: "Peptic ulcer disease" },
      { name: "celiac", text: "Celiac disease" },
      { name: "gallstones", text: "Gallstones" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Urinary/Genital",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "kidney_stones", text: " Kidney stones" },
      { name: "gout", text: "Gout" },
      { name: "interstitial_cystitis", text: "Interstitial cystitis" },
      { name: "frequent_yeast_infections", text: "Frequent yeast infections" },
      {
        name: "frequent_urinary_tract_infections",
        text: "Frequent urinary tract infections",
      },
      { name: "sexual_dysfunction", text: "Sexual dysfunction" },
      {
        name: "sexual_transmitted_disease",
        text: "Sexual transmitted disease",
      },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Endocrine/Metabolic",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "diabetes", text: "Diabetes" },
      { name: "hypothyroidism", text: "Hypothyroidism (low thyroid)" },
      { name: "hyperthyroidism", text: "Hyperthyroidism (overactive thyroid)" },
      { name: "polycystic", text: "Polycystic ovarian syndrome" },
      { name: "infertility", text: "Infertility" },
      {
        name: "metabolic_syndrome/insulin_resistance",
        text: "Metabolic syndrome/insulin resistance",
      },
      { name: "eating_disorder", text: "Eating disorder" },
      { name: "hyperglycemia", text: "Hyperglycemia" },
    ],
  },

  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Inflammatory/Immune",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "rheumatoid_arthritis", text: "Rheumatoid arthritis" },
      { name: "chronic_fatigue_syndrome", text: "Chronic fatigue syndrome" },
      { name: "food_allergies", text: "Food allergies" },
      { name: "environmental_allergies", text: "Environmental allergies" },
      {
        name: "multiple_chemical_sensitivities",
        text: "Multiple chemical sensitivities",
      },
      { name: "autoimmune_disease", text: "Autoimmune disease" },
      { name: "immune_deficiency", text: "Immune deficiency" },
      { name: "mononucleosis", text: "Mononucleosis" },
    ],
  },

  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Musculoskeletal",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "fibromyalgia", text: "Fibromyalgia" },
      { name: "osteoarthritis", text: "Osteoarthritis" },
      { name: "chronic_pain", text: "Chronic pain" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Skin",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "eczema", text: "Eczema" },
      { name: "psoriasis", text: "Psoriasis" },
      { name: "acne", text: "Acne" },
      { name: "skin_cancer", text: "Skin cancer" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Cardiovascular",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "angina", text: "Angina" },
      { name: "heart_attack", text: "Heart Attack" },
      { name: "heart_failure", text: "Heart failure" },
      { name: "hypertension", text: "Hypertension (high blood pressure)" },
      { name: "stroke", text: "Stroke" },
      {
        name: "high_blood_fats",
        text: "High blood fats (cholesterol, triglycerides)",
      },
      { name: "rheumatic_fever", text: "Rheumatic fever" },
      { name: "arrythmia", text: "Arrythmia (irregular heart rate)" },
      { name: "murmur", text: "Murmur" },
      { name: "mitral_valve_prolapse", text: "Mitral valve prolapse" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Neurologic/Emotional",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "epilepsy_seizures", text: "Epilepsy/Seizures" },
      { name: "ADD/ADHD", text: "ADD/ADHD" },
      { name: "headaches", text: "Headaches" },
      { name: "migraines", text: "Migraines" },
      { name: "depression", text: "Depression" },
      { name: "anxiety", text: "Anxiety" },
      { name: "Autism", text: "Autism" },
      { name: "multiple_sclerosis", text: "Multiple sclerosis" },
      { name: "Parkinson’s disease", text: "parkinson’s_disease" },
      { name: "dementia", text: "Dementia" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Cancer",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you’ve had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "lung", text: "Lung" },
      { name: "breast", text: "Breast" },
      { name: "colon", text: "Colon" },
      { name: "ovarian", text: "Ovarian" },
      { name: "skin", text: "Skin" },
    ],
  },

  {
    type: "date_radio",
    name: "boneDensity",
    question: "Diagnostic Studies",
    sub: "Bone Density",
    dateName: "boneDensity",
    title: "Medical History: Illnesses/Conditions",
    radioName: "boneDensity",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "ctscan",
    question: "Diagnostic Studies",
    sub: "CT scan",
    dateName: "ctscan",
    title: "Medical History: Illnesses/Conditions",
    radioName: "ctscan",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "colonoscopy",
    question: "Diagnostic Studies",
    sub: "Colonoscopy",
    dateName: "colonoscopy",
    title: "Medical History: Illnesses/Conditions",
    radioName: "colonoscopy",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "cardiac_stress_test",
    question: "Diagnostic Studies",
    sub: "Cardiac stress test",
    dateName: "cardiac_stress_test",
    title: "Medical History: Illnesses/Conditions",
    radioName: "cardiac_stress_test",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "EKG",
    question: "Diagnostic Studies",
    sub: "EKG",
    dateName: "EKG",
    title: "Medical History: Illnesses/Conditions",
    radioName: "EKG",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "MRI",
    question: "Diagnostic Studies",
    sub: "MRI",
    dateName: "MRI",
    title: "Medical History: Illnesses/Conditions",
    radioName: "MRI",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "upper_endoscopy",
    question: "Diagnostic Studies",
    sub: "Upper endoscopy",
    dateName: "upper_endoscopy",
    title: "Medical History: Illnesses/Conditions",
    radioName: "upper_endoscopy",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "upper_GI_series",
    question: "Diagnostic Studies",
    sub: "Upper GI series",
    dateName: "upper_GI_series",
    title: "Medical History: Illnesses/Conditions",
    radioName: "upper_GI_series",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "chest_X_ray",
    question: "Diagnostic Studies",
    sub: "Chest X-ray",
    dateName: "chest_X-ray",
    title: "Medical History: Illnesses/Conditions",
    radioName: "chest_X_ray",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "other_X_rays",
    question: "Diagnostic Studies",
    sub: "Other X-rays",
    dateName: "other_X_rays",
    title: "Medical History: Illnesses/Conditions",
    radioName: "other_X_rays",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "barium_enema",
    question: "Diagnostic Studies",
    sub: "Barium enema",
    dateName: "barium_enema",
    title: "Medical History: Illnesses/Conditions",
    radioName: "barium_enema",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "other",
    question: "Diagnostic Studies",
    sub: "Other",
    dateName: "other",
    title: "Medical History: Illnesses/Conditions",
    radioName: "other",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "injuries",
    question: "Injuries",
    sub: "Broken bone(s)",
    dateName: "injuries",
    title: "Medical History: Illnesses/Conditions",
    radioName: "injuriess",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "back_injury",
    question: "Injuries",
    sub: "Back Injury",
    dateName: "back_injury",
    title: "Medical History: Illnesses/Conditions",
    radioName: "back_injury",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "neck_injury",
    question: "Injuries",
    sub: "Neck Injury",
    dateName: "neck_injury",
    title: "Medical History: Illnesses/Conditions",
    radioName: "neck_injury",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "injuries",
    question: "Injuries",
    sub: "Broken bone(s)",
    dateName: "injuries",
    title: "Medical History: Illnesses/Conditions",
    radioName: "Injuries",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "back_injury",
    question: "Injuries",
    sub: "Back Injury",
    dateName: "back_injury",
    title: "Medical History: Illnesses/Conditions",
    radioName: "back_injury",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "head_injury",
    question: "Injuries",
    sub: "Head Injury",
    dateName: "head_injury",
    title: "Medical History: Illnesses/Conditions",
    radioName: "head_injury",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "head_injury",
    question: "Injuries",
    sub: "Others",
    dateName: "head_injury",
    title: "Medical History: Illnesses/Conditions",
    radioName: "head_injury",
    radioOptions: [
      { label: "others", value: "Others" },

      { label: "comments", value: "Comments" },
    ],
  },

  {
    type: "date_radio",
    name: "appendectomy",
    question: "Surgeries",
    sub: "Appendectomy",
    dateName: "appendectomy",
    title: "Medical History: Illnesses/Conditions",
    radioName: "appendectomy",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "dental",
    question: "Surgeries",
    sub: "Dental",
    dateName: "dental",
    title: "Medical History: Illnesses/Conditions",
    radioName: "dental",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "gallbladder",
    question: "Surgeries",
    sub: "Gallbladder",
    dateName: "gallbladder",
    title: "Medical History: Illnesses/Conditions",
    radioName: "gallbladder",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "hernia",
    question: "Surgeries",
    sub: "Hernia",
    dateName: "hernia",
    title: "Medical History: Illnesses/Conditions",
    radioName: "hernia",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "hysterectomy",
    question: "Surgeries",
    sub: "Hysterectomy",
    dateName: "hysterectomy",
    title: "Medical History: Illnesses/Conditions",
    radioName: "hysterectomy",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "tonsillectomy",
    question: "Surgeries",
    sub: "Tonsillectomy",
    dateName: "tonsillectomy",
    title: "Medical History: Illnesses/Conditions",
    radioName: "tonsillectomy",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "joint_replacement",
    question: "Surgeries",
    sub: "Joint Replacement",
    dateName: "joint_replacement",
    title: "Medical History: Illnesses/Conditions",
    radioName: "joint_replacement",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },
  {
    type: "date_radio",
    name: "heart_surgery",
    question: "Surgeries",
    sub: "Heart surgery",
    dateName: "heart_surgery",
    title: "Medical History: Illnesses/Conditions",
    radioName: "heart_surgery",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "other_surgeries",
    question: "Surgeries",
    sub: "Other",
    dateName: "other_surgeries",
    title: "Medical History: Illnesses/Conditions",
    radioName: "other_surgeries",
    radioOptions: [{ label: "comments", value: "Comments" }],
  },

  {
    type: "date_radio",
    name: "lastPapTest",
    question: "Diagnostic Studies",
    sub: "Last Pap Test",
    dateName: "papTestDate",
    title: "Gynecological Screening/Procedures",
    radioName: "papTestResult",
    radioOptions: [
      { label: "Normal", value: "normal" },
      { label: "Abnormal", value: "abnormal" },
    ],
  },
  {
    type: "hospitalization",
    name: "hospitalizations",
    question: "Hospitalizations",
    title: "Health History",
  },
];

const IllnessAndCondition = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex8"),
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
    localStorage.setItem("currentQuestionIndex8", 0);
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
    dispatch(completeCard("/questionnaire/8"));
    localStorage.setItem("currentQuestionIndex8", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    navigate("/assessment");
  };

  const addHospitalization = (name) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: [...(prevAnswers[name] || []), { date: "", reason: "" }],
    }));
  };

  const handleHospitalizationChange = (value, field, index, name) => {
    const updatedEntries = [...(answers[name] || [])];
    updatedEntries[index][field] = value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: updatedEntries,
    }));
  };

  const removeHospitalization = (index, name) => {
    const updatedEntries = [...(answers[name] || [])];
    updatedEntries.splice(index, 1);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: updatedEntries,
    }));
  };

  const renderInput = (question) => {
    switch (question.type) {
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
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {question.question}
            </Button>
            <p
              style={{ color: "#00ADEF", fontSize: "15px", fontWeight: "bold" }}
            >
              {question.sub}
            </p>
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
            <div style={{ marginBottom: "10px" }}>
              {question.radioOptions.map((option, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <label>{option.label}:</label>
                  <br />
                  <Input
                    type="text"
                    className="input_questionnaire"
                    name={`${question.radioName}_${option.value}`}
                    value={
                      answers[`${question.radioName}_${option.value}`] || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        `${question.radioName}_${option.value}`,
                      )
                    }
                    style={{ width: "200px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "hospitalization":
        return (
          <div key={question.name} style={{ marginBottom: "20px" }}>
            {answers[question.name]?.map((entry, index) => (
              <div
                style={{
                  marginBottom: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "100%",
                  boxShadow: "#ccc",
                }}
              >
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "10px",
                    gap: "10px",
                  }}
                >
                  <Input
                    type="date"
                    value={entry.date || ""}
                    onChange={(e) =>
                      handleHospitalizationChange(
                        e.target.value,
                        "date",
                        index,
                        question.name,
                      )
                    }
                    className="input_questtionnaire"
                  />
                  <Input
                    type="text"
                    placeholder="Reason"
                    value={entry.reason || ""}
                    onChange={(e) =>
                      handleHospitalizationChange(
                        e.target.value,
                        "reason",
                        index,
                        question.name,
                      )
                    }
                    className="input_questtionnaire"
                  />
                  <Button
                    type="danger"
                    onClick={() => removeHospitalization(index, question.name)}
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="primary"
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                fontWeight: 700,
                background: "#00ADEF",
                padding: 10,
              }}
              onClick={() => addHospitalization(question.name)}
            >
              + Add Hospitalization
            </Button>
          </div>
        );

      case "multi_yes_no":
        return (
          <div style={{ marginTop: "20px" }}>
            <Button
              type="primary"
              style={{
                background: "#335CAD",
                padding: 20,
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {question.sub}
            </Button>

            {question.subQuestions.map((subQuestion) => (
              <div key={subQuestion.name} style={{ marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, fontSize: "15px", color: "#000" }}>
                    {subQuestion.text}
                  </div>
                  <div style={{ display: "flex" }}>
                    <Radio
                      style={{ marginRight: "10px" }}
                      checked={answers[subQuestion.name] === "yes"}
                      onChange={() => handleChange("yes", subQuestion.name)}
                    >
                      Yes
                    </Radio>
                    <Radio
                      checked={answers[subQuestion.name] === "no"}
                      onChange={() => handleChange("no", subQuestion.name)}
                    >
                      No
                    </Radio>
                  </div>
                </div>
              </div>
            ))}
            <Input placeholder="Others" style={{ marginTop: 20 }}></Input>
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

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight:"600", fontSize: "15px" }}>
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

export default IllnessAndCondition;
