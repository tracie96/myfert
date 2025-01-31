import React from "react";
import { Col } from "antd";
import QuestionnaireGrid from "./QuestionBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./assesment.css";



export default function Assessment() {
  const cards = useSelector((state) => state.assessment);
  console.log({cards})
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
              ...card
            }))}
            onCardClick={handleCardClick}
          />
        </div>
      </>
    </Col>
  );
}
