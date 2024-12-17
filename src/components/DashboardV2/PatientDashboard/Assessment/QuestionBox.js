import React, { useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPatientStatus } from "../../../redux/patientSlice";
import "./assesment.css";

const CardComponent = ({ card, isClickable, handleCardClick }) => (
  <div
    className={`assessment-card ${!isClickable ? "disabled" : ""}`}
    onClick={isClickable ? () => handleCardClick(card.component) : null}
  >
    <div className="card-image">
      <img src={card.icon} alt={card.title} loading="lazy" />
    </div>
    <div className="card-title">{card.title}</div>
  </div>
);

const QuestionnaireGrid = ({ cards, onCardClick }) => {
  const dispatch = useDispatch();

  const { userAuth, status } = useSelector((state) => ({
    userAuth: state.authentication.userAuth,
    status: state.patient.status,
  }));

  useEffect(() => {
    if (userAuth?.obj?.token) {
      dispatch(getPatientStatus());
    }
  }, [userAuth?.obj?.token, dispatch]);

  const handleCardClick = useCallback(
    (component) => {
      onCardClick(component);
    },
    [onCardClick]
  );

  const cardList = useMemo(() => {
    return cards.map((card, index) => {
      const isClickable = status?.statLevel > 1 || index === 0;
      return (
        <Col key={index} className="mb-4 d-flex justify-content-center">
          <CardComponent
            card={card}
            isClickable={isClickable}
            handleCardClick={handleCardClick}
          />
        </Col>
      );
    });
  }, [cards, status?.statLevel, handleCardClick]);

  return (
    <Container className="mt-4 assessment-container">
      <div className="assessment-header">
        <h2>GENERAL INTAKE FORM</h2>
      </div>

      <div className="assessment-content">
        <i className="assessment-progress">
          0 out of {cards.length} questions complete
        </i>
        <Row className="mt-4" xs={2} sm={2} md={3} lg={5} xl={5}>
          {cardList}
        </Row>
      </div>
    </Container>
  );
};

export default QuestionnaireGrid;
