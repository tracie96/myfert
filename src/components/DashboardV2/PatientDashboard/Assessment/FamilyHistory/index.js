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
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import { getPersonalFamilyPatient } from "../../../../redux/AssessmentController";
import dayjs from 'dayjs';

const { Option } = Select;


const questions = [
  {
    question: "(Check box and provide number if applicable)",
    title: "Obstetric History",
    type: "checkbox_with_select",
    name: "obstetricHistory",
    options: [
      {
        label: "Pregnancies",
        name: "pregnancies",
        selectName: "pregnancies_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Miscarriages",
        name: "miscarriages",
        selectName: "miscarriages_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Abortions",
        name: "abortions",
        selectName: "abortions_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Living children",
        name: "living_children",
        selectName: "living_children_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Vaginal deliveries",
        name: "vaginal_deliveries",
        selectName: "vaginal_deliveries_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Caeseran",
        name: "caeserean",
        selectName: "caeserean_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Term births",
        name: "term_births",
        selectName: "term_births_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
      {
        label: "Premature birth",
        name: "premature_birth",
        selectName: "premature_birth_select",
        selectOptions: Array.from({ length: 30 }, (_, i) => 0 + i),
      },
    ],
  },
  {
    question: "Provide number if applicable",
    type: "unit_toggle",
    name: "weight_unit",
    title: "Obstetric History",
    options: ["Metric", "Imperial"],
    subQuestions: [
      {
        question: "Birth weight of smallest baby",
        type: "number_with_unit",
        name: "smallest_baby_weight",
        unit: "kg",
      },
      {
        question: "Birth weight of largest baby",
        type: "number_with_unit",
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
    options: Array.from({ length: 30 }, (_, i) => 7 + i),
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
    options: Array.from({ length: 12 }, (_, i) => 24 + i),
  },
  {
    question: "Times between cycles",
    type: "select",
    title: "Menstrual History",
    name: "times_between_of_cycle",
    options: Array.from({ length: 30 }, (_, i) => 10 + i),
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
        name: "premenstrual_problems_describe",
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
        name: "other_hormonal_problems_history",
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
        name: "hormonal_birthcontrol_often",
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
        name: "any_hormonal_problems_bc",
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
        name: "use_of_contraception_sub",
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
        options: Array.from({ length: 100 }, (_, i) => 40 + i),
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
        name: "surgical_menopause_detail",
      },
    ],
  },
  {
    question:
      "Do you currently have symptomatic problems with menopause? (Check all that apply)",
    type: "checkbox",
    title: "Menstrual History",

    name: "symptomatic_problems_menopause_history",
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
    name: "symptomatic_problems_menopause_other",
    options: [
      "Endometriosis",
      "Infertility",
      "Vaginal infection",
      "Fibroids",
      "Ovarian cysts",
      "Sexually transmitted disease (describe)",
    ],
  },
  // {
  //   type: "date_radio",
  //   name: "lastPapTest",
  //   question: "If applicable, provide date",
  //   buttonText: "Last Pap Test",
  //   dateName: "papTestDate",
  //   title: "Gynecological Screening/Procedures",
  //   radioName: "papTestResult",
  //   radioOptions: [
  //     { label: "Normal", value: "normal" },
  //     { label: "Abnormal", value: "abnormal" },
  //   ],
  // },
  // {
  //   type: "date_radio",
  //   name: "lastPapTest",
  //   question: "If applicable, provide date",
  //   buttonText: "Last Mammogram",
  //   dateName: "papTestDate",
  //   title: "Gynecological Screening/Procedures",
  //   radioName: "last_mammogram",
  //   radioOptions: [
  //     { label: "Normal", value: "normal" },
  //     { label: "Abnormal", value: "abnormal" },
  //   ],
  // },
  // {
  //   type: "date_radio",
  //   name: "lastPapTest",
  //   question: "If applicable, provide date",
  //   buttonText: "Last bone density",
  //   dateName: "papTestDate",
  //   title: "Gynecological Screening/Procedures",
  //   radioName: "last_bone_density",
  //   radioOptions: [
  //     { label: "Normal", value: "normal" },
  //     { label: "Abnormal", value: "abnormal" },
  //   ],
  // },
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
  const patientPersonalFamilyInfo = useSelector((state) => state.intake?.patientPersonalFamilyInfo);

  const mapPersonalFamilyInfoToAnswers = (info) => {
    const mapped = {};
  
    // Map obstetricHistory
    if (info.obstetricHistory && Array.isArray(info.obstetricHistory)) {
      info.obstetricHistory.forEach((item) => {
        const key = item.name?.toLowerCase().replace(/\s+/g, "_");
        mapped[key] = true;
        mapped[`${key}_select`] = item.level || 0;
      });
    }
  
    // Map weightChild data
    if (info.weightChild) {
      setUnit(info.weightChild.metricImperialScale ? "Metric" : "Imperial");
      mapped.smallest_baby_weight = info.weightChild.weightSmallest || "";
      mapped.largest_baby_weight = info.weightChild.weightLargest || "";

      // If Imperial, convert the weights from kg to lbs
      if (!info.weightChild.metricImperialScale) {
        mapped.smallest_baby_weight = mapped.smallest_baby_weight ? (mapped.smallest_baby_weight * 2.20462).toFixed(2) : "";
        mapped.largest_baby_weight = mapped.largest_baby_weight ? (mapped.largest_baby_weight * 2.20462).toFixed(2) : "";
      }
    }
  
    // General fields
    mapped.pregnancy_problems = info.problemsAfterPregnancy ? "Yes" : "No";
    mapped.pregnancy_problems_sub = info.problemsAfterPregnancyExplain || "";
  
    mapped.age_of_period = info.ageStartMenstrual || "";
    mapped.date_of_last_period = info.startDateLastMenstrual || "";
    mapped.length_of_cycle = info.lenghtOfCycle || "";
    mapped.times_between_of_cycle = info.timeBtwCycles || "";
  
    mapped.cramping = info.cramping ? "Yes" : "No";
    mapped.pain = info.painInPeriod ? "Yes" : "No";
  
    mapped.premenstrual_problems = info.everHadPreMenstrualProblems?.yesNo ? "Yes" : "No";
    mapped.premenstrual_problems_describe = info.everHadPreMenstrualProblems?.describe || "";
  
    mapped.other_premenstrual_problems = info.otherMenstrualProblems?.yesNo ? "Yes" : "No";
    mapped.other_hormonal_problems_history = info.otherMenstrualProblems?.describe || "";
  
    mapped.hormonal_birthcontrol = info.hormonalBirthControlType?.name ? "Yes" : "No";
    mapped.hormonal_birthcontrol_often = info.hormonalBirthControlType?.name || "";
    mapped.hormonal_birthcontrol_long = info.hormonalBirthControlType?.level?.toString() || "";
  
    mapped.other_hormonal_problems = info.problemsWithHormonalBirthControl?.yesNo ? "Yes" : "No";
    mapped.any_hormonal_problems_bc = info.problemsWithHormonalBirthControl?.describe || "";
  
    mapped.use_of_contraception = info.useContraception?.yesNo ? "Yes" : "No";
    mapped.use_of_contraception_sub = info.useContraception?.describe || "";
  
    mapped.is_menopause = info.inMenopause?.yesNo ? "Yes" : "No";
    mapped.age_at_last_period = info.inMenopause?.level || "";
  
    mapped.surgical_menopause = info.surgicalMenopause?.yesNo ? "Yes" : "No";
    mapped.surgical_menopause_detail = info.surgicalMenopause?.describe || "";
  
    mapped.symptomatic_problems_menopause_history = info.symptomicProblems || [];
  
    mapped.hormone_replacement_therapy = info.hormonalReplacement?.yesNo ? "Yes" : "No";
    mapped.hormone_replacement_therapy_sub = info.hormonalReplacement?.describe || "";
  
    mapped.symptomatic_problems_menopause_other = info.gynSymptoms || [];
  
    mapped.other_test_procedures = info.otherTest || "";
  
    return mapped;
  };
  
  useEffect(() => {
    dispatch(getPersonalFamilyPatient());
  }, [dispatch]);

  useEffect(() => {
    if (patientPersonalFamilyInfo && Object.keys(patientPersonalFamilyInfo).length > 0) {
      const mappedAnswers = mapPersonalFamilyInfoToAnswers(patientPersonalFamilyInfo);
      setAnswers(mappedAnswers);
      localStorage.setItem("answers", JSON.stringify(mappedAnswers)); // optional: persist locally
    }
  }, [patientPersonalFamilyInfo]);
  

  useEffect(() => {
    if (!patientPersonalFamilyInfo || Object.keys(patientPersonalFamilyInfo).length === 0) {
      dispatch(getPersonalFamilyPatient());
    }
  }, [dispatch, patientPersonalFamilyInfo]);

  useEffect(() => {
    console.log('patientPersonalFamilyInfo received:', patientPersonalFamilyInfo);
    
    if (patientPersonalFamilyInfo && Object.keys(patientPersonalFamilyInfo).length > 0) {
      const mapped = {};
  
      // Map obstetricHistory
      if (patientPersonalFamilyInfo.obstetricHistory && Array.isArray(patientPersonalFamilyInfo.obstetricHistory)) {
        patientPersonalFamilyInfo.obstetricHistory.forEach((item) => {
          const key = item.name.toLowerCase().replace(/\s+/g, '_');
          // Set the checkbox state
          mapped[key] = item.level !== null && item.level !== undefined;
          // Set the select value with the correct selectName format
          mapped[`${key}_select`] = item.level;
        });
      }

      // Map weightChild data
      if (patientPersonalFamilyInfo.weightChild) {
        setUnit(patientPersonalFamilyInfo.weightChild.metricImperialScale ? "Metric" : "Imperial");
        mapped.smallest_baby_weight = patientPersonalFamilyInfo.weightChild.weightSmallest || "";
        mapped.largest_baby_weight = patientPersonalFamilyInfo.weightChild.weightLargest || "";

        // If Imperial, convert the weights from kg to lbs
        if (!patientPersonalFamilyInfo.weightChild.metricImperialScale) {
          mapped.smallest_baby_weight = mapped.smallest_baby_weight ? (mapped.smallest_baby_weight * 2.20462).toFixed(2) : "";
          mapped.largest_baby_weight = mapped.largest_baby_weight ? (mapped.largest_baby_weight * 2.20462).toFixed(2) : "";
        }
      }
  
      // General fields
      mapped.pregnancy_problems = patientPersonalFamilyInfo.problemsAfterPregnancy ? "Yes" : "No";
      mapped.pregnancy_problems_sub = patientPersonalFamilyInfo.problemsAfterPregnancyExplain || "";

      // Map menstrual history
      mapped.age_of_period = patientPersonalFamilyInfo.ageStartMenstrual || "";
      mapped.date_of_last_period = patientPersonalFamilyInfo.startDateLastMenstrual || "";
      mapped.length_of_cycle = patientPersonalFamilyInfo.lenghtOfCycle || "";
      mapped.times_between_of_cycle = patientPersonalFamilyInfo.timeBtwCycles || "";
      mapped.cramping = patientPersonalFamilyInfo.cramping ? "Yes" : "No";
      mapped.pain = patientPersonalFamilyInfo.painInPeriod ? "Yes" : "No";

      // Map premenstrual problems
      mapped.premenstrual_problems = patientPersonalFamilyInfo.everHadPreMenstrualProblems?.yesNo ? "Yes" : "No";
      mapped.premenstrual_problems_describe = patientPersonalFamilyInfo.everHadPreMenstrualProblems?.describe || "";

      // Map other menstrual problems
      mapped.other_premenstrual_problems = patientPersonalFamilyInfo.otherMenstrualProblems?.yesNo ? "Yes" : "No";
      mapped.other_hormonal_problems_history = patientPersonalFamilyInfo.otherMenstrualProblems?.describe || "";

      // Map hormonal birth control
      mapped.hormonal_birthcontrol = patientPersonalFamilyInfo.hormonalBirthControlType?.name ? "Yes" : "No";
      mapped.hormonal_birthcontrol_often = patientPersonalFamilyInfo.hormonalBirthControlType?.name || "";
      mapped.hormonal_birthcontrol_long = ""; // Not provided in API

      // Map hormonal birth control problems
      mapped.other_hormonal_problems = patientPersonalFamilyInfo.problemsWithHormonalBirthControl?.yesNo ? "Yes" : "No";
      mapped.any_hormonal_problems_bc = patientPersonalFamilyInfo.problemsWithHormonalBirthControl?.describe || "";

      // Map contraception
      mapped.use_of_contraception = patientPersonalFamilyInfo.useContraception?.yesNo ? "Yes" : "No";
      mapped.use_of_contraception_sub = patientPersonalFamilyInfo.useContraception?.describe || "";

      // Map menopause
      mapped.is_menopause = patientPersonalFamilyInfo.inMenopause?.yesNo ? "Yes" : "No";
      mapped.age_at_last_period = patientPersonalFamilyInfo.inMenopause?.level || "";

      // Map surgical menopause
      mapped.surgical_menopause = patientPersonalFamilyInfo.surgicalMenopause?.yesNo ? "Yes" : "No";
      mapped.surgical_menopause_detail = patientPersonalFamilyInfo.surgicalMenopause?.describe || "";

      // Map symptomatic problems
      mapped.symptomatic_problems_menopause_history = patientPersonalFamilyInfo.symptomicProblems || [];

      // Map hormone replacement
      mapped.hormone_replacement_therapy = patientPersonalFamilyInfo.hormonalReplacement?.yesNo ? "Yes" : "No";
      mapped.hormone_replacement_therapy_sub = patientPersonalFamilyInfo.hormonalReplacement?.describe || "";

      // Map gynecological symptoms
      mapped.symptomatic_problems_menopause_other = patientPersonalFamilyInfo.gynSymptoms || [];

      // Map other tests
      mapped.other_test_procedures = patientPersonalFamilyInfo.otherTest || "";

      console.log('Mapped answers:', mapped);
      setAnswers(mapped);
    }
  }, [patientPersonalFamilyInfo]);



  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (question.question === "(Check if applicable)") {
      return true;
    }
  
    switch (question.type) {
      case "radio": {
        if (answers[question.name] === undefined || answers[question.name] === null || answers[question.name] === "") {
          console.log(`Validation failed: '${question.name}' radio question not answered.`);
          return false;
        }
        return true;
      }
      case "checkbox_with_select":
        for (const option of question.options) {
          const checkboxChecked = answers[option.name] || false;
          const selectName = option.selectName;
  
          if (checkboxChecked && selectName) {
            const selectValue = answers[selectName];
            if (selectValue === undefined || selectValue === "") {
              console.log(`Validation Failed: Checkbox ${option.name} is checked, but select ${selectName} is empty.`);
              return false;
            }
          }
        }
        console.log("Validation Passed: All checked checkboxes have filled selects.");
        return true;
  
      case "long_radio":
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
  
        case "checkbox":
          if (!answers[question.name] || answers[question.name].length === 0) {
            return false;
          }
    
          const requiresOtherInput =
            answers[question.name].includes("Other") ||
            answers[question.name].includes("Sexually transmitted disease (describe)");
    
          if (requiresOtherInput) {
            const otherInputName = `${question.name}_other`;
            if (!answers[otherInputName] || answers[otherInputName] === "") {
              console.log("Validation Failed: Other/STD is checked, but input field is empty.");
              return false;
            }
          }
    
  
        return true;
  
      case "unit_toggle": {
        // For weight inputs, at least one weight should be provided
        const hasSmallestWeight = answers.smallest_baby_weight !== undefined && 
                                answers.smallest_baby_weight !== "" && 
                                !isNaN(answers.smallest_baby_weight) && 
                                parseFloat(answers.smallest_baby_weight) >= 0;
        
        const hasLargestWeight = answers.largest_baby_weight !== undefined && 
                               answers.largest_baby_weight !== "" && 
                               !isNaN(answers.largest_baby_weight) && 
                               parseFloat(answers.largest_baby_weight) >= 0;
        
        // If either weight is provided, validate that it's a reasonable value
        if (hasSmallestWeight) {
          const weight = parseFloat(answers.smallest_baby_weight);
          const isMetric = unit === "Metric";
          // Valid range: 0.5-15 kg or 1-33 lbs
          if ((isMetric && (weight < 0.5 || weight > 15)) || 
              (!isMetric && (weight < 1 || weight > 33))) {
            message.error("Please enter a valid weight for smallest baby");
            return false;
          }
        }
        
        if (hasLargestWeight) {
          const weight = parseFloat(answers.largest_baby_weight);
          const isMetric = unit === "Metric";
          // Valid range: 0.5-15 kg or 1-33 lbs
          if ((isMetric && (weight < 0.5 || weight > 15)) || 
              (!isMetric && (weight < 1 || weight > 33))) {
            message.error("Please enter a valid weight for largest baby");
            return false;
          }
        }
        
        // If both weights are provided, validate that largest is not smaller than smallest
        if (hasSmallestWeight && hasLargestWeight) {
          const smallest = parseFloat(answers.smallest_baby_weight);
          const largest = parseFloat(answers.largest_baby_weight);
          if (largest < smallest) {
            message.error("Largest baby weight cannot be smaller than smallest baby weight");
            return false;
          }
        }
        
        // At least one weight should be provided
        return hasSmallestWeight || hasLargestWeight;
      }
      
      default:
        return answers[question.name] !== undefined && answers[question.name] !== "";
    }
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

  const handleSubmit = async () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }

    // Prepare obstetric history data
    const obstetricCategories = [
      "Pregnancies",
      "Miscarriages",
      "Abortions",
      "Living children",
      "Vaginal deliveries",
      "Caesarean",
      "Term births",
      "Premature birth"
    ];
    
    const obstetricHistory = obstetricCategories.map(category => ({
      name: category,
      level: answers[`${category.toLowerCase().replace(/\s+/g, "_")}_select`] || 0
    }));

    // Prepare weight data and handle unit conversion if needed
    const smallestWeight = answers.smallest_baby_weight ? parseFloat(answers.smallest_baby_weight) : 0;
    const largestWeight = answers.largest_baby_weight ? parseFloat(answers.largest_baby_weight) : 0;
    
    // Convert weights if in Imperial units
    const weightMultiplier = unit === "Imperial" ? 0.45359237 : 1; // Convert lbs to kg if Imperial
    
    const apiPayload = {
      obstetricHistory: obstetricHistory,
      weightChild: {
        metricImperialScale: unit === "Metric",
        weightSmallest: smallestWeight * weightMultiplier,
        weightLargest: largestWeight * weightMultiplier
      },
      problemsAfterPregnancy: answers.pregnancy_problems === "Yes",
      problemsAfterPregnancyExplain: answers.pregnancy_problems_sub || "",
      ageStartMenstrual: answers.age_of_period || 0,
      startDateLastMenstrual: answers.date_of_last_period || "string",
      lenghtOfCycle: answers.length_of_cycle || 0,
      timeBtwCycles: answers.times_between_of_cycle || 0,
      cramping: answers.cramping === "Yes",
      painInPeriod: answers.pain === "Yes",
      everHadPreMenstrualProblems: {
          yesNo: answers.premenstrual_problems === "Yes",
          describe: answers.premenstrual_problems_describe || "",
      },
      otherMenstrualProblems: {
          yesNo: answers.other_premenstrual_problems === "Yes",
          describe: answers.other_hormonal_problems_history || "",
      },
      hormonalBirthControlType: {
          level: 0, // Adjust if applicable
          name: answers.hormonal_birthcontrol_often || "string",
      },
      problemsWithHormonalBirthControl: {
          yesNo: answers.other_hormonal_problems === "Yes",
          describe: answers.any_hormonal_problems_bc || "",
      },
      useContraception: {
          yesNo: answers.use_of_contraception === "Yes",
          describe: answers.use_of_contraception_sub || "",
      },
      inMenopause: {
          yesNo: answers.is_menopause === "Yes",
          level: answers.age_at_last_period || 0, 
      },
      surgicalMenopause: {
          yesNo: answers.surgical_menopause === "Yes",
          describe: answers.symptomatic_problems_menopause_history?.join(", ") || "",
      },
      symptomicProblems: answers.symptomatic_problems_menopause_history || [],
      hormonalReplacement: {
          yesNo: answers.hormone_replacement_therapy === "Yes",
          describe: answers.hormone_replacement_therapy_sub || "",
      },
      gynSymptoms: answers.symptomatic_problems_menopause_other || [],
      gynScreeningLastPapTest: {
          date: "", // Adjust if applicable
          value: "", // Adjust if applicable
      },
      gynScreeningLastMammo: {
          date: "", // Adjust if applicable
          value: "", // Adjust if applicable
      },
      gynScreeningLastBoneDesity: {
          date: "", // Adjust if applicable
          value: "", // Adjust if applicable
      },
      otherTest: answers.other_test_procedures || "none",
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo.obj?.token || "";

  try {
    const response = await fetch(
      "https://myfertilitydevapi-prod.azurewebsites.net/api/Patient/AddPersonalFamily",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiPayload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }

    dispatch(completeCard("/questionnaire/7"));
    localStorage.setItem("currentQuestionIndex7", 0);
    localStorage.setItem("answers", JSON.stringify(answers));
    navigate("/assessment");
  } catch (error) {
    console.error("Error submitting the form:", error);
    message.error("Failed to submit the form. Please try again.");
  }
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

        {subQuestion.type === "select" && (
          <Select
            className="select_questtionnaire"
            name={subQuestion.name}
            value={answers[subQuestion.name] || ""}
            onChange={(value) => handleChange(value, subQuestion.name)}
          >
            {subQuestion.options.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>)}

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
                <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
              </Radio>
            ))}
          </Radio.Group>
        )}
      </div>
    ));
  };

  const handleSelectCheckChange = (checked, name, selectName, options) => {
    console.log(`handleSelectCheckChange: checked=${checked}, name=${name}, selectName=${selectName}`);
    setAnswers(prevAnswers => {
      const updatedAnswers = { ...prevAnswers, [name]: checked };
      if (!checked && selectName) {
        updatedAnswers[selectName] = undefined;
        console.log(`  Clearing select value for ${selectName}`);
      }
      console.log(`  Updated answers:`, updatedAnswers);
      return updatedAnswers;
    });
  };

  
  const handleSelectChange = (value, selectName) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectName]: value, // Update the `selectName` field with the selected value
    }));
  };
  const renderInput = (question) => {
    switch (question.type) {
      case "date":
        return (
          <DatePicker
            disabledDate={(current) => current && current > dayjs().endOf('day')}
            value={answers[question.name] ? dayjs(answers[question.name]) : null}
            format="YYYY-MM-DD"
            style={{
              width: isMobile ? "100%" : "50%",
              height: "42px",
              borderColor: "#ccc"
            }}
            onChange={(date, dateString) => handleChange(dateString, question.name)}
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
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
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
                padding: "8px 16px",
                color: "#000",
                marginBottom: 20,
                borderRadius: 10,
                width: isMobile ? "100%" : "200px",
              }}
            >
              <span style={{ marginRight: 10 }}>Metric</span>
              <Switch
                checked={unit === "Imperial"}
                onChange={(checked) => setUnit(checked ? "Imperial" : "Metric")}
              />
              <span style={{ marginLeft: 10 }}>Imperial</span>
            </div>
            {question.subQuestions.map((subQuestion, index) => (
              <div key={index} style={{ marginBottom: 15 }}>
                <div style={{ marginBottom: 5 }}>{subQuestion.question}</div>
                <Input
                  type="number"
                  style={{ width: isMobile ? "100%" : "200px" }}
                  value={answers[subQuestion.name] || ""}
                  onChange={(e) => handleChange(e.target.value, subQuestion.name)}
                  suffix={unit === "Metric" ? "kg" : "lbs"}
                />
              </div>
            ))}
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
                min={0}
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
                  <div style={{ display: "flex", alignItems: "center", width: isMobile ? "100%" : "50%" }}>
                    <Select
                      name={option.selectName}
                      value={answers[option.selectName] || undefined}
                      onChange={(value) => handleSelectChange(value, option.selectName)} // Use the new handler
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
          onChange={(checkedValues) => handleChange(checkedValues, question.name)}
          value={answers[question.name] || []}
          className="checkbox-group"
        >
          {question.options.map((option, index) => (
            <Checkbox key={index} value={option} className="checkbox-item">
              {option === "Other" || option === "Sexually transmitted disease (describe)" ? (
                <>
                  {option}
                  {(answers[question.name]?.includes("Other") ||
                    answers[question.name]?.includes("Sexually transmitted disease (describe)")) && (
                    <>
                      <br />
                      <Input
                        className="input_questtionnaire"
                        placeholder="Please specify"
                        value={answers[`${question.name}_other`] || ""}
                        onChange={(e) =>
                          handleChange(e.target.value, `${question.name}_other`)
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
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
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
      {
        questions[currentQuestionIndex].name !== "symptomatic_problems_menopause_other"? <span style={{ color: "red" }}>* </span>: undefined
      }
    </span>
  );

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
        
          {questions[currentQuestionIndex].title}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight: "600", fontSize: "15px" }}>
        {label} {questions[currentQuestionIndex].question}
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

export default PersonalAndFamilyHistory;
