import React from "react";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const parseCycleData = (cycleInfo) => {
  const {
    period_start,
    period_end,
    fertile_window_start,
    fertile_window_end,
    ovulation,
  } = cycleInfo?.cycleInfo;

  const periodStartDate = moment(period_start);
  const periodEndDate = moment(period_end).subtract(1, "day");
  const fertileStartDate = moment(fertile_window_start);
  const fertileEndDate = moment(fertile_window_end).subtract(1, "day");
  const ovulationDate = moment(ovulation);
  const totalDays = periodStartDate.clone().endOf("month").date();

  const cycleData = [];
  for (let i = 1; i <= totalDays + fertileEndDate.date(); i++) {
    const currentDate = periodStartDate
      .clone()
      .startOf("month")
      .add(i - 1, "days");

    cycleData.push({
      date: currentDate, // Store the actual date here
      flow: false,
      phase: "follicular",
      isOvulation: false,
      isCycleEnd: false,
    });

    const day = cycleData[i - 1];

    if (currentDate.isBetween(periodStartDate, periodEndDate, null, "[]")) {
      day.flow = true;
    }

    if (currentDate.isBetween(fertileStartDate, fertileEndDate, null, "[]")) {
      day.phase = "fertile";
    }

    if (currentDate.isSame(ovulationDate, "day")) {
      day.isOvulation = true;
      day.phase = "ovulation";
    }
  }
  return cycleData;
};

const PeriodCycleTracker = ({ cycleInfo }) => {
  const cycleData = parseCycleData(cycleInfo);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const renderCycle = () => {
    const totalDays = cycleData.length;
    const radius = isMobile ? 150 : 200;
    const angleIncrement = (2 * Math.PI) / totalDays;

    const today = moment().startOf("day");

    return cycleData.map((day, index) => {
      const angle = index * angleIncrement;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const dayDate = moment(day.date).local().startOf("day");

      let color = "#f3f3f5";
      let gradient = "";
      let circleSize = isMobile ? 5 : 15;
      let borderSize = "50%";

      if (day.flow || day.phase === "fertile") {
        circleSize = isMobile ? 25 : 40;
        borderSize = "70%";
        if (day.phase === "fertile") {
          gradient = "linear-gradient(135deg, #AFE1AF 0%, #097969 100%)";
        }
      }

      if (day.phase === "ovulation") {
        circleSize = isMobile ? 25 : 40;
        borderSize = "70%";
      }

      if (day.flow) {
        gradient = "linear-gradient(135deg, #C70039 0%, #FF5733 100%)";
      } else if (day.phase === "fertile") {
        color = "transparent";
      } else if (day.phase === "ovulation") {
        color = "#097969";
      }

      if (day.isCycleEnd) {
        color = "#DFFF00";
        gradient = "linear-gradient(135deg, #E4D00A 0%, #FFC300 100%)";
      }

      if (dayDate.isSame(today, "day")) {
        color = "#FFFF00"; // Set color to yellow for the current date
        circleSize = isMobile ? 25 : 40;
        gradient = "linear-gradient(135deg, #E4D00A 0%, #FFC300 100%)";
      }
      const formattedDate = day.date.format("ddd D"); // Properly format the date

      const dayStyle = {
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        borderRadius: `${borderSize}`,
        position: "absolute",
        top: `calc(50% - ${circleSize / 2}px + ${y}px)`,
        left: `calc(50% - ${circleSize / 2}px + ${x}px)`,
        backgroundColor: color,
        backgroundImage: gradient,
        backgroundSize: "cover",
        textAlign: "center",
        lineHeight: `${circleSize}px`,
        boxShadow: "0px 4px 4px 0px #00000040",
        fontSize: isMobile ? "6px" : "10px",
        color: "#fff",
        zIndex: 1,
      };

      return (
        <div key={index} style={dayStyle}>
          {day.phase === "fertile" ||
          day.flow ||
          dayDate.isSame(today, "day") ||
          day.phase === "ovulation"
            ? formattedDate
            : null}
        </div>
      );
    });
  };

  const formatDate = () => {
    return moment().format("ddd / MMM Do");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          width: isMobile ? "250px" : "370px",
          marginTop: isMobile ? 0 : -100,
          margin: "auto",
        }}
      ></div>
      <div
        style={{
          position: "relative",
          width: isMobile ? "250px" : "350px",
          height: isMobile ? "250px" : "350px",
          margin: "auto",
          marginTop: 70,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxSizing: "border-box",
            background: "#f3f3f5",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            width: "90%",
            height: "90%",
            borderRadius: "50%",
            backgroundColor: "#fff",
            top: "5%",
            left: "5%",
            fontSize: "16px",
            color: "#000",
            zIndex: 2,
          }}
        >
          <div
            style={{ flexDirection: "column", display: "flex" }}
            className="me"
          >
            <div
              style={{
                borderBottom: "1px solid #d1d5db",
                width: "100%",
                textAlign: "center",
                padding: 2,
              }}
            >
              {formatDate()}
            </div>
            <div
              style={{
                borderBottom: "1px solid #d1d5db",
                width: "100%",
                textAlign: "center",
                padding: 10,
                fontWeight: "bold",
              }}
            >
              Cycle Days: {cycleInfo.cycleInfo.cycle_length}
            </div>
          </div>
        </div>

        {renderCycle()}
      </div>
    </div>
  );
};

export default PeriodCycleTracker;
