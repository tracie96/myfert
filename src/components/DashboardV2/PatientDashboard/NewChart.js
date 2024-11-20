import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { getMiraInfo } from "../../redux/AuthController";
import { Card, Col, Row } from "antd";

const NewHormoneChart = () => {
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

  const periodStart = new Date("2024-11-01");
  const labels = Array.from({ length: 62 }, (_, i) => `${(i % 31) + 1}`);
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

  const chartOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: "Hormone Levels Over the Cycle",
      align: "center",
    },
    xaxis: {
      categories: labels,
      title: {
        text: "Day in Cycle",
      },
      labels: {
        show: true, // Show x-axis labels
      },
      axisBorder: {
        show: true, // Show border at the bottom of the x-axis
      },
      axisTicks: {
        show: true, // Show ticks at each category
      },
      grid: {
        show: true, // Show vertical grid lines
        borderColor: '#e0e0e0', // Optional: set the grid line color
        strokeDashArray: 1, // Optional: set solid lines (0) or dashed lines
      },
    },
    yaxis: {
      title: {
        text: "Hormone Levels",
      },
      labels: {
        show: true,
      },
    },
    annotations: {
      xaxis: cycleInfo
        ? [
            {
              x: `Day ${Math.max(1, Math.floor((new Date(cycleInfo.period_start) - periodStart) / (1000 * 60 * 60 * 24)) + 1)}`,
              x2: `Day ${Math.floor((new Date(cycleInfo.period_end) - periodStart) / (1000 * 60 * 60 * 24)) + 1}`,
              fillColor: "#FF99A2",
              opacity: 0.25,
              label: {
                text: "Period",
              },
            },
            {
              x: `Day ${Math.max(1, Math.floor((new Date(cycleInfo.fertile_window_start) - periodStart) / (1000 * 60 * 60 * 24)) + 1)}`,
              x2: `Day ${Math.floor((new Date(cycleInfo.fertile_window_end) - periodStart) / (1000 * 60 * 60 * 24)) + 1}`,
              fillColor: "#99D8E0",
              opacity: 0.25,
              label: {
                text: "Fertile Window",
              },
            },
          ]
        : [],
    },
  };
  
  console.log('Hormone Data:', hormoneData);
  console.log('LH Data:', lhData);
  console.log('E3G Data:', e3gData);
  console.log('PdG Data:', pdgData);
  
  const chartSeries = [
    {
      name: "Luteinizing Hormone (LH)",
      data: lhData,
    },
    {
      name: "Estradiol (E3G)",
      data: e3gData,
    },
    {
      name: "Pregnanediol 3 Glucuronide (PdG)",
      data: pdgData,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={400}
        />
      </div>
      <Row gutter={[16, 16]}>
        {hormoneData?.map((entry, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={entry.test_time.toLocaleDateString()}
              bordered={true}
              style={{ textAlign: "center" }}
            >
              <p>
                <strong>LH:</strong> {entry.lh}
              </p>
              <p>
                <strong>E3G:</strong> {entry.e3g}
              </p>
              <p>
                <strong>PdG:</strong> {entry.pdg}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NewHormoneChart;
