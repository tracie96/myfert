import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const TooltipIcon = ({
  icon,
  text,
  placement = "top",
  offset = [0, 4],
  backgroundColor = "#ffffff",
}) => {
  const renderTooltip = (props) => (
    <Tooltip id="tooltip" style={{ backgroundColor }} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      overlay={renderTooltip}
      trigger={["hover", "focus"]}
      offset={offset}
    >
      <span style={{ cursor: "pointer" }}>{icon}</span>
    </OverlayTrigger>
  );
};

export default TooltipIcon;
