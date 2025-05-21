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
  DatePicker,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { backBtnTxt, exitBtnTxt, reproductiveGeneralHeading, reproductiveGeneralInfo, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import InfoModal from "./InfoModal";
import { getReproductiveHealthPatient } from "../../../../redux/AssessmentController";

const { Option } = Select;

const questions = [
  {
    question: "Are you currently using birth control?",
    type: "long_radio",
    name: "relaxation_techniques",
    prefix:
      "In this survey, trying to conceive means engaging in regular, unprotected sex without any form of birth control or preventative measures to avoid pregnancy.",
    title: "Reproductive Health Assessment",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Hormonal Birth Control (please specify the type)",
        type: "text",
        name: "how_often_hormonal_bc",
      },
      {
        question: "Non-Hormonal Birth Control (please specify the type)",
        type: "text",
        name: "how_often_non_hormonal_bc",
      },
    ],
  },
  {
    question: "Are you currently pregnant?",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "isPregnant",
    options: ["Yes", "No"],
  },
  {
    question: "Are you currently trying to conceive?",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_trying_to_conceive",
    options: ["Yes", "No"],
  },
  {
    question: "Have you experienced difficulty trying to conceive? ",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_difficulty_to_conceive",
    options: ["Yes", "No"],
  },
  {
    question:
      "Do any of your biological family members have a history of reproductive health concerns (such as infertility, miscarriage, or conditions like PCOS, endometriosis, uterine fibroids, or PMDD)?  ",
    type: "radio",
    title: "Reproductive Health Assessment",
    name: "is_family_health_concern",
    options: ["Yes", "No", "Unsure"],
  },
  {
    question: "Since what date have you been trying to conceive?",
    type: "date",
    title: "Trying to Conceive",
    name: "is_trying_to_conceive_time",
  },

  {
    question:
      "What methods have you tried to conceive in the past? (Check all that apply)",
    type: "checkbox",
    title: "Trying to Conceive",
    name: "methods_trying_to_conceive",
    options: [
      "Cycle tracking",
      "Ovulation induction",
      "IVF",
      "Artificial Insemination",
      "Acupuncture",
      "Naturopath",
      "Homeopath",
      "None",
      "Unsure",
      "Other",
    ],
  },
  {
    question:
      "Are you currently charting your cycles using biomarkers/ symptom tracking? (Check all that apply)",
    type: "checkbox",
    title: "Trying to Conceive",
    name: "is_charting_cycles",
    options: [
      "LH urine strips",
      "Estrogen urine strips",
      "Cervical mucus",
      "Basal Body Temperature (BBT)",
      "Calendar/ rhythm method",
      "Cervical Position",
      "Cervical Firmness",
      "none",
      "Other",
    ],
  },
  {
    question:
      "Are you utilizing a Fertility Awareness Based Method (FABM/FAM) for charting your cycles?",
    type: "long_radio",
    name: "current_therapy",
    title: "Trying to Conceive",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "What method are you using?",
        type: "text",
        name: "charting_method",
      },
      // {
      //   question:
      //   "How long have you been using fertility awareness based method(s)?",
      //   type: "select_two",
      // },
    ],
  },

  {
    question:
    "How frequently do you have intercourse during your fertile window?",
    type: "number_with_radio",
    title: "Trying to Conceive",
    name: "intercourse_during_fertile",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "intercourse_during_fertile_sub",
        },
      ],
  },

  {
    question: "How much do you have intercourse each cycle?",
    type: "radio",
    title: "Trying to Conceive",
    name: "is_frequent_intercourse_cycle",
    options: [
      "Daily",
      "Every other week",
      "Twice a week",
      "Once a week",
      "Less than once a week",
    ],
  },

  {
    question:
      "Do you have menstrual pain around the time of your period? (Check all that apply)?",
    type: "checkbox",
    title: "Cycle Information",
    name: "is_menstrual_pain",
    options: [
      "No",
      "Yes - at the beginning",
      "Yes - during",
      "Yes - at the end",
    ],
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
    question:
      "Do you experience low backache or pelvic pain around the middle of your cycle (when you are not bleeding)? ",
    type: "radio",
    title: "Cycle Information",
    name: "is_lower_back_pain",
    options: ["Yes", "No"],
  },

  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    sub_question: "Mid-Cycle Pain: PELVIC PAIN (not during menstrual bleeding)",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        name: "duration_per_cycle_pp_not_menstrual",
      },
  
      {
        question: "Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe"],
        name: "duration_per_mild_cycle_severity_pp_not_menstrual",
      },
    ],
  },

  {
    question: "",
    type: "info",
    title: "Cycle Information",
    name: "info",
  },

  {
    question: "Do you experience PMS symptoms?",
    infoIconBtn:"   ℹ️ ",
    type: "radio",
    title: "Cycle Information",
    name: "is_pms_symptom",
    options: ["Yes", "No"],
  },

  {
    question: "PMS Symptoms (Check all that apply)",
    prefix:
      "Describe the duration and severity of PMS symptoms you experience.",
    type: "number_with_radio",
    title: "Cycle Information",
    name: "pms_sympton",
    sub_question: "PELVIC PAIN (not during menstrual bleeding)",
    subQuestions: [
      {
        type: "checkbox",
        name: "pms_sympton",
        options: [
          "Bloating",
          "Bowel Movement changes",
          "Acne",
          "Breast tenderness",
          "Mood Changes",
          "Headache/ Migraine",
          "Nausea",
          "Migraine",
          "Fatigue",
          "Poor Sleep",
          "Energy Increase",
          "Energy Decrease",
          "Unsure"
        ],
      },
      {
        question: "PMS Duration per Cycle",
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure","None"],
        name: "pms_sympton_check",
      },
      {
        question: "PMS Severity",
        type: "radio",
        label: "Severity",
        options: ["Mild", "Moderate", "Severe", "None"],
        name: "pms_sympton_severity",
      },
    ],
  },

  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: LONGEST CYCLE",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "longest_cycle_radio",
      },
    ],
  },
  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: SHORTEST CYCLE",
    name: "",

    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "shortest_cycle_radio",
      },
    ],
  },
  {
    question: "Duration per Cycle",
    type: "number_with_radio",
    title: "Cycle Information",
    isCyleInfo: true,
    sub_question: "Total Cycle Length: AVERAGE CYCLE LENGTH",
    name: "",
    subQuestions: [
      {
        type: "number_with_radio_sub",
        label: "",
        options: ["Unsure"],
        name: "average_cycle_radio",
      },
    ],
  },

  {
    question: "Over the past year, have you experienced any mid cycle spotting?",
    type: "long_radio",
    isCyleSpotting: true,
    title: "cycle spotting",
    name: "mid_cycle_spotting",
    options: ["Yes", "No"],
    sub_question: "Duration per Cycle",
    subQuestions: [
      {
        question: "Frequency",
        type: "radio",
        label: "Colour",
        options: ["Once per cycle", "Once every 2-3 cycles", "Once every 4+ cycles", "unsure"],
        name: "cycle_spotting_sub_frq",
      },

      {
        type: "number_with_radio_sub",
        name: "cycle_spotting_sub_number",
      },
     
      {
        question: "Colour",
        type: "radio",
        label: "Colour",
        options: ["Pink", "Red", "brown", "black", "unsure"],
        name: "cycle_spotting_sub",
      },
    ],
  },

  {
    question: "",
    type: "info_spotting",
    title: "Cycle Information",
    name: "infoSpotting",
  },
  {
    question:
    "Discharge: Creamy, yogurt-like, or glue-like cervical mucus",
    type: "number_with_radio",
    name: "cervical_mucus",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "cervical_mucus",
        },
        {
          question: "Colour",
          type: "radio",
          label: "Colour",
          options: ["White","Other"],
          name: "cervical_mucus_sub",
        },
      ],
  },
  {
    question:
    "Discharge: Watery, thin cervical mucus",
    type: "number_with_radio",
    title: "Duration(put 0 if you do not experience it)",
    name: "Watery_mucus",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "Watery_mucus_sub",
        },
        {
          question: "Colour",
          type: "radio",
          label: "Colour",
          options: ["White","Other"],
          name: "Watery_mucus_colour",
        },
      ],
  },

  {
    question:
    "Discharge: Egg white, long (>1”), slippery, stretchy cervical mucus",
    type: "number_with_radio",
    title: "Duration(put 0 if you do not experience it)",
    name: "egg_white_mucus",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "egg_white_mucus_sub",
        },
        {
          question: "Colour",
          type: "radio",
          label: "Colour",
          options: ["White","Other"],
          name: "egg_white_mucus_colour",
        },
      ],
  },

  {
    question:
    "Discharge: Pre-Period Spotting   ℹ️",
    type: "number_with_radio",
    title: "Duration(put 0 if you do not experience it)",
    name: "pre_spotting",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "pre_spotting_sub",
        },
        {
          question: "Colour",
          type: "radio",
          label: "Colour",
          options: ["None", "Pink", "Red", "Brown",  "Black","Other"],
          name: "pre_spotting_colour",
        },
      ],
  },

  // {
  //   question:
  //   "Discharge: Menstrual Bleeding",
  //   type: "number_with_radio",
  //   title: "Duration(put 0 if you do not experience it)",
  //   name: "menstrual_bleeding",
  //   value: 0,
  //   subQuestions: [
  //       {
  //         type: "number_with_radio_sub",
  //         label: "",
  //         name: "menstrual_bleeding_sub",
  //       },
  //       {
  //         question: "Colour",
  //         type: "radio",
  //         label: "Colour",
  //         options: ["None", "Pink", "Red", "Brown",  "Black"],
  //         name: "menstrual_bleeding_sub_colour",
  //       },
  //       {
  //         question: "Clots",
  //         type: "radio",
  //         label: "Colour",
  //         options: ["Yes", "No"],
  //         name: "menstrual_bleeding_sub_clots",
  //       },
  //     ],
  // },

  {
    question:
    "Discharge: After Period Spotting   ℹ️",
    type: "number_with_radio",
    title: "Duration(put 0 if you do not experience it)",
    name: "after_period_spot",
    subQuestions: [
        {
          type: "number_with_radio_sub",
          label: "",
          name: "after_period_spot_sub",
        },
        {
          question: "Colour",
          type: "radio",
          label: "Colour",
          options: ["None", "Pink", "Red", "Brown",  "Black"],
          name: "after_period_spot_colour",
        },
      ],
  },


  // {
  //   question: "Discharge: Creamy, yogurt-like, or glue-like cervical mucus",
  //   type: "long_radio",
  //   isCyleSpotting: true,
  //   title: "cycle spotting",
  //   name: "mid_cycle_spotting",
  //   options: ["Yes", "No"],
  //   sub_question: "Duration per Cycle",
  //   subQuestions: [
  //     {
  //       question: "Colour",
  //       type: "radio",
  //       label: "Colour",
  //       options: ["None", "White"],
  //       name: "duration_per_cycle_colour",
  //     },
  //   ],
  // },
  
  //
  // {
  //   question:
  //     "With whom do you live? (Include children, parents, relatives, friends, pets)",
  //   type: "long_textarea",
  //   title: "Relationships",
  //   name: "who_do_you_live_with",
  // },

  // {
  //   question: "Current occupation:",
  //   title: "Relationships",
  //   type: "long_textarea",
  //   name: "current_occupation",
  // },
  // {
  //   question: "Previous occupation:",
  //   type: "long_textarea",
  //   title: "Relationships",
  //   name: "previous_occupation",
  // },
  // {
  //   question:
  //     "Do you have resources for emotional support? (Check all that apply)",
  //   type: "checkbox",
  //   title: "Relationships",
  //   name: "resourcces_for_emotional_support",
  //   options: [
  //     "Spouse/Partner",
  //     "Family",
  //     "Friends",
  //     "Religious/Spiritual",
  //     "Pets",
  //     "Other",
  //   ],
  // },
  // {
  //   question: "Do you have a religious or spiritual practice?",
  //   type: "long_radio",
  //   title: "Relationships",
  //   name: "spiritual_practice",
  //   options: ["Yes", "No"],
  //   subQuestions: [
  //     {
  //       question: "If Yes: what kind",
  //       type: "text",
  //       name: "spiritual_practice_desciption",
  //     },
  //   ],
  // },
];

