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
import { useDispatch } from "react-redux";
import { completeCard } from "../../../../redux/assessmentSlice";
import FormWrapper from "../FormWrapper";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";

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
    ],
  },
  {
    question: "Do you have sensitivities to certain foods?",
    type: "radio",
    name: "sensitive_food",
    options: ["Yes", "No"],
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
      "Signifcant other or family members have special dietary needs",
      "Love to eat",
      "Eat because I have to",
      "Have negative relationship to food",
      "Struggle with eating issues",
      "Emotional eater (eat when sad, lonely, bored, etc.)",
      "Eat too much under stress",
      "Eat too little under stress",
      "Don’t care to cook",
      "Confused about nutrition advice",
    ],
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Breakfast",
    name: "diet_detail_breakfast",
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Lunch",
    name: "diet_detail_lunch",
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Dinner",
    name: "diet_detail_dinner",
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Snacks",
    name: "diet_detail_snacks",
  },
  {
    question: "Please record what you eat in a typical day:",
    type: "long_textarea",
    sub: "Fluids",
    name: "diet_detail_fluids",
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fruits (not juice)",
    name: "diet_detail_fruits",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Vegetables (not including white potatoes)",
    name: "diet_detail_vegetables",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Legumes (beans, peas, etc)",
    name: "diet_detail_legumes",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },

  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Red meat",
    name: "diet_detail_red_meat",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fish",
    name: "diet_detail",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Dairy/ Alternatives",
    name: "diet_detail_dairyalt",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Nuts & Seeds",
    name: "diet_detail_nuts",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Fats & Oils",
    name: "diet_detail_fatsandoil",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Cans of soda (regular or diet)",
    name: "diet_detail_soda",
    selectOptions: Array.from({ length: 10 }, (_, i) => 0 + i),
  },
  {
    question: "How many servings do you eat in a typical week of these foods:",
    type: "long_select",
    sub: "Sweets (candy, cookies, cake, ice cream, etc.)",
    name: "diet_detail_sweets",
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
        options: ["1", "2-4", "More than 4"],
        label: "Coffee (cups per day)",
      },
      {
        type: "radio",
        name: "tea_amount",
        options: ["1", "2-4", "More than 4"],
        label: "Tea (cups per day)",
      },
      {
        type: "radio",
        name: "soda_amount",
        options: ["1", "2-4", "More than 4"],
        label: "Caffeinated sodas—regular or diet (cans per day)",
      },
    ],
  },
  {
    question: "Do you have adverse reactions to caffeine?",
    type: "radio",
    name: "sensitive_food_caffeine",
    options: ["Yes", "No"],
  },
  {
    question: "When you drink caffeine do you feel:",
    type: "radio",
    name: "sensitive_food_caffeine_feel",
    options: ["Irritable or weird", "Aches or pains"],
  },
];

const Nutrition = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex3"),
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
    setAnswers({
      ...answers,
      [name]: value,
    });
  };

  const transformNutritionData = (answers) => {
    return {
      specialDietProgram: answers.special_nutritional_program || [],
      sensitiveToFood: {
        yesNo: answers.sensitive_food === "Yes",
        describe: answers.sensitive_food_caffeine_feel || "",
      },
      aversionToFood: {
        yesNo: answers.aversion_to_certain_food === "Yes",
        describe: "",
      },
      adverseList: answers.adversely_react || [],
      anyFoodCraving: {
        yesNo: answers.crave_for_foods === "Yes",
        describe: "",
      },
      have3MealADay: {
        yesNo: answers.eat_3_meals === "Yes",
        level:
          parseInt(answers?.meals_per_day?.replace(/[^0-9]/g, ""), 10) || 0,
      },
      skippingAMeal: answers.does_skipping_meal_affect_you === "Yes",
      howManyEatOutPerWeek: answers.meals_per_day || "",
      eatingHabits: answers.actors_applyingto_current_lifestyle || [],
      typicalBreakfast: answers.diet_detail_breakfast || "",
      typicalLunch: answers.diet_detail_lunch || "",
      typicalDinner: answers.diet_detail_dinner || "",
      typicalSnacks: answers.diet_detail_snacks || "",
      typicalFluid: answers.diet_detail_fluids || "",
      noTypicalFruits: answers.diet_detail_fruits || 0,
      noTypicalVegetables: answers.diet_detail_vegetables || 0,
      noTypicalLegumes: answers.diet_detail_legumes || 0,
      noTypicalRedMeat: answers.diet_detail_red_meat || 0,
      noTypicalFish: 0,
      noTypicalDairy: answers.diet_detail_dairyalt || 0,
      noTypicalNuts: answers.diet_detail_nuts || 0,
      noTypicalFats: answers.diet_detail_fatsandoil || 0,
      noTypicalCanSoda: answers.diet_detail_soda || 0,
      noTypicalSweets: answers.diet_detail_sweets || 0,
      caffeinatedBeverages: answers.caffeinated_beverages === "Yes",
      coffeeCups: "", // Assuming no data provided for coffee, tea, or soda cups
      teaCups: "",
      sodaCups: "",
      adverseReactionToCoffee: answers.sensitive_food_caffeine === "Yes",
      explainAdverseReactionToCoffee:
        answers.sensitive_food_caffeine_feel || "",
      reactionToCaffeine: answers.sensitive_food_caffeine_feel || "",
    };
  };

  const handleSubmit = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const token = userInfo.obj.token || "";

    const transformedData = transformNutritionData(answers);

    fetch(
      "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddNutrition",
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
        <p>{subQuestion.label}</p>
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
                  {option}
                </Radio>
              ))}
            </Radio.Group>

            {answers[question.name] === "Yes" &&
              question.name === "sensitive_food_caffeine" && (
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
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
              </Select>
            )}
          </Radio.Group>
        );
      case "long_textarea":
        return (
          <div style={{ flexDirection: "column" }}>
            <br />
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
              value={answers[question.name] || ""}
              onChange={(value) => handleChange(value, question.name)}
              style={{ marginTop: "10px", width: "50%" }}
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
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>Nutrition</h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontSize: "15px" }}>
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

export default Nutrition;
