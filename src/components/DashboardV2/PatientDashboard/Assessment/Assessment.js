import React from "react";
import { Col } from "antd";
import QuestionnaireGrid from "./QuestionBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GeneralIntakeIcon from "../../../../assets/images/assessment/1.svg";
import LifeStyleIcon from "../../../../assets/images/assessment/2.svg";
import DietaryIcon from "../../../../assets/images/assessment/3.svg";
import SubstanceIcon from "../../../../assets/images/assessment/4.svg";
import MedicalHistoryIcon from "../../../../assets/images/assessment/5.svg";
import FamilyHistoryIcon from "../../../../assets/images/assessment/9.svg";
import IllnessIcon from "../../../../assets/images/assessment/6.svg";
import dummyIcon from "../../../../assets/images/assessment/8.svg";
import ReproductiveIcon from "../../../../assets/images/assessment/11.svg";

import "./assesment.css";

const icons = {
  GeneralIntakeIcon,
  LifeStyleIcon,
  DietaryIcon,
  SubstanceIcon,
  MedicalHistoryIcon,
  FamilyHistoryIcon,
  IllnessIcon,
  dummyIcon,
  ReproductiveIcon,
};

export default function Assessment() {
  const cards = useSelector((state) => state.assessment);
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };
  return (
    <Col>
      <>
        <div
          className="mt-4 assessment-container"
          style={{ color: "#111F4A", padding: "0 6%" }}
        >
          <p style={{ color: "#000", fontSize: 15, fontWeight: "bold" }}>
            Great to see you!
          </p>
          <p>
            Just a gentle nudge to complete your general intake form at your
            earliest convenience before your appointment.{" "}
          </p>
          <p>
            It helps us get to know you better and ensures a smoother
            experience.{" "}
          </p>
          <p>Thanks a bunch!</p>
        </div>
        <div>
          <hr
            style={{ background: "#EFD0BD", width: "200px", height: "7px" }}
          />
        </div>
        <div>
          <QuestionnaireGrid
            cards={cards.map((card) => ({
              ...card,
              icon: icons[card.icon],
            }))}
            onCardClick={handleCardClick}
          />
        </div>
      </>
    </Col>
  );
}
