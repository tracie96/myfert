import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { getMiraInfo } from "../../redux/AuthController";
import { useDispatch } from "react-redux";
import { Button } from "antd";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
  annotationPlugin
);

const HormoneChart = () => {
  const dispatch = useDispatch();
  const [hormoneData, setHormoneData] = useState([]);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cycleType, setCycleType] = useState("cycle2"); // Start with the current cycle

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
            test_time: hormone.test_time ? new Date(hormone.test_time) : new Date(),
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

  if (!cycleInfo) return <div>Loading...</div>;
  
  // Assuming the cycleInfo contains `period_start`, `period_end`, etc.
  const periodStartCycle1 = new Date(cycleInfo.previousCycle.start); // Cycle 1 (last month)
  const periodEndCycle1 = new Date(cycleInfo.previousCycle.end); // Cycle 1 (last month)
  const periodStartCycle2 = new Date(cycleInfo.currentCycle.start); // Cycle 2 (current month)
  const periodEndCycle2 = new Date(cycleInfo.currentCycle.end); // Cycle 2 (current month)

  const labels = Array.from({ length: 62 }, (_, i) => (i % 31) + 1);
  const lhData = Array(62).fill(null);
  const e3gData = Array(62).fill(null);
  const pdgData = Array(62).fill(null);

  hormoneData.forEach((entry) => {
    const dayIndexCycle1 = Math.floor((new Date(entry.test_time) - periodStartCycle1) / (1000 * 60 * 60 * 24));
    const dayIndexCycle2 = Math.floor((new Date(entry.test_time) - periodStartCycle2) / (1000 * 60 * 60 * 24));

    if (entry.test_time >= periodStartCycle1 && entry.test_time <= periodEndCycle1) {
      lhData[dayIndexCycle1] = entry.lh;
      e3gData[dayIndexCycle1] = entry.e3g;
      pdgData[dayIndexCycle1] = entry.pdg;
    }

    if (entry.test_time >= periodStartCycle2 && entry.test_time <= periodEndCycle2) {
      lhData[31 + dayIndexCycle2] = entry.lh;
      e3gData[31 + dayIndexCycle2] = entry.e3g;
      pdgData[31 + dayIndexCycle2] = entry.pdg;
    }
  });

  // Cycle 1 data
  const dataCycle1 = {
    labels: labels.slice(0, 31),
    datasets: [
      {
        label: "Luteinizing Hormone (LH)",
        data: lhData.slice(0, 31),
        borderColor: "rgba(3, 154, 243, 0.8)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
      {
        label: "Estradiol (E3G)",
        data: e3gData.slice(0, 31),
        borderColor: "rgba(75, 192, 192, 0.7)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
      {
        label: "Pregnanediol 3 Glucuronide (PdG)",
        data: pdgData.slice(0, 31),
        borderColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
    ],
  };

  // Cycle 2 data
  const dataCycle2 = {
    labels: labels.slice(31, 62),
    datasets: [
      {
        label: "Luteinizing Hormone (LH)",
        data: lhData.slice(31, 62),
        borderColor: "rgba(3, 154, 243, 0.8)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
      {
        label: "Estradiol (E3G)",
        data: e3gData.slice(31, 62),
        borderColor: "rgba(75, 192, 192, 0.7)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
      {
        label: "Pregnanediol 3 Glucuronide (PdG)",
        data: pdgData.slice(31, 62),
        borderColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
    ],
  };

  // Define fertile window and period windows based on cycle days
  const fertileWindow = { start: 12, end: 16 }; // Fertile window for both cycles
  const periodWindow = { start: 24, end: 29 }; // Period window for both cycles

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Hormone Levels",
        },
      },
      x: {
        title: {
          display: true,
          text: "Day in Cycle",
        },
        ticks: {
          autoSkip: true,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: window.innerWidth < 600 ? 10 : 14,
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: window.innerWidth < 600 ? 10 : 14,
        },
      },
      annotation: {
        annotations: [
          // Period shading
          {
            type: "box",
            xMin: periodWindow?.start,
            xMax: periodWindow?.end,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 0.5)",
            borderWidth: 1,
            label: {
              content: "Period",
              enabled: true,
              position: "center",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          },
          // Fertile window shading
          {
            type: "box",
            xMin: fertileWindow?.start,
            xMax: fertileWindow?.end,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 1,
            label: {
              content: "Fertile Window",
              enabled: true,
              position: "center",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          },
        ],
      },
    },
  };

  const handleCycleChange = (cycle) => {
    setCycleType(cycle);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
        <div style={{ position: "relative", width: window.innerWidth < 600 ? "1000px" : "100%", height: "400px" }}>
          <Line data={cycleType === "cycle1" ? dataCycle1 : dataCycle2} options={options} />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button onClick={() => handleCycleChange("cycle1")} style={{ marginRight: "10px" }}>
          Cycle 1 (Last Month)
        </Button>
        <Button onClick={() => handleCycleChange("cycle2")}>Cycle 2 (Current Month)</Button>
      </div>
    </>
  );
};

export default HormoneChart;
