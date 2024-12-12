import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
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
import { getMiraInfo } from "../../redux/AuthController";

const NewHormoneChart = () => {
  const dispatch = useDispatch();
  const [hormoneData, setHormoneData] = useState([]);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Mira info
  useEffect(() => {
    const fetchMiraInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultAction = await dispatch(getMiraInfo());

        if (getMiraInfo.fulfilled.match(resultAction)) {
          const hormones = resultAction.payload.hormones || [];
          const parsedHormones = hormones.map((hormone) => ({
            lh: parseFloat(hormone.lh) || 0,
            e3g: parseFloat(hormone.e3g) || 0,
            pdg: parseFloat(hormone.pdg) || 0,
            test_time: hormone.test_time
              ? new Date(hormone.test_time)
              : new Date(),
          }));

          setHormoneData(parsedHormones);
          setCycleInfo(resultAction.payload.cycleInfo);
        } else {
          setError(resultAction.payload || "Failed to fetch Mira Info");
        }
      } catch (err) {
        console.error("Error occurred:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMiraInfo();
  }, [dispatch]);

  // Transform hormone data into chart-friendly format
  const chartData = useMemo(() => {
    if (!cycleInfo || !hormoneData.length) return [];

    const startDate = new Date(cycleInfo.period_start);
    return hormoneData.map((hormone) => {
      const testDate = new Date(hormone.test_time);
      const day = Math.ceil((testDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      return {
        day,
        LH: hormone.lh,
        E3G: hormone.e3g,
        PdG: hormone.pdg,
      };
    });
  }, [hormoneData, cycleInfo]);

  // Define phases
  const phases = useMemo(() => {
    if (!cycleInfo) return [];
    return [
      { start: 1, end: 5, label: "Menstruation", color: "#ffcccc" },
      { start: 14, end: 18, label: "Fertile Window", color: "#ccffcc" },
   
    ];
  }, [cycleInfo]);

  const ovulationDay = useMemo(() => {
    if (!cycleInfo) return null;
    return (
      Math.ceil(
        (new Date(cycleInfo.ovulation) - new Date(cycleInfo.period_start)) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  }, [cycleInfo]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* Phase Backgrounds */}
      {phases.map((phase) => (
        <div
          key={phase.label}
          style={{
            position: "absolute",
            top: 0,
            left: `${(phase.start - 1) * (100 / cycleInfo.cycle_length)}%`,
            width: `${(phase.end - phase.start + 1) * (100 / cycleInfo.cycle_length)}%`,
            height: "100%",
            backgroundColor: phase.color,
            zIndex: 1,
            opacity: 0.3,
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {phase.label}
          </div>
        </div>
      ))}

      {/* Ovulation Marker */}
      {ovulationDay && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${(ovulationDay - 1) * (100 / cycleInfo.cycle_length)}%`,
            transform: "translate(-50%, -50%)",
            color: "green",
            fontSize: "16px",
            zIndex: 2,
          }}
        >
          ★ Ovulation
        </div>
      )}

      {/* Responsive Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 50, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            label={{ value: "Day", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="LH" stroke="#8884d8" />
          <Line type="monotone" dataKey="E3G" stroke="#82ca9d" />
          <Line type="monotone" dataKey="PdG" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NewHormoneChart;
