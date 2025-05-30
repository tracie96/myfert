import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button, Avatar, Modal, Col, Row } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import moment from "moment-timezone";
import { gapi } from "gapi-script";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { addAppointment, getUpcomingAppointments } from "../../redux/patientSlice";
import {
  CalendarTwoTone,
  EnvironmentOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getAvailableDoctorsForDate,
  getDoctorAvailabilityForDay,
  getPatientAvailability,
  setPatientAppointment,
} from "../../redux/doctorSlice";
import { List, Card, Typography, Tag, message } from "antd";
import "./PatientCalendar.css";

const { Text } = Typography;
const localizer = momentLocalizer(moment);
const CLIENT_ID_MAIL = process.env.REACT_APP_MAIL_CLIENT_ID;
const API_KEY_MAIL = process.env.REACT_APP_MAIL_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

const PatientCalendar = ({ selectedProviders }) => {
  const calendarRef = useRef(null);
  const roleColorMap = useMemo(
    () => ({
      0: "grey",
      2: "green",
      3: "blue",
      4: "purple",
      9: "lilac",
      8: "brown",
    }),
    []
  );

const [events, setEvents] = useState([]);
useEffect(() => {
  function start() {
    gapi.client
      .init({
        apiKey: API_KEY_MAIL,
        clientId: CLIENT_ID_MAIL,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance();

        // Optional: auto sign-in if already authenticated
        if (authInstance.isSignedIn.get()) {
          listUpcomingEvents();
        }

        // Listen to sign-in state changes
        authInstance.isSignedIn.listen((isSignedIn) => {
          if (isSignedIn) {
            listUpcomingEvents();
          }
        });
      });
  }

  gapi.load('client:auth2', start);
}, []);


const handleAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    createEvent();
  });
};

const createEvent = () => {
  const event = {
   // summary: 'availability slot Doctor 2025',
    location: '800 Howard St., San Francisco, CA 94103',
    description: 'A chance to hear more about Google\'s developer products.',
    start: {
      dateTime: '2025-04-28T09:00:00-07:00',
      timeZone: 'America/Los_Angeles'
    },
    end: {
      dateTime: '2025-04-28T17:00:00-07:00',
      timeZone: 'America/Los_Angeles'
    },
    recurrence: [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    attendees: [
      { email: 'lpage@example.com' },
      { email: 'sbrin@example.com' }
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 },  // 24 hours
        { method: 'popup', minutes: 8 }
      ]
    }
  };

  const request = gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  request.execute(event => {
    console.log('Event created:', event);
    listUpcomingEvents();
    // console.log('Event created:', event);
    // listUpcomingEvents(); // Refresh the calendar on the same page
  });
};



