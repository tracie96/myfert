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

import { addAppointment } from "../../redux/patientSlice";
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

const PatientCalendar = ({ selectedProviders }) => {
  const calendarRef = useRef(null);
  const roleColorMap = useMemo(
    () => ({
      0: "grey",
      2: "green",
      3: "blue",
      4: "purple",
      9: "lilac",
      6: "cyan",
    }),
    []
  );
  
  const [apptEvents, setApptEvents] = useState([]);
  const {
    availableDoctors,
    doctorAvailability,
    appointmentList,
    loading,
    error,
  } = useSelector((state) => state?.doctor);

  const [newAppointmentList, setAppointmentList] = useState([]);
console.log({newAppointmentList})
  useEffect(() => {
    setAppointmentList(appointmentList);
  }, [appointmentList]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([
    16, 17, 18, 19, 20, 24,
  ]);
  console.log(loading, error, setUnavailableDates);
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
    }
  };

  const updateCalendarEvents = useCallback(
    (availability, startYear, startMonth) => {
      const events = availability.flatMap((slot) => {
        const backgroundColor = roleColorMap[slot.roleId] || "gray";
        return slot.free
          ? [
              {
                id: `${slot.date}_${slot.roleId}`,
                title: slot.roleName,
                start: new Date(slot.date),
                end: new Date(slot.date),
                classNames: `fc-event-${backgroundColor}`,
                textColor: "white",
              },
            ]
          : [
              {
                id: `${slot.date}_${slot.roleId}`,
                title: `Booked`,
                start: new Date(slot.date),
                end: new Date(slot.date),
                classNames: "fc-event-green",
                textColor: "white",
              },
            ];
      });
  
      setApptEvents((prevEvents) => {
        if (JSON.stringify(prevEvents) !== JSON.stringify(events)) {
          return events;
        }
        return prevEvents;
      });
    },
    [roleColorMap, setApptEvents] 
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
        selectable={true}
        datesSet={(dateInfo) => handleDateRangeChange(dateInfo)}

        eventClick={(selectInfo) => {
          console.log({selectInfo})
          const formattedDate = moment(selectInfo.event.startStr).utc().add(1, 'day').format("YYYY-MM-DD");
          addCalendarAppointment.resetForm();
          showDrawer();
          setSelectedDate(formattedDate);
        }}
        selectAllow={(selectInfo) => {

          const formattedDate = moment(selectInfo.startStr).utc().add(1, 'day').format("YYYY-MM-DD");
          addCalendarAppointment.resetForm();
          showDrawer();
          setSelectedDate(formattedDate)
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
                  ? new Date(selectedDate).toDateString()
                  : "No date selected"}
              </span>{" "}
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
                style={{ marginBottom: 16 }}
                onClick={() => handleClinicianClick(clinician)}
              >
                <Col
                  span={18}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />

                  <Link
                    to="#"
                    style={{ marginLeft: "12px", whiteSpace: "nowrap" }}
                  >
                    {clinician.name}
                  </Link>
                </Col>
                <Col span={4}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <EnvironmentOutlined style={{ marginRight: 30 }} />
                    Virtual
                  </div>
                </Col>
                <Col span={2} style={{ textAlign: "right" }}>
                  <RightOutlined style={{ color: "#08c" }} />
                </Col>
              </Row>
            ))}
            {availableDoctors?.length === 0 && "No clinicians available"}
          </div>
        </div>
      </Drawer>
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
                <span className="ml-2">
                  {selectedDate
                    ? new Date(selectedDate).toDateString()
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
                              <Text strong>Appointment ID:</Text>{" "}
                              {appointment.appointmentId}
                              <br />
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
