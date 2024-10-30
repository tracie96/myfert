import React from "react";
import InputMask from "react-input-mask";
import { Input, Form } from "antd";
import "../assesment.css";

const EmergencyContactInput = ({ value = {}, onChange }) => {
  const handleChange = (key, val) => {
    if (onChange) {
      onChange({
        ...value,
        [key]: val,
      });
    }
  };
  const requiredLabel = (label) => (
    <span>
      {label} <span style={{ color: "red" }}>*</span>
    </span>
  );

  return (
    <Form layout="vertical">
      <Form.Item label={requiredLabel("Emergency Contact")}>
        <Input
          className="input_questtionnaire"
          value={value.contact}
          required
          onChange={(e) => handleChange("contact", e.target.value)}
        />
      </Form.Item>
      <Form.Item label={requiredLabel("Relationship")}>
        <Input
          className="input_questtionnaire"
          value={value.relationship}
          required
          onChange={(e) => handleChange("relationship", e.target.value)}
        />
      </Form.Item>
      <Form.Item label={requiredLabel("Phone (Home/Default)")}>
        <InputMask
          mask="+1 (999) 999-9999"
          value={value.phoneHome}
          onChange={(e) => handleChange("phoneHome", e.target.value)}
        >
          {(inputProps) => (
            <Input {...inputProps} className="input_questtionnaire" />
          )}
        </InputMask>
      </Form.Item>
      <Form.Item label="Phone (Cell)">
        <InputMask
          mask="+1 (999) 999-9999"
          value={value.phoneCell}
          onChange={(e) => handleChange("phoneCell", e.target.value)}
        >
          {(inputProps) => (
            <Input {...inputProps} className="input_questtionnaire" />
          )}
        </InputMask>
      </Form.Item>
      <Form.Item label="Phone (Work)">
        <InputMask
          mask="+1 (999) 999-9999"
          value={value.phoneWork}
          onChange={(e) => handleChange("phoneWork", e.target.value)}
        >
          {(inputProps) => (
            <Input {...inputProps} className="input_questtionnaire" />
          )}
        </InputMask>
      </Form.Item>
    </Form>
  );
};

export default EmergencyContactInput;
