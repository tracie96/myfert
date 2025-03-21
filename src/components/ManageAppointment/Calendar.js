import React, { useState, useEffect, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { getAvailability } from "../redux/doctorSlice";
import "./PatientAppointment/PatientCalendar.css";
import { useMediaQuery } from "react-responsive";
import {
  Drawer,
  Button,
  TimePicker,
  Space,
  Typography,
  Divider,
} from "antd"; // Import necessary Ant Design components
import moment from "moment";
import axios from "axios"; // Import axios

const { Text } = Typography; // Import Typography.Text for inline styling

const Calendar = ({ currentWeek, refreshTrigger }) => {
  const [apptEvents, setApptEvents] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const calendarRef = useRef(null);
  const dispatch = useDispatch();

  // State for event details drawer
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // State for edit drawer
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [editStartTime, setEditStartTime] = useState(null);
  const [editEndTime, setEditEndTime] = useState(null);

  // New state variables
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const { userAuth } = useSelector((state) => state?.authentication);
  const user = userAuth?.obj;

  const [editingKey, setEditingKey] = useState("");

  const fetchAppointmentDetails = useCallback(
    async (date) => {
      try {
        const formattedDate = moment(date).format("YYYY-MM-DD"); // Format the date
        const response = await axios.get(
          `https://myfertilitydevapi.azurewebsites.net/api/Doctor/GetAppointmentDetails/${formattedDate}`,
          {
            headers: {
              accept: "text/plain",
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );
        console.log(response.data);

        setAppointmentDetails(response.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    },
    [user?.token],
  );

  const updateCalendarEvents = useCallback(
    (availability, startYear, startMonth) => {
      const events = availability.flatMap((slot, index) => {
        const start = new Date(slot.date);
        const end = new Date(slot.date);

        // Extract hours and minutes from the slot
        const startHour = slot.start ? slot.start.hour : 0;
        const startMinute = slot.start ? slot.start.minute : 0;
        const endHour = slot.end ? slot.end.hour : 0;
        const endMinute = slot.end ? slot.end.minute : 0;

        // Set the time for the start and end dates
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
                  startTime: start.toLocaleTimeString(), // Store formatted start time
                  endTime: end.toLocaleTimeString(), // Store formatted end time
                  slotData: slot, // Store the original slot data
                  date: slot.date, // Store the date
                },
              },
            ]
          : [
              {
                id: `${slot.date}_${slot.roleId}_${index}`,
                title: `Booked`,
                start: start,
                end: end,
                classNames: "fc-event-coach-booked",
                textColor: "white",
                extendedProps: {
                  startTime: start.toLocaleTimeString(), // Store formatted start time
                  endTime: end.toLocaleTimeString(), // Store formatted end time
                  slotData: slot, // Store the original slot data
                  date: slot.date, // Store the date
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

  // Event click handler
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsDrawerVisible(true);

    // Format the date from the FullCalendar event to 'YYYY-MM-DD'
    const formattedDate = moment(clickInfo.event.extendedProps.date).format(
      "YYYY-MM-DD",
    );

    // Fetch appointment details when an event is clicked
    fetchAppointmentDetails(formattedDate);
  };

  // Drawer close handler
  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedEvent(null);
    setAppointmentDetails(null); // Clear appointment details
    setEditingKey(null);
  };

  // Edit event handler (opens the edit drawer)
  const handleEditEvent = () => {
    console.log("Edit event clicked", selectedEvent);

    // Check if appointmentDetails and bookedTimeRange are available
    if (
      appointmentDetails &&
      appointmentDetails.bookedTimeRange &&
      appointmentDetails.bookedTimeRange.length > 0
    ) {
      const startTime = appointmentDetails.bookedTimeRange[0].start;
      const endTime = appointmentDetails.bookedTimeRange[0].end;

      // Initialize the edit form with the current event times
      setEditStartTime(
        moment({
          hour: startTime.hour,
          minute: startTime.minute,
        }),
      );
      setEditEndTime(
        moment({
          hour: endTime.hour,
          minute: endTime.minute,
        }),
      );
    } else {
      console.warn(
        "Appointment details or bookedTimeRange is missing.  Cannot initialize edit form.",
      );
      // Optionally, show an error message to the user
      // message.error("Could not load appointment details for editing.");
      return; // Prevent the edit drawer from opening with invalid data
    }

    setIsDrawerVisible(false); // Close the event details drawer
    setIsEditDrawerVisible(true); // Open the edit drawer
  };

  // Handle time change in the edit drawer
  const handleEditTimeChange = (field, time, timeString) => {
    if (field === "start") {
      setEditStartTime(time);
    } else {
      setEditEndTime(time);
    }
  };

  // Save the edited event
  const handleSaveEdit = () => {
    console.log(
      "Saving edited event",
      selectedEvent,
      editStartTime,
      editEndTime,
    );

    // You would implement your save logic here, which might involve:
    // 1. Calling an API to update the availability slot in your backend
    // 2. Updating the apptEvents state to reflect the changes in the calendar

    // Example (replace with your actual save logic):
    // dispatch(updateAvailability({
    //   ...selectedEvent.extendedProps.slotData,
    //   start: {
    //     hour: editStartTime.hour(),
    //     minute: editStartTime.minute(),
    //   },
    //   end: {
    //     hour: editEndTime.hour(),
    //     minute: editEndTime.minute(),
    //   },
    // }));

    // Close the edit drawer
    setIsEditDrawerVisible(false);
    setSelectedEvent(null);
  };

  // Cancel event handler (placeholder)
  const handleCancelEvent = () => {
    setIsDrawerVisible(false);
    setSelectedEvent(null);
    setAppointmentDetails(null); // Clear appointment details
    setEditingKey(null);
    // Implement your cancel logic here, which might involve removing the event
    // from the calendar and updating the availability in your backend.
  };

  // Close the edit drawer
  const handleEditDrawerClose = () => {
    setIsEditDrawerVisible(false);
    setSelectedEvent(null);
  };

  // Function to handle enabling the editing state for a specific time range
  const startEditing = (key) => {
    setEditingKey(key);
  };
  // Function to handle saving the edited time range (You'll need to implement the actual save logic)
  // const saveEdit = (key) => {
  //   console.log("Save edit called for key:", key);
  //   setEditingKey(null); // Close the edit mode
  //   // Implement your save logic here (API call, state update, etc.)
  // };

  // // Function to handle canceling the edit
  // const cancelEdit = () => {
  //   setEditingKey(null);
  // };

  // Function to handle time change in the time pickers
  const onTimeChange = (time, timeString, field, index) => {
    console.log("Time changed:", time, timeString, field, index);
    // Implement your logic to update the state with the new time
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
        eventClick={handleEventClick} // Add event click handler
      />

      <Drawer
        title={selectedEvent?.title}
        placement="right"
        width={500} 
        onClose={handleDrawerClose}
        open={isDrawerVisible}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancelEvent} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleEditEvent}
              style={{
                background: "#00ADEF",
                padding: "10px 20px",
              }}
            >
             Save
            </Button>
          </div>
        }
       
      >
        {selectedEvent && (
     <div>
     {appointmentDetails?.bookedTimeRange?.map((timeRange, index) => {
       const key = `timeRange-${index}`; // Unique key for each time range
       return (
         <div key={key} style={{ marginBottom: "20px" }}>
           <Divider orientation="left">Time Range {index + 1}</Divider>
           {editingKey === key ? (
             <div
               style={{
                 display: "flex",
                 alignItems: "center",
                 gap: "20px",
                 flexWrap: "wrap",
               }}
             >
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <Text strong>Start Time:</Text>
                 <TimePicker
                   defaultValue={
                     timeRange?.start
                       ? moment({
                           hour: timeRange?.start?.hour,
                           minute: timeRange?.start?.minute,
                         })
                       : null
                   }
                   format="HH:mm"
                   onChange={(time, timeString) =>
                     onTimeChange(time, timeString, "start", index)
                   }
                 />
               </div>
   
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <Text strong>End Time:</Text>
                 <TimePicker
                   defaultValue={
                     timeRange?.end
                       ? moment({
                           hour: timeRange?.end?.hour,
                           minute: timeRange?.end?.minute,
                         })
                       : null
                   }
                   format="HH:mm"
                   onChange={(time, timeString) =>
                     onTimeChange(time, timeString, "end", index)
                   }
                 />
               </div>
   
               {/* <Space>
                 <Button size="small" onClick={() => saveEdit(key)} type="primary">
                   Save
                 </Button>
                 <Button size="small" onClick={cancelEdit}>Cancel</Button>
               </Space> */}
             </div>
           ) : (
             <div
               style={{
                 display: "flex",
                 alignItems: "center",
                 gap: "20px",
                 flexWrap: "wrap",
               }}
             >
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <Text strong>Start Time:</Text>
                 <Text>
                   {timeRange?.start
                     ? moment({
                         hour: timeRange?.start?.hour,
                         minute: timeRange?.start?.minute,
                       }).format("HH:mm")
                     : "N/A"}
                 </Text>
               </div>
   
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                 <Text strong>End Time:</Text>
                 <Text>
                   {timeRange?.end
                     ? moment({
                         hour: timeRange?.end?.hour,
                         minute: timeRange?.end?.minute,
                       }).format("HH:mm")
                     : "N/A"}
                 </Text>
               </div>
   
               <Button size="small" onClick={() => startEditing(key)}>
                 Edit
               </Button>
             </div>
           )}
         </div>
       );
     })}
   </div>
   
       
        )}
      </Drawer>

      <Drawer
        title="Edit Event Time"
        placement="right"
        width={500} // Adjust width as needed
        onClose={handleEditDrawerClose}
        open={isEditDrawerVisible}
        
        footer={
          <Space>
            <Button onClick={handleEditDrawerClose}>Cancel</Button>
            <Button type="primary" onClick={handleSaveEdit}  
              style={{
                background: "#00ADEF",
                padding: "10px 20px",
              }}
            >
              Save
            </Button>
          </Space>
        }
      >
        <p>Select new start and end times:</p>
        <TimePicker
          style={{ width: "100%", marginBottom: "16px" }}
          value={editStartTime}
          onChange={(time, timeString) =>
            handleEditTimeChange("start", time, timeString)
          }
          format="HH:mm"
          use12Hours={false}
        />
        <TimePicker
          style={{ width: "100%" }}
          value={editEndTime}
          onChange={(time, timeString) =>
            handleEditTimeChange("end", time, timeString)
          }
          format="HH:mm"
          use12Hours={false}
        />
      </Drawer>
    </>
  );
};

export default Calendar;
