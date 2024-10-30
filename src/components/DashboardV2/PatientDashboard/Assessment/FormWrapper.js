import React from "react";
import IFM from "../../../../assets/images/ifm.svg";

const FormWrapper = ({ name }) => {
  return (
    <div>
      <img src={IFM} alt="ifm" style={{ width: "100%", maxWidth: "200px" }} />
      <span
        style={{
          display: "block",
          marginTop: "30px",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
          color: "#335CAD",
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default FormWrapper;
