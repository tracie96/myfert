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
    sub: "General",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { text: "Cold hands and feet", name: "cold_hands_and_feets" },
      { text: "Cold intolerance", name: "cold_intoerance" },
      { text: "crohns", name: "crohn" },
      { text: "Daytime sleepiness", name: "daytime_sleepiness" },
      { text: "Difficulty falling asleep", name: "difficulty_falling_asleep" },
      { text: "Early waking", name: "early_waking" },
      { text: "Fatigue", name: "fatigue" },
      { text: "Fever", name: "fever" },
      { text: "Flushing", name: "fushing" },
      { text: "Heat intolerance", name: "heat_intolerance" },
      { text: "Night waking", name: "night_walking" },
      { text: "Nightmares", name: "nightmares" },
      { text: "Can’t remember dreams", name: "cant_remember_dreams" },
      { text: "Low body temperature", name: "low_body_temperature" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Head, Eyes, and Ears",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "conjunctivitis", text: " Conjunctivitis" },
      { name: "distorted_sense_of_smell", text: "Distorted sense of smell" },
      { name: "distorted_taste", text: "Distorted taste" },
      { name: "ear_fullness", text: "Ear fullness" },
      { name: "ear_ringing", text: "Ear ringing/buzzing" },
      { name: "eye_crusting", text: "Eye crusting" },
      { name: "eye_pain", text: "Eye pain" },
      { name: "eyelid_margin_redness", text: " Eyelid margin redness" },
      { name: "headache", text: "Headache" },
      { name: "interstitial_cystitis", text: "Hearing loss" },
      { name: "hearing_problems", text: "Hearing problems" },
      { name: "migraine", text: "Migraine" },
      {
        name: "sensitivity_to_loud_noises",
        text: "Sensitivity to loud noises",
      },
      { name: "vision_problems", text: "Vision problems" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "healthConditions",
    sub: "Musculoskeletal",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "back_muscle_spasm", text: "Back muscle spasm" },
      { name: "calf_cramps", text: "Calf cramps" },
      { name: "chest_tightness", text: "Chest tightness" },
      { name: "foot_cramps", text: "Foot cramps" },
      { name: "joint_deformity", text: "Joint deformity" },
      { name: "joint_pain", text: "Joint pain" },
      { name: "joint_redness", text: "Joint redness" },
      { name: "joint_stiffness", text: "Joint stiffness" },
      { name: "muscle_pain", text: "Muscle pain" },
      { name: "muscle_spasms", text: "Muscle spasms" },
      { name: "muscle_stiffness", text: "Muscle stiffness" },
      { name: "muscle_twitches_eyes", text: "Muscle twitches Around eyes" },
      {
        name: "muscle_twitches_arms_legs",
        text: "Muscle twitches Arms or legs",
      },
      { name: "muscle_weakness", text: "Muscle weakness" },
      { name: "neck_muscle_spasm", text: "Neck muscle spasm" },
      { name: "tendonitis", text: "Tendonitis" },
      { name: "tension_headache", text: "Tension headache" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "moodNervesSymptoms",
    sub: "Mood/Nerves",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "agoraphobia", text: "Agoraphobia" },
      { name: "anxiety", text: "Anxiety" },
      { name: "auditory_hallucinations", text: "Auditory hallucinations" },
      { name: "blackouts", text: "Blackouts" },
      { name: "depression", text: "Depression" },
      {
        name: "difficulty_concentrating",
        text: "Difficulty:",
        subOptions: [
          { name: "concentrating", text: "Concentrating" },
          { name: "with_balance", text: "With balance" },
          { name: "with_thinking", text: "With thinking" },
          { name: "with_judgment", text: "With judgment" },
          { name: "with_speech", text: "With speech" },
          { name: "with_memory", text: "With memory" },
        ],
      },
      { name: "dizziness", text: "Dizziness (spinning)" },
      { name: "fainting", text: "Fainting" },
      { name: "fearfulness", text: "Fearfulness" },
      { name: "irritability", text: "Irritability" },
      { name: "light_headedness", text: "Light-headedness" },
      { name: "numbness", text: "Numbness" },
      { name: "other_phobias", text: "Other phobias" },
      { name: "panic_attacks", text: "Panic attacks" },
      { name: "paranoia", text: "Paranoia" },
      { name: "seizures", text: "Seizures" },
      { name: "suicidal_thoughts", text: "Suicidal thoughts" },
      { name: "tremor_trembling", text: "Tremor/trembling" },
      { name: "visual_hallucinations", text: "Visual Hallucinations" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "cardiovascularSymptoms",
    sub: "Cardiovascular",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "angina_chest_pain", text: "Angina/chest pain" },
      { name: "breathlessness", text: "Breathlessness" },
      { name: "heart_attack", text: "Heart attack" },
      { name: "heart_murmur", text: "Heart murmur" },
      { name: "high_blood_pressure", text: "High blood pressure" },
      { name: "irregular_pulse", text: "Irregular pulse" },
      { name: "mitral_valve_prolapse", text: "Mitral valve prolapse" },
      { name: "palpitations", text: "Palpitations" },
      { name: "phlebitis", text: "Phlebitis" },
      { name: "swollen_ankles_feet", text: "Swollen ankles/feet" },
      { name: "varicose_veins", text: "Varicose veins" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "urinarySymptoms",
    sub: "Urinary",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "bed_wetting", text: "Bed wetting" },
      { name: "hesitancy", text: "Hesitancy" },
      { name: "infection", text: "Infection" },
      { name: "kidney_disease", text: "Kidney disease" },
      { name: "kidney_stone", text: "Kidney stone" },
      { name: "leaking/incontinence", text: "Leaking/incontinence" },
      { name: "pain/burning", text: "Pain/burning" },
      { name: "urgency", text: "Urgency" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "digestionIssues",
    sub: "Digestion",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "anal_spasms", text: "Anal spasms" },
      { name: "bad_teeth", text: "Bad teeth" },
      { name: "bleeding_gums", text: "Bleeding gums" },
      { name: "bloating_lower_abdomen", text: "Bloating of Lower abdomen" },
      { name: "bloating_whole_abdomen", text: "Bloating of Whole abdomen" },
      { name: "bloating_after_meals", text: "Bloating after meals" },
      { name: "blood_in_stools", text: "Blood in stools" },
      { name: "burping", text: "Burping" },
      { name: "canker_sores", text: "Canker sores" },
      { name: "cold_sores", text: "Cold sores" },
      { name: "constipation", text: "Constipation" },
      { name: "cracking_corner_of_lips", text: "Cracking at corner of lips" },
      { name: "dentures_poor_chewing", text: "Dentures w/poor chewing" },
      { name: "diarrhea", text: "Diarrhea" },
      { name: "difficulty_swallowing", text: "Difficulty swallowing" },
      { name: "dry_mouth", text: "Dry mouth" },
      { name: "farting", text: "Farting" },
      { name: "fissures", text: "Fissures" },
      { name: "foods_repeat", text: 'Foods "repeat" (reflux)' },
      { name: "heartburn", text: "Heartburn" },
      { name: "hemorrhoids", text: "Hemorrhoids" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "digestionAdvancedIssues",
    sub: "Digestion Contd.",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "intolerance_lactose", text: "Intolerance to Lactose" },
      {
        name: "intolerance_all_dairy",
        text: "Intolerance to All dairy products",
      },
      { name: "intolerance_gluten", text: "Intolerance to Gluten (wheat)" },
      { name: "intolerance_corn", text: "Intolerance to Corn" },
      { name: "intolerance_eggs", text: "Intolerance to Eggs" },
      { name: "intolerance_fatty_foods", text: "Intolerance to Fatty foods" },
      { name: "intolerance_yeast", text: "Intolerance to Yeast" },
      {
        name: "liver_disease_jaundice",
        text: "Liver disease/jaundice (yellow eyes or skin)",
      },
      { name: "lower_abdominal_pain", text: "Lower abdominal pain" },
      { name: "mucus_in_stools", text: "Mucus in stools" },
      { name: "nausea", text: "Nausea" },
      { name: "periodontal_disease", text: "Periodontal disease" },
      { name: "sore_tongue", text: "Sore tongue" },
      { name: "strong_stool_odor", text: "Strong stool odor" },
      { name: "undigested_food_in_stools", text: "Undigested food in stools" },
      { name: "upper_abdominal_pain", text: "Upper abdominal pain" },
      { name: "vomiting", text: "Vomiting" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "eatingIssues",
    sub: "Eating",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "binge_eating", text: "Binge eating" },
      { name: "bulimia", text: "Bulimia" },
      { name: "cant_gain_weight", text: "Can't gain weight" },
      { name: "cant_lose_weight", text: "Can't lose weight" },
      { name: "carbohydrate_craving", text: "Carbohydrate craving" },
      { name: "carbohydrate_intolerance", text: "Carbohydrate intolerance" },
      { name: "poor_appetite", text: "Poor appetite" },
      { name: "salt_cravings", text: "Salt cravings" },
      { name: "frequent_dieting", text: "Frequent dieting" },
      { name: "sweet_cravings", text: "Sweet cravings" },
      { name: "caffeine_dependency", text: "Caffeine dependency" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "respiratoryIssues",
    sub: "Respiratory",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "bad_breath", text: "Bad breath" },
      { name: "bad_odor_in_nose", text: "Bad odor in nose" },
      { name: "cough_dry", text: "Cough - dry" },
      { name: "cough_productive", text: "Cough - productive" },
      { name: "hayfever_spring", text: "Hayfever: Spring" },
      { name: "hayfever_summer", text: "Hayfever: Summer" },
      { name: "hayfever_fall", text: "Hayfever: Fall" },
      { name: "hayfever_change_of_season", text: "Hayfever: Change of season" },
      { name: "hoarseness", text: "Hoarseness" },
      { name: "nasal_stuffiness", text: "Nasal stuffiness" },
      { name: "nose_bleeds", text: "Nose bleeds" },
      { name: "post_nasal_drip", text: "Post nasal drip" },
      { name: "sinus_fullness", text: "Sinus fullness" },
      { name: "sinus_infection", text: "Sinus infection" },
      { name: "snoring", text: "Snoring" },
      { name: "sore_throat", text: "Sore throat" },
      { name: "wheezing", text: "Wheezing" },
      { name: "winter_stuffiness", text: "Winter stuffiness" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "nailIssues",
    sub: "Nails",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "bitten", text: "Bitten" },
      { name: "brittle", text: "Brittle" },
      { name: "curve_up", text: "Curve Up" },
      { name: "frayed", text: "Frayed" },
      { name: "fungus_fingers", text: "Fungus - fingers" },
      { name: "fungus_toes", text: "Fungus - toes" },
      { name: "pitting", text: "Pitting" },
      { name: "ragged_cuticles", text: "Ragged cuticles" },
      { name: "ridges", text: "Ridges" },
      { name: "soft", text: "Soft" },
      { name: "thickening_fingernails", text: "Thickening of: Fingernails" },
      { name: "thickening_toenails", text: "Thickening of: Toenails" },
      { name: "white_spots_lines", text: "White spots/lines" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "lymphNodesIssues",
    sub: "Lymph Nodes",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "enlarged_neck", text: "Enlarged/neck" },
      { name: "tender_neck", text: "Tender/neck" },
      {
        name: "other_enlarged_tender_lymph_nodes",
        text: "Other enlarged/tender lymph nodes",
      },
    ],
  },
  {
    type: "multi_yes_no",
    name: "skinDrynessIssues",
    sub: "Skin, Dryness of",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "eyes_dryness", text: "Eyes" },
      { name: "feet_dryness", text: "Feet" },
      { name: "feet_cracking", text: "Any cracking? (Feet)" },
      { name: "feet_peeling", text: "Any peeling? (Feet)" },
      { name: "hair_dryness", text: "Hair" },
      { name: "hair_unmanageable", text: "And unmanageable?" },
      { name: "hands_dryness", text: "Hands" },
      { name: "hands_cracking", text: "Any cracking? (Hands)" },
      { name: "hands_peeling", text: "Any peeling? (Hands)" },
      { name: "mouth_throat_dryness", text: "Mouth/throat" },
      { name: "scalp_dryness", text: "Scalp" },
      { name: "scalp_dandruff", text: "Any dandruff" },
      { name: "skin_general_dryness", text: "Skin in general" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "skinProblems",
    sub: "Skin Problems",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "acne_back", text: "Acne on back" },
      { name: "acne_chest", text: "Acne on chest" },
      { name: "acne_face", text: "Acne on face" },
      { name: "acne_shoulders", text: "Acne on shoulders" },
      { name: "athletes_foot", text: "Athlete's foot" },
      { name: "bumps_upper_arms", text: "Bumps on back of upper arms" },
      { name: "cellulite", text: "Cellulite" },
      { name: "dark_circles_eyes", text: "Dark circles under eyes" },
      { name: "ears_red", text: "Ears get red" },
      { name: "easy_bruising", text: "Easy bruising" },
      { name: "eczema", text: "Eczema" },
      { name: "herpes_genital", text: "Herpes - genital" },
      { name: "hives", text: "Hives" },
      { name: "jock_itch", text: "Jock itch" },
      { name: "lackluster_skin", text: "Lackluster skin" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "skinProblemsContd",
    sub: "Skin Problems Contd",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "moles_color_size_change", text: "Moles w color/size change" },
      { name: "oily_skin", text: "Oily skin" },
      { name: "pale_skin", text: "Pale skin" },
      { name: "patchy_dullness", text: "Patchy dullness" },
      { name: "psoriasis", text: "Psoriasis" },
      { name: "rash", text: "Rash" },
      { name: "red_face", text: "Red face" },
      { name: "sensitive_bites", text: "Sensitive to bites" },
      { name: "sensitive_poison_ivy_oak", text: "Sensitive to poison ivy/oak" },
      { name: "shingles", text: "Shingles" },
      { name: "skin_cancer", text: "Skin cancer" },
      { name: "skin_darkening", text: "Skin darkening" },
      { name: "strong_body_odor", text: "Strong body odor" },
      { name: "thick_calluses", text: "Thick calluses" },
      { name: "vitiligo", text: "Vitiligo" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "itchingSkin",
    sub: "Itching Skin",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "itching_anus", text: "Anus" },
      { name: "itching_arms", text: "Arms" },
      { name: "itching_ear_canals", text: "Ear canals" },
      { name: "itching_eyes", text: "Eyes" },
      { name: "itching_feet", text: "Feet" },
      { name: "itching_hands", text: "Hands" },
      { name: "itching_legs", text: "Legs" },
      { name: "itching_nipples", text: "Nipples" },
      { name: "itching_nose", text: "Nose" },
      { name: "itching_genitals", text: "Genitals" },
      { name: "itching_roof_of_mouth", text: "Roof of mouth" },
      { name: "itching_scalp", text: "Scalp" },
      { name: "itching_skin_in_general", text: "Skin in general" },
      { name: "itching_throat", text: "Throat" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "femaleReproductive",
    sub: "Female Reproductive",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Symptom Review",
    subQuestions: [
      { name: "breast_cysts", text: "Breast cysts" },
      { name: "breast_lumps", text: "Breast lumps" },
      { name: "breast_tenderness", text: "Breast tenderness" },
      { name: "ovarian_cysts", text: "Ovarian cysts" },
      { name: "poor_libido", text: "Poor libido (sex drive)" },
      { name: "endometriosis", text: "Endometriosis" },
      { name: "fibroids", text: "Fibroids" },
      { name: "infertility", text: "Infertility" },
      { name: "vaginal_discharge", text: "Vaginal discharge" },
      { name: "vaginal_odor", text: "Vaginal odor" },
      { name: "vaginal_itch", text: "Vaginal itch" },
      { name: "vaginal_pain", text: "Vaginal pain" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "premenstrual",
    sub: "Premenstrual",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Premenstrual Symptom Review",
    subQuestions: [
      { name: "bloating", text: "Bloating" },
      { name: "breast_tenderness", text: "Breast tenderness" },
      { name: "carbohydrate_craving", text: "Carbohydrate craving" },
      { name: "chocolate_craving", text: "Chocolate craving" },
      { name: "constipation", text: "Constipation" },
      { name: "decreased_sleep", text: "Decreased sleep" },
      { name: "diarrhea", text: "Diarrhea" },
      { name: "fatigue", text: "Fatigue" },
      { name: "increased_sleep", text: "Increased sleep" },
      { name: "irritability", text: "Irritability" },
    ],
  },
  {
    type: "multi_yes_no",
    name: "menstrual",
    sub: "Menstrual",
    question:
      "Please check if these symptoms occur presently or have occurred in the last 6 months",
    title: "Menstrual Symptom Review",
    subQuestions: [
      { name: "cramps", text: "Cramps" },
      { name: "heavy_periods", text: "Heavy periods" },
      { name: "irregular_periods", text: "Irregular periods" },
      { name: "no_periods", text: "No periods" },
      { name: "scanty_periods", text: "Scanty periods" },
      { name: "spotting_between", text: "Spotting between periods" },
    ],
  },

  {
    type: "hospitalization",
    name: "current_medication",
    question: "Current medications (include prescription and over-the-counter)",
    title: "Medications/Supplements",
  },
  {
    type: "hospitalization",
    name: "nutritional_supplement",
    question: "Nutritional supplements (vitamins/minerals/herbs etc",
    title: "Medications/Supplements",
  },

  {
    question:
      "Have medications or supplements ever caused unusual side effects or problems?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "side_effects_problems",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "If yes, specify:",
        type: "text",
        name: "side_effects_details",
        label: "Details",
      },
    ],
  },
  {
    question: "Have you used any of these regularly or for a long time:",
    type: "radio",
    title: "Medications/Supplements",
    sub: "NSAIDs (Advil, Aleve, etc.), Motrin, Aspirin?",
    name: "regular_long_term_use",
    options: ["Yes", "No"],
  },
  {
    question: "Have you used any of these regularly or for a long time:",
    type: "radio",
    sub: "Tylenol (acetaminophen)",
    name: "regular_long_term_use_tylenol",
    options: ["Yes", "No"],
  },
  {
    question: "Have you used any of these regularly or for a long time:",
    type: "radio",
    sub: "Acid-blocking drugs (Zantac, Prilosec, Nexium, etc.)",
    name: "regular_long_term_use_acid_blocking_drugs",
    options: ["Yes", "No"],
  },
  {
    question: "How many times have you taken antibiotics?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "antibiotics_usage",
    sub: "Infancy/childhood",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "antibiotics_reason",
        label: "Details",
      },
    ],
  },
  {
    question: "How many times have you taken antibiotics?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "antibiotics_usage_teen",
    sub: "Teen",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "antibiotics_reason_teen",
        label: "Details",
      },
    ],
  },
  {
    question: "How many times have you taken antibiotics?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "antibiotics_usage_adulthood",
    sub: "Adulthood",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "antibiotics_reason_adulthood",
        label: "Details",
      },
    ],
  },
  {
    question: "Have you ever taken long term antibiotics?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "long_term_antibiotics",
    options: ["Yes", "No"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "long_term_antibiotics_reason",
        label: "Details",
      },
    ],
  },
  {
    question:
      "How often have you taken oral steroids (e.g., cortisone, prednisone, etc.)?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "oral_steroids_usage_infancy",
    sub: "Infancy/childhood",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "oral_steroids_reason_infancy",
        label: "Details",
      },
    ],
  },
  {
    question:
      "How often have you taken oral steroids (e.g., cortisone, prednisone, etc.)?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "oral_steroids_usage_teen",
    sub: "Teen",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "oral_steroids_reason_teen",
        label: "Details",
      },
    ],
  },
  {
    question:
      "How often have you taken oral steroids (e.g., cortisone, prednisone, etc.)?",
    type: "long_radio",
    title: "Medications/Supplements",
    name: "oral_steroids_usage_adulthood",
    sub: "Adulthood",
    options: ["Less than 5", "5 or more"],
    subQuestions: [
      {
        question: "Reason for use:",
        type: "text",
        name: "oral_steroids_reason_adulthood",
        label: "Details",
      },
    ],
  },
];

