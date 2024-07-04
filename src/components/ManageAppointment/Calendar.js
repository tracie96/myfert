import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [currentEvent, setCurrentEvent] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
console.log(currentEvents)
  let eventGuid = 0;
  let createEventId = eventGuid++;
  let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

  const INITIAL_EVENTS = [
    {
      id: createEventId,
      title: "All-day event",
      start: todayStr,
      editable: true,
    },
    {
      id: createEventId,
      title: "Timed event",
      start: todayStr + "T12:00:00",
      editable: true,
    },
    {
      id: createEventId,
      title: "Timed Eevent",
      start: todayStr + "T23:59:59",
      editable: false,
    },
  ];

  // const handleWeekendsToggle = () => {
  //   setWeekendsVisible(!weekendsVisible);
  // };

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title} ${clickInfo.event.startStr}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  // const handleEventRightClick = (clickInfo) => {
  //   window.alert(`Right clicked event '${clickInfo.event.title}'`);
  // };

  const handleMouseEnterOnEvent = (clickInfo) => {
    setCurrentEvent(clickInfo.event);
    const rect = clickInfo.el.getBoundingClientRect();
    const positionY = window.scrollY + rect.top + rect.height - 90;
    const positionX = window.scrollX + rect.left - 275;

    setTooltipVisible(true);
    setTooltipPosition({ top: positionY, left: positionX });
  };

  const handleMouseLeaveOnEvent = () => {
    setCurrentEvent(null);
    setTooltipVisible(false);
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );

  const renderToolTipContent = (eventInfo) => {
    // Customize the content of your tooltip
    <>
      <div>
        <h2>Tooltip Content</h2>
        {/* Add your tooltip content here */}
        <b>{currentEvent.title}</b>
        <b>{currentEvent.title}</b>
      </div>
    </>;
  };

  const updateWindowSize = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  const headerToolbar = isMobile
    ? {
        left: "prev,next today",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }
    : {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      };

  return (
    <div className="demo-app">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={headerToolbar}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={weekendsVisible}
        initialEvents={INITIAL_EVENTS}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        direction="ltr" // or rtl(right to left)
        eventMouseEnter={handleMouseEnterOnEvent}
        eventMouseLeave={handleMouseLeaveOnEvent}
      />
      {tooltipVisible && (
        <div
          id="eventTooltip"
          role="tooltip"
          style={{
            color: "black",
            borderRadius: "5px",
            border: "0.5px solid black",
            padding: "5px",
            backgroundColor: "white",
            zIndex: "999",
            position: "absolute",
            width: "200px",
            // top: `5px`,
            // left: `5px`,
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="slds-popover__body">
            <span>Id: {currentEvent.id}</span>
            <br />
            <span>Title: {currentEvent.title}</span>
            <br />
            {/* Add your tooltip content here */}
            <span>Start: {currentEvent.startStr}</span>
            <br />
            <span>End: {currentEvent.endStr}</span>
          </div>
          {/* Tooltip content */}
          {renderToolTipContent}
        </div>
      )}
    </div>
  );
};

export default Calendar;
