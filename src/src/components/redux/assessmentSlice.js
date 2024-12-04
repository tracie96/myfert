import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    title: "Reproductive Health",
    component: "/questionnaire/11",
    icon: "ReproductiveIcon",
    isComplete: false,
  },
  {
    title: "General Information",
    component: "/questionnaire/1",
    icon: "GeneralIntakeIcon",
    isComplete: false,
  },
  {
    title: "Current Health and Lifestyle",
    component: "/questionnaire/2",
    icon: "LifeStyleIcon",
    isComplete: false,
  },
  {
    title: "Nutrition and Dietary Habits",
    component: "/questionnaire/3",
    icon: "DietaryIcon",
    isComplete: false,
  },
  {
    title: "Substance Use",
    component: "/questionnaire/4",
    icon: "SubstanceIcon",
    isComplete: false,
  },
  {
    title: "Stress and Relationships",
    component: "/questionnaire/5",
    icon: "MedicalHistoryIcon",
    isComplete: false,
  },
  {
    title: "Health and Medical History",
    component: "/questionnaire/6",
    icon: "MedicalHistoryIcon",
    isComplete: false,
  },
  {
    title: "Family History",
    component: "/questionnaire/7",
    icon: "FamilyHistoryIcon",
    isComplete: false,
  },
  {
    title: "Illness and Conditions",
    component: "/questionnaire/8",
    icon: "IllnessIcon",
    isComplete: false,
  },
  {
    title: "Symptom Review and Medications",
    component: "/questionnaire/9",
    icon: "dummyIcon",
    isComplete: false,
  },
  {
    title: "Readiness and Health Goals",
    component: "/questionnaire/10",
    icon: "dummyIcon",
    isComplete: false,
  },
];

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    completeCard: (state, action) => {
      const index = state.findIndex(
        (card) => card.component === action.payload,
      );
      console.log("completeCard action payload:", action.payload);
      console.log("Index found:", index);
      if (index !== -1) {
        state[index].isComplete = true;
        console.log("Updated card:", state[index]);
      } else {
        console.log("Card not found");
      }
    },
  },
});

export const { completeCard, setCards } = assessmentSlice.actions;
export default assessmentSlice.reducer;
