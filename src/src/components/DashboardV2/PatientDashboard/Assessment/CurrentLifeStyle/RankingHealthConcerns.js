import React, { useState, useEffect } from "react";
import { Input, Button, Form, Select } from "antd";
import "./../assesment.css";

const { Option } = Select;

const defaultConcern = {
  problem: "",
  severity: "",
  priorTreatment: "",
  success: "",
};

const RankingHealthConcerns = ({
  concern,
  onChange,
  setAnswers,
  handleChange,
}) => {
  const [editing, setEditing] = useState(false);

  const currentConcern = concern || defaultConcern;

  useEffect(() => {
    localStorage.setItem("currentConcern", JSON.stringify(currentConcern));
  }, [currentConcern]);

  const handleSave = () => {
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    onChange(null); // Notify parent to delete this concern
  };

  return (
    <div
      style={{
        marginBottom: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        width: "100%",
        boxShadow: "#ccc",
      }}
    >
      {editing ? (
        <Form layout="vertical">
          <Form.Item label="Describe Problem">
            <Input
              value={currentConcern.describeProblem}
              onChange={(e) => handleChange("describeProblem", e.target.value)}
              placeholder="Describe Problem"
              className="input_questtionnaire"
            />
          </Form.Item>
          <Form.Item label="Severity">
            <Select
              value={currentConcern.severity}
              onChange={(value) => handleChange("severity", value)}
              placeholder="Select Severity"
              className="select_questtionnaire"
            >
              <Option value="Mild">Mild</Option>
              <Option value="Moderate">Moderate</Option>
              <Option value="Severe">Severe</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Prior Treatment">
            <Input
              value={currentConcern.priorTreatment}
              onChange={(e) => handleChange("priorTreatment", e.target.value)}
              placeholder="Prior Treatment"
              className="input_questtionnaire"
            />
          </Form.Item>
          <Form.Item label="Success">
            <Select
              value={currentConcern.success ? "Yes" : "No"}
              onChange={(value) => handleChange("success", value === "Yes")}
              placeholder="Select Success"
              className="select_questtionnaire"
            >
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              style={{ background: "#01ACEE" }}
            >
              Save
            </Button>
            <Button
              type="danger"
              onClick={handleDelete}
              style={{ marginLeft: "8px", background: "red", color: "#fff" }}
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Describe Problem:</strong> {currentConcern.describeProblem}
          </p>
          <p>
            <strong>Severity:</strong> {currentConcern.severity}
          </p>
          <p>
            <strong>Prior Treatment:</strong> {currentConcern.priorTreatment}
          </p>
          <p>
            <strong>Success:</strong> {currentConcern.success ? "Yes" : "No"}
          </p>
          <Button type="link" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default RankingHealthConcerns;
