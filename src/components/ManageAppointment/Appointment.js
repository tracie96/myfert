import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { Drawer, Button, Checkbox, Row, Col, Space, Avatar, TimePicker } from "antd";
import moment from "moment";
import {
  MinusCircleOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DownOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  UpOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { submitAvailability, getAvailability } from "../redux/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

const Appointment = () => {
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [drawerCurrentWeek, setDrawerCurrentWeek] = useState(moment());
  const [drawerKey, setDrawerKey] = useState(0);
  const [isDrawer, setIsDrawer] = useState(false);
  const [availability, setAvailability] = useState({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const maxSlots = 5;
  const [viewAll, setViewAll] = useState(false);
  const handleViewAll = () => {
    setViewAll(!viewAll);
  };
  const toggleMore = (index) => {
    setMoreVisible(prevState =>
      prevState.map((visible, i) => (i === index ? !visible : visible))
    );
  };
  const showDrawer = () => {
    setDrawerKey((prevKey) => prevKey + 1);
    setDrawerCurrentWeek(moment());
    setOpen(true);
  };
  const [refreshCalendar, setRefreshCalendar] = useState(0);
  const dispatch = useDispatch();
  const { appointmentList = [] } = useSelector((state) => state?.doctor);
  
  const filteredAppointments = appointmentList.filter(
    (app) => app.roleId === 0
  );
  
  const visibleAppointments = viewAll
    ? filteredAppointments
    : filteredAppointments.slice(0, 2);
  const [moreVisible, setMoreVisible] = useState(filteredAppointments.map(() => true));
  const onClose = () => {
    setAvailability({
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    });
    setOpen(false);
    setIsDrawer(false);
  };
  const addTimeSlot = (day) => {
    if (availability[day].length < maxSlots) {
      setAvailability((prev) => ({
        ...prev,
        [day]: [...prev[day], { startTime: "", endTime: "" }],
      }));
    }
  };

  const removeTimeSlot = (day, index) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, idx) => idx !== index),
    }));
  };

  const handleTimeChange = (day, index, field, value) => {

    const updatedSlots = availability[day].map((slot, idx) =>
      idx === index ? { ...slot, [field]: value } : slot,
    );
    setAvailability((prev) => ({
      ...prev,
      [day]: updatedSlots,
    }));
  };

  const handleSubmitAvailability = () => {
    let startDate;
    let endDate;
    startDate = drawerCurrentWeek.startOf("week").format("YYYY-MM-DD");
    endDate = drawerCurrentWeek.endOf("week").format("YYYY-MM-DD");

    const formattedAvailability = Object.entries(availability).map(
      ([day, slots], index) => ({
        dayOfWeek: index,
        availabilityPeriod: slots.map((slot) => ({
          start: {
            hour: moment(slot.startTime, "HH:mm").hour(),
            minute: moment(slot.startTime, "HH:mm").minute(),
          },
          end: {
            hour: moment(slot.endTime, "HH:mm").hour(),
            minute: moment(slot.endTime, "HH:mm").minute(),
          },
        })),
      }),
    );

    const payload = {
      startDate,
      endDate,
      availability: formattedAvailability,
    };

    dispatch(submitAvailability(payload))
      .then((response) => {
        if (submitAvailability.fulfilled.match(response)) {
          // If submission was successful, fetch the updated availability with the same date range
          return dispatch(getAvailability({ startDate, endDate }));
        }
      })
      .then(() => {
        // Update the calendar's current week to match the drawer's week
        setCurrentWeek(moment(drawerCurrentWeek));
        // Trigger calendar refresh
        setRefreshCalendar(prev => prev + 1);
        onClose();
      })
      .catch((error) => {
        console.error("Error submitting or fetching availability:", error);
      });
  };

  const isPastDay = (day) => {
    const currentDayIndex = moment().day();
    const selectedDayIndex = moment().day(day).day();
    const isCurrentWeek = moment(drawerCurrentWeek).isSame(moment(), "week");

    return isCurrentWeek && selectedDayIndex < currentDayIndex;
  };
  const disableEndTime = (startTime) => {
    if (!startTime) return {};

    const startHour = moment(startTime, "HH:mm").hour();
    const startMinute = moment(startTime, "HH:mm").minute();

    return {
      disabledHours: () => Array.from({ length: startHour }, (_, i) => i), 
      disabledMinutes: (selectedHour) =>
        selectedHour === startHour
          ? Array.from({ length: startMinute }, (_, i) => i)
          : [],
    };
  };
  const handlePreviousWeek = () => {
    const prevWeek = moment(drawerCurrentWeek).subtract(1, "weeks");
    setDrawerCurrentWeek(prevWeek);
    
    // Fetch availability for the previous week
    const startDate = prevWeek.startOf("week").format("YYYY-MM-DD");
    const endDate = prevWeek.endOf("week").format("YYYY-MM-DD");
    dispatch(getAvailability({ startDate, endDate }));
  };

  const handleNextWeek = () => {
    const nextWeek = moment(drawerCurrentWeek).add(1, "weeks");
    setDrawerCurrentWeek(nextWeek);
    
    // Fetch availability for the next week
    const startDate = nextWeek.startOf("week").format("YYYY-MM-DD");
    const endDate = nextWeek.endOf("week").format("YYYY-MM-DD");
    dispatch(getAvailability({ startDate, endDate }));
  };

  // Add useEffect to fetch initial availability when drawer opens
  useEffect(() => {
    if (open) {
      const startDate = drawerCurrentWeek.startOf("week").format("YYYY-MM-DD");
      const endDate = drawerCurrentWeek.endOf("week").format("YYYY-MM-DD");
      dispatch(getAvailability({ startDate, endDate }));
    }
  }, [open, drawerCurrentWeek, dispatch]);

  // Add Today button handler
  const handleTodayClick = () => {
    const today = moment();
    setDrawerCurrentWeek(today);
    
    // Fetch availability for the current week
    const startDate = today.startOf("week").format("YYYY-MM-DD");
    const endDate = today.endOf("week").format("YYYY-MM-DD");
    dispatch(getAvailability({ startDate, endDate }));
  };

  // Function to get existing appointments for a specific day
  const getExistingAppointmentsForDay = (day) => {
    const dayIndex = moment().day(day).day(); // Get day index (0-6)
    
    // Find appointments for the drawer's selected week
    return filteredAppointments.filter(appointment => {
      const appointmentDate = moment(appointment.date);
      const appointmentDayIndex = appointmentDate.day();
      
      // Check if the appointment is in the drawer's selected week
      return appointmentDayIndex === dayIndex && 
             appointmentDate.isSame(drawerCurrentWeek, 'week');
    });
  };

  // Function to format time from hour and minute objects
  const formatTimeFromObject = (timeObj) => {
    if (!timeObj) return '';
    const hour = timeObj.hour.toString().padStart(2, '0');
    const minute = timeObj.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12 mb-4" >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: isMobile ? '30px' : '10px'
            }}
          >
            <Button
              type="primary"
              onClick={showDrawer}
              style={{
                zIndex: 10,
                background: "#00ADEF",
                padding: 20,
                fontSize: "14px",
              }}
            >
              Set Availability
            </Button>
          </div>
          <div className="appointment-calendar">
            <Calendar
              currentWeek={currentWeek}
              refreshTrigger={refreshCalendar}
              isDrawer={isDrawer}
            />
          </div>
        </div>
        <div className="col-lg-12 mb-4">
          <div className="card shadow mb-4">
            <div className="card-body">
            <div className="user" style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px", backgroundColor: "#fff" }}>
      <div className="form-group">
        <h3 style={{ color: "#333", marginBottom: "15px", fontWeight: "bold" }}>
          Upcoming Appointment
        </h3>
      </div>
      
      {filteredAppointments.length > 0 ? (
        <div>
          {visibleAppointments.map((appointment, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #e0e0e0",
                padding: "15px 0",
                fontSize: "14px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontWeight: "bold", color: "#333" }}>
                  <Avatar style={{ backgroundColor: "#1E90FF", marginRight: "8px" }} icon={<UserOutlined />} />
                  Patient Gullbringa
                </p>
                {moreVisible[index] ? (
                  <MoreOutlined style={{ fontSize: '18px', color: "#1E90FF", cursor: "pointer" }} onClick={() => toggleMore(index)} />
                ) : (
                  <Button type="link" onClick={() => toggleMore(index)} style={{ color: "#ff4d4f" }}>
                    Cancel
                  </Button>
                )}
              </div>

              <div style={{ color: "#666" }}>
                <p>
                  <CalendarOutlined style={{ marginRight: "8px" }} />
                  {new Date(appointment.date).toLocaleDateString("en-Us", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p>
                  <ClockCircleOutlined style={{ marginRight: "8px" }} />
                  {new Date(appointment.date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p>
                  <EnvironmentOutlined style={{ marginRight: "8px" }} />
                  Virtual or In-person
                </p>
              </div>

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Button type="primary" icon={<VideoCameraOutlined />} style={{ backgroundColor: "#1E90FF", border: "none", width: "100%", marginBottom: "8px" }}>
                  Join
                </Button>
                <p style={{ fontSize: "13px", color: "#888", margin: "5px 0 0" }}>
                  Ongoing Care Plan - Initial Care Team Appointment
                </p>
              </div>
            </div>
          ))}

          {filteredAppointments.length > 2 && (
            <div onClick={handleViewAll} style={{ color: "#1E90FF", textAlign: "center", marginTop: "15px", cursor: "pointer" }}>
              {viewAll ? <UpOutlined style={{ marginRight: "8px" }} /> : <DownOutlined style={{ marginRight: "8px" }} />}
              {viewAll ? "View Less" : "View All"}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#888", fontSize: "14px" }}>
          <p>You have no upcoming appointment.</p>
          <p>The earliest appointment you can schedule with your provider is:</p>
        </div>
      )}
    </div>
              <form className="user mt-4">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 font-weight-bold">
                    Recommended appointment schedule:
                  </label>
                  <p className="ml-1 text-sm" style={{ color: "black" }}>
                    Dependent on the patient's plan (Day 3 or ProSPr)
                  </p>
                </div>
              </form>
              <Drawer
                key={drawerKey}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#335CAD",
                        fontWeight: "bold",
                        fontSize: "16px",
                        fontFamily: "Montserrat, sans-serif"
                      }}
                    >
                      Set Availability
                    </h3>
                  </div>
                }
                placement="right"
                width={500}
                onClose={onClose}
                open={open}
                footer={
                  <div style={{ textAlign: "right", fontFamily: "Montserrat, sans-serif" }}>
                    <Button onClick={onClose} style={{ marginRight: 8, fontFamily: "Montserrat, sans-serif" }}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmitAvailability}
                      disabled={drawerCurrentWeek.isBefore(moment().startOf('week'))}
                      style={{
                        background: "#00ADEF",
                        padding: "10px 20px",
                        fontFamily: "Montserrat, sans-serif",
                        opacity: drawerCurrentWeek.isBefore(moment().startOf('week')) ? 0.5 : 1
                      }}
                    >
                      Set Availability
                    </Button>
                  </div>
                }
              >
                <Row
                  gutter={[16, 16]}
                  style={{ width: "100%", marginBottom: 16 }}
                >
                  <Col
                    span={24}
                    style={{
                      display: "block",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: "8px"
                      }}
                    >
                      <Button
                        type="link"
                        onClick={handlePreviousWeek}
                        icon={<LeftCircleTwoTone />}
                        style={{ fontSize: "20px" }}
                      />
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#335CAD",
                            fontFamily: "Montserrat, sans-serif"
                          }}
                        >
                          Week of {drawerCurrentWeek.startOf("week").format("MMMM D")} - {drawerCurrentWeek.endOf("week").format("MMMM D")}
                        </span>
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#5A5A5A",
                          fontFamily: "Montserrat, sans-serif"
                        }}>
                          {drawerCurrentWeek.startOf("week").format("YYYY")}
                        </span>
                      </div>
                      <Button
                        type="link"
                        onClick={handleNextWeek}
                        icon={<RightCircleTwoTone />}
                        style={{ fontSize: "20px" }}
                      />
                      <Button
                        type="link"
                        onClick={handleTodayClick}
                        style={{ 
                          marginLeft: "8px",
                          color: "#00ADEF",
                          fontFamily: "Montserrat, sans-serif"
                        }}
                      >
                        Today
                      </Button>
                    </div>
                  </Col>
                </Row>

                {drawerCurrentWeek.isBefore(moment().startOf('week')) && (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "16px",
                    backgroundColor: "#fff2f0",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    border: "1px solid #ffccc7"
                  }}>
                    <p style={{ 
                      color: "#ff4d4f",
                      margin: 0,
                      fontFamily: "Montserrat, sans-serif"
                    }}>
                      You cannot set availability for past weeks
                    </p>
                  </div>
                )}

                <label
                  style={{
                    fontWeight: "bold",
                    margin: "30px 0",
                    color: "#335CAD",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                >
                  Availability
                </label>

                <Row style={{ marginBottom: 24 }}>
                  <Col span={24}>
                    <Checkbox style={{ fontSize: "14px", fontFamily: "Montserrat, sans-serif" }}>
                      Weekly recurrence
                    </Checkbox>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    {Object.keys(availability).map((day) => {
                      const existingAppointments = getExistingAppointmentsForDay(day);
                      
                      return (
                        <Row key={day} style={{ marginBottom: 8 }}>
                          <Col span={8}>
                            <strong style={{ fontFamily: "Montserrat, sans-serif" }}>{day}</strong>
                          </Col>
                          <Col
                            span={16}
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {existingAppointments.length > 0 && (
                              <div style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: "12px", color: "#666", marginBottom: 4, fontFamily: "Montserrat, sans-serif" }}>
                                  Existing Availabilities:
                                </div>
                                {existingAppointments.map((appointment, appIndex) => (
                                  <div key={`existing-${appIndex}`} style={{ marginBottom: 4 }}>
                                    {appointment.periods && appointment.periods.map((period, periodIndex) => (
                                      <div 
                                        key={`period-${periodIndex}`} 
                                        style={{ 
                                          display: "flex", 
                                          alignItems: "center",
                                          backgroundColor: "#f5f5f5",
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          marginBottom: "4px",
                                          fontFamily: "Montserrat, sans-serif"
                                        }}
                                      >
                                        <span style={{ marginRight: 8 }}>
                                          {formatTimeFromObject(period.start)} - {formatTimeFromObject(period.end)}
                                        </span>
                                      
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}

                            {availability[day].length === 0 ? (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ color: "grey", fontFamily: "Montserrat, sans-serif" }}>Unavailable</span>
                                {!isPastDay(day) && !drawerCurrentWeek.isBefore(moment().startOf('week')) && (
                                  <Button
                                    type="link"
                                    onClick={() => addTimeSlot(day)}
                                    style={{ 
                                      padding: "4px 8px", 
                                      color: "#1890ff", 
                                      display: "flex", 
                                      alignItems: "center",
                                      fontFamily: "Montserrat, sans-serif"
                                    }}
                                  >
                                    <PlusCircleTwoTone style={{ marginRight: 4 }} />
                                    <span>Add Availability</span>
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div>
                                {availability[day].map((slot, index) => (
                                  <Space
                                    key={index}
                                    style={{ display: "flex", marginBottom: 4 }}
                                  >
                                    <TimePicker
                                      placeholder="Start Time"
                                      onChange={(time, timeString) =>
                                        handleTimeChange(
                                          day,
                                          index,
                                          "startTime",
                                          timeString,
                                        )
                                      }
                                      format="HH:mm"
                                      showNow={false}
                                      use12Hours={false}
                                      needConfirm={false}
                                      style={{ fontFamily: "Montserrat, sans-serif" }}
                                    />
                                    <TimePicker
                                      placeholder="End Time"
                                      onChange={(time, timeString) =>
                                        handleTimeChange(
                                          day,
                                          index,
                                          "endTime",
                                          timeString,
                                        )
                                      }
                                      format="HH:mm"
                                      showNow={false}
                                      use12Hours={false}
                                      needConfirm={false}
                                      style={{ fontFamily: "Montserrat, sans-serif" }}
                                      disabledTime={() =>
                                        disableEndTime(slot.startTime)
                                      }
                                    />
                                    <Button
                                      type="link"
                                      danger
                                      onClick={() => removeTimeSlot(day, index)}
                                      style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                      <MinusCircleOutlined />
                                    </Button>
                                  </Space>
                                ))}
                                {!isPastDay(day) && !drawerCurrentWeek.isBefore(moment().startOf('week')) && availability[day].length < maxSlots && (
                                  <Button
                                    type="link"
                                    onClick={() => addTimeSlot(day)}
                                    style={{ 
                                      padding: "4px 0", 
                                      color: "#1890ff", 
                                      display: "flex", 
                                      alignItems: "center",
                                      fontFamily: "Montserrat, sans-serif"
                                    }}
                                  >
                                    <PlusCircleTwoTone style={{ marginRight: 4 }} />
                                    <span>Add Availability</span>
                                  </Button>
                                )}
                              </div>
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  </Col>
                </Row>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;