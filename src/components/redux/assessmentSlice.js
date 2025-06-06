import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    title: "Reproductive Health",
    component: "/questionnaire/11",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738773195/ovum_qzgay1.png",
    isComplete: false,
    meta:"reproductiveHealth"
  },
  {
    title: "General Information",
    component: "/questionnaire/1",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258152/2_qe7gb1.svg",
    isComplete: false,
    meta:"generalInformation"
  },
  {
    title: "Current Health and Lifestyle",
    component: "/questionnaire/2",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738774038/self-care-health-concept_b56alw.png",
    isComplete: false,
    meta:"healthLifestyle"
  },
  {
    title: "Nutrition and Dietary Habits",
    component: "/questionnaire/3",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258153/4_fqy114.svg",
    isComplete: false,
    meta:"nutrition"
  },
  {
    title: "Substance Use",
    component: "/questionnaire/4",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258164/9_zb8ij3.svg",
    isComplete: false,
    meta:"substanceUse"
  },
  {
    title: "Stress and Relationships",
    component: "/questionnaire/5",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258153/1_srz5zf.svg",
    isComplete: false,
    meta:"stressRelationship"
  },
  {
    title: "Health and Medical History",
    component: "/questionnaire/6",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258153/5_t3wt7n.svg",
    isComplete: false,
    meta:"healthMedical"
  },
  {
    title: "Personal & Family History",
    component: "/questionnaire/7",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258164/substance_h41r7q.svg",
    isComplete: false,
    meta:"personalFamily"
  },

  {
    title: "Illness and Conditions",
    component: "/questionnaire/8",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258153/6_goxcxt.svg",
    isComplete: false,
    meta:"illnessConditions"
  },
  {
    title: "Symptom Review and Medications",
    component: "/questionnaire/9",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258156/8_xonkbe.svg",
    isComplete: false,
    meta:"symptomsReview"
  },
  {
    title: "Readiness and Health Goals",
    component: "/questionnaire/10",
    icon: "https://res.cloudinary.com/tracysoft/image/upload/v1738258156/3_mw2thv.svg",
    isComplete: false,
    meta:"readinessHealth"
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
