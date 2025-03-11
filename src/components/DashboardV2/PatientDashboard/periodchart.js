import React from 'react';
import moment from "moment";
import { useMediaQuery } from "react-responsive";

const CircleWithArc = ({ cycleInfo }) => {
    const { period_start, period_end, fertile_window_start, fertile_window_end } = cycleInfo?.cycleInfo;
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const radius = 200;
    const centerX = 200;
    const centerY = 250;
    const startAngle = -90;

    const today = moment();
    const daysInMonth = today.daysInMonth();

    const getDateAngle = (date) => {
        const dayOfMonth = moment(date).date();
        return startAngle + (360 / daysInMonth) * (dayOfMonth - 1);
    };

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
    
        if (rangeStartMoment.isBefore(rangeEndMoment)) {
            return dateMoment.isBetween(rangeStartMoment, rangeEndMoment, 'days', '[]');
        } else {
            // Range spans across months (e.g., Feb 27 - Mar 4)
            // Check if the date is in the remaining days of the start month
            const endOfStartMonth = moment(rangeStart).endOf('month');
            const isInStartMonth = dateMoment.isBetween(rangeStartMoment, endOfStartMonth, 'days', '[]');
    
            // Check if the date is in the beginning days of the end month
            const startOfEndMonth = moment(rangeEnd).startOf('month');
            const isInEndMonth = dateMoment.isBetween(startOfEndMonth, rangeEndMoment, 'days', '[]');
    
            return isInStartMonth || isInEndMonth;
        }
    };
    
    
    return (
        <div
            style={{
                position: "relative",
                width: isMobile ? "250px" : "500px",
                height: isMobile ? "250px" : "500px",
                margin: isMobile ? "10px" : "auto",
                marginTop: isMobile ? -20 : 70,
                padding: 10,
            }}
        >
            <svg width={isMobile ? 300 : 600} height={isMobile ? 300 : 500} viewBox={isMobile ? "0 0 350 500" : "0 0 500 500"}>
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
                <circle cx={centerX} cy={centerY} r={radius} stroke="gray" strokeWidth="0" fill="none" />

                <path
                    d={createArc(periodStartAngle, periodEndAngle)}
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="50"
                    strokeLinecap="round"
                />

                <path
                    d={createArc(fertileStartAngle, fertileEndAngle)}
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="50"
                    strokeLinecap="round"
                />

{dayPositions.map((position, i) => {
    let currentYear = moment().year();
    let currentMonth = moment().month(); // 0-indexed (0 = January, 2 = March)

    let dayOfMonth = i + 1;

    // Adjust year and month if dayOfMonth exceeds the number of days in the current month
    let daysInCurrentMonth = moment().daysInMonth();
    if (dayOfMonth > daysInCurrentMonth) {
        currentMonth = currentMonth + 1;
        dayOfMonth = dayOfMonth - daysInCurrentMonth;
    }

    const dayDate = moment([currentYear, currentMonth, i + 1]);
    const isToday = i + 1 === today.date();
    const isInPeriod = isWithinRange(dayDate, period_start, period_end);
    const isInFertileWindow = isWithinRange(dayDate, fertile_window_start, fertile_window_end);

    let showDate = isInPeriod || isInFertileWindow;

    let textColor = "white";

    return (
        <React.Fragment key={i}>
            {!showDate && (
                <circle
                    cx={position.x}
                    cy={position.y}
                    r={4}
                    fill="#f3f3f5"
                    filter="url(#shadow)"
                />
            )}
            <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="10"
                fill={textColor}
                style={{ display: showDate ? 'block' : 'none' }}
            >
                {isToday ? i + 1 : dayDate.format('ddd D')}
            </text>
        </React.Fragment>
    );
})}

            </svg>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    width: isMobile ? "90%" : "70%",
                    height: isMobile ? "90%" : "70%",
                    borderRadius: "50%",
                    borderWidth: 0,
                    borderColor: "#f3f3f5",
                    borderStyle: "solid",
                    top: isMobile ? "15%" : "18%",
                    left: isMobile ? "25%" : "16%",
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
