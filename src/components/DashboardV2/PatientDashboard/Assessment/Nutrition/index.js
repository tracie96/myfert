import React, { useState, useEffect } from "react";
import {
  Progress,
  Button,
  Radio,
  Col,
  Row,
  Input,
  Select,
  Checkbox,
  message,
} from "antd";
import { useNavigate } from "react-router-dom"; // useNavigate for react-router v6
import { useDispatch, useSelector } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";
import { backBtnTxt, exitBtnTxt, saveAndContinueBtn, submitBtn } from "../../../../../utils/constant";
import { getNutritionPatient } from "../../../../redux/AssessmentController";
import { baseUrl } from "../../../../../utils/envAccess";

const { Option } = Select;

const questions = [
  {
    question:
      "Do you currently follow any of the following special diets or nutritional programs? (Check all that apply)",
    type: "checkbox",
    name: "special_nutritional_program",
    options: [
      "Vegetarian",
      "Vegan",
      "Allergy",
      "Elimination",
      "Low Fat",
      "Low Carb",
      "High Protein",
      "Blood Type",
      "Low Sodium",
      "No Dairy",
      "No Wheat",
      "Gluten Free",
      "Other",
      "None",
    ],
  },
  {
    question: "What are your reasons for following your specific diet or nutrition program?",
    type: "long_textarea",
    name: "special_diet_reason",
  },
  {
    question: "Do you have sensitivities to certain foods?",
    type: "radio",
    name: "sensitive_food",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes: list food and symptoms",
        type: "text",
        name: "sensitive_food_info",
      },
    ]
  },
  {
    question: "Do you have an aversion to certain foods?",
    type: "radio",
    name: "aversion_to_certain_food",
    options: ["Yes", "No"],
  },
  {
    question: "Do you adversely react to: (Check all that apply)",
    type: "checkbox",
    name: "adversely_react",
    options: [
      "Monosodium glutamate (MSG)",
      "Artificial sweeteners",
      "Garlic/onion",
      "Cheese",
      "Citrus foods",
      "Chocolate",
      "Alcohol",
      "Red wine",
      "Sulfte–containing foods (wine, dried fruit, salad bars)",
      "Preservatives",
      "Food coloring",
      "None",
      "Other",
    ],
  },
  {
    question: "Are there any foods that you crave or binge on?",
    type: "radio",
    name: "crave_for_foods",
    options: ["Yes", "No"],
  },
  {
    question: "Do you eat 3 meals a day?",
    type: "radiowithselect",
    name: "eat_3_meals",
    options: ["Yes", "No"],
  },
  {
    question: "Does skipping a meal greatly affect you?",
    type: "radio",
    name: "does_skipping_meal_affect_you",
    options: ["Yes", "No"],
  },
  {
    question: "How many meals do you eat out per week?",
    type: "radio",
    name: "meals_per_day",
    options: ["0-1", "1-3", "3-5", "More than 5 meals per week"],
  },
  {
    question:
      "Check the factors that apply to your current lifestyle and eating habits:",
    type: "checkbox",
    name: "actors_applyingto_current_lifestyle",
    options: [
      "Fast eater",
      "Eat too much",
      "Late-night eating",
      "Dislike healthy foods",
      "Time constraints",
      "Travel frequently",
      "Eat more than 50% of meals away from home",
      "Healthy foods not readily available",
      "Poor snack choices",
      "Signifcant other or family members don't like healthy foods",
      "Signifcant other or family members have special dietary needs",
      "Love to eat",
      "Eat because I have to",
      "Have negative relationship to food",
      "Struggle with eating issues",
      "Emotional eater (eat when sad, lonely, bored, etc.)",
      "Eat too much under stress",
      "Eat too little under stress",
      "Don't care to cook",
      "Confused about nutrition advice",
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Breakfast",
    name: "diet_detail_breakfast",
    subQuestion: [
      {
        type: "time_select",
        label: "Time of Breakfast",
        name: "breakfast_time",
      },
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Lunch",
    name: "diet_detail_lunch",
    subQuestion: [
      {
        type: "time_select",
        label: "Time of Lunch",
        name: "lunch_time",
      },
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Dinner",
    name: "diet_detail_dinner",
    subQuestion: [
      {
        type: "time_select",
        label: "Time of Dinner",
        name: "dinner_time",
      },
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Snacks",
    name: "diet_detail_snacks",
    subQuestion: [
      {
        type: "time_select",
        label: "Time of Snack",
        name: "snack_time",
      },
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Drink",
    name: "diet_detail_fluids",
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fruits (not juice)",
    name: "diet_servings_fruits",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Vegetables (not including white potatoes)",
    name: "diet_serving_vegetables",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Legumes (beans, peas, etc)",
    name: "diet_servings_legumes",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },

  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Red meat",
    name: "diet_servings_meat",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fish",
    name: "diet_servings_fish",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Dairy/ Alternatives",
    name: "diet_servings_dairyalt",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Nuts & Seeds",
    name: "diet_servings_nuts",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fats & Oils",
    name: "diet_servings_fatsandoil",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Cans of soda (regular or diet)",
    name: "diet_servings_soda",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Sweets (candy, cookies, cake, ice cream, etc.)",
    name: "diet_servings_sweets",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "Do you drink caffeinated beverages?",
    type: "long_radio",
    name: "caffeinated_beverages",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, check amount:",
        type: "radio",
        name: "coffee_amount",
        options: ["1", "2-4", "More than 4", "N/A"],
        label: "Coffee (cups per day)",
      },
      {
        type: "radio",
        name: "tea_amount",
        options: ["1", "2-4", "More than 4", "N/A"],
        label: "Tea (cups per day)",
      },
      {
        type: "radio",
        name: "soda_amount",
        options: ["1", "2-4", "More than 4", "N/A"],
        label: "Caffeinated sodas—regular or diet (cans per day)",
      },
    ],
  },
  {
    question: "Do you have adverse reactions to caffeine?",
    type: "radio",
    name: "sensitive_food_caffeine",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If Yes, please describe your reaction:",
        type: "text",
        name: "sensitive_food_caffeine_other"
      }
    ]
  },
  {
    question: "When you drink caffeine do you feel:",
    type: "checkbox",
    name: "sensitive_food_caffeine_feel",
    options: ["Irritable or weird", "Aches or pains", "N/A"],
    subQuestions: [
      {
        question: "Other",
        type: "text",
        name: "sensitive_food_caffeine_feel_other"
      }
    ]
  }
  
];

