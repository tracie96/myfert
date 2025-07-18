import React from "react";
import InputMask from "react-input-mask";
import { Input, Form, Col, Select, Row } from "antd";
import "../assesment.css";
import { useMediaQuery } from "react-responsive";

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
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { phoneType} = value;

  return (
    <Form
      layout="vertical"
      style={{
        width: "100%",
        maxWidth: "600px",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
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
        <Row gutter={16}>
          <Col span={8}>
            <Select
              className="select_questtionnaire"
              value={phoneType}
              onChange={(value) => handleChange("phoneType", value)}
              placeholder="Contact"
              style={{ width: "100%" }}
              defaultValue="home"
            >
              <Select.Option value="home">Home</Select.Option>
              <Select.Option value="work">Work</Select.Option>
              <Select.Option value="cell">Cell</Select.Option>
            </Select>
          </Col>
          <Col span={isMobile?16:13}>
            <InputMask
              mask="+1 (999) 999-9999"
              value={value.phoneHome}
              style={{borderColor:'#bcbcbc'}}
              onChange={(e) => handleChange("phoneHome", e.target.value)}
            >
              {(inputProps) => (
                <Input {...inputProps}  />
              )}
            </InputMask>
          </Col>
        </Row>
      </Form.Item>


      
    </Form>
  );
};

export default EmergencyContactInput;
