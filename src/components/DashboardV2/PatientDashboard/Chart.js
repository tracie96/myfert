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
    January: 30,
    Febuary: 31,
  }), []);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

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

  const shadingAreas = useMemo(() => {
    if (!hormoneData) return [];

    const periodStart = new Date(hormoneData.period_start);
    const periodEnd = new Date(hormoneData.period_end);
    const fertileStart = new Date(hormoneData.fertile_window_start);
    const fertileEnd = new Date(hormoneData.fertile_window_end);
    
    const startDayPeriod = periodStart.getDate();
    const endDayPeriod = periodEnd.getDate();
    const startDayFertile = fertileStart.getDate();
    const endDayFertile = fertileEnd.getDate();

    return [
      {
        start: startDayPeriod,
        end: endDayPeriod,
        type: "period",
      },
      {
        start: startDayFertile,
        end: endDayFertile,
        type: "fertile",
      }
    ];
  }, [hormoneData]);
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
        (new Date(cycleInfo?.ovulation)) 
      ) + 1
    );
  }, [cycleInfo]);



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // if (hormoneData.length === 0) {
  //   return <div>No data is available for the selected month.</div>;
  // }
  
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

      {/* Ovulation Marker */}
      {ovulationDay && selectedMonth === 'November' && userInfo.obj.firstName === 'Amara' && (
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

      {/* Chart Rendering */}
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

            {/* Dynamic Shading Areas */}
            {userInfo.obj.firstName === 'Amara' && shadingAreas.map((area, index) => (
              <ReferenceArea
                key={index}
                x1={area.start}
                x2={area.end}
                stroke="none"
                fill={area.type === "period" ? "#ffcccc" : "#ccffcc"}
                fillOpacity={0.2}
                label={area.type === "period" ? "Menstruation" : "Fertile Window"}
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
