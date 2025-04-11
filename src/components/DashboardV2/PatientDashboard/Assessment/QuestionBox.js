import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPatientStatus } from "../../../redux/patientSlice";
import "./assesment.css";
import CheckIcon from "../../../../assets/images/check.svg";

const CardComponent = ({ card, isClickable, index, handleCardClick, isCompleted }) => (
  <div
    className={`assessment-card ${!isClickable ? "disabled" : ""}`}
    onClick={isClickable ? () => handleCardClick(card.component) : null}
  >
     {isCompleted && (
        <div className="checkmark-overlay">
          <img src={CheckIcon} className="checkmark-icon" alt="check" />
        </div>
      )}
    <div className="card-image">
      <img src={card.icon} alt={card.title} loading="lazy" style={{ width: (index === 4 || index === 7) ? '100%' : '' }} />
    </div>
    <div className="card-title">{card.title}</div>
  </div>
);

const QuestionnaireGrid = ({ cards, onCardClick }) => {
  const dispatch = useDispatch();
  const patientStatus = useSelector((state) => state.patient.status);
  const [currentStep, setCurrentStep] = useState(0);
console.log({currentStep})

  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    if (storedStep) {
      setCurrentStep(parseInt(storedStep, 10));
    }
  }, []);

  const { userAuth } = useSelector((state) => ({
    userAuth: state.authentication.userAuth,
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
    console.log('userAuth:', userAuth); // Debug log
    const statLevel = userAuth?.obj?.status?.statLevel;
    console.log('statLevel:', statLevel); // Debug log
    
    return cards.map((card, index) => {
      // Check if both initialAssessment and isPaymentComplete are true
      const isFullyEnabled = patientStatus?.initialAssessment === true && patientStatus?.isPaymentComplete === true;
      // If patientStatus is null or either value is null, only first card is clickable
      const isClickable = isFullyEnabled ? true : (index === 0);
      console.log(`Card ${index} isClickable:`, isClickable); // Debug log
      const isCompleted = patientStatus?.initialAssessment || false;

      return (
        <Col key={index} className="mb-4 d-flex justify-content-center">
          <CardComponent
            card={card}
            isClickable={isClickable}
            index={index}
            handleCardClick={handleCardClick}
            isCompleted={isCompleted}
          />
        </Col>
      );
    });
  }, [cards, handleCardClick, patientStatus, userAuth]);

  return (
    <Container className="mt-4 assessment-container">
      <div className="assessment-header">
        <h2>GENERAL INTAKE FORM</h2>
      </div>

      <div className="assessment-content">
        {/* <i className="assessment-progress">
          0 out of {cards.length} questions complete
        </i> */}
        <Row className="mt-4" xs={2} sm={2} md={3} lg={5} xl={5}>
          {cardList}
        </Row>
      </div>
    </Container>
  );
};

export default QuestionnaireGrid;
