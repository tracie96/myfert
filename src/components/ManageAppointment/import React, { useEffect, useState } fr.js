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
import { useDispatch, useSelector } from "react-redux";

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
  const { userAuth } = useSelector((state) => state.authentication);
console.log({userAuth})
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
          setCycleInfo(resultAction.payload.cycleInfo); // Set cycle info here
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

  const labels = Array.from({ length: 62 }, (_, i) => {
    const day = i % 31;
    return day.toString();
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Luteinizing Hormone (LH)",
        data: hormoneData.length
          ? hormoneData.map((entry) => entry.lh || null) 
          : Array(30).fill(userAuth.obj.firstName === "Amarsa" ? 1 : null), 
        borderColor: "rgba(3, 154, 243, 0.8)",
        borderWidth: 2,
        fill: true,
        spanGaps: true,  
      },
      {
        label: "Estradiol (E3G)",
        data: hormoneData.length
          ? hormoneData.map((entry) => entry.e3g || null)  // Use null for missing data
          : Array(30).fill(userAuth.obj.firstName === "Amarda" ? 2 : null),
        borderColor: "rgba(75, 192, 192, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        spanGaps: true, 
      },
      {
        label: "Pregnanediol 3 Glucuronide (PdG)",
        data: hormoneData.length
          ? hormoneData.map((entry) => entry.pdg || null)  // Use null for missing data
          : Array(30).fill(null),  // Ensure missing values are null
        borderColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        spanGaps: true,  // Ensure lines connect across gaps
      },
    ],
  };

  const getDayIndex = (date) => {
    if (!cycleInfo) return 0;
    const periodStart = new Date("2024-11-01");
    const targetDate = new Date(date);
    return Math.floor((targetDate - periodStart) / (1000 * 60 * 60 * 24)) + 1;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hormone Levels",
        },
      },
      x: {
        title: {
          display: true,
          text: "Cycle (2)",
        },
        ticks: {
          callback: function (value, index) {
            return labels[index]; 
          },
        },
      },
    },
    plugins: {
      annotation: {
        annotations: {
          period: cycleInfo
            ? {
                type: "box",
                xMin: getDayIndex(cycleInfo.period_start),
                xMax: getDayIndex(cycleInfo.period_end),
                backgroundColor: "rgba(255, 99, 132, 0.25)",
                borderWidth: 0,
                label: {
                  content: "Period",
                  enabled: true,
                  position: "center",
                },
              }
            : {},
          fertile: cycleInfo
            ? {
                type: "box",
                xMin: getDayIndex(cycleInfo.fertile_window_start),
                xMax: getDayIndex(cycleInfo.fertile_window_end),
                backgroundColor: "rgba(75, 192, 192, 0.25)",
                borderWidth: 0,
                label: {
                  content: "Fertile Window",
                  enabled: true,
                  position: "center",
                },
              }
            : {},
        },
      },
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
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default HormoneChart;