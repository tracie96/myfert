import React from "react";

const CustomButtons = ({ buttons, row }) => {
  return (
    <div>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick ? () => button.onClick(row) : undefined}
          className={button.className}
          title={button.title || ""}
        >
          {button.icon && <i className={button.icon}></i>}
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default CustomButtons;