const ReproductiveHealth = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDisabled, setisDisabled] = useState(false);
  const [showInfoMoal,setShowInfoMoal] = useState(false);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const patientReproductiveInfo = useSelector((state) => state.intake?.patientReproductiveInfo);

  useEffect(() => {
    if (patientReproductiveInfo) {
      const mappedAnswers = {
        relaxation_techniques: patientReproductiveInfo.birthControl ? "Yes" : "No",
        how_often_hormonal_bc: patientReproductiveInfo.hormonalBirthControl || "",
        how_often_non_hormonal_bc: patientReproductiveInfo.nonHormonalBirthControl || "",
        isPregnant: patientReproductiveInfo.currentlyPregnant ? "Yes" : "No",
        is_trying_to_conceive: patientReproductiveInfo.tryingToConceive ? "Yes" : "No",
        is_difficulty_to_conceive: patientReproductiveInfo.difficultyTryingToConceive ? "Yes" : "No",
        is_family_health_concern: patientReproductiveInfo.familyMemberWithReproductiveConcerns || "No",
        is_trying_to_conceive_time: patientReproductiveInfo.howLongTryingToConceive || "",
        methods_trying_to_conceive: patientReproductiveInfo.methodToConceive || [],
        is_charting_cycles: patientReproductiveInfo.chartingToConceive || [],
        current_therapy: patientReproductiveInfo.currentTherapy ? "Yes" : "No",
        charting_method: patientReproductiveInfo.methodFertilityAwareness || "",
        // intercourse_during_fertile_sub: patientReproductiveInfo.intercourse_during_fertile || "",
        is_frequent_intercourse_cycle: patientReproductiveInfo.intercouseEachCycle || "",
        is_menstrual_pain: patientReproductiveInfo.menstrualPainDuringPeriod || [],
        is_lower_back_pain: patientReproductiveInfo.experiencePelvicPain ? "Yes" : "No",
        duration_per_cycle_pp_not_menstrual: patientReproductiveInfo.duringCirclePelvicPain?.duration || "",
        duration_per_cycle_pp_not_menstrual_unsure: patientReproductiveInfo.duringCirclePelvicPain?.duration || "0",
        duration_per_mild_cycle_severity_pp_not_menstrual: patientReproductiveInfo.duringCirclePelvicPain?.colour || "",
        duration_per_cycle_pelvic_pain: patientReproductiveInfo.menstralBleedingPelvicPain?.duration || "",
        duration_per_cycle_pelvic_pain_unsure: patientReproductiveInfo.menstralBleedingPelvicPain?.duration === "0",
        duration_per_cycle_severity_pelvic_pain: patientReproductiveInfo.menstralBleedingPelvicPain?.colour || "",
        is_pms_symptom: patientReproductiveInfo.doYouPmsSymptoms ? "Yes" : "No",
        pms_sympton: patientReproductiveInfo.pmsSymptoms || [],
        pms_sympton_severity: patientReproductiveInfo.pms?.colour || "",
        cycle_spotting_sub_number: patientReproductiveInfo.midCycleSpottingFrequency?.duration || "",
        cycle_spotting_sub: patientReproductiveInfo.midCycleSpottingFrequency?.colour || "",
        cycle_spotting_sub_frq: patientReproductiveInfo.midCycleSpottingFrequency?.frequency || "",
        pms_sympton_check: patientReproductiveInfo.pms?.duration || "",
        longest_cycle_radio: patientReproductiveInfo.longestCycleLenght || "",
        longest_cycle_radio_unsure: patientReproductiveInfo.longestCycleLenght || "0",
        average_cycle_radio: patientReproductiveInfo.averageCycleLenght || "",
        average_cycle_radio_unsure: patientReproductiveInfo.averageCycleLenght || "0",
        shortest_cycle_radio: patientReproductiveInfo.shortestCycleLenght || "",
        shortest_cycle_radio_unsure: patientReproductiveInfo.shortestCycleLenght || "0",
        mid_cycle_spotting: patientReproductiveInfo.midCycleSpotting ? "Yes" : "No",
        cervical_mucus: patientReproductiveInfo.cycleDischargeCreamy?.duration || "",
        cervical_mucus_unsure: patientReproductiveInfo.cycleDischargeCreamy?.duration || "0",
        cervical_mucus_sub: patientReproductiveInfo.cycleDischargeCreamy?.colour || "",
        Watery_mucus_sub: patientReproductiveInfo.cycleDischargeWatery?.duration || "",
        Watery_mucus_sub_unsure: patientReproductiveInfo.cycleDischargeWatery?.duration || "0",
        Watery_mucus_colour: patientReproductiveInfo.cycleDischargeWatery?.colour || "",
        egg_white_mucus_sub: patientReproductiveInfo.cycleDischargeEggWhite?.duration || "",
        egg_white_mucus_sub_unsure: patientReproductiveInfo.cycleDischargeEggWhite?.duration || "0",
        egg_white_mucus_colour: patientReproductiveInfo.cycleDischargeEggWhite?.colour || "",
        pre_spotting_sub: patientReproductiveInfo.cycleDischargePrePeriod?.duration || "",
        pre_spotting_sub_unsure: patientReproductiveInfo.cycleDischargePrePeriod?.duration || "0",
        pre_spotting_colour: patientReproductiveInfo.cycleDischargePrePeriod?.colour || "",
        after_period_spot_sub: patientReproductiveInfo.cycleDischargeAfterPeriodSpotting?.duration || "",
        after_period_spot_sub_unsure: patientReproductiveInfo.cycleDischargeAfterPeriodSpotting?.duration || "0",
        after_period_spot_colour: patientReproductiveInfo.cycleDischargeAfterPeriodSpotting?.colour || "",
        intercourse_during_fertile_sub: patientReproductiveInfo.intercouseDays || "",
        intercourse_during_fertile_sub_unsure: patientReproductiveInfo.intercouseDays === "0",
        // Add more mappings as needed...
      };
  
      setAnswers((prev) => ({
        ...prev,
        ...mappedAnswers,
      }));
    }
  }, [patientReproductiveInfo]);
  
  useEffect(() => {
    dispatch(getReproductiveHealthPatient());
  }, [dispatch]);

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex5"),
      10
    );
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (!isNaN(savedIndex) && savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, []);

  const validateQuestion = () => {
    
    const question = questions[currentQuestionIndex];
    const mainAnswer = answers[question.name];
    // const isUnsureChecked = answers[`${question.name}_unsure`];
    const isMainQuestionValid = mainAnswer !== undefined && mainAnswer !== "";
    let subQuestionsValid = true;

    if (question.type === "info_spotting") {
      return true;
  }
    // Handle main question validation when no subquestions are present or main answer is "No"
    if (!question.subQuestions || mainAnswer === "No") {
        if (question.type === "checkbox") {
            // Checkbox requires at least one selection unless "Unsure" is checked
            return answers[`${question.name}_unsure`] || (Array.isArray(mainAnswer) && mainAnswer.length > 0);
        }
        // For other types, either "Unsure" is checked or a valid main answer is provided
        return answers[`${question.name}_unsure`] || isMainQuestionValid;
    }

    let allSubQuestionsUnsure = true; // Assume all subquestions are unsure initially

    // Validate sub-questions
    if (question.subQuestions) {
        for (const subQuestion of question.subQuestions) {
            const subAnswer = answers[subQuestion.name];
            const subUnsure = answers[`${subQuestion.name}_unsure`];

            // If at least one subquestion is not unsure, set flag to false
            if (!subUnsure) {
                allSubQuestionsUnsure = false;
            }
            
          // const validCervicalMucusNames = [
          //   "cervical_mucus",
          //   "pre_spotting_sub",
          //   "Watery_mucus_sub",
          //   "egg_white_mucus_sub",
          //   "after_period_spot_sub"
          // ];
          // if (validCervicalMucusNames.includes(subQuestion.name)) {
          //   return true;
          // }

            // Validate number_with_radio_sub questions if not "Unsure" 
            if (subQuestion.type === "number_with_radio_sub" && subQuestion.name !== "longest_cycle_radio" && subQuestion.name !== "shortest_cycle_radio" && subQuestion.name !== "average_cycle_radio") {
              if (!subUnsure) {
                const parsed = Number(subAnswer);
                if (isNaN(parsed) || parsed === 0) {
                  subQuestionsValid = false;
                  break; // No need to continue if one subquestion is invalid
                }
              }
            }
            
            // Validate radio questions
            if (subQuestion.type === "radio") {
                if (!subAnswer) {
                    subQuestionsValid = false;
                    break; // No need to continue if one subquestion is invalid
                }
            }

            // Validate checkbox questions
             if (subQuestion.type === "checkbox") {
                if (!subAnswer || !Array.isArray(subAnswer) || subAnswer.length === 0) {
                     subQuestionsValid = false;
                     break; // No need to continue if one subquestion is invalid
                 }
             }
        }
    }

    // If all subquestions are "Unsure" or if all subquestions are valid, the question is considered valid
    return allSubQuestionsUnsure || subQuestionsValid;
};


  const handleSave = () => {
    const question = questions[currentQuestionIndex];
    // Allow skipping validation if "Unsure" is selected for subQuestions
    if (
      question.type === "number_with_radio" &&
      question.subQuestions &&
      answers[`${question.subQuestions[0].name}_radio`] === "Unsure"
    ) {
      localStorage.setItem("currentQuestionIndex5", currentQuestionIndex + 1);
      localStorage.setItem("answers", JSON.stringify(answers));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return; // Exit early
    }
  
    // Validate the question before proceeding
    if (!validateQuestion() && question.name !== "info") {
      message.error("Please answer the current question before saving.");
      return;
    }
  
    localStorage.setItem("currentQuestionIndex5", currentQuestionIndex + 1);
    localStorage.setItem("answers", JSON.stringify(answers));
    
    if(question.name === "is_pms_symptom" && answers.is_pms_symptom === "No"){
      setCurrentQuestionIndex(currentQuestionIndex + 2);
      return;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  
  const handlePrevious = () => {
    // const question = questions[currentQuestionIndex];
    
    let getPmsSymtom = JSON.parse(localStorage.getItem("answers"));
    if(getPmsSymtom.is_pms_symptom === "No"){
      setCurrentQuestionIndex(currentQuestionIndex - 2);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleChange = (value, name) => {
    let updatedAnswers = { ...answers };

    const disabledNames = [
      "cervical_mucus",
      "pre_spotting_sub",
      "Watery_mucus_sub",
      "egg_white_mucus_sub",
      "after_period_spot_sub"
    ];
    
    setisDisabled(value === 0 && disabledNames.includes(name));
    
    updatedAnswers["menstrual_bleeding"] =  0;
    if (name === "relaxation_techniques") { 
      if (value === "Yes") {
          updatedAnswers[name] = "Yes";
      } else {
          updatedAnswers[name] = "No";
          updatedAnswers["how_often_hormonal_bc"] = ""; 
          updatedAnswers["how_often_non_hormonal_bc"] = "";
      }
  } 
  else if (name === "how_often_hormonal_bc") {
      updatedAnswers["how_often_hormonal_bc"] = value;
      // updatedAnswers["how_often_non_hormonal_bc"] = "";
  } 
  else if (name === "how_often_non_hormonal_bc") {
      updatedAnswers["how_often_non_hormonal_bc"] = value;
      // updatedAnswers["how_often_hormonal_bc"] = "";
  }
  
    if (Array.isArray(value)) {
      const lastValue = value[value.length - 1];
      if (lastValue !== 'Unsure' && lastValue !== 'None') {
        const hasOtherValue = value.some(value => value !== null && value !== 'unsure');
        if (hasOtherValue) {
          value = value.filter(item => item !== 'None' && item !== 'Unsure');
          updatedAnswers[name] = value;
        }
      }
      if (lastValue === 'Unsure' || lastValue === 'None') {
        // Keep only the last value if it's 'Unsure' or 'None'
        value = value.filter(item => item === "Unsure" || item === "None");
        updatedAnswers[name] = value;
      }

    } 
  
    else {
      // Normal case when selecting other options
      updatedAnswers[name] = value;
    }

    //check for NO VALUE
    if (Array.isArray(value) &&  name === "is_menstrual_pain" ) {
      // Check if "Unsure" or "None" is selected

      const isUnsureOrNoneSelected = value.includes("No");
      if (isUnsureOrNoneSelected) {
        // Keep only "Unsure" or "None" and remove all other selections
        updatedAnswers[name] = value.filter(opt => opt === "No");
      } else {
        // Otherwise, update normally
        updatedAnswers[name] = value;
      }
    } 
    if (name && name.includes("_unsure")) {
      updatedAnswers[name] = value;
      if (value) {
        updatedAnswers[name.replace("_unsure", "")] = "";
      }
    } else {
      updatedAnswers[name] = value;
      updatedAnswers[`${name}_unsure`] = false;
    }

    if (name === "is_menstrual_pain" && Array.isArray(value)) {
      // If "No" is selected, remove all other selections
      if (value.includes("No")) {
        updatedAnswers[name] = ["No"];
      } else {
        updatedAnswers[name] = value;
      }
    } else if (name && name.includes("_unsure")) {
      updatedAnswers[name] = value;
      if (value) {
        updatedAnswers[name.replace("_unsure", "")] = "";
      }
    } else {
      updatedAnswers[name] = value;
      updatedAnswers[`${name}_unsure`] = false;
    }
    setAnswers(updatedAnswers);
  }; 

  

  const handleExit = () => {
    navigate("/assessment");
  };
  const handleStepChange = () => {
    localStorage.setItem("currentStep", 1);
  };
  const handleInfoModal = () => {
    setShowInfoMoal(!showInfoMoal)
  }
  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );
  const handleSubmit = async () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }
    try {
      const requestData = {
        
        birthControl: answers.relaxation_techniques === "Yes",
        hormonalBirthControl: answers.how_often_hormonal_bc || "N/A",
        nonHormonalBirthControl: answers.how_often_non_hormonal_bc || "N/A",
        currentlyPregnant: answers.isPregnant === "Yes",
        tryingToConceive: answers.is_trying_to_conceive === "Yes",
        difficultyTryingToConceive: answers.is_difficulty_to_conceive === "Yes",
        familyMemberWithReproductiveConcerns: 
          answers.is_family_health_concern === "Yes"
            ? "Yes"
            : answers.is_family_health_concern || "No",
        howLongTryingToConceive: answers.is_trying_to_conceive_time || "Unknown",
        methodToConceive: answers.methods_trying_to_conceive || [],
        chartingToConceive: answers.is_charting_cycles || [],
        currentTherapy:answers.current_therapy,
        intercourse_during_fertile:answers.intercourse_during_fertile_sub || "Unknown",
        intercouseEachCycle: answers.is_frequent_intercourse_cycle || "Unknown",
        menstrualPainDuringPeriod: answers.is_menstrual_pain || ["None"],
        experiencePelvicPain: answers.is_lower_back_pain === "Yes",
        menstralBleedingPelvicPain: {
          duration: `${answers.duration_per_cycle_pelvic_pain}` || "0",
          colour: answers.duration_per_cycle_severity_pelvic_pain, 
        },
        doYouPmsSymptoms: answers.is_pms_symptom === "Yes",
        pmsSymptoms: answers.pms_sympton || ["None"],
        pms: {
          duration: `${answers.pms_sympton_check}` || "None", 
          colour: answers.pms_sympton_severity || "Mild",
        },
        midCycleSpottingFrequency:{
          duration: `${answers.cycle_spotting_sub_number}` || "None", 
          colour: `${answers.cycle_spotting_sub}` || "None",
          frequency: `${answers.cycle_spotting_sub_frq}` || "None",
        },
        longestCycleLenght: `${answers.longest_cycle_radio}` || "0",
        averageCycleLenght: `${answers.average_cycle_radio}` || "0",
        shortestCycleLenght: `${answers.shortest_cycle_radio}` || "0",
        who_do_you_live_with: answers.who_do_you_live_with || 'N/A',
        current_occupation: answers.current_occupation || 'N/A',
        previous_occupation: answers.previous_occupation || 'N/A',
        resourcces_for_emotional_support: answers.resourcces_for_emotional_support || [],
        spiritual_practice:answers.spiritual_practice || 'N/A',

        utilizingFertilityAwareness: false, 
        methodFertilityAwareness: answers.charting_method || "None",
        intercouseDays: `${answers.intercourse_during_fertile_sub}` || "None",
        is_charting_cycles: answers.is_charting_cycles || 'N/A',
        duringCirclePelvicPain: {
          duration: `${answers.duration_per_cycle_pp_not_menstrual}` || "0",
          colour: `${answers.duration_per_mild_cycle_severity_pp_not_menstrual}` || "N/A",
        },
        midCycleSpotting: answers.mid_cycle_spotting === "Yes",
        menstralCycleFrequency: answers.menstralCycleFrequency || "Unknown", // Example default
        menstralCycleDuration: answers.menstralCycleDuration || "Unknown", // Example default
        menstralCycleColour: answers.menstralCycleColour || "Unknown",
        relaxation_techniques: answers.relaxation_techniques || 'N/A',
        methods_trying_to_conceive: answers.methods_trying_to_conceive || [],
        cycleDischargeCreamy: {
          duration: `${answers.cervical_mucus}` || "N/A", // Example default
          colour: answers.cervical_mucus_sub || "N/A", // Example default
        },
        cycleDischargeWatery: {
          duration: `${answers.Watery_mucus_sub}` || "0", // Example default
          colour: answers.Watery_mucus_colour === "Other"
            ? answers.Watery_mucus_colour_other
            : (answers.Watery_mucus_colour || "N/A"),
        },
        cycleDischargeEggWhite: {
          duration: `${answers.egg_white_mucus_sub}` || "N/A", // Example default
          colour: answers.egg_white_mucus_colour === "Other"
            ? answers.egg_white_mucus_colour_other
            : (answers.egg_white_mucus_colour || "N/A"),
        },
        cycleDischargePrePeriod: {
          duration: `${answers.pre_spotting_sub}` || "0", // Example default
          colour: answers.pre_spotting_colour === "Other"
            ? answers.pre_spotting_colour_other
            : (answers.pre_spotting_colour || "N/A"),
        },
        cycleDischargeMenstralBleeding: {
          duration: `${answers.menstrual_bleeding_sub+ ", " +answers.days_light_bleeding+ ", " +answers.days_moderate_bleeding+ ", " +answers.days_heavy_bleeding+ ", " +answers.days_very_heavy_bleeding}` || "N/A", // Example default
          colour: answers.menstrual_bleeding_sub_colour || "N/A", // Example default
          clots: answers.menstrual_bleeding_sub_clots || "N/A", // Example default
        },
        cycleDischargeAfterPeriodSpotting: {
          duration: `${answers.after_period_spot_sub}` || "0", // Example default
          colour: answers.after_period_spot_colour || "N/A", // Example default
        },
        chartBase64: answers.charting_method || "",
      };
  
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj?.token || "";
  
      const response = await fetch(
        "https://myfertilitydevapi-prod.azurewebsites.net/api/Patient/AddReproductiveHealth",
        {
          method: "POST",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        console.log("API response:", result);
        message.success("Form submitted successfully!");
        dispatch(completeCard("/questionnaire/11"));
        localStorage.setItem("currentQuestionIndex11", 0);
        localStorage.setItem("currentStep", 1);
        localStorage.setItem("answers", JSON.stringify(answers));
        handleStepChange(2);

        navigate("/assessment");
      } else {
        console.error("API error:", response.statusText);
        message.error("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      message.error("An error occurred. Please try again.");
    }
  };
  
 
  const subQuestions_question = [
    { name: 'days light bleeding' },
    { name: 'days moderate bleeding' },
    { name: 'days heavy bleeding' },
    { name: 'days very heavy bleeding' }
  ];

  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p style={{color:'#353C43', fontWeight:'bold'}}>{subQuestion.question}</p>
        {subQuestion.type === "text" && (
          <Input
            name="method"
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
           // disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
          />
        )}
        {subQuestion.name !== "menstrual_bleeding_sub" && subQuestion.type === "number_with_radio_sub" && (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{display: "flex", alignItems:"center"}}>
                 {/* InputNumber should have its own state key */}
                  {subQuestion.name === "intercourse_during_fertile_sub"?<span style={{ fontWeight: "600", color:"#303030"}}>Every&nbsp;</span>:""}
                  <InputNumber
                    max={subQuestion.name === "shortest_cycle_radio" || subQuestion.name === "average_cycle_radio" ? answers.longest_cycle_radio : undefined}
                    min={subQuestion.name === "average_cycle_radio" ? answers.shortest_cycle_radio : 0}
                    name={`${subQuestion.name}_menstrual_bleeding`}
                    value={answers[subQuestion.name] || 0} // Default to 0 instead of undefined
                    onChange={(value) => handleChange(value, subQuestion.name)}
                    disabled={answers[`${subQuestion.name}_unsure`]}
                    className="input_questionnaire"
                  />
                    {<span style={{ fontWeight: "600", color:"#303030"}}>&nbsp;Days</span>}
              </div>
             
              {/* Radio.Group should use a different key in the state */}
              <Checkbox
                name={`${subQuestion.name}_unsure`}
                checked={answers[`${subQuestion.name}_unsure`] || false}
                onChange={(e) => handleChange(e.target.checked, `${subQuestion.name}_unsure`)}
              >
                Unsure
            </Checkbox>
            </div>
          </>
        )}
        { subQuestion.type === "number_with_radio_sub" && subQuestion.name === "menstrual_bleeding_sub" && (
          <>
            <div>
              {subQuestions_question && subQuestions_question.map((subQuestion, index) => {
                let nameSubQuestion = subQuestion.name.replace(/ /g, '_');
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

        {subQuestion.type === "multi_number_with_radio" && (
          <>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {subQuestion.subQuestions.slice(0, 4).map((item, index) => (
                <div key={index}>
                  <label>{item.label}</label>
                  <InputNumber
                    name={`${item.name}_input_questionnaire`}
                    value={answers[item.name] || 0}
                    onChange={(value) => handleChange(value, item.name)}
                    className="input_questionnaire"
                    style={{ width: "100%" }}
                    //disabled={answers[item.name] === "Unsure" || answers[item.name] === "None"}
                  />
                </div>
              ))}

              {/* Radio group for yes/no accuracy question */}
              <div>
                <label>{subQuestion.subQuestions[4].label}</label>
                <Radio.Group
                  name={`${subQuestion.subQuestions[4].name}_radio`}
                  className="radioGroup"
                  value={
                    answers[`${subQuestion.subQuestions[4].name}_radio`] || null
                  }
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      `${subQuestion.subQuestions[4].name}_radio`
                    )
                  }
                >
                  {subQuestion.subQuestions[4].options.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </>
        )}
        {subQuestion.type === "select_two" && (
       <Space size="large">
       {/* Input for Years */}
       <div style={{ display: "flex", alignItems: "center" }}>
         <InputNumber
           min={0}
           max={100}
           onChange={(value) => handleChange(value || 0, `${subQuestion.name}_years`)}
           value={answers[`${subQuestion.name}_years`] || ""}
           name={`${subQuestion.name}_years`}
          // disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
           style={{
             height: 35,
             borderColor: "#00ADEF",
             width: isMobile ? "100%" : "50%",
           }}
         />
         <span style={{ marginLeft: "8px" }}>Years</span>
       </div>
     
       {/* Input for Months */}
       <div style={{ display: "flex", alignItems: "center" }}>
         <InputNumber
           min={0}
           max={11}
           onChange={(value) => handleChange(value || 0, `${subQuestion.name}_months`)}
           value={answers[`${subQuestion.name}_months`] || ""}
           name={`${subQuestion.name}_months`}
          // disabled={answers[subQuestion.name] === "Unsure" || answers[subQuestion.name] === "None"}
           style={{
             height: 35,
             borderColor: "#00ADEF",
             width: isMobile ? "100%" : "50%",
           }}
         />
         <span style={{ marginLeft: "8px" }}>Months</span>
       </div>
     </Space>
     
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
                subQuestion.name
              )
            }
            style={{ width: isMobile ? "100%" : "50%" }}
          />
        )}
        {subQuestion.type === "radio" && (
           <Radio.Group
           name={subQuestion.name}
           className="radioGroup"
           onChange={(e) => handleChange(e.target.value, subQuestion.name)}
           value={answers[subQuestion.name]}
           style={{ width: "100%" }}
         >
           {subQuestion.options.map((option, idx) => {
  
             return (
               <div key={idx} style={{ marginBottom: "10px" }}>
                 <Radio
                   key={idx}
                   value={option}
                   name={option}
                   style={{ display: "block", marginBottom: "10px" }}
                   disabled={isDisabled}
                 >
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                 </Radio>
                 {option === "Other" && answers[subQuestion.name]?.includes("Other") && (
                   <Input
                     className="input_questionnaire"

                     placeholder="Please specify"
                     name={`${subQuestion.name}_other`}
                     value={answers[`${subQuestion.name}_other`] || ""}
                     disabled={isDisabled}
                     onChange={(e) =>
                       handleChange(e.target.value, `${subQuestion.name}_other`)
                     }
                     style={{ marginTop: "5px",width: "100%" }}
                   />
                 )}
               </div>
             );
           })}
         </Radio.Group>
        )}
        {subQuestion.type === "checkbox" && (
          <Col>
            <Checkbox.Group
              style={{ display: "flex", flexDirection: "column" }} // Force column layout for checkboxes
              name={subQuestion.name}
              onChange={(checkedValues) =>
                handleChange(checkedValues, subQuestion.name)
              }
              value={answers[subQuestion.name] || []}
            >
              {subQuestion.options.map((option, idx) => {
                // const isUnsureOrNoneSelected = (answers[subQuestion.name] || []).includes("Unsure") || 
                (answers[subQuestion.name] || []).includes("None");
                return (
               <div key={idx} style={{ marginBottom: "10px" }}>
                  {" "}
                  {/* Ensure consistent spacing */}
                  <Checkbox 
                  value={option}
                 // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
                  >{option}</Checkbox>
                  {option === "Other" &&
                    answers[subQuestion.name]?.includes("Other") && (
                      <Input
                        className="input_questionnaire"
                        placeholder="Please specify"
                        value={answers[`${subQuestion.name}_other`] || ""}
                        onChange={(e) =>
                          handleChange(
                            e.target.value,
                            `${subQuestion.name}_other`
                          )
                        }
                        style={{ marginTop: "5px" }} // Adjust margin for the input field
                      />
                    )}
                </div>
                )})}
            </Checkbox.Group>
          </Col>
        )}
      </div>
    ));
  };

  const renderInput = (question) => {
    switch (question.type) {
      case "radio":
        return (
          <Radio.Group
            name={question.name}
            className="radioGroup"
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%" }}
          > 
            {question.options.map((option, index) => {
              // const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
              return (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
                // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
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
                          style={{ height: 50, borderColor: "#00ADEF" }}
                          value={answers[`${question.name}_other`] || ""}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              `${question.name}_other`
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
            )})}
          </Radio.Group>
        );
      case "date":
        return (
          <Input
            type="date"
            className="input_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(e) => handleChange(e.target.value, question.name)}
            max={new Date().toISOString().split('T')[0]} 
          />
        );
      case "info":
        return (
          <div className="info-box">
            <div className="info-header">
              <InfoCircleOutlined className="info-icon" />
              <Title
                level={5}
                className="info-title"
                style={{ color: "#335CAD" }}
              >
                What is Premenstrual Syndrome (PMS)?
              </Title>
            </div>
            <Paragraph>
              PMS refers to physical and emotional symptoms experienced 1-2
              weeks before a menstrual period. Common symptoms include:
            </Paragraph>
            <ul className="info-list">
              <li>
                <strong>Mood Changes:</strong> Mood swings, irritability,
                anxiety, or depression.
              </li>
              <li>
                <strong>Physical Discomfort:</strong> Bloating, breast
                tenderness, headaches, joint or muscle pain.
              </li>
              <li>
                <strong>Other Symptoms:</strong> Fatigue, trouble sleeping,
                changes in appetite, acne, constipation, or diarrhea.
              </li>
            </ul>
          </div>
        );
        case "info_spotting":
        return (
          <div className="info-box info-form-message">
            <div className="info-header info-header-message">
              <Title
                level={5}
                className="info-title"
                style={{ color: "#335CAD" }}
              >
                ℹ️  Pre-Period Spotting:
              </Title>
              <Paragraph>
                This spotting happens just before menstrual bleeding begins.
                It is light and often serves as an early indicator that the period is about to start.
                It usually transitions into the regular menstrual flow shortly afterward.
              </Paragraph>
            </div>
            
           
            <div className="info-header info-header-message">
            <Title
                level={5}
                className="info-title"
                style={{ color: "#335CAD" }}
              >
                ℹ️  After Period Spotting:
              </Title>
            <Paragraph>
 
            This may occur at the tail end of menstrual bleeding as the flow tapers off into lighter spotting.
            </Paragraph>
          </div>
          <div className="info-header info-header-message">
            <Title
                level={5}
                className="info-title"
                style={{ color: "#335CAD" }}
              >
                ℹ️  Bleeding:
              </Title>
            <Paragraph>
              <div class="info-bleed-head"><span class="info-bleed">Light: </span>Tampons/Pads typically need to be changed every 7-8 hours. Menstrual cups can be worn for up to 12 hours.</div>
              <div class="info-bleed-head"><span class="info-bleed">Moderate: </span>Tampons/Pads generally need to be changed every 5-6 hours. Menstrual cups can be left in place for 8-12 hours, depending on the flow.</div>
              <div class="info-bleed-head"><span class="info-bleed">Heavy:</span>Tampons/Pads generally need to be changed every 3-4 hours. Menstrual cups can be left in place for up to 4-6 hours, depending on the flow.</div>
              <div class="info-bleed-head"><span class="info-bleed">Very Heavy: </span>Tampons/Pads often need to be changed every 1-2 hours. Heavy bleeding is defined as soaking through one or more pads or tampons every 1-2 hours. Menstrual cups may need to be emptied more frequently, every 4 hours or more frequently, depending on the volume and heaviness of the flow.</div>
            </Paragraph>
            </div>
          </div>
        );
      case "radiowithselect":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            className="radioGroup"
            value={answers[question.name]}
            style={{ width: "100%" }}
          >
            {question.options.map((option, index) => {
              // const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
              return (
              <Radio
                key={index}
                value={option}
                style={{ display: "block", marginBottom: "10px" }}
                // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
              >
                {option}
              </Radio>
            )})}
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
      case "number":
        return (
          <Col style={{ marginBottom: "20px", display: "block" }}>
            {/* Number Input */}
            <Input
              type="number"
              className="input_questtionnaire"
              name={question.name}
              value={answers[question.name] || ""}
              onChange={(e) => handleChange(e.target.value, question.name)}
              style={{ marginBottom: "10px", width: isMobile ? "100%" : "10%" }}
              min={0}
            />
            <br />
            {/* Checkbox */}
            <Checkbox
              name={`${question.name}_checkbox`}
              checked={answers[`${question.name}_checkbox`] || false}
              onChange={(e) =>
                handleChange(e.target.checked, `${question.name}_checkbox`)
              }
            >
              Unsure
            </Checkbox>
          </Col>
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
        // case "radio":
        // return (
        //   <div className="input_container" style={{ marginBottom: "20px" }}>
        //     {question.isCyleSpotting && (
        //       <div className="info-box">
        //         <Title
        //           level={5}
        //           className="info-title"
        //           style={{ color: "#335CAD" }}
        //         >
        //           Cycle Length
        //         </Title>
        //         <Paragraph>
        //         Light bleeding that occurs around the middle of the menstrual cycle, 
        //         typically near ovulation. This spotting is brief, light, 
        //         and usually only requires a panty liner for protection. 
        //         There is no additional bleeding immediately before or after it.
        //         </Paragraph>
        //       </div>
        //     )}
        //     {/* <p>{question.sub_question}</p> */}
        //     {/* <p>{question.sub_question}</p>
        //     {renderSubQuestions(question.subQuestions)} */}
        //   </div>
        // );
      
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
            {question.options.map((option, index) => {
              // const isUnsureOrNoneSelected = (answers[question.name] || []).includes("Unsure") || 
              (answers[question.name] || []).includes("None");
              return (
              <Checkbox 
                key={index} 
                value={option} 
                checked={true}
                //disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
                className="checkbox-item"
              >
                {option === "Other" ? (
                  <>
                    {option}
                    {answers[question.name] &&
                      answers[question.name].includes("Other") && (
                        <>
                          <br />
                          <Input
                            className="input_questtionnaire"
                            style={{ height: 50, borderColor: "#00ADEF" }}
                            placeholder="Please specify"
                            value={answers[`${question.name}_other`] || ""}
                            onChange={(e) =>
                              handleChange(
                                e.target.value,
                                `${question.name}_other`
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
            )})}
          </Checkbox.Group>
        );
      case "long_radio":
        return (
          <div style={{ flexDirection: "column" }}>
            <Radio.Group
              name={question.name}
              className="radioGroup"
              onChange={(e) => handleChange(e.target.value, question.name)}
              value={answers[question.name]}
              style={{ width: "100%" }}
            >
               {question.isCyleSpotting && (
              <div className="info-box">
                <Title
                  level={5}
                  className="info-title"
                  style={{ color: "#335CAD" }}
                >
                  Mid Cycle Spotting:
                </Title>
                <Paragraph>
                Light bleeding that occurs around the middle of the menstrual cycle, 
                typically near ovulation. This spotting is brief, light, 
                and usually only requires a panty liner for protection. 
                There is no additional bleeding immediately before or after it.
                </Paragraph>
              </div>
            )}
              {question.options.map((option, index) => {
                // const isUnsureOrNoneSelected = answers[question.name] === "Unsure" || answers[question.name] === "None";
                // const isBirthControlQuestion = question.name === "relaxation_techniques";
                // const isHormonalAnswered = answers["how_often_hormonal_bc"];
                // const isNonHormonalAnswered = answers["how_often_non_hormonal_bc"];
                return (
                <Radio
                  key={index}
                  value={option}
                  style={{ display: "block", marginBottom: "10px" }}
                  // disabled={isUnsureOrNoneSelected && option !== "Unsure" && option !== "None"}
                >
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                </Radio>
              )})}
            </Radio.Group>
            {answers[question.name] === "Yes" &&
              renderSubQuestions(question.subQuestions)}
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
  <Col
    xs={24}
    sm={24}
    md={24}
    lg={24}
    xl={24}
  >
    <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE"/>
    <Progress
      percent={Math.round(progressPercentage)}
      strokeColor={progressColor}
      style={{
        top: 10,                  
        width: "90%",            
        zIndex: 1000            
      }}
    />

    <div
      style={{
        overflowY: "auto", 
        marginTop: "2%", 
        paddingRight: "20px",
      }}
    >
      <div 
        style={{
          font: "inter",
          fontWeight:"700",
          fontSize: "20px",
          lineHeight:"24.25px",
          color: "#F2AA93"
        }}>
          {reproductiveGeneralHeading}
      </div>
      <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
        {questions[currentQuestionIndex].sub}
      </h3>

      <i 
        style={{
          font: "inter",
          fontWeight:"600",
          fontSize: "16px",
          lineHeight:"18.15px",
          color: "#FF0000"
        }}>
          {reproductiveGeneralInfo}
      </i>

      <h3 style={{ margin: "20px 0", fontWeight:"600", color: "#000", fontSize: "15px" }}>
        {label}
        {questions[currentQuestionIndex].question}{" "}
        <span style={{cursor: "pointer"}} onClick={handleInfoModal}>{questions[currentQuestionIndex]?.infoIconBtn}</span>
        <div>{
          questions[currentQuestionIndex]?.question_description}
          <span style={{color:"#325cae", fontWeight:"600", fontSize: "15px"}}>{questions[currentQuestionIndex]?.question_description_answer}</span>
        </div>
        {questions[currentQuestionIndex].postname && (
          <span style={{ color: "#335CAD", fontWeight: "bold" }}>
            {` ${questions[currentQuestionIndex].postname}`}
          </span>
        )}
      </h3>
      {showInfoMoal && 
        <InfoModal
          showInfoMoal={showInfoMoal} 
          handleInfoModal={handleInfoModal} 
        />
      }
      {renderInput(questions[currentQuestionIndex])}
    </div>

    {/* Fixed Button Group */}
    <div
    style={{ marginTop: isMobile ? '10%' : '1%' ,background:'#fff', padding:isMobile ? '25px':'1px'}}
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

export default ReproductiveHealth;