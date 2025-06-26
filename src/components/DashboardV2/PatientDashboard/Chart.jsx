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
  const [error, setError] = useState(null);

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
            test_time: hormone.test_time, // Keep the original test_time
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
    // Group hormone data by month
    const groupedData = hormoneData.reduce((acc, entry) => {
      if (!acc[entry.month]) {
        acc[entry.month] = [];
      }
      acc[entry.month].push(entry);
      return acc;
    }, {});

    // Create a combined dataset for all months
    const combinedData = Object.entries(groupedData).reduce((acc, [month, data]) => {
      const daysInMonth = new Date(new Date().getFullYear(), new Date(data[0].test_time).getMonth() + 1, 0).getDate(); // Get days in the specific month
      const monthData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const existingData = data.find((item) => item.day === day);
        return {
          month: month,
          day: day,
          lh: existingData?.lh || null,
          e3g: existingData?.e3g || null,
          pdg: existingData?.pdg || null,
          fsh: existingData?.fsg || null,
        };
      });
      return acc.concat(monthData);
    }, []);

    return combinedData;
  }, [hormoneData]);

  // Dynamically generate ticks for the X-axis based on available data
  const allMonths = useMemo(() => {
    const months = [...new Set(hormoneData.map((item) => item.month))];
    return months;
  }, [hormoneData]);

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
      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}> {/* Enable horizontal scrolling */}
        {/* Chart Rendering */}
        <div style={{ width: "1800px", height: "500px" }}> {/* Increased chart width */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataWithXAxis} margin={{ top: 50, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="xAxisLabel"
                ticks={xAxisTicks}
                interval={0}
                label={{ value: "Day", position: "bottom", offset: 0 }}
                tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }}
              />
              <YAxis label={{ value: "Hormone Level", angle: -90, position: "insideLeft" }} />
              <Tooltip labelFormatter={(value) => value} />
              <Legend verticalAlign="top" />

              {shadingAreas.map((area, index) => {
                const startDate = new Date(new Date().getFullYear(), new Date(hormoneData.find(item => item.month === area.month)?.test_time).getMonth(), area.start);
                const endDate = new Date(new Date().getFullYear(), new Date(hormoneData.find(item => item.month === area.month)?.test_time)?.getMonth(), area.end);
                const startIndex = dataWithXAxis.findIndex(item => new Date(new Date().getFullYear(), new Date(hormoneData.find(data => data.month === item.month).test_time).getMonth(), item.day).getTime() === startDate.getTime());
                const endIndex = dataWithXAxis.findIndex(item => new Date(new Date().getFullYear(), new Date(hormoneData.find(data => data.month === item.month).test_time).getMonth(), item.day).getTime() === endDate.getTime());

                if (startIndex === -1 || endIndex === -1) {
                  return null; // Skip if the start or end index is not found
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

              {/* Hormone Lines */}
              <Line type="monotone" dataKey="e3g" stroke="#00bfff" activeDot={{ r: 8 }} connectNulls={true} />
              <Line type="monotone" dataKey="lh" stroke="#9932cc" connectNulls={true} />
              <Line type="monotone" dataKey="pdg" stroke="#8b4513" connectNulls={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: "20px", padding: "10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {hormoneData.map((data, index) => (
            <div key={index} style={{ border: "1px solid #eee", padding: "5px" }}>
              <b>{data.month} {data.day}:</b><br />
              LH={data.lh}, E3G={data.e3g}, PDG={data.pdg}
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "30px 0", width:"50%" }}>
        <ChartFileUploader
          onUpload={async (fileData) => {
            const payload = {
              bloodWork: fileData,
            };
            try {
              await dispatch(addDocuments(payload)).unwrap();
              message.success("Chart uploaded successfully");
             // fetchPatientBloodWork();
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