const listUpcomingEvents = () => {
  gapi.client.calendar.events
    .list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    })
    .then((response) => {
      const googleEvents = response.result.items;

      const formattedEvents = googleEvents.map((event) => {
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);

        return {
          title: event.summary || '(No Title)',
          start,
          end,
        };
      });

      setEvents(formattedEvents);
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
};

  const [apptEvents, setApptEvents] = useState([]);
  const {
    availableDoctors,
    doctorAvailability,
    appointmentList,
    loading,
    error,
  } = useSelector((state) => state?.doctor);
  const [selectedRole, setSelectedRole] = useState("");
  const [doctorList, setAvailableDoctors] = useState(availableDoctors);
  const [newAppointmentList, setAppointmentList] = useState([]);
  console.log({ newAppointmentList,doctorList });
  useEffect(() => {
    setAppointmentList(appointmentList);
  }, [appointmentList]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([
    16, 17, 18, 19, 20, 24,
  ]);
  console.log(loading, error, setUnavailableDates,selectedRole);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedDate || selectedProviders) {
      dispatch(getAvailableDoctorsForDate(selectedDate));
    }
  }, [selectedDate, selectedProviders, dispatch]);

  useEffect(() => {
    if (selectedProviders) {
      dispatch(getPatientAvailability({ month: 12, year: 2024 }));
    }
  }, [selectedProviders, dispatch]);

  useEffect(() => {
    if (selectedDate) {
      dispatch(getAvailableDoctorsForDate(selectedDate)).then((response) => {
        if (getAvailableDoctorsForDate.fulfilled.match(response)) {
          console.log("Fetched doctor availability:", response.payload);
        } else {
          console.error(
            "Failed to fetch doctor availability:",
            response.error.message
          );
        }
      });
    }
  }, [selectedDate, dispatch]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState(null);
  const handleClinicianClick = (clinician) => {
    setSelectedClinician(clinician);
    dispatch(
      getDoctorAvailabilityForDay({
        doctorId: clinician.id,
        date: selectedDate,
      })
    );
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedClinician(null);
  };
  const showDrawer = () => {
    if (unavailableDates.includes(selectedDate)) {
      return;
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  const prevDateRange = useRef(null);

  const handleDateRangeChange = (rangeInfo) => {
    const { start } = rangeInfo;
    const startMonth = start.getMonth() + 1;
    const startYear = start.getFullYear();

    const newDateRange = `${startYear}-${startMonth}`;
    if (prevDateRange.current !== newDateRange) {
      prevDateRange.current = newDateRange;

      fetchAndSetAvailability(startYear, startMonth);
      getUpcomingAppointments();
    }
  };

  const updateCalendarEvents = useCallback(
    (availability, startYear, startMonth) => {
      const uniqueEvents = new Map();
      console.log({uniqueEvents})
      // Group slots by date and role
      const groupedSlots = availability.reduce((acc, slot) => {
        if (!slot || !slot.roleName || !slot.date) {
          console.error('Invalid slot data:', slot);
          return acc;
        }

        const key = `${slot.date}_${slot.roleId}`;
        if (!acc[key]) {
          acc[key] = {
            date: slot.date,
            roleId: slot.roleId,
            roleName: slot.roleName,
            slots: []
          };
        }
        acc[key].slots.push(slot);
        return acc;
      }, {});

      const events = Object.values(groupedSlots).flatMap(group => {
        // Check if this provider type is selected
        const roleToProviderMap = {
          3: 'doctor',
          5: 'nurse',
          6: 'pharmacistClinician',
          7: 'nutritionalPractitioner',
          8: 'fertilitySupportPractitioner',
          9: 'fertilityEducator'
        };
        const providerType = roleToProviderMap[group.roleId];
        
        // If no providers are selected, show all events
        // If providers are selected, only show events for selected providers
        if (selectedProviders && Object.values(selectedProviders).some(value => value)) {
          if (!selectedProviders[providerType]) {
            return []; // Skip events for unselected providers
          }
        }

        // Check if all slots for this date and role are free: false
        const allSlotsBooked = group.slots.every(slot => !slot.free);
        const backgroundColor = roleColorMap[group.roleId] || "gray";

        return [
          {
            id: `${group.date}_${group.roleId}`,
            title: allSlotsBooked ? 'Booked' : group.roleName,
            start: new Date(group.date),
            end: new Date(group.date),
            classNames: allSlotsBooked ? 'fc-event-green' : `fc-event-${backgroundColor}`,
            textColor: "white",
          }
        ];
      });

      // Log the generated events to check what is being returned
      console.log('Generated events:', events);

      setApptEvents((prevEvents) => {
        // Only update events if they are different from the previous state
        if (JSON.stringify(prevEvents) !== JSON.stringify(events)) {
          return events;
        }
        return prevEvents;
      });
    },
    [roleColorMap, setApptEvents, selectedProviders]
  );
  
  
  
  
  const fetchAndSetAvailability = useCallback(
    async (startYear, startMonth) => {
      try {
        const response = await dispatch(
          getPatientAvailability({ month: startMonth, year: startYear })
        );
        if (getPatientAvailability.fulfilled.match(response)) {
          const availability = response.payload;
          updateCalendarEvents(availability, startYear, startMonth);
        } else {
          console.error("Failed to fetch availability");
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    },
    [dispatch, updateCalendarEvents]
  );
  const handleAppointmentClick = (appointment) => {
    console.log("Appointment CLicked", appointment);
    const { appointmentId } = appointment;
    dispatch(setPatientAppointment(appointmentId)).then((result) => {
      if (setPatientAppointment.fulfilled.match(result)) {
        message.success("Appointment successfully set!");
        setIsModalVisible(false);
        
        const currentDate = new Date(selectedDate);
        const startMonth = currentDate.getMonth() + 1;
        const startYear = currentDate.getFullYear();
        fetchAndSetAvailability(startYear, startMonth);
        dispatch(getUpcomingAppointments());
        setOpen(false);
      } else {
        message.error(result.error.message || "Failed to set appointment");
      }
    });
  };


  const formatTime = (hour, minute) => {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${formattedMinute} ${period}`;
  };
  const addAppointmentValidationSchema = Yup.object().shape({
    title: Yup.string().min(3).required("Title is required"),
    description: Yup.string().min(10).required("Description is required"),
    appointmentStartDate: Yup.date()
      .required("Appointment Date is required")
      .nullable(),
    appointmentStartTime: Yup.string().required("Appointment Time is required"),
    doctorId: Yup.string().required("User must be selected"),
  });

  const addCalendarAppointment = useFormik({
    initialValues: {
      title: "",
      description: "",
      appointmentStartDate: "",
      appointmentStartTime: "",
      doctorId: "",
      patientId: "",
    },
    validationSchema: addAppointmentValidationSchema,
    onSubmit: async (values) => {
      const response = await dispatch(addAppointment(values));
      if (response?.payload?.appointmentId) {
        calendarRef.current.getApi().addEvent({
          id: response.payload.appointmentId,
          title: response.payload.title,
          start: response.payload.start,
          end: response.payload.end,
          extendedProps: { ...response.payload },
        });
      }
    },
  });

  const ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    if (authCode) {
      fetchAccessToken(authCode);
    }
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    console.log(authCode, "authcode");
    if (authCode) {
      fetchAccessToken(authCode);
    }
  }, []);

  const fetchAccessToken = async (authCode) => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;

    try {
      const response = await axios.post(
        ZOHO_TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: authCode,
        })
      );

      const data = response.data;
      localStorage.setItem("zoho_access_token", data.access_token);
      localStorage.setItem("zoho_refresh_token", data.refresh_token); // If available
    } catch (error) {
      console.error(
        "Error exchanging authorization code for access token:",
        error
      );
    }
  };

  // const handleJoinCall = async (appointmentId) => {
  //   localStorage.setItem("currentStep",3);

  //   alert(`Joining call`);
  //   console.log(`Joining call for appointment ID: ${appointmentId}`);

  //   const token = localStorage.getItem("zoho_access_token");

  //   if (!token) {
  //     console.log("Access token not found, redirecting for OAuth...");
  //     redirectToZohoAuth();
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `${ZOHO_MEETING_API_URL}/${appointmentId}`,
  //       {
  //         headers: {
  //           Authorization: `Zoho-oauthtoken ${token}`,
  //         },
  //       }
  //     );

  //     const meetingData = response.data;
  //     const joinUrl = meetingData.join_url;
  //     window.open(joinUrl, "_blank");
  //   } catch (error) {
  //     console.error("Error joining the meeting:", error);
  //     alert("Failed to join the meeting. Please try again.");
  //   }
  // };

  // const handleDeleteAppointment = (appointmentId) => {
  //   const updatedAppointmentList = newAppointmentList?.availability?.map(
  //     (slot) => ({
  //       ...slot,
  //       checkAvailabilities: slot.checkAvailabilities.filter(
  //         (availabilitySlot) => availabilitySlot.appointmentId !== appointmentId
  //       ),
  //     })
  //   );

  //   dispatch(cancelPatientAppointment(appointmentId)).then((result) => {
  //     if (result.type.endsWith("fulfilled")) {
  //       message.success("Appointment canceled successfully");
  //     } else {
  //       message.error("Failed to cancel appointment");
  //     }
  //   });
  //   fetchAndSetAvailability(2024, 9);
  //   setAppointmentList(updatedAppointmentList);
  // };

  useEffect(() => {
    if (selectedProviders) {
      dispatch(getPatientAvailability({ month: 12, year: 2024 }));
    }
  }, [selectedProviders, dispatch]);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        height={isMobile ? 464 : '100vh'}
        initialView="dayGridMonth"
        events={apptEvents}
        datesSet={(dateInfo) => handleDateRangeChange(dateInfo)}
        eventClick={(selectInfo) => {
          const formattedDate = moment(selectInfo.event.startStr)
            .local()
            .format("YYYY-MM-DD");
            const selectedRole = selectInfo.event.title;
            console.log({selectedRole})

            const filteredClinicians = availableDoctors.filter(
              (clinician) => clinician.roleName === selectedRole
            );
            setSelectedRole(selectedRole);
            setAvailableDoctors(filteredClinicians); 
          addCalendarAppointment.resetForm();
          showDrawer();
          setSelectedDate(formattedDate);
        }}

        selectAllow={(selectInfo) => {
          const formattedDate = moment(selectInfo.startStr)
            .local()
            .format("YYYY-MM-DD");
          addCalendarAppointment.resetForm();
          showDrawer();
          setSelectedDate(formattedDate);
        }}
        select={(selectInfo) => {
          addCalendarAppointment.resetForm();
      
          const startStr = selectInfo.startStr.split("T")[0];
          addCalendarAppointment.setFieldValue(
            "appointmentStartDate",
            startStr
          );
        }}
        validRange={{
          start: new Date().toISOString().split("T")[0],
        }}
      />
      <Drawer
        title="Booking"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
      >
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>Selected Date</p>
          <Row align="">
            <Col>
              <CalendarTwoTone style={{ fontSize: 24, marginRight: 50 }} />
              <span>
                {selectedDate
                  ? moment(selectedDate).local().format("dddd, MMMM Do YYYY")
                  : "No date selected"}
              </span>
            </Col>
          </Row>
        </div>
        {/* <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}> Select a time</p>
        </div>
        <div style={{ margin: "50px 0" }}>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>My Bookings</p>
          <div style={{ margin: "50px 0" }}>
            {selectedDay &&
              newAppointmentList
                ?.filter(
                  (appointment) =>
                    new Date(appointment.date)?.toISOString().split("T")[0] ===
                    new Date(selectedDay)?.toISOString().split("T")[0] &&
                    appointment?.roleId
                )
                .map((appointment, idx) => {
                  const timeRange = appointment.free ? "Available" : "Booked";

                  const tagTitle = `${timeRange}`;

                  return (
                    <div
                      key={`${appointment.date}-${idx}`}
                      style={{ marginBottom: "10px" }}
                    >
                      <Tag
                        key={`${appointment.date}-${idx}`}
                        color={appointment.free ? "green" : "green"}
                        style={{
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: `1px solid ${appointment.free ? "#52c41a" : "#52c41a"
                            }`,
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => handleAppointmentClick(appointment)}
                        closable
                        onClose={() =>
                          handleDeleteAppointment(appointment.date)
                        }
                      >
                        {tagTitle}
                      </Tag>
                      {!appointment.free && (
                        <Tag
                          color="blue"
                          style={{
                            cursor: "pointer",
                            borderRadius: "4px",
                            border: `1px solid blue`,
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => handleJoinCall(appointment.id)}
                        >
                          Join Call
                        </Tag>
                      )}
                    </div>
                  );
                })}
          </div>
        </div> */}

        <div style={{ margin: "50px 0" }}>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            Select a clinician
          </p>
          <p style={{ color: "red" }}>
            Please note that once you complete your first appointment with your
            selected <strong>clinician</strong>, all follow-up appointments will
            be with the same <strong>clinician</strong> to ensure continuity of
            care.
          </p>
          <div style={{ margin: "50px 0" }}>
            {availableDoctors?.map((clinician, index) => (
              <Row
                key={index}
                align="middle"
                justify="space-between"
                style={{ marginBottom: 16, padding: "10px 20px",borderRadius: "8px" }}
                onClick={() => handleClinicianClick(clinician)}
              >
                <Col
                  span={12}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  <Link
                    to="#"
                    style={{ whiteSpace: "nowrap", fontSize: "16px", fontWeight: "500" }}
                  >
                    {clinician.name}
                  </Link>
                </Col>
                <Col span={4} style={{ textAlign: "" }}>
                  <Link
                    to="#"
                    style={{ color: "#000", fontSize: "14px", fontWeight: "400" }}
                  >
                    {clinician?.roleName}
                  </Link>
                </Col>
                <Col span={4} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <EnvironmentOutlined />
                  <span style={{ fontSize: "14px", fontWeight: "400" }}>Virtual</span>
                </Col>
                <Col span={2} style={{ textAlign: "right" }}>
                  <RightOutlined style={{ color: "#08c" }} />
                </Col>
              </Row>
            ))}
            {availableDoctors?.length === 0 && <div style={{ textAlign: "center", marginTop: "20px" }}>No clinicians available</div>}
          </div>

        </div>
      </Drawer >
      <Modal
        title={
          <p
            style={{ color: "#00ADEF", fontWeight: "bold", textAlign: "left" }}
          >
            Select Appointment Slot
          </p>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
       <div>
       <button onClick={handleAuthClick}>Authorize Google Calendar</button>
       </div>
      <div>

    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600, margin: '20px' }}
    />
      <div>
    </div>
    </div>
        {selectedClinician && (
          <>
            <Row gutter={0} style={{ marginBottom: 16 }}>
              <Col span={18} style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  size={20}
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
                <Col span={22} className="ml-2">
                  {selectedClinician.name}
                </Col>
              </Col>
            </Row>
            <Row gutter={0} style={{ marginBottom: 8 }}>
              <Col span={18} style={{ display: "flex", alignItems: "center" }}>
                <CalendarTwoTone style={{ fontSize: "20px" }} />
                <span>
                  {selectedDate
                    ? moment(selectedDate).local().format("dddd, MMMM Do YYYY")
                    : "No date selected"}
                </span>
              </Col>
            </Row>

            <Row gutter={0} style={{ marginBottom: 8 }}>
              {Object.keys(doctorAvailability).length > 0 ? (
                Object.keys(doctorAvailability).map((doctorId) => (
                  <Col
                    span={24}
                    key={doctorId}
                    style={{ marginBottom: "20px" }}
                  >
                    <Card
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <List
                        dataSource={doctorAvailability[doctorId].filter(
                          (appointment) => appointment.occupied === 0
                        )}
                        renderItem={(appointment) => (
                          <List.Item
                            style={{
                              cursor: "pointer",
                              display: "block",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              border: "1px solid #f0f0f0",
                              borderRadius: "8px",
                              padding: "16px",
                              marginBottom: "12px",
                              transition: "background-color 0.3s ease",
                              backgroundColor: "#fff",
                              hover: { backgroundColor: "#fafafa" },
                            }}
                          >
                            <div>
                             
                              <Text strong>Time:</Text>{" "}
                              {`${formatTime(
                                appointment.start.hour,
                                appointment.start.minute
                              )} - ${formatTime(
                                appointment.end.hour,
                                appointment.end.minute
                              )}`}
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <Text strong>Select Time Slot:</Text>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  marginTop: "8px",
                                  flexWrap: "wrap",
                                }}
                              >

                                <Tag
                                  color="blue"
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    border: "1px solid #1890ff",
                                    transition: "all 0.3s ease",
                                  }}
                                  onClick={() =>
                                    handleAppointmentClick(appointment)
                                  }
                                >
                                  {`${formatTime(
                                    appointment.start.hour,
                                    appointment.start.minute
                                  )} - ${formatTime(
                                    appointment.end.hour,
                                    appointment.end.minute
                                  )}`}
                                </Tag>
                              </div>
                            </div>
                          </List.Item>
                        )}
                        locale={{ emptyText: "No available time slot" }}
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>No availability found</p>
                </Col>
              )}
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};

export default PatientCalendar;
