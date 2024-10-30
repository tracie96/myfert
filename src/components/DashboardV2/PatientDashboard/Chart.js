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
          ? hormoneData.map((entry) => entry.lh)
          : Array(30).fill(0),
        borderColor: "rgba(3, 154, 243, 0.8)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Estradiol (E3G)",
        data: hormoneData.length
          ? hormoneData.map((entry) => entry.e3g)
          : Array(30).fill(0),
        borderColor: "rgba(75, 192, 192, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Pregnanediol 3 Glucuronide (PdG)",
        data: hormoneData.length
          ? hormoneData.map((entry) => entry.pdg)
          : Array(30).fill(0),
        borderColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const getDayIndex = (date) => {
    if (!cycleInfo) return 0;
    const periodStart = new Date("2024-08-01");
    const targetDate = new Date(date);
    return Math.floor((targetDate - periodStart) / (1000 * 60 * 60 * 24)) + 1;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable fixed aspect ratio for responsive charts
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
            return labels[index]; // Use the labels array directly
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
