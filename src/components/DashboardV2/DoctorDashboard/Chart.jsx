import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

import Header from "./Components/Header";
// Sample Mira App Data
const sampleData = [
  {
    "hormones": [
      {
        "test_time": "2025-06-24T09:03:37.328Z",
        "lh": "3.2",
        "e3g": "45.1",
        "pdg": "10.5",
        "fsh": "6.8"
      },
      {
        "test_time": "2025-06-25T09:03:37.328Z",
        "lh": "4.5",
        "e3g": "60.2",
        "pdg": "12.0",
        "fsh": "7.2"
      }
    ]
  }
];

const Chart = () => {
    const patient = JSON.parse(localStorage.getItem("patient")) || {
        userRef: "",
      };
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Get hormone data from sample instead of API
    const rawHormones = sampleData[0].hormones;

    const formatted = rawHormones.map((item) => ({
      date: moment(item.test_time).format("YYYY-MM-DD"),
      lh: parseFloat(item.lh),
      e3g: parseFloat(item.e3g),
      pdg: parseFloat(item.pdg),
      fsh: parseFloat(item.fsh),
    }));

    setChartData(formatted);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
          {patient ? (
        <Header />
      ) : (
        "Select a patient to view their labs and requisitions"
      )}
      <h3>Mira Hormone Tracking (Sample Data)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lh" stroke="#8884d8" name="LH" />
          <Line type="monotone" dataKey="e3g" stroke="#82ca9d" name="E3G" />
          <Line type="monotone" dataKey="pdg" stroke="#ffc658" name="PdG" />
          <Line type="monotone" dataKey="fsh" stroke="#ff7300" name="FSH" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
