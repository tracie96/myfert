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
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const hardcodedPhases = useMemo(() => [
    { month: "November", startDay: 19, endDay: 23, type: "period",label: "Menstruation", color: "#ffcccc" },
    { month: "November", startDay: 29, endDay: 30, type: "fertile", label: "Fertile Window", color: "#ccffcc" },
    { month: "December", startDay: 1, endDay: 5, type: "fertile",  label: "Fertile Window", color: "#ccffcc" },
  ], []);
  console.log({userInfo})
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
            day: hormone.test_time
              ? new Date(hormone.test_time).getDate()
              : 0, 
            month: hormone.test_time
              ? new Date(hormone.test_time).toLocaleString("default", {
                  month: "long",
                })
              : "", 
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

  // Generate full data for the selected month
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
        const dayIndex = entry.day - 1; // Days are 1-based, array is 0-based
        fullMonthData[dayIndex] = {
          ...fullMonthData[dayIndex],
          ...entry,
        };
      });

    return fullMonthData;
  }, [hormoneData, selectedMonth, monthDays]);

  const ovulationDay = useMemo(() => {
    if (!cycleInfo) return null;
    return (
      Math.ceil(
        (new Date(cycleInfo?.ovulation) - new Date(cycleInfo?.period_start)) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
  }, [cycleInfo]);

  const shadingAreas = useMemo(() => {
    return hardcodedPhases
      .filter((phase) => phase.month === selectedMonth)
      .map((phase) => ({
        start: phase.startDay,
        end: phase.endDay,
        type: phase.type, 
      }));
  }, [selectedMonth,hardcodedPhases]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (hormoneData.length === 0) {
    return <div>No data is available for the selected month.</div>;
  }
  
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
  

      {ovulationDay && selectedMonth === 'November' && userInfo.obj.firstName === 'Amara'   &&(
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
      <div style={{ width: "100%", height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              ticks={Array.from({ length: monthDays[selectedMonth] }, (_, i) => i + 1)} 
              label={{ value: "Day", position: "insideBottom", dy: 10 }}
            />
            <YAxis label={{ value: "Hormone Level", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend verticalAlign="top" />

            {userInfo.obj.firstName === 'Amara' && shadingAreas.map((area, index) => (
              <ReferenceArea
                key={index}
                x1={area?.start}
                x2={area?.end}
                stroke="none"
                fill={area.type === "period" ? "#ffcccc" : "#ccffcc"}
                fillOpacity={0.2}
                label={area.type === "period" ? "Menstruation" : "Fertile Window"}
              />
            ))}

            {/* Hormone lines */}
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
