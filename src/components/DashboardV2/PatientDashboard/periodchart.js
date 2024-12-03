import React from 'react';
import moment from "moment";
import { useMediaQuery } from "react-responsive";

const CircleWithArc = ({ cycleInfo }) => {
    const { period_start, period_end, fertile_window_start, fertile_window_end } = cycleInfo?.cycleInfo;
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const radius = 200;
    const centerX = 200;
    const centerY = 250;
    const startAngle = -90; // Starting angle for the first day of the month

    const today = moment();
    const daysInMonth = today.daysInMonth(); // Get the number of days in the current month

    // Helper function to calculate the angle for a given date
    const getDateAngle = (date) => {
        const dayOfMonth = moment(date).date();
        return startAngle + (360 / daysInMonth) * (dayOfMonth - 1); // Adjust for 0-indexed days
    };

    // Calculate angles for the arcs
    const periodStartAngle = getDateAngle(period_start);
    const periodEndAngle = getDateAngle(period_end);
    const fertileStartAngle = getDateAngle(fertile_window_start);
    const fertileEndAngle = getDateAngle(fertile_window_end);

    const createArc = (startAngle, endAngle, radiusOffset = 0) => {
        const startRad = (Math.PI / 180) * startAngle;
        const endRad = (Math.PI / 180) * endAngle;

        const startX = centerX + (radius + radiusOffset) * Math.cos(startRad);
        const startY = centerY + (radius + radiusOffset) * Math.sin(startRad);
        const endX = centerX + (radius + radiusOffset) * Math.cos(endRad);
        const endY = centerY + (radius + radiusOffset) * Math.sin(endRad);

        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
        return `
            M ${startX} ${startY}
            A ${radius + radiusOffset} ${radius + radiusOffset} 0 ${largeArcFlag} 1 ${endX} ${endY}
        `;
    };

    const dayPositions = Array.from({ length: daysInMonth }, (_, i) => {
        const angle = (startAngle + (360 / daysInMonth) * i) * (Math.PI / 180);
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            day: i + 1,
        };
    });

    const formatDate = () => {
        return today.format("ddd / MMM Do");
    };

    const isWithinRange = (date, rangeStart, rangeEnd) => {
        const dateMoment = moment(date).startOf('day');
        const rangeStartMoment = moment(rangeStart).startOf('day');
        const rangeEndMoment = moment(rangeEnd).startOf('day');

        const rangeStartMonth = rangeStartMoment.month();
        const rangeEndMonth = rangeEndMoment.month();

        if (rangeStartMonth === rangeEndMonth) {
            return dateMoment.isBetween(rangeStartMoment, rangeEndMoment, 'days', '[]');
        } else {
            const isWithinPreviousMonth = dateMoment.isBetween(
                moment(rangeStartMoment).subtract(1, 'month').startOf('month'),
                rangeStartMoment.endOf('month'),
                'days',
                '[]'
            );
            const isWithinCurrentMonth = dateMoment.isBetween(
                rangeStartMoment.startOf('month'),
                rangeEndMoment.endOf('month'),
                'days',
                '[]'
            );

            return isWithinPreviousMonth || isWithinCurrentMonth;
        }
    };


    return (
        <div
            style={{
                position: "relative",
                width: isMobile ? "250px" : "500px",
                height: isMobile ? "250px" : "500px",
                margin: "auto",
                marginTop: isMobile ? 0 : 70,
                padding: 10,
            }}
        >
            <svg width={isMobile ? 400 : 600} height={500} viewBox={isMobile ? "0 0 400 500" : "0 0 500 500"}>
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.3)" />
                    </filter>
                </defs>
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#C70039", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#FF5733", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#AFE1AF", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#097969", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#E4D00A", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#FFC300", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                {/* Full Circle Outline */}
                <circle cx={centerX} cy={centerY} r={radius} stroke="gray" strokeWidth="0" fill="none" />

                {/* Period Arc */}
                <path
                    d={createArc(periodStartAngle, periodEndAngle)}
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="40"
                    strokeLinecap="round"
                />

                {/* Fertile Window Arc */}
                <path
                    d={createArc(fertileStartAngle, fertileEndAngle)}
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="40"
                    strokeLinecap="round"
                />

                {dayPositions.map((position, i) => {
                    const dayDate = moment().date(i + 1); // Current day (i + 1)
                    const isToday = i + 1 === today.date(); // Check if it's today
                    const isFertile = isWithinRange(dayDate, fertile_window_start, fertile_window_end); // Check if the day is in the fertile window
                    const dayNumber = dayDate.date();
                    const periodRange = Array.from(
                        { length: moment(period_end).date() - moment(period_start).date() + 1 },
                        (_, index) => moment(period_start).date() + index
                    );
                    const formattedDate = dayDate.format('ddd D');
                    // Define the fertility window range for multiple months
                    const fertilityRange = [];
                    let currentDay = moment(fertile_window_start);
                    while (currentDay.isBefore(moment(fertile_window_end)) || currentDay.isSame(moment(fertile_window_end))) {
                        fertilityRange.push(currentDay.date());
                        currentDay.add(1, 'day');
                    }

                    // Check if the day is in the period range or fertility range
                    const isNotInPeriodRange = !periodRange.includes(dayNumber);
                    const isNotInFertilityRange = !fertilityRange.includes(dayNumber);

                    // Check if it's today
                    if (isToday) {
                        return (
                            <React.Fragment key={i}>
                                <circle
                                    cx={position.x}
                                    cy={position.y}
                                    r={25}
                                    fill="url(#gradient3)"
                                    strokeWidth="5"
                                    filter="url(#shadow)"
                                />
                                <text
                                    x={position.x}
                                    y={position.y}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontSize="10"
                                    fill="white"
                                >
                                    {i + 1}
                                </text>
                            </React.Fragment>
                        );
                    }

                    // If the day is not in the period range and not in the fertility range
                    else if (isNotInPeriodRange && isNotInFertilityRange && !isFertile) {
                        return (
                            <React.Fragment key={i}>
                                <circle
                                    cx={position.x}
                                    cy={position.y}
                                    r={4}
                                    fill="#f3f3f5"
                                    filter="url(#shadow)"
                                />
                                <text
                                    x={position.x}
                                    y={position.y}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontSize="10"
                                    fill="white"
                                >
                                    {dayNumber}
                                </text>
                            </React.Fragment>
                        );
                    }

                    // For other cases (days in period range or fertility range)
                    else {
                        return (
                            <React.Fragment key={i}>
                                {(isNotInPeriodRange && isNotInFertilityRange) ?
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r={4}
                                        fill="#f3f3f5"
                                        filter="url(#shadow)"
                                    /> : ''}
                                <text
                                    x={position.x}
                                    y={position.y}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontSize="10"
                                    fill="white"
                                >
              {(isNotInPeriodRange && isNotInFertilityRange) ? "":formattedDate}                     
               </text>
                            </React.Fragment>
                        );
                    }
                })}



            </svg>

            {/* Center Content */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    width: isMobile ? "90%" : "70%",
                    height: isMobile ? "65%" : "70%",
                    borderRadius: "50%",
                    borderWidth: 0,
                    borderColor: "#f3f3f5",
                    borderStyle: "solid",
                    backgroundColor: "#fff",
                    top: "18%",
                    left: isMobile ? "5%" : "16%",
                    fontSize: "16px",
                    color: "#000",
                    zIndex: 2,
                }}
            >
                <div style={{ flexDirection: "column", display: "flex" }}>
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
        </div>
    );
};

export default CircleWithArc;
