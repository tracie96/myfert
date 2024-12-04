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
import { Card, Col, Row } from "antd";

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

  const periodStart = new Date("2024-11-1");
  const labels = Array.from({ length: 62 }, (_, i) => (i % 31) + 1);
  const lhData = Array(62).fill(null);
  const e3gData = Array(62).fill(null);
  const pdgData = Array(62).fill(null);

  hormoneData.forEach((entry) => {
    const dayIndex = Math.floor((new Date(entry.test_time) - periodStart) / (1000 * 60 * 60 * 24));
    if (dayIndex >= 0 && dayIndex < lhData.length) {
      lhData[dayIndex] = entry.lh;
      e3gData[dayIndex] = entry.e3g;
      pdgData[dayIndex] = entry.pdg;
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Luteinizing Hormone (LH)",
        data: lhData,
        borderColor: "rgba(3, 154, 243, 0.8)",
        borderWidth: 2,
        fill: false,
        spanGaps: true,
      },
      {
        label: "Estradiol (E3G)",
        data: e3gData,
        borderColor: "rgba(75, 192, 192, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        spanGaps: true,
      },
      {
        label: "Pregnanediol 3 Glucuronide (PdG)",
        data: pdgData,
        borderColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        spanGaps: true,
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
        }
      },
    },
    plugins: {
      annotation: {
        annotations: {
          period: cycleInfo
            ? {
              type: "box",
              xMin: getDayIndex(cycleInfo.period_start) - 1,
              xMax: getDayIndex(cycleInfo.period_end) - 1,
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
              xMin: getDayIndex(cycleInfo.fertile_window_start) - 1,
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
    <>
      <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
        <div style={{ position: "relative", width: window.innerWidth < 600 ? "1000px" : "100%", height: "400px" }}>
          <Line data={data} options={options} />


        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Row gutter={[16, 16]}>
          {hormoneData?.map((entry, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={entry.test_time.toLocaleDateString()}
                bordered={true}
                style={{ textAlign: "center" }}
              >
                <p><strong>LH:</strong> {entry.lh}</p>
                <p><strong>E3G:</strong> {entry.e3g}</p>
                <p><strong>PdG:</strong> {entry.pdg}</p>
              </Card>
            </Col>
          ))}
        </Row>


      </div>
    </>
  );
};

export default HormoneChart;
