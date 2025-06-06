import React, { useState, useEffect, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { getAvailability, updateAvailability, deleteAppointment, getUpcomingAppointments } from "../redux/doctorSlice";
import "./PatientAppointment/PatientCalendar.css";
import { useMediaQuery } from "react-responsive";
import {
  Drawer,
  Button,
  Typography,
  message,
} from "antd";
import moment from "moment";

const { Text } = Typography;

const CustomTimePicker = ({ value, onChange, disabledHours = () => [], disabledMinutes = () => [] }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const currentHour = value ? value.hour() : 0;
  const currentMinute = value ? value.minute() : 0;

  // Get disabled hours and minutes based on current value
  const disabledHoursList = disabledHours(value) || [];
  const disabledMinutesList = disabledMinutes(value) || [];

  const handleHourChange = (e) => {
    const newHour = parseInt(e.target.value);
    const newTime = moment(value).hour(newHour);
    onChange(newTime);
  };

  const handleMinuteChange = (e) => {
    const newMinute = parseInt(e.target.value);
    const newTime = moment(value).minute(newMinute);
    onChange(newTime);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <select
        value={currentHour}
        onChange={handleHourChange}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
      >
        {hours.map(hour => (
          <option 
            key={hour} 
            value={hour}
            disabled={disabledHoursList.includes(hour)}
          >
            {hour.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
      <select
        value={currentMinute}
        onChange={handleMinuteChange}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
      >
        {minutes.map(minute => (
          <option 
            key={minute} 
            value={minute}
            disabled={disabledMinutesList.includes(minute)}
          >
            {minute.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
    </div>
  );
};

const Calendar = ({ currentWeek, refreshTrigger, isDrawer }) => {
  const [apptEvents, setApptEvents] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const { appointmentList = [] } = useSelector((state) => state?.doctor);
console.log({currentWeek})
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editingKey, setEditingKey] = useState("");
  const [editedTimes, setEditedTimes] = useState({});

  // Use a static week when isDrawer is true
  const displayWeek = isDrawer ? moment().startOf('week') : currentWeek;

  const updateCalendarEvents = useCallback(
    (availability, startYear, startMonth) => {
      console.log({ availability });

      const events = availability.flatMap((slot, index) => {
        const start = new Date(slot.date);
        const end = new Date(slot.date);

        const startHour = slot.start ? slot.start.hour : 0;
        const startMinute = slot.start ? slot.start.minute : 0;
        const endHour = slot.end ? slot.end.hour : 0;
        const endMinute = slot.end ? slot.end.minute : 0;
        start.setHours(startHour, startMinute, 0, 0);
        end.setHours(endHour, endMinute, 0, 0);
        return slot.free
          ? [
            {
              id: `${slot.date}_${slot.roleId}_${index}`,
              title: `Available`,
              start: start,
              end: end,
              classNames: `fc-event-coach-available`,
              textColor: "white",
              extendedProps: {
                startTime: start.toLocaleTimeString(),
                endTime: end.toLocaleTimeString(),
                slotData: slot,
                date: slot.date,
              },
            },
          ]
          : [
            {
              id: `${slot.date}_${slot.roleId}_${index}`,
              title: `Available`,
              start: start,
              end: end,
              classNames: `fc-event-coach-available`,
              textColor: "white",
              extendedProps: {
                startTime: start.toLocaleTimeString(),
                endTime: end.toLocaleTimeString(),
                slotData: slot,
                date: slot.date,
              },
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
    if (!isDrawer) {
      const year = displayWeek.year();
      const month = displayWeek.month() + 1;
      fetchAndSetAvailability(year, month);
    }
  }, [displayWeek, isDrawer, fetchAndSetAvailability]);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedEvent(null);
    setEditingKey(null);
    setEditedTimes({});
  };

  const startEditing = (key) => {
    setEditingKey(key);
  };

  const handleTimeChange = async (time, field, index) => {
    if (!time) {
      setEditedTimes((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: null,
        },
      }));
      return;
    }

    const newTime = moment(time);
    const currentTimes = editedTimes[index] || {};
    
    // Get the other time value (either start or end)
    const otherTimeField = field === 'start' ? 'end' : 'start';
    const otherTime = currentTimes[otherTimeField];

    // Only validate if both times are set
    if (field === 'start' && otherTime) {
      const startHour = newTime.hour();
      const endHour = otherTime.hour();
      const startMinute = newTime.minute();
      const endMinute = otherTime.minute();

      if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        message.error('Start time must be before end time');
        return;
      }
    }

    if (field === 'end' && currentTimes.start) {
      const startHour = currentTimes.start.hour();
      const endHour = newTime.hour();
      const startMinute = currentTimes.start.minute();
      const endMinute = newTime.minute();

      if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        message.error('End time must be after start time');
        return;
      }
    }

    // Update state first
    setEditedTimes((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: newTime,
      },
    }));

    // Wait for state to update, then make API call
    setTimeout(() => {
      updateAvailabilityToApi(newTime, field, index);
    }, 100);
  };

  const updateAvailabilityToApi = async (newTime, field, index) => {
    if (selectedEvent && appointmentList.length > 0) {
      const eventDate = moment(selectedEvent.extendedProps.date).format("YYYY-MM-DD");
      const appointment = appointmentList.find(app =>
        moment(app.date).format("YYYY-MM-DD") === eventDate
      );

      if (appointment && appointment.periods && appointment.periods.length > 0) {
        const period = appointment.periods[index];

        let startTime = moment({ hour: period.start.hour, minute: period.start.minute });
        let endTime = moment({ hour: period.end.hour, minute: period.end.minute });

        if (field === "start") {
          startTime = newTime;
        } else if (field === "end") {
          endTime = newTime;
        }

        // Validate times before making API call
        if (startTime.isAfter(endTime) || startTime.isSame(endTime)) {
          message.error('Start time must be before end time');
          return;
        }

        const payload = {
          start: {
            hour: startTime.hour(),
            minute: startTime.minute()
          },
          end: {
            hour: endTime.hour(),
            minute: endTime.minute()
          },
          appointID: period.appointID
        };

        try {
          const response = await dispatch(updateAvailability(payload));

          if (updateAvailability.fulfilled.match(response)) {
            message.success('Appointment time updated successfully!');
            console.log("Successfully updated availability");
            const startYear = displayWeek.year();
            const startMonth = displayWeek.month() + 1;
            await fetchAndSetAvailability(startYear, startMonth);
          } else {
            message.error('Failed to update appointment time');
            console.error("Failed to update appointment:", response.error);
          }
        } catch (error) {
          message.error('Error updating appointment time');
          console.error("Error updating appointment:", error);
        }
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await dispatch(deleteAppointment(appointmentId)).unwrap();
      // Refresh the appointments list after deletion
      dispatch(getUpcomingAppointments());
      // Close the drawer and clear selected event
      handleDrawerClose();
            const year = displayWeek.year();
      const month = displayWeek.month() + 1;
      fetchAndSetAvailability(year, month);
      message.success('Appointment deleted successfully');
    } catch (error) {
      message.error('Failed to delete appointment');
    }
  };

  return (
    <>
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
        height={isMobile ? 464 : "1000px"}
        eventClick={handleEventClick}
        validRange={{
          start: isDrawer ? displayWeek.startOf('week').format('YYYY-MM-DD') : undefined,
          end: isDrawer ? displayWeek.endOf('week').format('YYYY-MM-DD') : undefined
        }}
      />

      <Drawer
        title="Existing Availabilities"
        placement="right"
        width={500}
        onClose={handleDrawerClose}
        open={isDrawerVisible}
        footer={
          editingKey ? (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Button
                onClick={() => {
                  setEditingKey("");
                  setEditedTimes({});
                  handleDrawerClose()
                }}
              >
                Close
              </Button>
            </div>
          ) : null
        }
      >
        {selectedEvent && (
          <div>
            {appointmentList
              .find(
                (app) =>
                  moment(app.date).format("YYYY-MM-DD") ===
                  moment(selectedEvent.extendedProps.date).format("YYYY-MM-DD")
              )
              ?.periods?.map((period, index) => {
                const key = `period-${index}`;
                return (
                  <div
                    key={key}
                    style={{
                      marginBottom: "24px",
                      background: "#f5f5f5",
                      padding: "16px",
                      borderRadius: "8px",
                    }}
                  >
                    {editingKey === key ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ fontSize: "16px", marginBottom: "8px" }}>
                          Current:{" "}
                          {moment({
                            hour: period.start.hour,
                            minute: period.start.minute,
                          }).format("hh:mm A")}{" "}
                          -{" "}
                          {moment({
                            hour: period.end.hour,
                            minute: period.end.minute,
                          }).format("hh:mm A")}
                        </div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1 }}>
                            <Text strong>Start Time</Text>
                            <CustomTimePicker
                              value={editedTimes[index]?.start || moment({
                                hour: period.start.hour,
                                minute: period.start.minute
                              })}
                              onChange={(time) => handleTimeChange(time, "start", index)}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Text strong>End Time</Text>
                            <CustomTimePicker
                              value={editedTimes[index]?.end || moment({
                                hour: period.end.hour,
                                minute: period.end.minute
                              })}
                              onChange={(time) => handleTimeChange(time, "end", index)}
                              disabledHours={(time) => {
                                const startTime = editedTimes[index]?.start || moment({
                                  hour: period.start.hour,
                                  minute: period.start.minute
                                });
                                return Array.from({ length: startTime.hour() }, (_, i) => i);
                              }}
                              disabledMinutes={(time) => {
                                const startTime = editedTimes[index]?.start || moment({
                                  hour: period.start.hour,
                                  minute: period.start.minute
                                });
                                if (time && time.hour() === startTime.hour()) {
                                  return Array.from({ length: startTime.minute() + 1 }, (_, i) => i);
                                }
                                return [];
                              }}
                            />
                          </div>
                        </div>
                        
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "16px" }}>
                          {moment({
                            hour: period.start.hour,
                            minute: period.start.minute,
                          }).format("hh:mm A")}{" "}
                          -{" "}
                          {moment({
                            hour: period.end.hour,
                            minute: period.end.minute,
                          }).format("hh:mm A")}
                        </div>
                        <div>
                          <Button type="link" onClick={() => startEditing(key)}>
                            Edit
                          </Button>
                          <Button 
                            type="link" 
                            danger
                            onClick={() => handleDeleteAppointment(period?.appointID)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Calendar;
