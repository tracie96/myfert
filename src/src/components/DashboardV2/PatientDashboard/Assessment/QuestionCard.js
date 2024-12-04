import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

const QuestionnaireCard = ({ title, path }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(path);
  };

  return (
    <Card hoverable style={{ margin: "10px" }} onClick={handleCardClick}>
      <Card.Meta title={title} />
    </Card>
  );
};

export default QuestionnaireCard;
