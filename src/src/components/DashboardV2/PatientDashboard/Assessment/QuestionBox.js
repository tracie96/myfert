import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { getPatientStatus } from "../../../redux/patientSlice";

const QuestionnaireGrid = ({ cards, onCardClick }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleCardClick = (component) => {
    onCardClick(component);
  };
  const dispatch = useDispatch();
  useEffect(() => {}, [cards]);
  const { userAuth } = useSelector((state) => state.authentication);
  const { status } = useSelector((state) => state.patient);

  useEffect(() => {
    if (userAuth?.obj?.token) {
      dispatch(getPatientStatus());
    }
  }, [userAuth?.obj?.token, dispatch]);

  return (
    <Container className="mt-4 assessment-container">
      <div
        style={{
          backgroundColor: "#335CAD",
          borderRadius: "12px 12px 0 0",
          height: "61px",
          display: "flex",
          justifyContent: "left",
          paddingLeft: "20px",
        }}
      >
        <h2 style={{ color: "#fff", fontSize: "15px", paddingTop: 15 }}>
          GENERAL INTAKE FORM
        </h2>
      </div>

      <div
        style={{
          padding: "16px 24px",
          borderRadius: 12,
          borderWidth: "1px",
          marginTop: -10,
          backgroundColor: "#fff",
          borderColor: "#C2E6F8",
          borderStyle: "solid",
        }}
      >
        <i style={{ color: "red" }}>
          0 out of {cards.length} questions complete
        </i>
        {isMobile && <div style={{ margin: 50 }}></div>}

        <Row className="mt-8" xs={2} sm={2} md={3} lg={5} xl={5}>
          {cards.map((card, index) => (
            <Col key={index} className="mb-4 d-flex justify-content-center">
              <div
                className="mt-4"
                onClick={
                  status?.statLevel > 1 || index === 0
                    ? () => handleCardClick(card?.component)
                    : null
                }
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#F2AA93",
                  opacity: status?.statLevel > 1 || index === 0 ? 1 : 0.5 || status?.statLevel === undefined,
                  position: "relative",
                  padding: "20px",
                  width: isMobile ? "100%" : "300px",
                  height: "200px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60%",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={card.icon}
                    alt="questionnaires"
                    style={{ width: "60%", height: "auto" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  {card.title}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default QuestionnaireGrid;
