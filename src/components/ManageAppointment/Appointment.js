import React, { useState } from "react";
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

import { submitAvailability } from "../redux/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

const Appointment = () => {
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [drawerKey, setDrawerKey] = useState(0);
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
console.log({filteredAppointments})
  const onClose = () => {
    setAvailability({
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    })
    setOpen(false);
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
    startDate = currentWeek.startOf("week").format("YYYY-MM-DD");
    endDate = currentWeek.endOf("week").format("YYYY-MM-DD");

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
    setRefreshCalendar((prev) => prev + 1);
    dispatch(submitAvailability(payload));
    onClose();
  };

  const isPastDay = (day) => {
    const currentDayIndex = moment().day();
    const selectedDayIndex = moment().day(day).day();
    const isCurrentWeek = moment(currentWeek).isSame(moment(), "week");

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
    setCurrentWeek((prev) => moment(prev).subtract(1, "weeks"));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => moment(prev).add(1, "weeks"));
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
          <div className="mb-4">
            <Calendar
              availability={availability}
              currentWeek={currentWeek}
              refreshTrigger={refreshCalendar}
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
                  <div style={{ textAlign: "right" }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmitAvailability}
                      style={{
                        background: "#00ADEF",
                        padding: "10px 20px",
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
                    }}
                  >
                    {/* Right Section: Previous/Next Arrows and Date Range */}
                    <div
                      style={{
                        display: "block",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        type="link"
                        onClick={handlePreviousWeek}
                        icon={<LeftCircleTwoTone />}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          margin: "0 10px",
                        }}
                      >
                        Week
                      </span>
                      <Button
                        type="link"
                        onClick={handleNextWeek}
                        icon={<RightCircleTwoTone />}
                      />

                      {/* Date Range Display */}
                      <div style={{ marginLeft: 8 }}>
                        <span style={{ fontSize: "14px", color: "#5A5A5A" }}>
                          {currentWeek.startOf("week").format("MMMM D, YYYY")} -{" "}
                          {currentWeek.endOf("week").format("MMMM D, YYYY")}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                <label
                  style={{
                    fontWeight: "bold",
                    margin: "30px 0",
                    color: "#335CAD",
                  }}
                >
                  Availability
                </label>

                {/* Weekly Recurrence Checkbox */}
                <Row style={{ marginBottom: 24 }}>
                  <Col span={24}>
                    <Checkbox style={{ fontSize: "14px" }}>
                      Weekly recurrence
                    </Checkbox>
                  </Col>
                </Row>

                {/* Availability */}
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    {Object.keys(availability).map((day) => (
                      <Row key={day} style={{ marginBottom: 8 }}>
                        <Col span={8}>
                          <strong>{day}</strong>
                        </Col>
                        <Col
                          span={16}
                          style={{ display: "flex", alignItems: "center" }}
                        >

                          {availability[day].length === 0 ? (
                            <span style={{ color: "grey" }}>Unavailable</span>
                          ) : (
                            availability[day].map((slot, index) => (
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
                                  disabledTime={() =>
                                    disableEndTime(slot.startTime)
                                  }
                                />
                                <Button
                                  type="link"
                                  danger
                                  onClick={() => removeTimeSlot(day, index)}
                                >
                                  <MinusCircleOutlined />
                                </Button>
                              </Space>
                            ))
                          )}
                          {!isPastDay(day) &&
                            availability[day].length < maxSlots && (
                              <Button
                                type="link"
                                onClick={() => addTimeSlot(day)}
                              >
                                <PlusCircleTwoTone style={{ marginTop: -4 }} />
                              </Button>
                            )}
                        </Col>
                      </Row>
                    ))}
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