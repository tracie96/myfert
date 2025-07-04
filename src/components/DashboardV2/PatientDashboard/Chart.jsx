import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import {
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { getMiraInfo } from "../../redux/AuthController";
import ChartFileUploader from "../PatientDashboard/ChartFileUploader";
import { addDocuments } from "../../redux/patientSlice";

const HormoneChart = () => {
  const dispatch = useDispatch();
  const [hormoneData, setHormoneData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [selectedMonthType, setSelectedMonthType] = useState("current");
  const [error, setError] = useState(null);
  const toUTCDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  };

  useEffect(() => {
    const fetchMiraInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const resultAction = await dispatch(getMiraInfo());

        if (getMiraInfo.fulfilled.match(resultAction)) {
          const hormones = resultAction.payload.hormones || [];
          const parsedHormones = hormones.map((hormone) => {
            const testDate = toUTCDate(hormone.test_time);
            return {
              lh: parseFloat(hormone.lh) || 0,
              e3g: parseFloat(hormone.e3g) || 0,
              pdg: parseFloat(hormone.pdg) || 0,
              fsh: parseFloat(hormone.fsh) || 0,
              day: testDate.getUTCDate(),
              month: testDate.toLocaleString("default", { month: "long", timeZone: "UTC" }),
              test_time: hormone.test_time,
            };
          });

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

  const filteredHormoneData = useMemo(() => {
    if (!cycleInfo) return [];

    const startDate = new Date(
      selectedMonthType === "current" ? cycleInfo.period_start : cycleInfo.previous_period_start
    );
    const endDate = new Date(
      selectedMonthType === "current" ? cycleInfo.fertile_window_end : cycleInfo.previous_fertile_window_end
    );

    return hormoneData.filter(item => {
      const itemDate = new Date(item.test_time);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [hormoneData, selectedMonthType, cycleInfo]);


  const shadingAreas = useMemo(() => {
    if (!cycleInfo) return [];
    const periodStart = new Date(cycleInfo.period_start).getDate();
    const periodEnd = new Date(cycleInfo.period_end).getDate();
    const fertileStart = new Date(cycleInfo.fertile_window_start).getDate();
    const fertileEnd = new Date(cycleInfo.fertile_window_end).getDate();

    const periodStartMonth = new Date(cycleInfo.period_start).toLocaleString("default", { month: "long" });
    const periodEndMonth = new Date(cycleInfo.period_end).toLocaleString("default", { month: "long" });
    const fertileStartMonth = new Date(cycleInfo.fertile_window_start).toLocaleString("default", { month: "long" });
    const fertileEndMonth = new Date(cycleInfo.fertile_window_end).toLocaleString("default", { month: "long" });

    let areas = [];

    // Handling period shading
    if (periodStartMonth === periodEndMonth) {
      areas.push({
        start: periodStart,
        end: periodEnd,
        type: "period",
        month: periodStartMonth,
      });
    } else {
      // Period spans across two months
      areas.push({
        start: periodStart,
        end: new Date(new Date(cycleInfo.period_start).getFullYear(), new Date(cycleInfo.period_start).getMonth() + 1, 0).getDate(),  // last day of period start month
        type: "period",
        month: periodStartMonth,
      });
      areas.push({
        start: 1,
        end: periodEnd,
        type: "period",
        month: periodEndMonth,
      });
    }

    // Handling fertile window shading
    if (fertileStartMonth === fertileEndMonth) {
      areas.push({
        start: fertileStart,
        end: fertileEnd,
        type: "fertile",
        month: fertileStartMonth,
      });
    } else {
      // Fertile window spans across two months
      areas.push({
        start: fertileStart,
        end: new Date(new Date(cycleInfo.fertile_window_start).getFullYear(), new Date(cycleInfo.fertile_window_start).getMonth() + 1, 0).getDate(),  // last day of fertile start month
        type: "fertile",
        month: fertileStartMonth,
      });
      areas.push({
        start: 1,
        end: fertileEnd,
        type: "fertile",
        month: fertileEndMonth,
      });
    }

    return areas;
  }, [cycleInfo]);

  const chartData = useMemo(() => {
    if (!cycleInfo?.period_start || !cycleInfo?.fertile_window_end) return [];

    const periodStartDate = new Date(cycleInfo.period_start);
    const fiveDaysBefore = new Date(periodStartDate);
    fiveDaysBefore.setDate(periodStartDate.getDate() - 5);

    const fertileEndDate = new Date(cycleInfo.fertile_window_end);
    const fiveDaysAfter = new Date(fertileEndDate);
    fiveDaysAfter.setDate(fertileEndDate.getDate() + 5);

    const allDates = [];
    for (let d = new Date(fiveDaysBefore); d <= fiveDaysAfter; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    const hormoneMap = {};
    hormoneData.forEach((item) => {
      const dateStr = new Date(item.test_time).toISOString().split("T")[0];
      hormoneMap[dateStr] = item;
    });

    const combinedData = allDates.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const hormone = hormoneMap[dateStr] || {};

      return {
        month: date.toLocaleString("default", { month: "long" }),
        day: date.getDate(),
        lh: Math.max(0, parseFloat(hormone.lh) || 0),
        e3g: Math.max(0, parseFloat(hormone.e3g) || 0),
        pdg: Math.max(0, parseFloat(hormone.pdg) || 0),
        fsh: Math.max(0, parseFloat(hormone.fsh) || 0),
        test_time: dateStr,
      };
    });


    return combinedData;
  }, [hormoneData, cycleInfo]);

  // Dynamically generate ticks for the X-axis based on available data
  const allMonths = useMemo(() => {
    const months = [...new Set(filteredHormoneData.map((item) => item.month))];
    return months;
  }, [filteredHormoneData]);

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    allMonths.forEach((month) => {
      const daysInMonth = new Date(new Date().getFullYear(), new Date(hormoneData.find(item => item.month === month).test_time).getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        ticks.push(`${month} ${i}`);
      }
    });
    return ticks;
  }, [allMonths, hormoneData]);

  const dataWithXAxis = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      xAxisLabel: `${item.month} ${item.day}`
    }));
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div>
          <button
            style={{
              marginRight: 8,
              padding: "6px 12px",
              backgroundColor: selectedMonthType === "past" ? "#1890ff" : "#f0f0f0",
              color: selectedMonthType === "past" ? "#fff" : "#000",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setSelectedMonthType("past")}
          >
            Past Month
          </button>
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: selectedMonthType === "current" ? "#1890ff" : "#f0f0f0",
              color: selectedMonthType === "current" ? "#fff" : "#000",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setSelectedMonthType("current")}
          >
            Current Month
          </button>
        </div>
      </div>
      {/* Custom Legend */}\
      <div className="space-x-4 chartHeader">
        <span className="px-4 py-1 border-2 border-sky-400 text-sky-600 rounded-full text-sm font-medium">E3G</span>
        <span className="px-4 py-1 border-2 border-fuchsia-500 text-fuchsia-700 bg-fuchsia-100 rounded-full text-sm font-medium">FSH</span>
        <span className="px-4 py-1 border-2 border-yellow-900 text-yellow-900 bg-yellow-100 rounded-full text-sm font-medium">PdG</span>
        <span className="px-4 py-1 border-2 border-yellow-500 text-yellow-600 bg-yellow-100 rounded-full text-sm font-medium">LH</span>
      </div>

      <div style={{ width: "100%", height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataWithXAxis}
            margin={{ top: 50, right: 30, left: 20, bottom: 20 }} // add more bottom space for x-axis and phase bar
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="xAxisLabel"
              ticks={xAxisTicks}
              interval={0}
              // label={{ value: "Day", position: "bottom", offset: 20 }} // offset for better spacing
              tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }}
            />
            <YAxis
              label={{ angle: -90, position: "insideLeft" }}
              domain={[0, 'auto']}
              ticks={[0, 50, 100, 150, 200, 250, 300]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip labelFormatter={(value) => value} />
            {/* <Legend verticalAlign="top" /> */}
            {shadingAreas.map((area, index) => {
              const startDate = new Date(new Date().getFullYear(), new Date(hormoneData.find(item => item.month === area.month)?.test_time).getMonth(), area.start);
              const endDate = new Date(new Date().getFullYear(), new Date(hormoneData.find(item => item.month === area.month)?.test_time).getMonth(), area.end);

              const startIndex = dataWithXAxis.findIndex(item =>
                new Date(new Date().getFullYear(), new Date(hormoneData.find(data => data.month === item.month).test_time).getMonth(), item.day).getTime() === startDate.getTime()
              );

              const endIndex = dataWithXAxis.findIndex(item =>
                new Date(new Date().getFullYear(), new Date(hormoneData.find(data => data.month === item.month).test_time).getMonth(), item.day).getTime() === endDate.getTime()
              );

              if (startIndex === -1 || endIndex === -1) {
                return null;
              }

              return (
                <ReferenceArea
                  key={index}
                  x1={dataWithXAxis[startIndex].xAxisLabel}
                  x2={dataWithXAxis[endIndex].xAxisLabel}
                  stroke="none"
                  fill={area.type === "period" ? "#ffcccc" : "#ccffcc"}
                  fillOpacity={0.3}
                  label={{
                    value: area.type === "period" ? "Menstruation" : "Fertile Window",
                    position: "insideTop",
                    fill: "#666",
                    fontSize: 12,
                  }}
                />
              );
            })}

            <Line type="monotone" dataKey="e3g" stroke="#00bfff" activeDot={{ r: 8 }} connectNulls={true} />
            <Line type="monotone" dataKey="lh" stroke="#9932cc" connectNulls={true} />
            <Line type="monotone" dataKey="pdg" stroke="#8b4513" connectNulls={true} />
            <Line type="monotone" dataKey="fsh" stroke="#f0bfff" connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: "20px", padding: "10px" }}>
        {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {hormoneData.map((data, index) => (
            <div key={index} style={{ border: "1px solid #eee", padding: "5px" }}>
              <b>{data.month} {data.day}:</b><br />
              LH={data.lh}, E3G={data.e3g}, PDG={data.pdg}
            </div>
          ))}
        </div> */}
      </div>
      <div style={{ margin: "30px 0", width: "100%", float: "left" }}>
        <ChartFileUploader
          onUpload={async (fileData) => {
            const payload = {
              bloodWork: fileData,
            };
            try {
              await dispatch(addDocuments(payload)).unwrap();
              message.success("Chart uploaded successfully");
            } catch (err) {
              message.error("Failed to upload chart");
            }
          }}
        />

      </div>
    </div>
  );

};

export default HormoneChart;