const Nutrition = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const patientNutritionInfo = useSelector((state) => state.intake?.patientNutritionInfo);
  
  useEffect(() => {
    dispatch(getNutritionPatient());
  }, [dispatch]);

  useEffect(() => {
    if (patientNutritionInfo) {
      const normalizeYesNo = (value) => {
        if (value === true) return "Yes";
        if (value === false) return "No";
        return null;
      };

      const prefilledAnswers = {
        special_nutritional_program: (() => {
          const base = patientNutritionInfo.specialDietProgram || [];
          const hasOther = patientNutritionInfo.specialDietOther && patientNutritionInfo.specialDietOther.trim() !== "";
          return hasOther && !base.includes("Other") ? [...base, "Other"] : base;
        })(),
        special_nutritional_program_other: patientNutritionInfo.specialDietOther || "",
        special_diet_reason: patientNutritionInfo.specialDietReason || "",
        sensitive_food: normalizeYesNo(patientNutritionInfo.sensitiveToFood?.yesNo),
        sensitive_food_info: patientNutritionInfo.sensitiveToFood?.describe || "",
        aversion_to_certain_food: normalizeYesNo(patientNutritionInfo.aversionToFood?.yesNo),
        aversion_to_certain_food_other: patientNutritionInfo.aversionToFood?.describe || "",
        adversely_react: patientNutritionInfo.adverseList || [],
        adversely_react_other: patientNutritionInfo.adverseReactOther || "",
        crave_for_foods: normalizeYesNo(patientNutritionInfo.anyFoodCraving?.yesNo),
        crave_for_foods_other: patientNutritionInfo.anyFoodCraving?.describe || "",
        eat_3_meals: normalizeYesNo(patientNutritionInfo.have3MealADay?.yesNo),
        eat_3_meals_detail: patientNutritionInfo.have3MealADay?.yesNo === false ? String(patientNutritionInfo.have3MealADay.level || "") : "",
        does_skipping_meal_affect_you: normalizeYesNo(patientNutritionInfo.skippingAMeal),
        does_skipping_meal_affect_you_other: patientNutritionInfo.reasonSkipMeal || "",
        meals_per_day: patientNutritionInfo.howManyEatOutPerWeek || "",
        actors_applyingto_current_lifestyle: patientNutritionInfo.eatingHabits || [],
        diet_detail_breakfast: patientNutritionInfo.typicalBreakfast || "",
        diet_detail_lunch: patientNutritionInfo.typicalLunch || "",
        diet_detail_dinner: patientNutritionInfo.typicalDinner || "",
        diet_detail_snacks: patientNutritionInfo.typicalSnacks || "",
        diet_detail_fluids: patientNutritionInfo.typicalFluid || "",
        diet_servings_fruits: String(patientNutritionInfo.noTypicalFruits || "0"),
        diet_serving_vegetables: String(patientNutritionInfo.noTypicalVegetables || "0"),
        diet_servings_legumes: String(patientNutritionInfo.noTypicalLegumes || "0"),
        diet_servings_meat: String(patientNutritionInfo.noTypicalRedMeat || "0"),
        diet_servings_fish: String(patientNutritionInfo.noTypicalFish || "0"),
        diet_servings_dairyalt: String(patientNutritionInfo.noTypicalDairy || "0"),
        diet_servings_nuts: String(patientNutritionInfo.noTypicalNuts || "0"),
        diet_servings_fatsandoil: String(patientNutritionInfo.noTypicalFats || "0"),
        diet_servings_soda: String(patientNutritionInfo.noTypicalCanSoda || "0"),
        diet_servings_sweets: String(patientNutritionInfo.noTypicalSweets || "0"),
        caffeinated_beverages: normalizeYesNo(patientNutritionInfo.caffeinatedBeverages),
        coffee_amount: patientNutritionInfo.coffeeCups || "",
        tea_amount: patientNutritionInfo.teaCups || "",
        soda_amount: patientNutritionInfo.sodaCups || "",
        sensitive_food_caffeine: normalizeYesNo(patientNutritionInfo.adverseReactionToCoffee?.yesNo),
        sensitive_food_caffeine_other: patientNutritionInfo.adverseReactionToCoffee?.describe || "",
        sensitive_food_caffeine_feel: (() => {
          const reactions = [];
          if (patientNutritionInfo.reactionToCaffeine) {
            if (patientNutritionInfo.reactionToCaffeine.includes("Irritable or weird")) reactions.push("Irritable or weird");
            if (patientNutritionInfo.reactionToCaffeine.includes("Aches or pains")) reactions.push("Aches or pains");
            if (patientNutritionInfo.reactionToCaffeine.includes("N/A")) reactions.push("N/A");
          }
          return reactions;
        })(),
        sensitive_food_caffeine_feel_other: patientNutritionInfo.sensitiveCaffeineOther || "",
        breakfast_time: patientNutritionInfo.breakfastTime || "",
        lunch_time: patientNutritionInfo.lunchTime || "",
        snack_time: patientNutritionInfo.snacksTime || "",
        dinner_time: patientNutritionInfo.dinnerTime || "",
      };

      console.log("Setting answers with adversely_react:", prefilledAnswers.adversely_react);
      setAnswers(prefilledAnswers);
    } else {
      // Initialize with default values
      setAnswers({
        diet_servings_fruits: "0",
      });
    }
  }, [patientNutritionInfo]);

  const handleExit = () => {
    navigate("/assessment");
  };
  // const validateQuestion = () => {
  //   const question = questions[currentQuestionIndex];
  //   const isTimeFieldValid =
  //   question.subQuestion && question.subQuestion.some(sub => {
  //     return answers[sub.name] !== undefined && answers[sub.name] !== "";
  //   });

  //   const isCheckboxValid = question.type === "checkbox" && 
  //   (Array.isArray(answers[question.name]) && answers[question.name].length > 0 && answers[question.name] !== undefined);

  //   return (
  //     answers[question.name] !== undefined && answers[question.name] !== "" && (isCheckboxValid || isTimeFieldValid)
  //   );
  // };

  const validateQuestion = () => {
    const question = questions[currentQuestionIndex];
  
    switch (question.type) {
      case "long_select": {
        const value = answers[question.name];
        if (value === undefined || value === null || value === "") {
          console.log(`Validation Failed: No value selected for ${question.name}`);
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
        return true;
  
      case "long_radio":
        if (question.subQuestions) {
          if (answers[question.name] === "Yes") {
            for (const subQuestion of question.subQuestions) {
              if (!answers[subQuestion.name] || answers[subQuestion.name] === "") {
                console.log(`Validation Failed: long_radio subquestion ${subQuestion.name} is empty.`);
                return false;
              }
            }
          }
        }
        return answers[question.name] !== undefined;
  
        case "radio": {
          const value = answers[question.name];
        
          if (value === undefined || value === null || value === "") {
            console.log(`Validation Failed: No selection made for ${question.name}`);
            return false;
          }      
          
          if (question.name === "does_skipping_meal_affect_you" && value === "Yes") {
            const requiredField = "does_skipping_meal_affect_you_other";
            if (!answers[requiredField] || answers[requiredField].trim() === "") {
              console.log(`Validation Failed: ${requiredField} is required when 'Yes' is selected.`);
              return false;
            }
          }
          if (question.name === "crave_for_foods" && value === "Yes") {
            const requiredField = "crave_for_foods_other";
            if (!answers[requiredField] || answers[requiredField].trim() === "") {
              console.log(`Validation Failed: ${requiredField} is required when 'Yes' is selected.`);
              return false;
            }
          }

          if (question.name === "aversion_to_certain_food" && value === "Yes") {
            const requiredField = "aversion_to_certain_food_other";
            if (!answers[requiredField] || answers[requiredField].trim() === "") {
              console.log(`Validation Failed: ${requiredField} is required when 'Yes' is selected.`);
              return false;
            }
          }
          // Optional logic for specific radios needing extra input
          if (question.name === "sensitive_food" && value === "Yes") {
            const detailField = "sensitive_food_info";
            if (!answers[detailField] || answers[detailField].trim() === "") {
              console.log(`Validation Failed: ${detailField} required.`);
              return false;
            }
          }
          if (question.name === "sensitive_food_caffeine" && value === "Yes") {
            const detailField = "sensitive_food_caffeine_other";
            if (!answers[detailField] || answers[detailField].trim() === "") {
              console.log(`Validation Failed: ${detailField} required.`);
              return false;
            }
          }        
        
          return true;
        }
        
  
      case "checkbox": {
        if (!answers[question.name] || answers[question.name].length === 0) {
          console.log(`Validation Failed: No checkboxes selected for ${question.name}`);
          return false;
        }
        if (answers[question.name].includes("Other")) {
          if (!answers[`${question.name}_other`] || answers[`${question.name}_other`] === "") {
            console.log(`Validation Failed: "Other" checkbox selected for ${question.name}, but input is empty.`);
            return false;
          }
        }
        return true;
      }
      
      case "long_textarea":
        return answers[question.name] !== undefined && answers[question.name] !== "";
  
      case "radiowithselect":
        if (!answers[question.name]) {
          console.log(`Validation Failed: No option selected for ${question.name}`);
          return false;
        }
        if (answers[question.name] === "No" && (!answers[`${question.name}_detail`] || answers[`${question.name}_detail`] === "")) {
          console.log(`Validation Failed: User selected "No" for ${question.name}, but did not specify how many.`);
          return false;
        }
        return true;
  
      default:
        return true;
    }
  };
  

  const handleSave = () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    localStorage.setItem("currentQuestionIndex3", currentQuestionIndex);
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

    if (question && question.type === "checkbox") {
      if (name.endsWith('_other')) {
        updatedAnswers[name] = value;
      } else {
        // For checkbox selections
        updatedAnswers[name] = value;
        // If "Other" is unchecked, clear its text input
        if (!value.includes('Other')) {
          delete updatedAnswers[`${name}_other`];
        }
      }
    } else if (question && (question.type === "radio" || question.type === "long_radio" || question.type === "radiowithselect")) {
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
      if (name === "sensitive_food") {
        delete updatedAnswers.sensitive_food_info;
      } else if (name === "eat_3_meals") {
        delete updatedAnswers.eat_3_meals_detail;
      } else if (name === "caffeinated_beverages") {
        delete updatedAnswers.coffee_amount;
        delete updatedAnswers.tea_amount;
        delete updatedAnswers.soda_amount;
      }
    } else {
      // Default behavior for other types
      updatedAnswers[name] = value;
    }

    setAnswers(updatedAnswers);
  };
  

  const transformNutritionData = (answers) => {

    return {
      specialDietProgram: answers.special_nutritional_program || [],
      specialDietOther: answers.special_nutritional_program_other || "",
      sensitiveToFood: {
        yesNo: answers.sensitive_food === "Yes",
        describe: answers.sensitive_food_info || "",
      },
      aversionToFood: {
        yesNo: answers.aversion_to_certain_food === "Yes",
        describe: answers.aversion_to_certain_food_other || "",
      },
      adverseList: answers.adversely_react || [],
      adverseReactOther: answers.adversely_react_other || "",
      anyFoodCraving: {
        yesNo: answers.crave_for_foods === "Yes",
        describe: answers.crave_for_foods_other || "",
      },
      have3MealADay: {
        yesNo: answers.eat_3_meals === "Yes",
        level:
          answers.eat_3_meals === "No"
            ? parseInt(answers["eat_3_meals_detail"] || "0", 10)
            : 3, // default to 3 if answered Yes
      },
      skippingAMeal: answers.does_skipping_meal_affect_you === "Yes",
      reasonSkipMeal:answers.does_skipping_meal_affect_you === "Yes" ? answers.does_skipping_meal_affect_you_other : "",
      howManyEatOutPerWeek: answers.meals_per_day || "",
      eatingHabits: answers.actors_applyingto_current_lifestyle || [],
      typicalBreakfast: answers.diet_detail_breakfast || "",
      typicalLunch: answers.diet_detail_lunch || "",
      typicalDinner: answers.diet_detail_dinner || "",
      typicalSnacks: answers.diet_detail_snacks || "",
      typicalFluid: answers.diet_detail_fluids || "",
      noTypicalFruits: answers.diet_servings_fruits || 0,
      noTypicalVegetables: answers.diet_serving_vegetables || 0,
      noTypicalLegumes: answers.diet_servings_legumes || 0,
      noTypicalRedMeat: answers.diet_servings_meat || 0,
      noTypicalFish: answers.diet_servings_fish || 0,
      noTypicalDairy: answers.diet_servings_dairyalt || 0,
      noTypicalNuts: answers.diet_servings_nuts || 0,
      noTypicalFats: answers.diet_servings_fatsandoil || 0,
      noTypicalCanSoda: answers.diet_servings_soda || 0,
      noTypicalSweets: answers.diet_servings_sweets || 0,
      caffeinatedBeverages: answers.caffeinated_beverages === "Yes",
      coffeeCups: answers.coffee_amount,
      teaCups: answers.tea_amount || "",
      sodaCups: answers.soda_amount || "",
      adverseReactionToCoffee: {
        yesNo: answers.sensitive_food_caffeine === "Yes",
        describe: answers.sensitive_food_caffeine_other || "",
      },
      explainAdverseReactionToCoffee: answers.sensitive_food_caffeine_other || "",
      reactionToCaffeine: (() => {
        const processed = Array.isArray(answers.sensitive_food_caffeine_feel)
          ? answers.sensitive_food_caffeine_feel
          : [answers.sensitive_food_caffeine_feel].filter(Boolean);

        return processed.length > 0 ? processed.join(", ") : "";
      })(),
      sensitiveCaffeineOther: answers.sensitive_food_caffeine_feel_other || "",
      specialDietReason:answers.special_diet_reason || "",
      breakfastTime:answers.breakfast_time || "",
      lunchTime:answers.lunch_time || "",
      snacksTime:answers.snack_time || "",
      dinnerTime:answers.dinner_time || "",
    };
  };

  const handleSubmit = () => {
    if (!validateQuestion()) {
      message.error("Please answer the current question before saving.");
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo?.obj?.token || "";
    console.log(({ userInfo }))
    const transformedData = transformNutritionData(answers);

    fetch(
      `${baseUrl}Patient/AddNutrition`,
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
        dispatch(completeCard("/questionnaire/3"));
        localStorage.setItem("currentQuestionIndex3", 0);
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
      <div key={index} style={{ marginTop: 20, marginLeft: 20 }}>
        <p style={{ color: "#000", fontWeight: "bold" }}>
          {subQuestion.question}
        </p>
        <p style={{ color: "#000" }}>{subQuestion.label}</p>
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
      </div>
    ));
  };

  const label = (
    <span>
      <span style={{ color: "red" }}>* </span>
    </span>
  );

  const renderInput = (question) => {
    switch (question.type) {
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

            {answers[question.name] === "Yes" && question.subQuestions && question.subQuestions.map((subQ, index) => (
              <div key={index}>
                <p style={{ marginTop: "10px", color: "#000", fontWeight: "600" }}>{subQ.question}</p>
                <Input
                  className="input_questtionnaire"
                  required
                  placeholder="Please describe"
                  value={answers[subQ.name] || ""}
                  onChange={(e) => handleChange(e.target.value, subQ.name)}
                  style={{ marginTop: "10px" }}
                />
              </div>
            ))}

            {answers[question.name] === "Yes" && !question.subQuestions && (
              <Input
                className="input_questtionnaire"
                required
                placeholder={question.name === "sensitive_food" ? "If Yes: list food and symptoms" : "If Yes, Please explain"}
                value={answers[`${question.name}_other`] || ""}
                onChange={(e) =>
                  handleChange(e.target.value, `${question.name}_other`)
                }
                style={{ marginTop: "10px" }}
              />
            )}
          </>
        );

        case "checkbox":
          return (
            <Checkbox.Group
              name={question.name}
              onChange={(checkedValues) => {
                // If "None" is selected, remove all others
                let finalValues = checkedValues.includes("None")
                  ? ["None"]
                  : checkedValues.filter((val) => val !== "None");

                handleChange(finalValues, question.name);
              }}
              value={answers[question.name] || []}
              className="checkbox-group"
            >

              <div className="checkbox-rows">
                {question.options.map((option, idx) => (
                  <div key={idx} className="checkbox-row">
                    <div className="checkbox-container" style={{flexDirection:"row", alignItems:"baseline"}}>
                    <Checkbox value={option} className="checkbox-item" style={{ width: "calc(9% - 10px)" }}>
                        {option}
                      </Checkbox>
                      {option === "Other" && answers[question.name]?.includes("Other") && (
                        <Input
                          className="input_questionnaire other-input"
                          placeholder="Please describe"
                          value={answers[`${question.name}_other`] || ""}
                          onChange={e =>
                            handleChange(e.target.value, `${question.name}_other`)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          );
          
          
        case "radiowithselect":
        return (
          <Radio.Group
            name={question.name}
            onChange={(e) => handleChange(e.target.value, question.name)}
            value={answers[question.name]}
            style={{ width: "100%", overflow: "visible" }}
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
            {answers[question.name] === "No" && (
              <>
                <div style={{ marginTop: "10px", color: "#000", fontWeight: "600", fontSize: "15px" }}>If no, how many?</div>
                <Select
                  placeholder="Please specify"
                  value={answers[`${question.name}_detail`] || ""}
                  onChange={(value) =>
                    handleChange(value, `${question.name}_detail`)
                  }
                  style={{ width: isMobile?"100%":"50%", marginTop: "10px" }}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                </Select>
              </>
            )}
          </Radio.Group>
        );
     
        case "time_select":
        const timeOptions = Array.from({ length: 24 }, (_, i) => {
          const hour = i < 10 ? `0${i}` : i;
          return `${hour}:00`;
        });

        return (
          <div style={{ flexDirection: "column", marginTop: "10px" }}>
            <label style={{ marginBottom: "10px", fontWeight: "bold" }}>
              {question.label || "Select Time"}
            </label>
            <br/>
            <Select
              placeholder="Select time"
              className="select_time_dropdown"
              value={answers[question.name] || ""}
              onChange={(value) => handleChange(value, question.name)}
              style={{ width: isMobile?"100%":"30%" }}
            >
              {timeOptions.map((time) => (
                <Option key={time} value={time}>
                  {time}
                </Option>
              ))}
            </Select>
          </div>
        );

      case "long_textarea":
        return (
          <div style={{ flexDirection: "column" }}>
            <br />
            {question.subQuestion &&
              question.subQuestion.map((sub, index) => (
                <div key={index}>
                  {renderInput(sub)}
                </div>
              ))}
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
              <br />
              <Select
                className="select_questtionnaire"
                name={question.name}
                value={answers[question.name] ?? ""}
                onChange={(value) => handleChange(value, question.name)}
                style={{ width: "292px", marginTop: "10px" }}
                placeholder="Select number of servings"
              >
                {question.selectOptions.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
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
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>Nutrition</h3>

        <h3 style={{ margin: "20px 0", fontWeight: "600", color: "#000", fontSize: "15px" }}>
          {label}
          {questions[currentQuestionIndex].question}{" "}
          <i style={{ color: "#335CAD", fontWeight: "bold" }}>
            {questions[currentQuestionIndex]?.sub}
          </i>
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

export default Nutrition;