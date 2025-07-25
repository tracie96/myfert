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
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import { getHealthMedicalPatient } from "../../../../redux/AssessmentController";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import dayjs from 'dayjs';
import { baseUrl } from "../../../../../utils/envAccess";

const { Option } = Select;

const startYear = 2025;

const disableBefore2006 = (current) => {
  return current && current > dayjs(`${startYear}-01-01`);
};

const questions = [
  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "Overall",
    name: "overll_wellbeing",
  },
  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "At school",
    name: "school_wellbeing",
  },
  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "In your job",
    name: "job_wellbeing",
  },
  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "In your social life",
    name: "social_life_wellbeing",
  },

  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With close friends",
    name: "close_friends_wellbeing",
  },

  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With Sex",
    name: "sex_wellbeing",
  },

  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your attitude",
    name: "attitude_wellbeing",
  },

  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your boyfriend/girlfriend",
    name: "relationship_wellbeing",
  },

  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your children",
    name: "children_wellbeing",
  },
  {
    title: "How well have things been going for you?",
    question:
      "(Enter score on scale of 1-10, with 1 being poorly, 5 being fine, and 10 being very well; choose N/A if not applicable) :",
    type: "rating_scale",
    sub: "With your parents",
    name: "parents_wellbeing",
  },
  {
    title: "How well have things been going for you?",
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
    options: ["Term", "Premature", "Don't know"],
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
        name: "birth_complications_details",
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
        name: "food_avoided",
      },
    ],
  },
  {
    question: "Did you eat a lot of sugar or candy as a child?",
    type: "radio",
    name: "eat_sugar_as_a_child",
    options: ["Yes", "No"],
  },
  // {
  //   question:
  //     "Check if you have any of the following, and provide number if applicable:",
  //   type: "checkbox_with_select",
  //   options: [
  //     {
  //       label: "Silver mercury fillings",
  //       name: "Silver_mercury_fillings",
  //       selectName: "Silver_mercury_fillings_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //     {
  //       label: "Gold fillings",
  //       name: "Gold_fillings",
  //       selectName: "Gold_fillings_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //     {
  //       label: "Root canals",
  //       name: "Root_canals",
  //       selectName: "Root_canals_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //     {
  //       label: "Implants",
  //       name: "Implants",
  //       selectName: "Implants_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //     {
  //       label: "Caps/Crowns",
  //       name: "Caps/Crowns",
  //       selectName: "Caps/Crowns_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //     {
  //       label: "Tooth pain",
  //       name: "Tooth_pain",
  //       selectName: "Tooth_pain_select",
  //       selectOptions: Array.from({ length: 30 }, (_, i) => 1 + i),
  //     },
  //   ],
  // },
  {
    question: "Have you had any mercury fillings removed?",
    type: "long_radio",
    name: "mercury_filings",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, when?",
        type: "text",
        name: "mercury_fillings_removed",
      },
    ],
  },
  {
    question: "How many fillings did you have as a kid?",
    type: "select",
    name: "fillings_removed",
    options: Array.from({ length: 48 }, (_, i) => 1 + i),
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
      "None",
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
      "None",
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
        name: "harmful_chemical_exposure",
      },
      {
        question: "Length of Exposure",
        type: "select",
        name: "harmful_chemical_exposure_length",
        options: Array.from({ length: 48 }, (_, i) => 1 + i),
      },
      {
        question: "Date:",
        type: "date",
        name: "harmful_chemical_exposure_date",
      },
    ],
  },
  {
    question: "Do you have any pets or farm animals?",
    type: "long_radio",
    name: "pets_or_animal",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, do they live:",
        type: "radio",
        name: "where_they_live",
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
  const patientHealthMedicalInfo = useSelector((state) => state.intake?.patientHealthMedicalInfo);
  
  useEffect(() => {
    dispatch(getHealthMedicalPatient());
  }, [dispatch]);

  console.log(patientHealthMedicalInfo,'patientHealthMedicalInfo')

  useEffect(() => {
    if (patientHealthMedicalInfo) {
      const lifestyle = patientHealthMedicalInfo;
      const normalizeYesNo = (value) => {
        if (value === true) return "Yes";
        if (value === false) return "No";
        return null;
      };

      const smokeIrritantsOptions = questions.find(
        (q) => q.name === "smoke_irritants"
      )?.options || [];

      const workEnvIrritantsOptions = questions.find(
        (q) => q.name === "work_env_smoke_irritants"
      )?.options || [];

      let smokeIrritants = lifestyle.environmentEffect || [];
      let smokeIrritantsOther = "";
      let workEnvIrritants = lifestyle.environmentExposed || [];
      let workEnvIrritantsOther = "";

      // Handle smoke irritants
      const customValue = smokeIrritants.find(value => !smokeIrritantsOptions.includes(value));
      if (customValue) {
        smokeIrritantsOther = customValue;
        smokeIrritants = smokeIrritants.filter(value => value !== customValue);
        smokeIrritants.push("Other");
      }

      // Handle work environment irritants
      const customWorkValue = workEnvIrritants.find(value => !workEnvIrritantsOptions.includes(value));
      if (customWorkValue) {
        workEnvIrritantsOther = customWorkValue;
        workEnvIrritants = workEnvIrritants.filter(value => value !== customWorkValue);
        workEnvIrritants.push("Other");
      }

      const prefillAnswers = {
        overll_wellbeing: lifestyle.howWellThingsGoingOverall ?? 1,
        overll_wellbeing_na: lifestyle.howWellThingsGoingOverall === 0, 
        school_wellbeing: lifestyle.howWellThingsGoingSchool || 1,
        school_wellbeing_na: lifestyle.howWellThingsGoingSchool === 0,
        job_wellbeing: lifestyle.howWellThingsGoingJob || 1,
        job_wellbeing_na: lifestyle.howWellThingsGoingJob === 0,  
        social_life_wellbeing: lifestyle.howWellThingsGoingSocialLife || 1,
        social_life_wellbeing_na: lifestyle.howWellThingsGoingSocialLife === 0,
        close_friends_wellbeing: lifestyle.howWellThingsGoingCloseFriends || 1,
        close_friends_wellbeing_na: lifestyle.howWellThingsGoingCloseFriends === 0,
        sex_wellbeing: lifestyle.howWellThingsGoingSex || 1,
        sex_wellbeing_na: lifestyle.howWellThingsGoingSex === 0,
        attitude_wellbeing: lifestyle.howWellThingsGoingAttitude || 1,
        attitude_wellbeing_na: lifestyle.howWellThingsGoingAttitude === 0,
        relationship_wellbeing: lifestyle.howWellThingsGoingPartner || 1,
        relationship_wellbeing_na: lifestyle.howWellThingsGoingPartner === 0,
        children_wellbeing: lifestyle.howWellThingsGoingKids || 1,
        children_wellbeing_na: lifestyle.howWellThingsGoingKids === 0,
        parents_wellbeing: lifestyle.howWellThingsGoingParents || 1,
        parents_wellbeing_na: lifestyle.howWellThingsGoingParents === 0,
        spouse_wellbeing: lifestyle.howWellThingsGoingSpouse || 1,
        spouse_wellbeing_na: lifestyle.howWellThingsGoingSpouse === 0,
        mode_of_own_birth: lifestyle.howWereYouBorn,
        birth_complications: normalizeYesNo(lifestyle.wereYouBornWithComplication?.yesNo),
        birth_complications_details: lifestyle.wereYouBornWithComplication?.describe || "",
        breast_fed_duration: lifestyle.breastFedHowLong || "",
        bottle_fed_type: lifestyle.breastFedFormula || "",
        dont_know: lifestyle.breastFoodDontKnow || false,
        age_of_solid_food_intro: lifestyle.ageIntroductionSolidFood || "",
        age_of_wheat_food_intro: lifestyle.ageIntroductionWheat || "",
        age_of_diary_food_intro: lifestyle.ageIntroductionDiary || "",
        allergic_food: normalizeYesNo(lifestyle.foodsAvoided),
        food_avoided: lifestyle.foodsAvoidTypeSymptoms || "",
        eat_sugar_as_a_child: normalizeYesNo(lifestyle.alotSugar),
        mercury_filings: normalizeYesNo(lifestyle.mercuryFillingRemoved),
        mercury_fillings_removed: lifestyle.mercuryFillingRemovedWhen || "",
        fillings_removed: lifestyle.fillingsAsKid || "",
  
        do_you_brush_regularly: normalizeYesNo(lifestyle.brushRegularly),
        do_you_floss_regularly: normalizeYesNo(lifestyle.flossRegularly),
  
        smoke_irritants: smokeIrritants,
        smoke_irritants_other: smokeIrritantsOther,
        work_env_smoke_irritants: workEnvIrritants,
        work_env_smoke_irritants_other: workEnvIrritantsOther,
  
        harmful_chemicals: normalizeYesNo(lifestyle.exposedHarmfulChemical),
        harmful_chemical_exposure: lifestyle.whenExposedHarmfulChemical?.chemicalName || "",
        harmful_chemical_exposure_length: lifestyle.whenExposedHarmfulChemical?.lenghtExposure || "",
        harmful_chemical_exposure_date: lifestyle.whenExposedHarmfulChemical?.dateExposure || "",
  
        pets_or_animal: normalizeYesNo(lifestyle.petsFarmAnimal),
        where_they_live: lifestyle.petsAnimalLiveWhere || "",
        age_of_solid_food_intro_unsure: lifestyle.ageIntroductionSolidFood === 0,
        age_of_wheat_food_intro_unsure: lifestyle.ageIntroductionWheat === 0,
        age_of_diary_food_intro_unsure: lifestyle.ageIntroductionDiary === 0,
        fillings_removed_unsure: lifestyle.fillingsAsKid === 0,
      };
  
      setAnswers(prefillAnswers);
    }
  }, [patientHealthMedicalInfo]);




  const transformApiDataToAnswers = (data) => {
    if (!data || !data.obj) return {};

    const apiData = data.obj;
    const transformedAnswers = {};

    try {
      // Map wellbeing scores
      transformedAnswers.overll_wellbeing = 
        apiData?.howWellThingsGoingOverall !== undefined && apiData?.howWellThingsGoingOverall !== null
          ? apiData.howWellThingsGoingOverall
          : 1;
      transformedAnswers.school_wellbeing = 
        apiData?.howWellThingsGoingSchool !== undefined && apiData?.howWellThingsGoingSchool !== null
          ? apiData.howWellThingsGoingSchool
          : 1;
      transformedAnswers.job_wellbeing = 
        apiData?.howWellThingsGoingJob !== undefined && apiData?.howWellThingsGoingJob !== null
          ? apiData.howWellThingsGoingJob
          : 1;
      transformedAnswers.social_life_wellbeing = 
        apiData?.howWellThingsGoingSocialLife !== undefined && apiData?.howWellThingsGoingSocialLife !== null
          ? apiData.howWellThingsGoingSocialLife
          : 1;
      transformedAnswers.close_friends_wellbeing = 
        apiData?.howWellThingsGoingCloseFriends !== undefined && apiData?.howWellThingsGoingCloseFriends !== null
          ? apiData.howWellThingsGoingCloseFriends
          : 1;
      transformedAnswers.sex_wellbeing = 
        apiData?.howWellThingsGoingSex !== undefined && apiData?.howWellThingsGoingSex !== null
          ? apiData.howWellThingsGoingSex
          : 1;
      transformedAnswers.attitude_wellbeing = 
        apiData?.howWellThingsGoingAttitude !== undefined && apiData?.howWellThingsGoingAttitude !== null
          ? apiData.howWellThingsGoingAttitude
          : 1;
      transformedAnswers.relationship_wellbeing = 
        apiData?.howWellThingsGoingPartner !== undefined && apiData?.howWellThingsGoingPartner !== null
          ? apiData.howWellThingsGoingPartner
          : 1;
      transformedAnswers.children_wellbeing = 
        apiData?.howWellThingsGoingKids !== undefined && apiData?.howWellThingsGoingKids !== null
          ? apiData.howWellThingsGoingKids
          : 1;
      transformedAnswers.parents_wellbeing = 
        apiData?.howWellThingsGoingParents !== undefined && apiData?.howWellThingsGoingParents !== null
          ? apiData.howWellThingsGoingParents
          : 1;
      transformedAnswers.spouse_wellbeing = 
        apiData?.howWellThingsGoingSpouse !== undefined && apiData?.howWellThingsGoingSpouse !== null
          ? apiData.howWellThingsGoingSpouse
          : 1;

      // Map birth information
      transformedAnswers.mode_of_own_birth = apiData?.howWereYouBorn || "";
      
      // Map birth complications
      if (apiData.wereYouBornWithComplication) {
        transformedAnswers.birth_complications = apiData.wereYouBornWithComplication.yesNo ? "Yes" : "No";
        transformedAnswers.birth_complications_details = apiData.wereYouBornWithComplication.describe || "";
      }

      // Map feeding information
      transformedAnswers.breast_fed_duration = apiData?.breastFedHowLong || "";
      transformedAnswers.bottle_fed_type = apiData?.breastFedFormula || "";
      transformedAnswers.dont_know = apiData?.breastFoodDontKnow || false;

      // Map food introduction ages
      transformedAnswers.age_of_solid_food_intro = apiData?.ageIntroductionSolidFood || "";
      transformedAnswers.age_of_wheat_food_intro = apiData?.ageIntroductionWheat || "";
      transformedAnswers.age_of_diary_food_intro = apiData?.ageIntroductionDiary || "";

      // Map food avoidance
      transformedAnswers.allergic_food = apiData?.foodsAvoided ? "Yes" : "No";
      transformedAnswers.food_avoided = apiData?.foodsAvoidTypeSymptoms || "";

      // Map sugar consumption
      transformedAnswers.eat_sugar_as_a_child = apiData?.alotSugar ? "Yes" : "No";

      // Map dental history
      if (apiData.dentalHistory && apiData.dentalHistory.length > 0) {
        transformedAnswers.fillings_removed = apiData.dentalHistory[0].level || 0;
      }

      // Map mercury fillings
      transformedAnswers.mercury_filings = apiData?.mercuryFillingRemoved ? "Yes" : "No";
      transformedAnswers.mercury_fillings_removed = apiData?.mercuryFillingRemovedWhen || "";

      // Map dental hygiene
      transformedAnswers.do_you_brush_regularly = apiData?.brushRegularly ? "Yes" : "No";
      transformedAnswers.do_you_floss_regularly = apiData?.flossRegularly ? "Yes" : "No";

      // Map environment effects
      transformedAnswers.smoke_irritants = apiData?.environmentEffect || [];
      transformedAnswers.work_env_smoke_irritants = apiData?.environmentExposed || [];

      // Map harmful chemical exposure
      transformedAnswers.harmful_chemicals = apiData?.exposedHarmfulChemical ? "Yes" : "No";
      if (apiData.whenExposedHarmfulChemical) {
        transformedAnswers.harmful_chemical_exposure = apiData.whenExposedHarmfulChemical.chemicalName || "";
        transformedAnswers.harmful_chemical_exposure_length = apiData.whenExposedHarmfulChemical.lenghtExposure || "";
        transformedAnswers.harmful_chemical_exposure_date = apiData.whenExposedHarmfulChemical.dateExposure || "";
      }

      // Map pets information
      transformedAnswers.pets_or_animal = apiData?.petsFarmAnimal ? "Yes" : "No";
      transformedAnswers.where_they_live = apiData?.petsAnimalLiveWhere || "";

    } catch (error) {
      console.error("Error transforming API data:", error);
    }

    return transformedAnswers;
  };

  useEffect(() => {
    dispatch(getHealthMedicalPatient());
  }, [dispatch]);

  useEffect(() => {
    if (
      patientHealthMedicalInfo &&
      patientHealthMedicalInfo.obj &&
      Object.keys(patientHealthMedicalInfo.obj).length > 0
    ) {
      const transformedAnswers = transformApiDataToAnswers(patientHealthMedicalInfo);

      setAnswers(transformedAnswers);
      setCurrentQuestionIndex(0);
      // Clear localStorage to avoid confusion
      localStorage.removeItem("answers");
      localStorage.removeItem("currentQuestionIndex6");
      return;
    }
    // Only use localStorage if API is empty
    const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex6"), 10);
    const savedAnswers = JSON.parse(localStorage.getItem("answers"));
    if (!isNaN(savedIndex) && savedAnswers) {
      setCurrentQuestionIndex(savedIndex);
      setAnswers(savedAnswers);
      console.log("Prefilling from localStorage:", savedAnswers);
    }
  }, [patientHealthMedicalInfo]);

  const handleExit = () => {
    navigate("/assessment");
  };
  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
  
    switch (question.type) { 
      case "rating_scale": {
        const value = answers[question.name];
        if (value === undefined || value === null) {
          return false;
        }
        return true;
      }

      case "checkbox_with_select":
        return question.options.every((option) => {
          const checkboxChecked = answers[option.name];
          const selectValid = option.selectName
            ? (answers[option.selectName] !== undefined && answers[option.selectName] !== "") 
            : true;
  
          return !checkboxChecked || selectValid;
        });
  
        case "checkbox_with_input": {
          const anySelected = question.options.some((option) => answers[option.name]);
        
          if (!anySelected) {
            return false;
          }
        
          for (const option of question.options) {
            if (option.inputName && answers[option.name]) {
              const inputValue = answers[option.inputName];
              if (!inputValue || inputValue.trim() === "") {
                message.error(`Please fill in the field for "${option.label}".`);
                return false;
              }
            }
          }
        
          return true;
        }
        
  
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
  
      case "radio": {
        if (answers[question.name] === undefined || answers[question.name] === null || answers[question.name] === "") {
          console.log(`Validation failed: '${question.name}' radio question not answered.`);
          return false;
        }
  
        if (answers[question.name] === "Yes" && (
          question.name === "do_you_use_sleeping_aids" ||
          question.name === "problems_limiting_exercise" ||
          question.name === "sore_after_exercise"
        )) {
          const inputFieldName = `${question.name}_other`;
          if (!answers[inputFieldName] || answers[inputFieldName] === "") {
            console.log(`Validation Failed: ${question.name} is Yes, but input field is empty.`);
            return false;
          }
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
  
        default: {
          const unsureFields = [
            "age_of_solid_food_intro",
            "age_of_wheat_food_intro",
            "age_of_diary_food_intro",
            "fillings_removed"
          ];
        
          if (unsureFields.includes(question.name) && answers[`${question.name}_unsure`]) {
            return true; // skip validation if unsure is selected
          }
        
          return (
            answers[question.name] !== undefined && answers[question.name] !== ""
          );
        }
        
    }
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
      // Find the question object by name
      const question = questions.find(q => q.name === name);
      const updatedAnswers = { ...answers };

      if (question && (question.type === "radio" || question.type === "long_radio")) {
        // For radio buttons, clear all related fields when selection changes
        updatedAnswers[name] = value;
        
        // Clear any _other fields
        delete updatedAnswers[`${name}_other`];
        
        // Clear subquestion answers if they exist
        if (question.subQuestions) {
          question.subQuestions.forEach(subQ => {
            delete updatedAnswers[subQ.name];
            delete updatedAnswers[`${subQ.name}_other`];
          });
        }

        // Special handling for specific questions
        if (name === "pets_or_animal") {
          delete updatedAnswers.where_they_live;
        } else if (name === "harmful_chemicals") {
          delete updatedAnswers.harmful_chemical_exposure;
          delete updatedAnswers.harmful_chemical_exposure_length;
          delete updatedAnswers.harmful_chemical_exposure_date;
        }
      } else if (name.endsWith("_unsure")) {
        const fieldName = name.replace("_unsure", "");

        if (value) {
          updatedAnswers[fieldName] = ""; // Clear select value
        }

        updatedAnswers[name] = value;
      } else {
        updatedAnswers[name] = value;
      
        // 🧼 Clear sub-question values when "No" is selected
        const clearMap = {
          birth_complications: "birth_complications_details",
          allergic_food: "food_avoided",
          mercury_filings: "mercury_fillings_removed",
          harmful_chemicals: [
            "harmful_chemical_exposure",
            "harmful_chemical_exposure_length",
            "harmful_chemical_exposure_date"
          ],
          pets_or_animal: "where_they_live"
        };
      
        if (clearMap[name] && value === "No") {
          const fieldsToClear = Array.isArray(clearMap[name])
            ? clearMap[name]
            : [clearMap[name]];
      
          fieldsToClear.forEach((field) => {
            updatedAnswers[field] = "";
          });
        }
      }
      

      // Handle future date validation
      if (
        value &&
        (name.includes("date") ||
          (questions[currentQuestionIndex]?.type === "long_radio" &&
            questions[currentQuestionIndex]?.subQuestions?.some(
              (sq) => sq.type === "date" && sq.name === name
            )))
      ) {
        const selectedDate = moment(value);
        const today = moment().endOf("day");

        if (selectedDate.isAfter(today)) {
          message.error("Future dates are not allowed");
          return;
        }
      }

      setAnswers(updatedAnswers);
    };


  const handleSubmit = async () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }
    try {
      const payload = {
        howWellThingsGoingOverall: answers.overll_wellbeing || 0,
        howWellThingsGoingSchool: answers.school_wellbeing || 0,
        howWellThingsGoingJob: answers.job_wellbeing || 0,
        howWellThingsGoingSocialLife: answers.social_life_wellbeing || 0,
        howWellThingsGoingCloseFriends: answers.close_friends_wellbeing || 0,
        howWellThingsGoingSex: answers.sex_wellbeing || 0,
        howWellThingsGoingAttitude: answers.attitude_wellbeing || 0,
        howWellThingsGoingPartner: answers.relationship_wellbeing || 0,
        howWellThingsGoingKids: answers.children_wellbeing || 0,
        howWellThingsGoingParents: answers.parents_wellbeing || 0,
        howWellThingsGoingSpouse: answers.spouse_wellbeing || 0,
        howWereYouBorn: answers.mode_of_own_birth || "Not answered",
        wereYouBornWithComplication: {
          yesNo: answers.birth_complications === "Yes",
          describe: answers.birth_complications_details || "Not answered",
        },
        breastFedHowLong: answers.breast_fed_duration || "Not answered",
        breastFedFormula: answers.bottle_fed_type || "Not answered",
        breastFoodDontKnow: answers.dont_know || false,
        ageIntroductionSolidFood: answers.age_of_solid_food_intro || 0,
        ageIntroductionWheat: answers.age_of_wheat_food_intro || 0,
        ageIntroductionDiary: answers.age_of_diary_food_intro || 0,
        foodsAvoided: answers.food_avoided === "Yes",
        foodsAvoidTypeSymptoms: answers.allergic_food || "Not answered",
        alotSugar: answers.eat_sugar_as_a_child === "Yes",
        dentalHistory: [
          {
            level: answers.fillings_removed || 0,
            name: "Not answered",
          },
        ],
        mercuryFillingRemoved: answers.mercury_filings === "Yes",
        mercuryFillingRemovedWhen: answers.mercury_fillings_removed || "Not answered",
        fillingsAsKid: answers.fillings_removed || 0,
        brushRegularly: answers.do_you_brush_regularly === "Yes",
        flossRegularly: answers.do_you_floss_regularly === "Yes",
        environmentEffect: (() => {
          let irritants = [...(answers.smoke_irritants || [])];
          if (irritants.includes("Other") && answers.smoke_irritants_other) {
            irritants = irritants.filter(item => item !== "Other");
            irritants.push(answers.smoke_irritants_other);
          }
          return irritants;
        })(),
        environmentExposed: (() => {
          let irritants = [...(answers.work_env_smoke_irritants || [])];
          if (irritants.includes("Other") && answers.work_env_smoke_irritants_other) {
            irritants = irritants.filter(item => item !== "Other");
            irritants.push(answers.work_env_smoke_irritants_other);
          }
          return irritants;
        })(),
        exposedHarmfulChemical: answers.harmful_chemicals === "Yes",
        whenExposedHarmfulChemical: {
          chemicalName: answers.harmful_chemical_exposure || "Not answered",
          lenghtExposure: answers.harmful_chemical_exposure_length || 0,
          dateExposure: answers.harmful_chemical_exposure_date || "Not answered",
        },
        petsFarmAnimal: answers.pets_or_animal === "Yes",
        petsAnimalLiveWhere: answers.where_they_live || "Not answered",
      };
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj.token || "";
      const response = await fetch(
        `${baseUrl}Patient/AddHealthMedicalHistory`,
        {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Successfully submitted:", result);

      dispatch(completeCard("/questionnaire/6"));
      localStorage.setItem("currentQuestionIndex6", 0);
      localStorage.setItem("answers", JSON.stringify(answers));
      navigate("/assessment");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  const handleSelectInputChange = (
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
  const handleSelectCheckChange = (checked, checkboxName, selectName) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
  
      updatedAnswers[checkboxName] = checked;
  
      if (!checked && selectName) {
        updatedAnswers[selectName] = "";  
      }
  
      return updatedAnswers;
    });
  };
  
  const handleSelectChange = (value, selectName) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectName]: value,
    }));
  };
  



  const renderSubQuestions = (subQuestions) => {
    return subQuestions.map((subQuestion, index) => (
      <div key={index} style={{ marginTop: "20px" }}>
        <p style={{color:"#000"}}>{subQuestion.type !== "text" && subQuestion.question}</p>
        {subQuestion.type === "text" && (
          <Input
            placeholder={subQuestion.question}
            value={answers[subQuestion.name] || ""}
            onChange={(e) => handleChange(e.target.value, subQuestion.name)}
            className="input_questtionnaire"
            style={{
              width: isMobile ? "100%" : "50%",
              height: "42px",
              borderColor: "#ccc"
            }}
          />
        )}
        {subQuestion.type === "inputNumber" && (
          <InputNumber
            name={subQuestion.name}
            value={answers[subQuestion.name] || 0}
            onChange={(value) => handleChange(value, subQuestion.name)}
            className="input_questtionnaire"
            style={{
              width: isMobile ? "100%" : "50%",
              height: "42px",
              borderColor: "#ccc"
            }}
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
            style={{
              width: isMobile ? "100%" : "50%",
              height: "42px",
              borderColor: "#ccc"
            }}
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
            disabledDate={disableBefore2006}
            defaultPickerValue={dayjs(`${startYear}-01-01`)}
            value={answers[subQuestion.name] ? dayjs(answers[subQuestion.name]) : null}
            format="YYYY-MM-DD"
            style={{
              width: isMobile ? "100%" : "50%",
              height: "42px",
              borderColor: "#000"
            }}
            onChange={(date, dateString) => handleChange(dateString, subQuestion.name)}
          />
        )}
        {subQuestion.type === "checkbox" && (
          <Checkbox.Group
            name={subQuestion.name}
            onChange={(checkedValues) =>
              handleChange(checkedValues, subQuestion.name)
            }
            value={answers[subQuestion.name] || []}
            style={{ width: isMobile ? "100%" : "50%" }}
          >
            {subQuestion.options.map((option, idx) => (
              <Checkbox
                key={idx}
                value={option}
                style={{ display: "flex", marginBottom: "10px",width: "calc(9% - 10px)" }}
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
                        style={{
                          width: isMobile ? "100%" : "50%",
                          height: "42px",
                          borderColor: "#000"
                        }}
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
          <div>
          <Select
            className="select_questtionnaire"
            name={question.name}
            value={answers[question.name] || ""}
            onChange={(value) => handleChange(value, question.name)}
            disabled={answers[`${question.name}_unsure`] || false}
          >
            {question.options.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
           {(question.name === "age_of_solid_food_intro" || question.name === "age_of_wheat_food_intro" || question.name === "age_of_diary_food_intro") && (
            <span style={{ color: "#000" }}> Months</span>
           )}
          {(question.name === "age_of_solid_food_intro" || question.name === "age_of_wheat_food_intro" || question.name === "age_of_diary_food_intro" || question.name === "fillings_removed") && (
            <div>
              <Checkbox
                name={`${question.name}_unsure`}
                checked={answers[`${question.name}_unsure`] || false}
                onChange={(e) => handleChange(e.target.checked, `${question.name}_unsure`)}
              >
                Unsure
              </Checkbox>
            </div>
          )}

          </div>
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
                    min={0}
                    max={10}
                    dots
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
                    className="input-number-box"
                    style={{ width: "40%", minWidth: "42px" }}
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
                      setAnswers((prev) => ({
                        ...prev,
                        [`${question.name}_na`]: isChecked,
                        [question.name]: isChecked ? 0 : prev[question.name],
                      }));
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
              style={{ marginTop: "10px" }}
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
          className="checkbox-input-gr"
          >
            {question.options.map((option, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    onChange={(e) =>
                      handleSelectInputChange(
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
                        handleSelectInputChange(
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
                    <div style={{ display: "flex", alignItems: "center", width: isMobile ? "100%" : "20%" }}>
                      <Select
                        name={option.selectName}
                        value={answers[option.selectName] || undefined}
                        onChange={(value) => handleSelectChange(value, option.selectName)} 
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
  
      case "checkbox":
        return (
          <div className="checkbox-group" style={{position:"relative"}}>
            <Checkbox.Group
              name={question.name}
              onChange={(checkedValues) =>
                handleChange(checkedValues, question.name)
              }
              value={answers[question.name] || []}
            >
              {question.options.map((option, index) => (
                <Checkbox key={index} value={option} className="checkbox-item">
                  {option}
                </Checkbox>
              ))}
            </Checkbox.Group>
            {answers[question.name]?.includes("Other") && (
              <div style={{ marginTop: "10px", marginLeft: "24px", position:"absolute", width:"100%", bottom:"-7px", left:"54px" }}>
                <Input
                  className="input_questtionnaire"
                  placeholder="Please specify"
                  value={answers[`${question.name}_other`] || ""}
                  onChange={(e) =>
                    handleChange(e.target.value, `${question.name}_other`)
                  }
                  style={{ width: isMobile ? "100%" : "50%" }}
                />
              </div>
            )}
          </div>
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
    console.log({ question })
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
    return (
      <p>
        {!question?.includes("1-10") && label}
        {highlightedQuestion}
      </p>
    );

  };


  const progressColor =
    currentQuestionIndex === totalQuestions - 1 ? "#01ACEE" : "#C2E6F8";
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  console.log("Current answers state:", answers);

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {questions[currentQuestionIndex]?.title ? questions[currentQuestionIndex]?.title : "Parent's Birth/Childhood History"}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight: "600", fontSize: "15px" }}>
          {questions[currentQuestionIndex]?.sub && (
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
