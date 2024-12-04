import React, { useState, useEffect, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch } from "react-redux";
import { getAvailability } from "../redux/doctorSlice";
import "./PatientAppointment/PatientCalendar.css"
import { useMediaQuery } from "react-responsive";

const Calendar = ({ currentWeek, refreshTrigger }) => {
  const [apptEvents, setApptEvents] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
 
  const updateCalendarEvents = useCallback(
    (availability, startYear, startMonth) => {
      const events = availability.flatMap((slot, index) => {
        return slot.free
          ? [
              {
                id: `${slot.date}_${slot.roleId}_${index}`, 
                title: `Available`,
                start: new Date(slot.date), 
                end: new Date(slot.date), 
                classNames: `fc-event-coach-available`,
                textColor: "white",
              },
            ]
          : [
              {
                id: `${slot.date}_${slot.roleId}_${index}`, 
                title: `Booked`,
                start: new Date(slot.date),
                end: new Date(slot.date),
                classNames: "fc-event-coach-booked",
                textColor: "white",
              },
            ];
      });
      setApptEvents(events);
    },
    [],
  );
  
  const fetchAndSetAvailability = useCallback(
    async (startYear, startMonth) => {
      try {
        const response = await dispatch(
          getAvailability({ month: startMonth, year: startYear }),
        );
        if (getAvailability.fulfilled.match(response)) {
          const availability = response.payload;
          console.log(response.payload);
          updateCalendarEvents(availability, startYear, startMonth);
        } else {
          console.error("Failed to fetch availability");
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    },
    [dispatch, updateCalendarEvents],
  );

  useEffect(() => {
    const startYear = currentWeek.year();
    const startMonth = currentWeek.month() + 1; 
    fetchAndSetAvailability(startYear, startMonth);
    const intervalId = setInterval(() => {
      fetchAndSetAvailability(startYear, startMonth);
    }, 5000); // 5 seconds = 5000 ms
  
    return () => clearInterval(intervalId);
  }, [refreshTrigger, fetchAndSetAvailability, currentWeek]);

  // Header toolbar configuration
 
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={apptEvents}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth",
      }}
      height={isMobile? 464:'1000px'}
       />
  );
};

export default Calendar;
