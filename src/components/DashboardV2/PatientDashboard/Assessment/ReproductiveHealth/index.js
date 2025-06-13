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
import { baseUrl } from "../../../../../utils/envAccess";
import CervicalMucusModal from "./CervicalMucusModal";

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
  // {
  //   question: "Since what date have you been trying to conceive?",
  //   type: "date",
  //   title: "Trying to Conceive",
  //   name: "is_trying_to_conceive_time",
  // },

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

  // {
  //   question:
  //   "How frequently do you have intercourse during your fertile window?",
  //   type: "number_with_radio",
  //   title: "Trying to Conceive",
  //   name: "intercourse_during_fertile",
  //   subQuestions: [
  //       {
  //         type: "number_with_radio_sub",
  //         label: "",
  //         name: "intercourse_during_fertile_sub",
  //       },
  //     ],
  // },

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
    infoIcon: true,
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
    infoIcon: true,
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
    "Discharge: Egg white, long (>1\"), slippery, stretchy cervical mucus",
    type: "number_with_radio",
    title: "Duration(put 0 if you do not experience it)",
    name: "egg_white_mucus",
    infoIcon: true,
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
  const [showCervicalMucusModal, setShowCervicalMucusModal] = useState(false);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const patientReproductiveInfo = useSelector((state) => state.intake?.patientReproductiveInfo);
  const [disabledSeverity, setDisabledSeverity] = useState({});
  useEffect(() => {
    // First try to load from localStorage
    const savedAnswers = localStorage.getItem("reproductiveHealthAnswers");
    const savedIndex = localStorage.getItem("currentQuestionIndex5");
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      
      if (savedIndex) {
        setCurrentQuestionIndex(parseInt(savedIndex, 10));
      }
    }

    // Then check if we have API data
    if (patientReproductiveInfo) {
      const normalizeYesNo = (value) => {
        if (value === true || value === "Yes") return "Yes";
        if (value === false || value === "No") return "No";
        if (value === "Unsure") return "Unsure";
        return null;
      };
      const mapDuration = (val) => (val === "0" || val === 0 ? 0 : val || "");
      const mapUnsure = (val) => val === "" || val === null || val === undefined;
      const mapColour = (val, validOptions) => validOptions.includes(val) ? val : "Other";
      const mapOther = (val, mainVal, validOptions) => validOptions.includes(mainVal) ? "" : (val || "");

      
      const mappedAnswers = {
        relaxation_techniques: normalizeYesNo(patientReproductiveInfo.birthControl),
        how_often_hormonal_bc: patientReproductiveInfo.hormonalBirthControl || "",
        how_often_non_hormonal_bc: patientReproductiveInfo.nonHormonalBirthControl || "",
        isPregnant: normalizeYesNo(patientReproductiveInfo.currentlyPregnant),
        is_trying_to_conceive: normalizeYesNo(patientReproductiveInfo.tryingToConceive),
        is_difficulty_to_conceive: normalizeYesNo(patientReproductiveInfo.difficultyTryingToConceive),
        is_family_health_concern: normalizeYesNo(patientReproductiveInfo.familyMemberWithReproductiveConcerns),
        is_trying_to_conceive_time: patientReproductiveInfo.howLongTryingToConceive || "",
        methods_trying_to_conceive: patientReproductiveInfo.methodToConceive || [],
        methods_trying_to_conceive_other: patientReproductiveInfo.otherMethodsConceive || "",
        is_charting_cycles: patientReproductiveInfo.chartingToConceive || [],
        is_charting_cycles_other: patientReproductiveInfo.otherChartingCycle || "",
        current_therapy: normalizeYesNo(patientReproductiveInfo.currentTherapy),
        charting_method: patientReproductiveInfo.methodFertilityAwareness || "",
        is_frequent_intercourse_cycle: patientReproductiveInfo.intercouseEachCycle || "",
        is_menstrual_pain: patientReproductiveInfo.menstrualPainDuringPeriod || [],
        is_lower_back_pain: normalizeYesNo(patientReproductiveInfo.experiencePelvicPain),
        is_pms_symptom: normalizeYesNo(patientReproductiveInfo.doYouPmsSymptoms),
        pms_sympton: patientReproductiveInfo.pmsSymptoms || [],
        pms_sympton_severity: patientReproductiveInfo.pms?.colour || "",
        pms_sympton_check: mapDuration(patientReproductiveInfo.pms?.duration),
        pms_sympton_check_unsure: mapUnsure(patientReproductiveInfo.pms?.duration),
      
        // Pelvic pain
        duration_per_cycle_pp_not_menstrual: mapDuration(patientReproductiveInfo?.duringCirclePelvicPain?.duration),
        duration_per_mild_cycle_severity_pp_not_menstrual: patientReproductiveInfo?.duringCirclePelvicPain?.colour || "",
        duration_per_cycle_pp_not_menstrual_unsure: mapUnsure(patientReproductiveInfo?.duringCirclePelvicPain?.duration),
      
        duration_per_cycle_pelvic_pain: mapDuration(patientReproductiveInfo?.menstralBleedingPelvicPain?.duration),
        duration_per_cycle_pelvic_pain_unsure: mapUnsure(patientReproductiveInfo?.menstralBleedingPelvicPain?.duration),
        duration_per_cycle_severity_pelvic_pain: patientReproductiveInfo.menstralBleedingPelvicPain?.colour || "",
      
        // Cycle lengths
        longest_cycle_radio: mapDuration(patientReproductiveInfo?.longestCycleLenght),
        longest_cycle_radio_unsure: mapUnsure(patientReproductiveInfo?.longestCycleLenght),
        average_cycle_radio: mapDuration(patientReproductiveInfo?.averageCycleLenght),
        average_cycle_radio_unsure: mapUnsure(patientReproductiveInfo?.averageCycleLenght),
        shortest_cycle_radio: mapDuration(patientReproductiveInfo?.shortestCycleLenght),
        shortest_cycle_radio_unsure: mapUnsure(patientReproductiveInfo?.shortestCycleLenght),
      
        // Spotting
        mid_cycle_spotting: normalizeYesNo(patientReproductiveInfo.midCycleSpotting),
        cycle_spotting_sub_number: mapDuration(patientReproductiveInfo?.midCycleSpottingFrequency?.duration),
        cycle_spotting_sub_number_unsure: mapUnsure(patientReproductiveInfo?.midCycleSpottingFrequency?.duration),
        cycle_spotting_sub: patientReproductiveInfo.midCycleSpottingFrequency?.colour || "",
        // cycle_spotting_sub_number_unsure: patientReproductiveInfo?.midCycleSpottingFrequency?.duration === "0" ? "0" : "",
        cycle_spotting_sub_frq: patientReproductiveInfo.midCycleSpottingFrequency?.frequency || "",
      
        // Cervical mucus
        cervical_mucus: mapDuration(patientReproductiveInfo?.cycleDischargeCreamy?.duration),
        cervical_mucus_unsure: mapUnsure(patientReproductiveInfo?.cycleDischargeCreamy?.duration),
     
        cervical_mucus_sub: patientReproductiveInfo.cycleDischargeCreamy?.colour || "",
        cervical_mucus_sub_other: patientReproductiveInfo.otherMucusSub || "",
      
        Watery_mucus_sub: mapDuration(patientReproductiveInfo?.cycleDischargeWatery?.duration),
        Watery_mucus_sub_unsure: mapUnsure(patientReproductiveInfo?.cycleDischargeWatery?.duration),
        Watery_mucus_colour: mapColour(patientReproductiveInfo.cycleDischargeWatery?.colour, ["White", "Other"]),
        Watery_mucus_colour_other: mapOther(patientReproductiveInfo.otherWateryMucus, patientReproductiveInfo.cycleDischargeWatery?.colour, ["White", "Other"]),
      
        egg_white_mucus_sub: mapDuration(patientReproductiveInfo?.cycleDischargeEggWhite?.duration),
        egg_white_mucus_sub_unsure: mapUnsure(patientReproductiveInfo?.cycleDischargeEggWhite?.duration),
        egg_white_mucus_colour: mapColour(patientReproductiveInfo.cycleDischargeEggWhite?.colour, ["White", "Other"]),
        egg_white_mucus_colour_other: mapOther(patientReproductiveInfo.otherWhiteMucus, patientReproductiveInfo.cycleDischargeEggWhite?.colour, ["White", "Other"]),
      
        pre_spotting_sub: mapDuration(patientReproductiveInfo?.cycleDischargePrePeriod?.duration),
        pre_spotting_sub_unsure: mapUnsure(patientReproductiveInfo?.cycleDischargePrePeriod?.duration),
        pre_spotting_colour: mapColour(patientReproductiveInfo.cycleDischargePrePeriod?.colour, ["None", "Pink", "Red", "Brown", "Black", "Other"]),
        pre_spotting_colour_other: mapOther(patientReproductiveInfo.otherSpottingColour, patientReproductiveInfo.cycleDischargePrePeriod?.colour, ["None", "Pink", "Red", "Brown", "Black", "Other"]),
      
        after_period_spot_sub: mapDuration(patientReproductiveInfo?.cycleDischargeAfterPeriodSpotting?.duration),
        after_period_spot_sub_unsure: mapUnsure(patientReproductiveInfo?.cycleDischargeAfterPeriodSpotting?.duration),
        after_period_spot_colour: patientReproductiveInfo?.cycleDischargeAfterPeriodSpotting?.colour || "",
      
        intercourse_during_fertile_sub: mapDuration(patientReproductiveInfo?.intercouseDays),
        intercourse_during_fertile_sub_unsure: mapUnsure(patientReproductiveInfo?.intercouseDays),
      };
           
      // Only override localStorage data if we have API data
      if (Object.keys(mappedAnswers).some(key => mappedAnswers[key])) {
        setAnswers((prev) => ({
          ...prev,
          ...mappedAnswers,
          cervical_mucus_sub: "",
          cervical_mucus_sub_other: "",
          Watery_mucus_colour: "",
          Watery_mucus_colour_other: "",
          egg_white_mucus_colour: "",
          egg_white_mucus_colour_other: "",
          pre_spotting_colour: "",
          pre_spotting_colour_other: "",
        }));

        //  Add this after setAnswers(...) inside the if (patientReproductiveInfo) block
        const newDisabledSeverity = {};

        // Match same logic as in handleChange
        if (patientReproductiveInfo.cycleDischargeAfterPeriodSpotting?.duration === "0") {
          newDisabledSeverity["after_period_spot_colour"] = true;
        }
        if (patientReproductiveInfo.cycleDischargePrePeriod?.duration === "0") {
          newDisabledSeverity["pre_spotting_colour"] = true;
        }
        if (patientReproductiveInfo.cycleDischargeWatery?.duration === "0") {
          newDisabledSeverity["Watery_mucus_colour"] = true;
        }
        if (patientReproductiveInfo.cycleDischargeEggWhite?.duration === "0") {
          newDisabledSeverity["egg_white_mucus_colour"] = true;
        }
        if (patientReproductiveInfo.cycleDischargeCreamy?.duration === "0") {
          newDisabledSeverity["cervical_mucus_sub"] = true;
        }
        if (patientReproductiveInfo.midCycleSpottingFrequency?.duration === "0") {
          newDisabledSeverity["cycle_spotting_sub"] = true;
        }
        if (patientReproductiveInfo.menstralBleedingPelvicPain?.duration === "0") {
          newDisabledSeverity["duration_per_cycle_severity_pelvic_pain"] = true;
        }
        if (patientReproductiveInfo.duringCirclePelvicPain?.duration === "0") {
          newDisabledSeverity["duration_per_mild_cycle_severity_pp_not_menstrual"] = true;
        }
        if (patientReproductiveInfo.pms?.duration === "0") {
          newDisabledSeverity["pms_sympton_severity"] = true;
        };

        const newCleanedAnswers = { ...mappedAnswers };

        // Watery mucus
        // if (mappedAnswers.Watery_mucus_sub === "0") {
        //   newDisabledSeverity["Watery_mucus_colour"] = true;
        //   newCleanedAnswers["Watery_mucus_colour"] = "";
        //   newCleanedAnswers["Watery_mucus_colour_other"] = "";
        // }

        // // Egg white mucus
        // if (mappedAnswers.egg_white_mucus_sub === "0") {
        //   newDisabledSeverity["egg_white_mucus_colour"] = true;
        //   newCleanedAnswers["egg_white_mucus_colour"] = "";
        //   newCleanedAnswers["egg_white_mucus_colour_other"] = "";
        // }

        // // Pre spotting
        // if (mappedAnswers.pre_spotting_sub === "0") {
        //   newDisabledSeverity["pre_spotting_colour"] = true;
        //   newCleanedAnswers["pre_spotting_colour"] = "";
        //   newCleanedAnswers["pre_spotting_colour_other"] = "";
        // }

        // //  Clean & disable if duration is 0
        // const dischargeFields = [
        //   { sub: "Watery_mucus_sub", colour: "Watery_mucus_colour" },
        //   { sub: "egg_white_mucus_sub", colour: "egg_white_mucus_colour" },
        //   { sub: "pre_spotting_sub", colour: "pre_spotting_colour" }
        // ];

        // dischargeFields.forEach(({ sub, colour }) => {
        //   if (mappedAnswers[sub] === "0") {
        //     newDisabledSeverity[colour] = true;
        //     newCleanedAnswers[colour] = "";                  // 🔁 Clear colour radio value
        //     newCleanedAnswers[`${colour}_other`] = "";       // 🔁 Clear "Other" text input
        //   }
        // });

        const clearColourIfZero = (durationField, colourField) => {
          if (mappedAnswers[durationField] === "0") {
            newDisabledSeverity[colourField] = true;
            newCleanedAnswers[colourField] = "";
            newCleanedAnswers[`${colourField}_other`] = "";
          }
        };
        
        clearColourIfZero("Watery_mucus_sub", "Watery_mucus_colour");
        clearColourIfZero("egg_white_mucus_sub", "egg_white_mucus_colour");
        clearColourIfZero("pre_spotting_sub", "pre_spotting_colour");

        // Apply to state
        setAnswers((prev) => ({
          ...prev,
          ...newCleanedAnswers,
        }));

        setDisabledSeverity(newDisabledSeverity);

        // Clear localStorage since we're using API data
        localStorage.removeItem("reproductiveHealthAnswers");
        localStorage.removeItem("currentQuestionIndex5");
      }
    }
  }, [patientReproductiveInfo]);
  
  useEffect(() => {
    dispatch(getReproductiveHealthPatient());
  }, [dispatch]);

  const isOtherOptionInvalid = (name, value) => {
    if (value === "Other" || (Array.isArray(value) && value.includes("Other"))) {
      const otherText = answers[`${name}_other`];
      return typeof otherText !== "string" || otherText.trim() === "";
    }
    return false;
  };

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
    const mainAnswer = answers[question.name];
    // Additional check for "Other" option
    
    if (isOtherOptionInvalid(question.name, mainAnswer)) {
      return false;
    }
    // Skip validation for info and info_spotting type questions
    if (question.type === "info" || question.type === "info_spotting") {
      return true;
    }
    //console.log("answers[subQuestion.name]--", answers[subQuestion.name]);
    if(question.type === "long_radio" &&  (mainAnswer === "" || mainAnswer === undefined || mainAnswer === null)){
      return false;
    }
    if (
      questions[currentQuestionIndex].name === "relaxation_techniques" &&
      answers["relaxation_techniques"] === "Yes" &&
      (!answers["how_often_hormonal_bc"] || !answers["how_often_non_hormonal_bc"])
    ) {
      return;
    }
    if (
      questions[currentQuestionIndex].name === "current_therapy" &&
      answers["current_therapy"] === "Yes" &&
      (!answers["charting_method"])
    ) {
      return;
    }
    if (questions[currentQuestionIndex].name !== "cervical_mucus" && (mainAnswer === null || mainAnswer === "")) {
      return false;
    } 
    const isMainQuestionValid = mainAnswer !== undefined && mainAnswer !== "";
    if (isOtherOptionInvalid(question.name, mainAnswer)) {
      return false;
    }

    let subQuestionsValid = true;

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
            // Validate "Other" selection must include input text
            if (subAnswer === "Other") {
              const otherInputValue = answers[`${subQuestion.name}_other`];
              if (!otherInputValue || otherInputValue.trim() === "") {
                subQuestionsValid = false;
                break;
              }
            }

            if (
              ["longest_cycle_radio", "shortest_cycle_radio", "average_cycle_radio"].includes(subQuestion.name)
            ) {
              if (
                (subAnswer === undefined || subAnswer === "" || subAnswer === null) &&
                !subUnsure
              ) {
                subQuestionsValid = false;
                return false;
              }
            }
            if (isOtherOptionInvalid(subQuestion.name, subAnswer)) {
              subQuestionsValid = false;
              break;
            }
            
            // If at least one subquestion is not unsure, set flag to false
            if (!subUnsure) {
                allSubQuestionsUnsure = false;
            }

            if (subQuestion.type === "number_with_radio_sub") {
              const parsed = Number(subAnswer);
              const subUnsure = answers[`${subQuestion.name}_unsure`];
            
              const hasValue = !(subAnswer === undefined || subAnswer === "" || isNaN(parsed));
              const isZero = parsed === 0;
            
              // ✅ Block 1: Validation FAIL — if no input and not unsure, but related field has value
              const relatedRadioFields = {
                cervical_mucus_sub: "cervical_mucus",
                Watery_mucus_sub: "Watery_mucus_colour",
                egg_white_mucus_sub: "egg_white_mucus_colour",
                pre_spotting_sub: "pre_spotting_colour",
                after_period_spot_sub: "after_period_spot_colour",
                duration_per_cycle_pelvic_pain: "duration_per_cycle_severity_pelvic_pain",
                duration_per_cycle_pp_not_menstrual: "duration_per_mild_cycle_severity_pp_not_menstrual",
                cycle_spotting_sub_number: "cycle_spotting_sub",
                pms_sympton_check: "pms_sympton_severity"
              };
            
              const relatedField = relatedRadioFields[subQuestion.name];
              const relatedAnswer = answers[relatedField];
              console.log(hasValue, parsed, relatedAnswer);

              if (hasValue && parsed > 0 && (!relatedAnswer || relatedAnswer === "" || relatedAnswer === "N/A")) {
                subQuestionsValid = false;
                return false;
              }
              // ✅ Validation: If unsure is selected but severity/colour not selected → fail
              if (subUnsure && (!relatedAnswer || relatedAnswer === "" || relatedAnswer === "N/A")) {
                subQuestionsValid = false;
                return false;
              }

              
              if (!hasValue && !subUnsure && relatedAnswer) {
                // ❌ Input missing but severity/colour selected → fail
                subQuestionsValid = false;
                return false;
              }
            
              // ✅ Block 2: Input is 0 → skip severity/colour
              if (hasValue && isZero) {
                return true;
              }
            
              // ✅ Block 3: If no input and not unsure at all → also fail
              if (!hasValue && !subUnsure) {
                subQuestionsValid = false;
                return false;
              }
            }
            
            if (subQuestion.type === "radio") {
              const skipValidationMap = {
                duration_per_cycle_severity_pelvic_pain: "duration_per_cycle_pelvic_pain",
                duration_per_mild_cycle_severity_pp_not_menstrual: "duration_per_cycle_pp_not_menstrual",
                pms_sympton_severity: "pms_sympton_check",
                cervical_mucus_sub: "cervical_mucus",
                Watery_mucus_colour: "Watery_mucus_sub",
                egg_white_mucus_colour: "egg_white_mucus_sub",
                pre_spotting_colour: "pre_spotting_sub",
                after_period_spot_colour: "after_period_spot_sub",
                cycle_spotting_sub: "cycle_spotting_sub_number",
              };
            
              const controllingField = skipValidationMap[subQuestion.name];
              const controllingValue = answers[controllingField];
              const isDisabled = disabledSeverity?.[subQuestion.name];  // ✅ NEW LINE
            
              const skip = isDisabled || controllingValue === 0 || controllingValue === "0";
            
              if (!subAnswer && !skip) {
                subQuestionsValid = false;
                break;
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
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    
    // Save current answers and question index to localStorage
    localStorage.setItem("reproductiveHealthAnswers", JSON.stringify(answers));
    localStorage.setItem("currentQuestionIndex5", currentQuestionIndex + 1);

    const currentQuestion = questions[currentQuestionIndex];
    if(currentQuestion.name === "is_pms_symptom" && answers.is_pms_symptom === "No"){
      setCurrentQuestionIndex(currentQuestionIndex + 2);
      return;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  
  const handlePrevious = () => {
    let getPmsSymtom = JSON.parse(localStorage.getItem("reproductiveHealthAnswers"));
    if(getPmsSymtom?.is_pms_symptom === "No"){
      setCurrentQuestionIndex(currentQuestionIndex - 2);
      return;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleChange = (value, name) => {
    let updatedAnswers = { ...answers };
    // Handle disabling of color/severity when unsure is selected
    if (name.endsWith("_unsure")) {
      const baseName = name.replace("_unsure", "");
      const relatedDisables = {
        duration_per_cycle_pp_not_menstrual: ["duration_per_mild_cycle_severity_pp_not_menstrual"],
        cervical_mucus: ["cervical_mucus_sub"],
        Watery_mucus_sub: ["Watery_mucus_colour", "Watery_mucus_colour_other"],
        egg_white_mucus_sub: ["egg_white_mucus_colour", "egg_white_mucus_colour_other"],
        pre_spotting_sub: ["pre_spotting_colour", "pre_spotting_colour_other"],
        after_period_spot_sub: ["after_period_spot_colour"],
        pms_sympton_check: ["pms_sympton_severity"],
        cycle_spotting_sub_number: ["cycle_spotting_sub"]
      };

      const relatedFields = relatedDisables[baseName];
      if (Array.isArray(relatedFields)) {
        relatedFields.forEach((field) => {
          // enable field when unsure is checked
          setDisabledSeverity((prev) => ({ ...prev, [field]: false }));
        });
      }

      updatedAnswers[name] = value;

      // If unsure is selected, clear the base field
      if (value === true) {
        updatedAnswers[baseName] = "";
      }
    } 

    if (
      name === "duration_per_cycle_pelvic_pain" ||
      name === "duration_per_cycle_pp_not_menstrual" ||
      name === "pms_sympton_check"
    ) {
      const severityFieldMap = {
        duration_per_cycle_pelvic_pain: "duration_per_cycle_severity_pelvic_pain",
        duration_per_cycle_pp_not_menstrual: "duration_per_mild_cycle_severity_pp_not_menstrual",
        pms_sympton_check: "pms_sympton_severity",
      };
      const severityField = severityFieldMap[name];
      if (value === 0 || value === "0") {
        updatedAnswers[severityField] = "";
        setDisabledSeverity((prev) => ({ ...prev, [severityField]: true }));
      } else {
        setDisabledSeverity((prev) => ({ ...prev, [severityField]: false }));
      }
    }

    if (name === "cervical_mucus") {
      if (value === 0 || value === "0") {
        updatedAnswers["cervical_mucus_sub"] = "";
        setDisabledSeverity((prev) => ({ ...prev, cervical_mucus_sub: true }));
      } else {
        setDisabledSeverity((prev) => ({ ...prev, cervical_mucus_sub: false }));
      }
    }

    if (name === "cycle_spotting_sub_number") {
      if (value === 0 || value === "0") {
        updatedAnswers["cycle_spotting_sub"] = "";
        setDisabledSeverity((prev) => ({ ...prev, cycle_spotting_sub: true }));
      } else {
        setDisabledSeverity((prev) => ({ ...prev, cycle_spotting_sub: false }));
      }
    }
    
    
    const dischargeMap = {
      cervical_mucus: "cervical_mucus_sub",
      Watery_mucus_sub: "Watery_mucus_colour",
      egg_white_mucus_sub: "egg_white_mucus_colour",
      pre_spotting_sub: "pre_spotting_colour",
      after_period_spot_sub: "after_period_spot_colour",
      cycle_spotting_sub_number: "cycle_spotting_sub",
    };
    
    if (name in dischargeMap) {
      const relatedColourField = dischargeMap[name];
      if (value === 0 || value === "0") {
        updatedAnswers[relatedColourField] = "";
        // clear the corresponding *_other field if it exists
        updatedAnswers[`${relatedColourField}_other`] = "";
        setDisabledSeverity((prev) => ({ ...prev, [relatedColourField]: true }));
      } else {
        setDisabledSeverity((prev) => ({ ...prev, [relatedColourField]: false }));
      }
    }
    
    
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
    // If unsure checkbox is selected, re-enable severity/colour field
    if (name.endsWith("_unsure") && value === true) {
      const baseField = name.replace("_unsure", "");

      const reverseDischargeMap = {
        cervical_mucus: "cervical_mucus_sub",
        Watery_mucus_sub: "Watery_mucus_colour",
        egg_white_mucus_sub: "egg_white_mucus_colour",
        pre_spotting_sub: "pre_spotting_colour",
        after_period_spot_sub: "after_period_spot_colour",
        cycle_spotting_sub_number: "cycle_spotting_sub",
        duration_per_cycle_pelvic_pain: "duration_per_cycle_severity_pelvic_pain",
        duration_per_cycle_pp_not_menstrual: "duration_per_mild_cycle_severity_pp_not_menstrual",
        pms_sympton_check: "pms_sympton_severity",
      };

      const relatedField = reverseDischargeMap[baseField];
      if (relatedField) {
        setDisabledSeverity((prev) => ({
          ...prev,
          [relatedField]: false,  // ✅ Re-enable related field
        }));
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

      localStorage.setItem("reproductiveHealthAnswers", JSON.stringify(answers));
      const reproductiveHealthAnswers = JSON.parse(localStorage.getItem("reproductiveHealthAnswers")) || {};
      const formatDuration = (value) => {
        return value === "" || value === null || value === undefined ? null : String(value);
      };

      const requestData = {
        birthControl: reproductiveHealthAnswers.relaxation_techniques === "Yes",
        hormonalBirthControl: reproductiveHealthAnswers.how_often_hormonal_bc || "N/A",
        nonHormonalBirthControl: reproductiveHealthAnswers.how_often_non_hormonal_bc || "N/A",
        currentlyPregnant: reproductiveHealthAnswers.isPregnant === "Yes",
        tryingToConceive: reproductiveHealthAnswers.is_trying_to_conceive === "Yes",
        difficultyTryingToConceive: reproductiveHealthAnswers.is_difficulty_to_conceive === "Yes",
        familyMemberWithReproductiveConcerns: reproductiveHealthAnswers.is_family_health_concern === "Yes"
          ? "Yes"
          : reproductiveHealthAnswers.is_family_health_concern || "No",
        howLongTryingToConceive: reproductiveHealthAnswers.is_trying_to_conceive === "Yes"
          ? (reproductiveHealthAnswers.is_trying_to_conceive_time || "N/A")
          : "N/A",
        methodToConceive: reproductiveHealthAnswers?.methods_trying_to_conceive || [],
        otherMethodsConceive: reproductiveHealthAnswers?.methods_trying_to_conceive_other || "",
        chartingToConceive: reproductiveHealthAnswers.is_charting_cycles || [],
        otherChartingCycle: reproductiveHealthAnswers?.is_charting_cycles_other || "",
        utilizingFertilityAwareness: reproductiveHealthAnswers.current_therapy === "Yes",
        methodFertilityAwareness: reproductiveHealthAnswers.charting_method || "N/A",
        intercouseDays: formatDuration(reproductiveHealthAnswers.intercourse_during_fertile_sub),
        intercouseEachCycle: reproductiveHealthAnswers.is_frequent_intercourse_cycle || "N/A",
        menstrualPainDuringPeriod: reproductiveHealthAnswers.is_menstrual_pain || [],
        menstralBleedingPelvicPain: {
          duration: formatDuration(reproductiveHealthAnswers.duration_per_cycle_pelvic_pain),
          colour: reproductiveHealthAnswers.duration_per_cycle_severity_pelvic_pain || "N/A"
        },
        experiencePelvicPain: reproductiveHealthAnswers.is_lower_back_pain === "Yes",
        duringCirclePelvicPain: {
          duration: formatDuration(reproductiveHealthAnswers.duration_per_cycle_pp_not_menstrual),
          colour: reproductiveHealthAnswers.duration_per_mild_cycle_severity_pp_not_menstrual || "N/A"
        },
        doYouPmsSymptoms: reproductiveHealthAnswers.is_pms_symptom === "Yes",
        pmsSymptoms: reproductiveHealthAnswers.pms_sympton || [],
        pms: {
          duration: formatDuration(reproductiveHealthAnswers.pms_sympton_check),
          colour: reproductiveHealthAnswers.pms_sympton_severity || "N/A"
        },
        longestCycleLenght: formatDuration(reproductiveHealthAnswers.longest_cycle_radio),
        shortestCycleLenght: formatDuration(reproductiveHealthAnswers.shortest_cycle_radio),
        averageCycleLenght: formatDuration(reproductiveHealthAnswers.average_cycle_radio),
        midCycleSpotting: reproductiveHealthAnswers.mid_cycle_spotting === "Yes",
        midCycleSpottingFrequency: reproductiveHealthAnswers.mid_cycle_spotting === "Yes" ? {
          frequency: reproductiveHealthAnswers.cycle_spotting_sub_frq || "None",
          duration: formatDuration(reproductiveHealthAnswers.cycle_spotting_sub_number),
          colour: reproductiveHealthAnswers.cycle_spotting_sub || "None"
        } : {
          frequency: "None",
          duration: null,
          colour: "None"
        },
        menstralCycleFrequency: reproductiveHealthAnswers.menstralCycleFrequency || "Unknown",
        menstralCycleDuration: reproductiveHealthAnswers.menstralCycleDuration || "Unknown",
        menstralCycleColour: reproductiveHealthAnswers.menstralCycleColour || "Unknown",
        cycleDischargeCreamy: {
          duration: formatDuration(reproductiveHealthAnswers.cervical_mucus),
          colour: reproductiveHealthAnswers.cervical_mucus_sub || "N/A"
        },
        otherMucusSub: reproductiveHealthAnswers.cervical_mucus_sub_other || "",
        cycleDischargeWatery: {
          duration: formatDuration(reproductiveHealthAnswers.Watery_mucus_sub),
          colour: reproductiveHealthAnswers.Watery_mucus_colour === "Other"
            ? reproductiveHealthAnswers.Watery_mucus_colour_other
            : (reproductiveHealthAnswers.Watery_mucus_colour || "N/A")
        },
        otherWateryMucus: reproductiveHealthAnswers.Watery_mucus_colour_other || "",
        cycleDischargeEggWhite: {
          duration: formatDuration(reproductiveHealthAnswers.egg_white_mucus_sub),
          colour: reproductiveHealthAnswers.egg_white_mucus_colour === "Other"
            ? reproductiveHealthAnswers.egg_white_mucus_colour_other
            : (reproductiveHealthAnswers.egg_white_mucus_colour || "N/A")
        },
        otherWhiteMucus: reproductiveHealthAnswers.egg_white_mucus_colour_other || "",
        cycleDischargePrePeriod: {
          duration: formatDuration(reproductiveHealthAnswers.pre_spotting_sub),
          colour: reproductiveHealthAnswers.pre_spotting_colour === "Other"
            ? reproductiveHealthAnswers.pre_spotting_colour_other
            : (reproductiveHealthAnswers.pre_spotting_colour || "N/A")
        },
        otherSpottingColour: reproductiveHealthAnswers.pre_spotting_colour_other || "",
        cycleDischargeMenstralBleeding: {
          duration: reproductiveHealthAnswers.menstrual_bleeding_sub !== undefined
            ? String(
                reproductiveHealthAnswers.menstrual_bleeding_sub + ", " +
                reproductiveHealthAnswers.days_light_bleeding + ", " +
                reproductiveHealthAnswers.days_moderate_bleeding + ", " +
                reproductiveHealthAnswers.days_heavy_bleeding + ", " +
                reproductiveHealthAnswers.days_very_heavy_bleeding
              )
            : "N/A",
          colour: reproductiveHealthAnswers.menstrual_bleeding_sub_colour || "N/A",
          clots: reproductiveHealthAnswers.menstrual_bleeding_sub_clots || "N/A"
        },
        cycleDischargeAfterPeriodSpotting: {
          duration: formatDuration(reproductiveHealthAnswers.after_period_spot_sub),
          colour: reproductiveHealthAnswers.after_period_spot_colour || "N/A"
        },
        chartBase64: reproductiveHealthAnswers.charting_method || "",
        currentTherapy: reproductiveHealthAnswers.current_therapy === "Yes"
      };
      
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj?.token || "";
  
      const response = await fetch(
        `${baseUrl}Patient/AddReproductiveHealth`,
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
        console.log("API response:", result, setisDisabled);
        message.success("Form submitted successfully!");
        // Clear localStorage after successful submission
        localStorage.removeItem("reproductiveHealthAnswers");
        localStorage.removeItem("currentQuestionIndex5");
        dispatch(completeCard("/questionnaire/11"));
        localStorage.setItem("currentQuestionIndex11", 0);
        localStorage.setItem("currentStep", 1);
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
            value={answers[`${subQuestion.name}_unsure`] ? null : (answers[subQuestion.name] ?? "")}

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
                    value={answers[`${subQuestion.name}_unsure`] ? null : (answers[subQuestion.name] ?? "")} // Default to 0 instead of undefined

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
           value={disabledSeverity[subQuestion.name] ? undefined : answers[subQuestion.name]}
           disabled={disabledSeverity[subQuestion.name]}
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
                   disabled={isDisabled || disabledSeverity[subQuestion.name]}

                 >
                  <span style={{ verticalAlign: 'text-bottom' }}>{option}</span>
                 </Radio>
                 {option === "Other" && answers[subQuestion.name] === "Other" && !disabledSeverity[subQuestion.name] && (
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
                        className="input_questtionnaire"
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
               <InfoCircleOutlined />  Pre-Period Spotting:
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
                <InfoCircleOutlined />  After Period Spotting:
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
                <InfoCircleOutlined />  Bleeding:
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
        {["info", "infoSpotting"].includes(questions[currentQuestionIndex]?.name) ? "" : label}
        {questions[currentQuestionIndex].question}{" "}
        {questions[currentQuestionIndex]?.infoIconBtn && (
          <span style={{cursor: "pointer"}} onClick={handleInfoModal}>
            {questions[currentQuestionIndex]?.infoIconBtn}
          </span>
        )}
        {questions[currentQuestionIndex]?.infoIcon && (
          <InfoCircleOutlined 
            style={{ 
              marginLeft: '8px', 
              color: '#00ADEF',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            onClick={() => setShowCervicalMucusModal(true)}
          />
        )}
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
      <CervicalMucusModal 
        visible={showCervicalMucusModal}
        onClose={() => setShowCervicalMucusModal(false)}
      />
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