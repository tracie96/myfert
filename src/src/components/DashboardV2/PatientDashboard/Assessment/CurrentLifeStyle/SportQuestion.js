import React, { useState, useEffect } from "react";
import { Input, Select, Form, Button } from "antd";

const { Option } = Select;

const SportsQuestion = ({ onSave, questionKey, initialValue, activity }) => {
  const [type, setType] = useState(initialValue?.type || "");
  const [timesPerWeek, setTimesPerWeek] = useState(
    initialValue?.timesPerWeek || "",
  );
  const [duration, setDuration] = useState(initialValue?.duration || "");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setType(initialValue.type || "");
      setTimesPerWeek(initialValue.timesPerWeek || "");
      setDuration(initialValue.duration || "");
      setIsSaved(false);
    }
  }, [initialValue]);

  return (
    <div style={{ margin: "20px 0" }}>
      <div>
        <p style={{ fontSize: "15px", color: "#335CAD", fontWeight: "bold" }}>
          Current Exercise Program:
        </p>
        <p style={{ color: "#000", fontWeight: "bold" }}>Activity</p>
        <Button
          style={{
            background: "#335CAD",
            color: "#ffff",
            height: "48px",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <p style={{ paddingTop: 10 }}>{activity}</p>
        </Button>
      </div>
      <Form layout="vertical">
        <Form.Item label="Type">
          <Input
            value={type}
            placeholder="Enter the type of sport"
            disabled={isSaved} // Disable input if saved
          />
        </Form.Item>
        <Form.Item label="Number of times per week">
          <Select
            value={timesPerWeek}
            placeholder="Select frequency"
            disabled={isSaved} // Disable select if saved
          >
            {Array.from({ length: 7 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Time Duration (minutes)">
          <Select
            value={duration}
            placeholder="Select duration"
            disabled={isSaved} // Disable select if saved
          >
            {Array.from({ length: 120 / 5 }, (_, i) => (
              <Option key={(i + 1) * 5} value={(i + 1) * 5}>
                {(i + 1) * 5} minutes
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SportsQuestion;
