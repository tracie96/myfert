import React from 'react';
import moment from "moment";
import { useMediaQuery } from "react-responsive";

const CircleWithArc = ({ cycleInfo }) => {
    const {
        period_start,
        period_end,
        fertile_window_start,
        fertile_window_end,
    } = cycleInfo?.cycleInfo;
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const periodStartDate = moment(period_start); 
    const periodEndDate = moment(period_end); 
    const fertileStartDate = moment(fertile_window_start); 
    const fertileEndDate = moment(fertile_window_end); 
    const totalDays = periodStartDate.clone().endOf("month").date(); 

    const radius = 200;
    const centerX = 200;
    const centerY = 250;
    const startAngle = -90;

    const today = new Date().getDate();

    const getDayPosition = (day) => {
        const angle = (startAngle + (360 / totalDays) * day) * (Math.PI / 180);
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        };
    };
    const formatDate = () => {
        return moment().format("ddd / MMM Do");
    };

    const dayPositions = Array.from({ length: totalDays }, (_, i) => getDayPosition(i));

    const createArc = (startDay, endDay, radiusOffset = 0) => {
        const start = getDayPosition(startDay - 1);
        const end = getDayPosition(endDay - 1); 

        const largeArcFlag = endDay - startDay <= 15 ? 0 : 1;
        const d = `
      M ${start.x} ${start.y}
      A ${radius + radiusOffset} ${radius + radiusOffset} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `;
        return d;
    };

    const isDayInRange = (day, startDate, endDate) => {
        const dayDate = moment().startOf('month').add(day - 1, 'days');
        return dayDate.isBetween(startDate, endDate, null, '[]');
    };

    return (
        <div
            style={{
                position: "relative",
                width: isMobile ? "250" : "500px",
                height: isMobile ? "250" : "500px",
                margin: "auto",
                marginTop: isMobile ? 0 : 70,

                padding: 10
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
                <circle cx={centerX} cy={centerY} r={radius} stroke="gray" strokeWidth="0" fill="none" />

                <path
                    d={createArc(periodStartDate.date(), periodEndDate.date())}
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="40"
                    strokeLinecap="round"
                />
                <path
                    d={createArc(fertileStartDate.date(), fertileEndDate.date())}
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="40"
                    strokeLinecap="round"
                />

                {dayPositions.map((position, i) => (
                    <React.Fragment key={i}>
                        {i + 1 === today ? (
                            <circle
                                cx={position.x}
                                cy={position.y}
                                r={25}
                                fill="url(#gradient3)"
                                strokeWidth="5"
                                filter="url(#shadow)"
                            />
                        ) : (
                            <>
                                {isDayInRange(i + 1, periodStartDate, periodEndDate) ? (
                                    ""
                                ) : isDayInRange(i + 1, fertileStartDate, fertileEndDate) ? (
                                   ""
                                ) : (
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r={4}  
                                        fill="#f3f3f5"
                                        filter="url(#shadow)" 
                                    />
                                )}
                            </>
                        )}

                        {(isDayInRange(i + 1, periodStartDate, periodEndDate) || isDayInRange(i + 1, fertileStartDate, fertileEndDate)  || i+1 === today )&& (
                            <text
                                x={position.x}
                                y={position.y}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="10"
                                fill="white"
                            >
                                {moment().startOf('month').add(i, 'days').format('ddd DD')}   
                                                         </text>
                        )}
                    </React.Fragment>
                ))}
            </svg>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    width: isMobile ? "90%" : "70%",
                    height: isMobile ? "65%" : "70%",
                    borderRadius: "50%",
                    borderWidth: 10,
                    borderColor: "#f3f3f5",
                    borderStyle: "solid",
                    backgroundColor: "#fff",
                    top: "18%",
                    left: isMobile ? "5%" : "19%",
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
        </div>
    );
};

export default CircleWithArc;
