import React, { useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPatientStatus } from "../../../redux/patientSlice";
import { getAccessDetails } from "../../../redux/AssessmentController";
import "./assesment.css";
import CheckIcon from "../../../../assets/images/check.svg";
import { ClockCircleOutlined } from "@ant-design/icons";

const CardComponent = ({ card, index, handleCardClick, isCompleted }) => (
  <div
    className={`assessment-card`}
    onClick={() => handleCardClick(card.component) }
  >
    <div className="checkmark-overlay">
      {isCompleted ? (
        <img src={CheckIcon} className="checkmark-icon" alt="check" />
      ) : (
        <ClockCircleOutlined style={{ color: '#faad14', fontSize: 24 }} />
      )}
    </div>
    <div className="card-image">
      <img src={card.icon} alt={card.title} loading="lazy" style={{ width: (index === 4 || index === 7) ? '100%' : '' }} />
    </div>
    <div className="card-title">{card.title}</div>
  </div>
);

const QuestionnaireGrid = ({ cards, onCardClick }) => {
  const dispatch = useDispatch();
  const accessDetails = useSelector((state) => state.intake.accessDetails);

  const { userAuth } = useSelector((state) => ({
    userAuth: state.authentication.userAuth,
  }));

  useEffect(() => {
    if (userAuth?.obj?.token) {
      dispatch(getPatientStatus());
    }
  }, [userAuth?.obj?.token, dispatch]);

  useEffect(() => {
    if (userAuth?.obj?.token) {
      dispatch(getAccessDetails());
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
      const isCompleted = accessDetails?.[card.meta] === true;
      console.log({accessDetails})
      console.log('card.meta:', card.meta, 'accessDetails:', accessDetails, 'isCompleted:', isCompleted);
      return (
        <Col key={index} className="mb-4 d-flex justify-content-center">
          <CardComponent
            card={card}
            index={index}
            handleCardClick={handleCardClick}
            isCompleted={isCompleted}
          />
        </Col>
      );
    });
  }, [cards, handleCardClick, accessDetails]);

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