const SymptomReview = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const totalQuestions = questions.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const savedIndex = parseInt(
      localStorage.getItem("currentQuestionIndex9"),
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
  // ToDo: old implementation, will remove this after complete testing
  // const validateQuestion = () => {
  //   const question = questions[currentQuestionIndex];
  //   return (
  //     answers[question.name] !== undefined && answers[question.name] !== ""
  //   );
  // };
  // const validateQuestion = () => {
  //   const question = questions[currentQuestionIndex];
  //   if (question.subQuestions) {
  //     return question.subQuestions.every(
  //       (sub) => answers[sub.name] !== undefined && answers[sub.name] !== ""
  //     );
  //   }
  //   return answers[question.name] !== undefined && answers[question.name] !== "";
  // };

  const handleSave = () => {
    // if (!validateQuestion()) {
    //   message.error("Please answer the current question before saving.");
    //   return;
    // }
    localStorage.setItem("currentQuestionIndex9", 0);
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
    const answers = JSON.parse(localStorage.getItem("answers")) || {};
    const apiFormat = {
      general: [],
      headEyesEars: [],
      musco: [],
      moodNerves: [],
      cardio: [],
      urinary: [],
      digestion: [],
      digestionCont: [],
      eating: [],
      respiratory: [],
      nails: [],
      lymph: [],
      skin: [],
      skinProblems: [],
      skinProblemsCont: [],
      itchingSkin: [],
      femaleReproductive: [],
      currentMedication: [],
      nutritionalSupplements: []
    };


    const generalQuestions = [
      "cold_hands_and_feets",
      "cold_intoerance",
      "crohn",
      "daytime_sleepiness",
      "difficulty_falling_asleep",
      "early_waking",
      "fatigue",
      "fever",
      "fushing",
      "heat_intolerance",
      "night_walking",
      "nightmares",
      "cant_remember_dreams",
      "low_body_temperature",
    ];

    const headEyesEarsQuestions = [
      "conjunctivitis",
      "distorted_sense_of_smell",
      "distorted_taste",
      "ear_fullness",
      "ear_ringing",
      "eye_crusting",
      "eye_pain",
      "eyelid_margin_redness",
      "headache",
      "interstitial_cystitis",
      "hearing_problems",
      "migraine",
      "sensitivity_to_loud_noises",
      "vision_problems",
    ];

    const lymphQuestions = [
      "enlarged_neck",
      "tender_neck",
      "other_enlarged_tender_ly"]

    const muscoQuestions = [
      "back_muscle_spasm",
      "calf_cramps",
      "chest_tightness",
      "foot_cramps",
      "joint_deformity",
      "joint_pain",
      'joint_redness',
      'joint_stiffness',
      'muscle_pain',
      'muscle_spasms',
      'muscle_stiffness',
      'muscle_twitches_eyes',
      'muscle_twitches_arms_legs',
      'muscle_weakness',
      'neck_muscle_spasm',
      'tendonitis',
      'tension_headache'
    ]

    const moodNervesSymptomsQuestions = [
      "agoraphobia",
      "anxiety",
      "auditory_hallucinations",
      "blackouts",
      "depression",
      {
        name: 'difficulty_concentrating',
        subOptions: [
          { name: 'concentrating' },
          { name: 'with_balance' },
          { name: 'with_thinking' },
          { name: 'with_judgment' },
          { name: 'with_speech' },
          { name: 'with_memory' }
        ]
      },
      "dizziness",
      "fainting",
      "fearfulness",
      "irritability",
      "light_headedness",
      "numbness",
      "other_phobias",
      "panic_attacks",
      "paranoia",
      "seizures",
      "suicidal_thoughts",
      "tremor_trembling",
      "visual_hallucinations"
    ];

    const cardiovascularSymptomsQuestions = [
      "angina_chest_pain",
      "breathlessness",
      "heart_attack",
      "heart_murmur",
      "high_blood_pressure",
      "irregular_pulse",
      "mitral_valve_prolapse",
      "palpitations",
      "phlebitis",
      "swollen_ankles_feet",
      "varicose_veins"
    ];

    const urinarySymptomsQuestions = [
      "bed_wetting",
      "hesitancy",
      "infection",
      "kidney_disease",
      "kidney_stone",
      "leaking/incontinence",
      "pain/burning",
      "urgency"
    ];

    const respiratoryQuestions = [
      "bad_breath",
      "bad_odor_in_nose",
      "cough_dry",
      "cough_productive",
      "hayfever_spring",
      "hayfever_summer",
      "hayfever_fall",
      "hayfever_change_of_season",
      "hoarseness",
      "nasal_stuffiness",
      "nose_bleeds",
      "post_nasal_drip",
      "sinus_fullness",
      "sinus_infection",
      "snoring",
      "sore_throat",
      "wheezing",
      "winter_stuffiness"
    ]

    const digestionIssuesQuestions = [
      "anal_spasms",
      "bad_teeth",
      "bleeding_gums",
      "bloating_lower_abdomen",
      "bloating_whole_abdomen",
      "bloating_after_meals",
      "blood_in_stools",
      "burping",
      "canker_sores",
      "cold_sores",
      "constipation",
      "cracking_corner_of_lips",
      "dentures_poor_chewing",
      "diarrhea",
      "difficulty_swallowing",
      "dry_mouth",
      "farting",
      "fissures",
      "foods_repeat",
      "heartburn",
      "hemorrhoids"
    ];

    const digestionAdvancedIssuesQuestions = [
      'intolerance_lactose',
      'intolerance_all_dairy',
      'intolerance_gluten',
      'intolerance_corn',
      'intolerance_eggs',
      'intolerance_fatty_foods',
      'intolerance_yeast',
      'liver_disease_jaundice',
      'lower_abdominal_pain',
      'mucus_in_stools',
      'nausea',
      'periodontal_disease',
      'sore_tongue',
      'strong_stool_odor',
      'undigested_food_in_stools',
      'upper_abdominal_pain',
      'vomiting'
    ];
    const skin = [
      "eyes_dryness",
      "feet_dryness",
      "feet_cracking",
      "feet_peeling",
      "hair_dryness",
      "hair_unmanageable",
      "hands_dryness",
      "hands_cracking",
      "hands_peeling",
      "mouth_throat_dryness",
      "scalp_dryness",
      "scalp_dandruff",
      "skin_general_dryness",
    ];

    const skinProblems = [
      "acne_back",
      "acne_chest",
      "acne_face",
      "acne_shoulders",
      "athletes_foot",
      "bumps_upper_arms",
      "cellulite",
      "dark_circles_eyes",
      "ears_red",
      "easy_bruising",
      "eczema",
      "herpes_genital",
      "hives",
      "jock_itch",
      "lackluster_skin",
    ];

    const skinProblemsContr = [
      "moles_color_size_change",
      "oily_skin",
      "pale_skin",
      "patchy_dullness",
      "psoriasis",
      "rash",
      "red_face",
      "sensitive_bites",
      "sensitive_poison_ivy_oak",
      "shingles",
      "skin_cancer",
      "skin_darkening",
      "strong_body_odor",
      "thick_calluses",
      "vitiligo",
    ];

    const itching = [
      "itching_anus",
      "itching_arms",
      "itching_ear_canals",
      "itching_eyes",
      "itching_feet",
      "itching_hands",
      "itching_legs",
      "itching_nipples",
      "itching_nose",
      "itching_genitals",
      "itching_roof_of_mouth",
      "itching_scalp",
      "itching_skin_in_general",
      "itching_throat",
    ];

    const femaleReproductive = [
      "breast_cysts",
      "breast_lumps",
      "breast_tenderness",
      "ovarian_cysts",
      "poor_libido",
      "endometriosis",
      "fibroids",
      "infertility",
      "vaginal_discharge",
      "vaginal_odor",
      "vaginal_itch",
      "vaginal_pain",
    ];


    const eatingIssuesQuestions = [
      'binge_eating',
      'bulimia',
      'cant_gain_weight',
      'cant_lose_weight',
      'carbohydrate_craving',
      'carbohydrate_intolerance',
      'poor_appetite',
      'salt_cravings',
      'frequent_dieting',
      'sweet_cravings',
      'caffeine_dependency'
    ];

    const nailIssues = [
      "bitten",
      "brittle",
      "curve_up",
      "frayed",
      "fungus_fingers",
      "fungus_toes",
      "pitting",
      "ragged_cuticles",
      "ridges",
      "soft",
      "thickening_fingernails",
      "thickening_toenails",
      "white_spots_lines"
    ]

    const getLevel = (answer) => {
      switch (answer) {
        case 'mild':
          return 1;
        case 'moderate':
          return 2;
        case 'severe':
          return 3;
        default:
          return 0;
      }
    };
    generalQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.general.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    headEyesEarsQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.headEyesEars.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    muscoQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.musco.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });
    respiratoryQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.respiratory.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    lymphQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.lymph.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    skin.forEach((question) => {
      if (answers[question]) {
        apiFormat.skin.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    skinProblems.forEach((question) => {
      if (answers[question]) {
        apiFormat.skinProblems.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    skinProblemsContr.forEach((question) => {
      if (answers[question]) {
        apiFormat.skinProblemsCont.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    itching.forEach((question) => {
      if (answers[question]) {
        apiFormat.itchingSkin.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    femaleReproductive.forEach((question) => {
      if (answers[question]) {
        apiFormat.femaleReproductive.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    moodNervesSymptomsQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.moodNerves.push({
          level: getLevel(answers[question]),
          name: question,
        });

        if (question.subOptions) {
          question.subOptions.forEach((subQuestion) => {
            if (answers[subQuestion.name]) {
              apiFormat.moodNerves.push({
                level: getLevel(answers[subQuestion.name]),
                name: subQuestion.name,
              });
            }
          });
        }
      }
    });

    cardiovascularSymptomsQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.cardio.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    urinarySymptomsQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.urinary.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    digestionIssuesQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.digestion.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    digestionAdvancedIssuesQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.digestionCont.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });

    eatingIssuesQuestions.forEach((question) => {
      if (answers[question]) {
        apiFormat.eating.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });
    nailIssues.forEach((question) => {
      if (answers[question]) {
        apiFormat.nails.push({
          level: getLevel(answers[question]),
          name: question,
        });
      }
    });


    const transformedData = {
      general: apiFormat.general,
      headEyesEars: apiFormat.headEyesEars,
      musco: apiFormat.musco,
      moodNerves: apiFormat.moodNerves,
      cardio: apiFormat.cardio,
      urinary: apiFormat.urinary,
      digestion: apiFormat.digestion,
      eating: apiFormat.eating,
      itchingSkin: apiFormat.itchingSkin,
      respiratory: apiFormat.respiratory,
      nails: apiFormat.nails,
      lymph: apiFormat.lymph,
      skin: apiFormat.skin,
      skinProblems: apiFormat.skinProblems,
      skinProblemsContr: apiFormat.skinProblemsCont,
      femaleReproductive: apiFormat.femaleReproductive,
      femaleReproductiveCont: apiFormat.femaleReproductiveCont,
      currentMedication: answers.current_medication
        ? answers.current_medication.map((med) => ({
          medication: med.medication || "",
          dosage: med.dosage || "",
          startDate: med.date || "",
          reason: med.reason || "",
        }))
        : [{ medication: "", dosage: "", startDate: "", reason: "" }],
        nutrionalSupplements: answers.nutritional_supplement
        ? answers.nutritional_supplement.map((supplement) => ({
          medication: supplement.medication || "",
          dosage: supplement.dosage || "",
          startDate: supplement.date || "",
          reason: supplement.reason || "",
        }))
        : [{ medication: "", dosage: "", startDate: "", reason: "" }],

      supplementsCausedEffects: {
        yesNo: answers.supplement_effects ? true : false,
        describe: answers.supplement_effects_description || "",
      },
      usedRegularlyNsaid: answers.regular_long_term_use === "Yes",
      usedRegularlyTyienol: answers.regular_long_term_use_tylenol === "Yes",
      usedRegularlyAcidBlocking: answers.regular_long_term_use_acid_blocking_drugs === "Yes",

      antibioticsInfancy: {
        value1: answers.antibiotics_infant ? "Yes" : "No",
        value2: answers.antibiotics_infant_description || "",
      },
      antibioticsTeens: {
        value1: answers.antibiotics_teen ? "Yes" : "No",
        value2: answers.antibiotics_teen_description || "",
      },
      antibioticsAdult: {
        value1: answers.antibiotics_adult ? "Yes" : "No",
        value2: answers.antibiotics_adult_description || "",
      },
      takenAntibioticsForLong: {
        yesNo: answers.long_term_antibiotics ? true : false,
        describe: answers.long_term_antibiotics_description || "",
      },
      oralSteriodsInfancy: {
        value1: answers.steroids_infant ? "Yes" : "No",
        value2: answers.steroids_infant_description || "",
      },
      oralSteriodsTeen: {
        value1: answers.steroids_teen ? "Yes" : "No",
        value2: answers.steroids_teen_description || "",
      },
      oralSteriodsAdult: {
        value1: answers.steroids_adult ? "Yes" : "No",
        value2: answers.steroids_adult_description || "",
      },
    };


    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj.token || "";

      fetch(
        "https://myfertilitydevapi.azurewebsites.net/api/Patient/AddSymptoms",
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

    } catch (error) {
      console.log(error);
    }

    message.success("Form submitted successfully!");
    dispatch(completeCard("/questionnaire/9"));
    localStorage.setItem("currentQuestionIndex9", 0);
    localStorage.setItem("transformedAnswers", JSON.stringify(transformedData));
    navigate("/assessment");
  };

  const addHospitalization = (name) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: [
        ...(prevAnswers[name] || []),
        { medication: "", dosage: "", date: "", reason: "" },
      ],
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
        {/* {subQuestion.type === 'inputNumber' && (
                <InputNumber
                    name={subQuestion.name}
                    value={answers[subQuestion.name] || 0}
                    onChange={(value) => handleChange(value, subQuestion.name)}
                    className='input_questtionnaire'
                    />
            )} */}
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
                {option}
              </Radio>
            ))}
          </Radio.Group>
        )}
      </div>
    ));
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
              }}
            >
              {question.question}
            </Button>
            <p style={{ color: "#00ADEF", padding: 10 }}>{question.sub}</p>
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
      case "radio":
        return (
          <>
            <Button
              type="primary"
              style={{ background: "#335CAD", padding: 20, marginBottom: 10 }}
            >{question?.sub ? question.sub : ''}</Button>

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
                    option
                  )}
                </Radio>
              ))}
            </Radio.Group>
          </>
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
                    type="text"
                    placeholder="Medication"
                    value={entry.medication || ""}
                    onChange={(e) =>
                      handleHospitalizationChange(
                        e.target.value,
                        "medication",
                        index,
                        question.name,
                      )
                    }
                    className="input_questtionnaire"
                  />
                  <Input
                    type="text"
                    placeholder="Dosage"
                    value={entry.dosage || ""}
                    onChange={(e) =>
                      handleHospitalizationChange(
                        e.target.value,
                        "dosage",
                        index,
                        question.name,
                      )
                    }
                    className="input_questtionnaire"
                  />
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
                    placeholder="Reason for use"
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
                    <DeleteOutlined style={{ color: "red" }} />{" "}
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
              {" "}
              + {question.name === 'current_medication' ? 'Add Hospitalization' : 'Add Nutrition'}
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
                      style={{
                        marginRight: "10px",
                        color: "#000",
                        fontSize: "15px",
                      }}
                      checked={answers[subQuestion.name] === "mild"}
                      onChange={() => handleChange("mild", subQuestion.name)}
                    >
                      Mild
                    </Radio>
                    <Radio
                      style={{
                        marginRight: "10px",
                        color: "#000",
                        fontSize: "15px",
                      }}
                      checked={answers[subQuestion.name] === "moderate"}
                      onChange={() =>
                        handleChange("moderate", subQuestion.name)
                      }
                    >
                      Moderate
                    </Radio>
                    <Radio
                      style={{
                        marginRight: "10px",
                        color: "#000",
                        fontSize: "15px",
                      }}
                      checked={answers[subQuestion.name] === "severe"}
                      onChange={() => handleChange("severe", subQuestion.name)}
                    >
                      Severe
                    </Radio>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "long_radio":
        return (
          <div style={{ flexDirection: "column" }}>
           {question?.sub?  <Button
              type="primary"
              style={{ background: "#335CAD", padding: 20, marginBottom: 10 }}
            > {question.sub}</Button>:''}
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
        <h3 style={{ margin: "20px 0", color: "#F2AA93" }}>
          {questions[currentQuestionIndex].title}
        </h3>

        <h3 style={{ margin: "20px 0", color: "#000", fontWeight: "600", fontSize: "15px" }}>
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

export default SymptomReview;
