import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useDispatch } from "react-redux";
import { getMiraInfo } from "../../redux/AuthController";

const HormoneChart = () => {
  const dispatch = useDispatch();
  const [hormoneData, setHormoneData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [loading, setLoading] = useState(false);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [error, setError] = useState(null);

  const monthDays = useMemo(() => ({
    November: 30,
    December: 31,
  }), []);

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
            day: new Date(hormone.test_time).getDate(),
            month: new Date(hormone.test_time).toLocaleString("default", { month: "long" }),
          }));
          setCycleInfo(resultAction.payload.cycleInfo);
          setHormoneData(parsedHormones);
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

  const shadingAreas = useMemo(() => {
    if (!cycleInfo) return [];
  
    // const periodMonth = new Date(cycleInfo.period_start).getMonth();
    const fertileStartMonth = new Date(cycleInfo.fertile_window_start).getMonth();
    const fertileEndMonth = new Date(cycleInfo.fertile_window_end).getMonth();
  
    const periodStart = new Date(cycleInfo.period_start).getDate();
    const periodEnd = new Date(cycleInfo.period_end).getDate();
    const fertileStart = new Date(cycleInfo.fertile_window_start).getDate();
    const fertileEnd = new Date(cycleInfo.fertile_window_end).getDate();
  
    let areas = [
      {
        start: periodStart,
        end: periodEnd,
        type: "period",
        month: new Date(cycleInfo.period_start).toLocaleString("default", { month: "long" }),
      },
    ];
  
    // Handle fertile window across months correctly
    if (fertileStartMonth === fertileEndMonth) {
      // Fertile window is within a single month
      areas.push({
        start: fertileStart,
        end: fertileEnd,
        type: "fertile",
        month: new Date(cycleInfo.fertile_window_start).toLocaleString("default", { month: "long" }),
      });
    } else {
      // Fertile window starts in November and ends in December
      areas.push({
        start: fertileStart,
        end: 30, // Up to the end of November
        type: "fertile",
        month: "November",
      });
      areas.push({
        start: 1, // Starts from 1st in December
        end: fertileEnd,
        type: "fertile",
        month: "December",
      });
    }
  
    return areas;
  }, [cycleInfo]);
  
  

  // Generate full month data including placeholders for missing days
  const chartData = useMemo(() => {
    const numberOfDays = monthDays[selectedMonth];
    const fullMonthData = Array.from({ length: numberOfDays }, (_, i) => ({
      day: i + 1,
      lh: null,
      e3g: null,
      pdg: null,
    }));

    hormoneData
      .filter((entry) => entry.month === selectedMonth)
      .forEach((entry) => {
        const dayIndex = entry.day - 1;
        fullMonthData[dayIndex] = { ...fullMonthData[dayIndex], ...entry };
      });

    return fullMonthData;
  }, [hormoneData, selectedMonth, monthDays]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* Month Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="month-select">Select Month: </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(monthDays).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Chart Rendering */}
      <div style={{ width: "100%", height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              ticks={Array.from({ length: monthDays[selectedMonth] }, (_, i) => i + 1)}
              label={{ value: "Day", position: "insideBottom", dy: 10 }}
            />
            <YAxis label={{ value: "Hormone Level", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend verticalAlign="top" />

            {/* Shading Areas */}
            {shadingAreas
              .filter((area) => area.month === selectedMonth)
              .map((area, index) => (
                <ReferenceArea
                  key={index}
                  x1={area.start}
                  x2={area.end}
                  stroke="none"
                  fill={area.type === "period" ? "#ffcccc" : "#ccffcc"}
                  fillOpacity={0.3} // Adjusted for better visibility
                  label={{
                    value: area.type === "period" ? "Menstruation" : "Fertile Window",
                    position: "insideTop",
                    fill: "#666",
                    fontSize: 12,
                  }}
                />
              ))}

            {/* Hormone Lines */}
            <Line type="monotone" dataKey="e3g" stroke="#00bfff" activeDot={{ r: 8 }} connectNulls={true} />
            <Line type="monotone" dataKey="lh" stroke="#9932cc" connectNulls={true} />
            <Line type="monotone" dataKey="pdg" stroke="#8b4513" connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HormoneChart;
