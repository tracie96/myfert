import React, { useState, useEffect } from "react";
import { Progress, Button, Radio, Col, Row, Input, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import { getIllnessConditionPatient } from "../../../../redux/AssessmentController";
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
    title: "Medical History: Illnesses/Conditions",
    subQuestions: [
      { name: "irritableBowel", text: "Irritable bowel syndrome" },
      { name: "gerd", text: "GERD (reflux)" },
      { name: "crohns", text: "Crohn's disease/ulcerative colitis" },
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
      { name: "Parkinson's disease", text: "parkinson's_disease" },
      { name: "dementia", text: "Dementia" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Cancer",
    question:
      "Check YES = a condition you currently have, Check PAST = a condition you've had in the past.",
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
    dateName: "chest_X_ray",
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
    radioName: "injuries",
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
    name: "head_injury_others",
    question: "Injuries",
    sub: "Others",
    dateName: "head_injury_others",
    title: "Medical History: Illnesses/Conditions",
    radioName: "head_injury_others",
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
    dateName: "lastPapTest",
    title: "Gynecological Screening/Procedures",
    radioName: "lastPapTest",
    radioOptions: [{ label: "comments", value: "Comments" }],

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  console.log(isDataLoaded, 'isDataLoaded')
  const { patientIllnessInfo, loading } = useSelector((state) => state.intake);

  useEffect(() => {
    dispatch(getIllnessConditionPatient());
  }, [dispatch]);

  useEffect(() => {
    const mapApiResponseToFormState = (apiData) => {
      console.log('Starting mapApiResponseToFormState with apiData:', apiData);
      const formAnswers = {};

      if (apiData.gastroIntestinal && apiData.gastroIntestinal.length > 0) {
        for (const item of apiData.gastroIntestinal) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.respiratory && apiData.respiratory.length > 0) {
        for (const item of apiData.respiratory) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.urinary && apiData.urinary.length > 0) {
        for (const item of apiData.urinary) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.endocrine && apiData.endocrine.length > 0) {
        for (const item of apiData.endocrine) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.inflammatory && apiData.inflammatory.length > 0) {
        for (const item of apiData.inflammatory) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.musculoskeletal && apiData.musculoskeletal.length > 0) {
        for (const item of apiData.musculoskeletal) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.skin && apiData.skin.length > 0) {
        for (const item of apiData.skin) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.cardiovascular && apiData.cardiovascular.length > 0) {
        for (const item of apiData.cardiovascular) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.neurologic && apiData.neurologic.length > 0) {
        for (const item of apiData.neurologic) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      if (apiData.cancer && apiData.cancer.length > 0) {
        for (const item of apiData.cancer) {
          formAnswers[item.typeName] = item.yesNoNA;
        }
      }

      // Helper function to handle date_radio type fields
      const handleDateRadioField = (apiField, formField) => {
        if (apiField) {
          formAnswers[formField] = apiField.date;
          formAnswers[`${formField}_Comments`] = apiField.value;
          // If there's a date but no comments, set _na to true
          if (apiField.date && !apiField.value) {
            formAnswers[`${formField}_na`] = true;
          }
        }
      };

      // Map date_radio fields using the helper function
      handleDateRadioField(apiData.diagnosticBoneDensity, 'boneDensity');
      handleDateRadioField(apiData.diagnosticCTScan, 'ctscan');
      handleDateRadioField(apiData.diagnosticColonoscopy, 'colonoscopy');
      handleDateRadioField(apiData.diagnosticCardiacStress, 'cardiac_stress_test');
      handleDateRadioField(apiData.diagnosticEKG, 'EKG');
      handleDateRadioField(apiData.diagnosticMRI, 'MRI');
      handleDateRadioField(apiData.diagnosticLastPap, 'lastPapTest');
      handleDateRadioField(apiData.diagnosticUpperEndoscopy, 'upper_endoscopy');
      handleDateRadioField(apiData.diagnosticUpperGI, 'upper_GI_series');
      handleDateRadioField(apiData.diagnosticChestXray, 'chest_X_ray');
      handleDateRadioField(apiData.diagnosticOtherXray, 'other_X_rays');
      handleDateRadioField(apiData.diagnosticBarium, 'barium_enema');
      handleDateRadioField(apiData.diagnosticOther, 'other');
      handleDateRadioField(apiData.injuriesBrokenBones, 'injuries');
      handleDateRadioField(apiData.injuriesBack, 'back_injury');
      handleDateRadioField(apiData.injuriesNeck, 'neck_injury');
      handleDateRadioField(apiData.injuriesHead, 'head_injury');
      handleDateRadioField(apiData.injuriesOther, 'head_injury_others');
      if (apiData.injuriesOther?.otherName) {
        formAnswers["head_injury_others_Others"] = apiData.injuriesOther.otherName;
      }
      handleDateRadioField(apiData.surgeryAppen, 'appendectomy');
      handleDateRadioField(apiData.surgeryDental, 'dental');
      handleDateRadioField(apiData.gallBladder, 'gallbladder');
      handleDateRadioField(apiData.hernia, 'hernia');
      handleDateRadioField(apiData.hysterectomy, 'hysterectomy');
      handleDateRadioField(apiData.tonsillectomy, 'tonsillectomy');
      handleDateRadioField(apiData.jointReplacement, 'joint_replacement');
      handleDateRadioField(apiData.heartSurgery, 'heart_surgery');
      handleDateRadioField(apiData.otherSurgeries, 'other_surgeries');

      if (apiData.addNew && Array.isArray(apiData.addNew)) {
        formAnswers.hospitalizations = apiData.addNew.map(item => ({
          date: item.date || "",
          reason: item.value || ""
        }));
      } else {
        formAnswers.hospitalizations = [];
      }

      console.log('Final mapped formAnswers:', formAnswers);
      return formAnswers;
    };

    // Handle initial data load and updates
    if (patientIllnessInfo && Object.keys(patientIllnessInfo).length > 0) {
      console.log('Loading patient illness info:', patientIllnessInfo);
      const mappedAnswers = mapApiResponseToFormState(patientIllnessInfo);
      setAnswers(mappedAnswers);
      setIsDataLoaded(true);

      const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex8"), 10);
      if (!isNaN(savedIndex)) {
        setCurrentQuestionIndex(savedIndex);
      }
    } else if (!loading) {
      // Only try to load from localStorage if we're not loading from API
      const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex8"), 10);
      const savedAnswers = JSON.parse(localStorage.getItem("answers"));
      if (!isNaN(savedIndex) && savedAnswers) {
        setCurrentQuestionIndex(savedIndex);
        setAnswers(savedAnswers);
      }
      setIsDataLoaded(true);
    }
  }, [patientIllnessInfo, loading]);

  const handleExit = () => {
    navigate("/assessment");
  };
  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];

    switch (question.type) {
      case "multi_yes_no":
        const hasValidAnswer = question.subQuestions.some(
          (subQuestion) =>
            answers[subQuestion.name] === "yes" || answers[subQuestion.name] === "no" || answers[subQuestion.name] === "n/a"
        );

        const hasOthersAnswer =
          answers[`${question.name}_${question.sub.replace(/\//g, '_')}_others`] !== undefined &&
          answers[`${question.name}_${question.sub.replace(/\//g, '_')}_others`] !== "";

        return hasValidAnswer || hasOthersAnswer;

      case "date_radio": {
        const naCheckboxName = `${question.name}_na`;
        const isNAChecked = answers[naCheckboxName] === true;

        if (isNAChecked) {
          return true;
        }

        const dateValue = answers[question.dateName];
        if (!dateValue || dateValue === "") {
          console.log("Validation Failed: Date is empty.");
          return false;
        }

        if (question.radioOptions && question.radioOptions.length > 0) {
          const commentName = `${question.radioName}_${question.radioOptions[0].value}`;
          const commentValue = answers[commentName];
          if (!commentValue || commentValue === "") {
            console.log("Validation Failed: Comment is empty.");
            return false;
          }
        }

        return true;
      }

      default:
        return answers[question.name] !== undefined && answers[question.name] !== "";
    }
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
    if (!validateQuestion()) {
      message.error("Please answer the current question before Submitting.");
      return;
    }

    // Helper function to organize questions by their sub-categories
    const getCategoryQuestions = (categoryName) => {
      // Find all questions with this category/sub value and extract their subQuestions
      const subQuestions = [];

      for (const question of questions) {
        if (question.type === "multi_yes_no" && question.sub === categoryName) {
          subQuestions.push(...question.subQuestions);
        }
      }

      // Create API data for this category
      return subQuestions.map(subQuestion => ({
        typeName: subQuestion.name,
        yesNoNA: answers[subQuestion.name] || "n/a"
      })); // Only include items that are yes
    };

    // Prepare the data to match the API structure
    const apiData = {
      // Based on the questions array, the gastrointestinal items are mislabeled as "Respiratory"
      respiratory: getCategoryQuestions("Respiratory"),
      urinary: getCategoryQuestions("Urinary/Genital"),
      endocrine: getCategoryQuestions("Endocrine/Metabolic"),
      inflammatory: getCategoryQuestions("Inflammatory/Immune"),
      musculoskeletal: getCategoryQuestions("Musculoskeletal"),
      skin: getCategoryQuestions("Skin"),
      cardiovascular: getCategoryQuestions("Cardiovascular"),
      neurologic: getCategoryQuestions("Neurologic/Emotional"),
      cancer: getCategoryQuestions("Cancer"),

      // Rest of the structure remains unchanged
      diagnosticBoneDensity: {
        date: answers.boneDensity_na ? "" : answers.boneDensity || "",
        value: answers.boneDensity_na ? "" : answers.boneDensity_Comments || "",
      },
      diagnosticCTScan: {
        date: answers.ctscan_na ? "" : answers.ctscan || "",
        value: answers.ctscan_na ? "" : answers.ctscan_Comments || "",
      },
      diagnosticColonoscopy: {
        date: answers.colonoscopy_na ? "" : answers.colonoscopy || "",
        value: answers.colonoscopy_na ? "" : answers.colonoscopy_Comments || "",
      },
      diagnosticCardiacStress: {
        date: answers.cardiac_stress_test_na ? "" : answers.cardiac_stress_test || "",
        value: answers.cardiac_stress_test_na ? "" : answers.cardiac_stress_test_Comments || "",
      },
      diagnosticEKG: {
        date: answers.EKG_na ? "" : answers.EKG || "",
        value: answers.EKG_na ? "" : answers.EKG_Comments || "",
      },
      diagnosticLastPap: {
        date: answers.lastPapTest_na ? "" : answers.lastPapTest || "",
        value: answers.lastPapTest_na ? "" : answers.lastPapTest_Comments || "",
      },
      diagnosticMRI: {
        date: answers.MRI_na ? "" : answers.MRI || "",
        value: answers.MRI_na ? "" : answers.MRI_Comments || "",
      },
      diagnosticUpperEndoscopy: {
        date: answers.upper_endoscopy_na ? "" : answers.upper_endoscopy || "",
        value: answers.upper_endoscopy_na ? "" : answers.upper_endoscopy_Comments || "",
      },
      diagnosticUpperGI: {
        date: answers.upper_GI_series_na ? "" : answers.upper_GI_series || "",
        value: answers.upper_GI_series_na ? "" : answers.upper_GI_series_Comments || "",
      },
      diagnosticChestXray: {
        date: answers.chest_X_ray_na ? "" : answers.chest_X_ray || "",
        value: answers.chest_X_ray_na ? "" : answers.chest_X_ray_Comments || "",
      },
      diagnosticOtherXray: {
        date: answers.other_X_rays_na ? "" : answers.other_X_rays || "",
        value: answers.other_X_rays_na ? "" : answers.other_X_rays_Comments || "",
      },
      diagnosticBarium: {
        date: answers.barium_enema_na ? "" : answers.barium_enema || "",
        value: answers.barium_enema_na ? "" : answers.barium_enema_Comments || "",
      },
      diagnosticOther: {
        date: answers.other_na ? "" : answers.other || "",
        value: answers.other_na ? "" : answers.other_Comments || "",
        otherName: answers.other_na ? "" : answers.other_Comments || "",
      },
      injuriesBrokenBones: {
        date: answers.injuries_na ? "" : answers.injuries || "",
        value: answers.injuries_Comments || "",
      },
      injuriesBack: {
        date: answers.back_injury_na ? "" : answers.back_injury || "",
        value: answers.back_injury_Comments || "",
      },
      injuriesNeck: {
        date: answers.neck_injury_na ? "" : answers.neck_injury || "",
        value: answers.neck_injury_Comments || "",
      },
      injuriesHead: {
        date: answers.head_injury_na ? "" : answers.head_injury || "",
        value: answers.head_injury_Comments || "",
      },
      injuriesOther: {
        date: answers.head_injury_others_na ? "" : answers.head_injury_others || "",
        value: answers.head_injury_others_Comments || "",
        otherName: answers.head_injury_others_Others || "",
      },
      surgeryAppen: {
        date: answers.appendectomy_na ? "" : answers.appendectomy || "",
        value: answers.appendectomy_Comments || "",
      },
      surgeryDental: {
        date: answers.dental_na ? "" : answers.dental || "",
        value: answers.dental_Comments || "",
      },
      gallBladder: {
        date: answers.gallbladder_na ? "" : answers.gallbladder || "",
        value: answers.gallbladder_Comments || "",
      },
      hernia: {
        date: answers.hernia_na ? "" : answers.hernia || "",
        value: answers.hernia_Comments || "",
      },
      hysterectomy: {
        date: answers.hysterectomy_na ? "" : answers.hysterectomy || "",
        value: answers.hysterectomy_Comments || "",
      },
      tonsillectomy: {
        date: answers.tonsillectomy_na ? "" : answers.tonsillectomy || "",
        value: answers.tonsillectomy_Comments || "",
      },
      jointReplacement: {
        date: answers.joint_replacement_na ? "" : answers.joint_replacement || "",
        value: answers.joint_replacement_Comments || "",
      },
      heartSurgery: {
        date: answers.heart_surgery_na ? "" : answers.heart_surgery || "",
        value: answers.heart_surgery_Comments || "",
      },
      otherSurgeries: {
        date: answers.other_surgeries_na ? "" : answers.other_surgeries || "",
        value: answers.other_surgeries_Comments || "",
        otherName: answers.other_surgeries_na ? "" : answers.other_surgeries_Comments || "",
      },
      addNew: answers.hospitalizations.map((item) => ({
        date: item.date || "",
        value: item.reason || "",
      })),
    };

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo.obj.token || "";
    fetch("https://myfertilitydevapi-prod.azurewebsites.net/api/Patient/AddIllnessConditions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
        Authorization: `${token}`,

      },
      body: JSON.stringify(apiData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit the form");
        }
        return response.json();
      })
      .then(() => {
        message.success("Form submitted successfully!");
        dispatch(completeCard("/questionnaire/5"));
        localStorage.setItem("currentQuestionIndex5", 0);
        localStorage.setItem("answers", JSON.stringify(answers));
        navigate("/assessment");
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to submit the form. Please try again.");
      });
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
      case "date_radio": {
        const isNA = answers[`${question.name}_na`] === true;

        return (
          <div key={question.name} style={{ marginBottom: "20px" }}>
            {/* <Button
              type="primary"
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                background: "#335CAD",
                padding: isMobile ? "5px" : "10px",
                fontSize: isMobile ? "13px" : "15px",
                fontWeight: "bold",
                width: isMobile ? "100%" : "auto",
              }}
            >
              {question.question}
            </Button> */}
            <div style={{
              marginTop: "10px",
              marginBottom: "10px",
              background: "#335CAD",
              padding: isMobile ? "5px" : "10px",
              fontSize: isMobile ? "13px" : "15px",
              fontWeight: "bold",
              width: isMobile ? "100%" : "200px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <p
                style={{
                  color: "#fff",
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "bold",
                  margin: 0,
                  textAlign: "center"
                }}
              >
                {question.sub}
              </p>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Checkbox
                checked={isNA}
                onChange={(e) => handleChange(e.target.checked, `${question.name}_na`)}
                style={{ fontSize: isMobile ? "13px" : "14px" }}
              >
                N/A
              </Checkbox>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ color: "#000", fontSize: isMobile ? "13px" : "14px" }}>Date:</label>
              <br />
              <Input
                type="date"
                className="input_questionnaire"
                name={question.dateName}
                value={answers[question.dateName] || ""}
                onChange={(e) =>
                  handleChange(e.target.value, question.dateName)
                }
                style={{ width: isMobile ? "100%" : "200px" }}
                disabled={isNA}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              {question.radioOptions.map((option, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <label style={{ color: "#000", fontSize: isMobile ? "13px" : "14px" }}>{option.label}:</label>
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
                    style={{ width: isMobile ? "100%" : "200px" }}
                    disabled={isNA}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "hospitalization":
        return (
          <div key={question.name} style={{ marginBottom: "20px" }}>
            {answers[question.name]?.map((entry, index) => (
              <div
                style={{
                  marginBottom: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: isMobile ? "10px" : "16px",
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
                    style={{ width: "100%" }}
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
                    style={{ width: "100%" }}
                  />
                  <Button
                    type="danger"
                    onClick={() => removeHospitalization(index, question.name)}
                    style={{ width: isMobile ? "100%" : "auto" }}
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
                padding: isMobile ? "5px" : "10px",
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "13px" : "14px"
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
            <div style={{
                    background: "#335CAD",
                    padding: isMobile ? "10px 16px" : "12px 20px",
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "bold",
                    width: "fit-content",
                    height: "40px", // optional if using padding + flex
                    borderRadius: "4px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer", // makes it behave like a button
                    userSelect: "none",
                
                  }}>
                     {question.sub}
                  </div>

            {question.subQuestions.map((subQuestion) => (
              <div key={subQuestion.name} style={{ marginTop: 20 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "10px" : "0"
                }}>
                  <div style={{
                    flex: 1,
                    fontSize: isMobile ? "13px" : "15px",
                    color: "#000",
                    width: isMobile ? "100%" : "auto"
                  }}>
                    {subQuestion.text}
                  </div>
                  <div style={{
                    display: "flex",
                    width: isMobile ? "100%" : "auto",
                    justifyContent: isMobile ? "space-between" : "flex-start"
                  }}>
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
                      Past
                    </Radio>
                    <Radio
                      checked={answers[subQuestion.name] === "n/a"}
                      onChange={() => handleChange("n/a", subQuestion.name)}
                    >
                      N/A
                    </Radio>
                  </div>
                </div>
              </div>
            ))}
            <Input
              placeholder="Others"
              style={{
                marginTop: 20,
                width: "100%"
              }}
              value={answers[`${question.name}_${question.sub.replace(/\//g, '_')}_others`] || ""}
              onChange={(e) =>
                handleChange(e.target.value.trim(), `${question.name}_${question.sub.replace(/\//g, '_')}_others`)
              }
            />
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
    <Row gutter={16} style={{ padding: isMobile ? "0 2%" : "0 5%" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <FormWrapper name="FEMALE INTAKE QUESTIONNAIRE" />
        <Progress
          percent={Math.round(progressPercentage)}
          strokeColor={progressColor}
        />
        <h3 style={{
          margin: "20px 0",
          color: "#F2AA93",
          fontSize: isMobile ? "16px" : "18px"
        }}>
          {label}
          {questions[currentQuestionIndex].title}
        </h3>

        <h3 style={{
          margin: "20px 0",
          color: "#000",
          fontWeight: "600",
          fontSize: isMobile ? "13px" : "15px"
        }}>
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
