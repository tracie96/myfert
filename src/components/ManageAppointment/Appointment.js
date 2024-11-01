import React, { useState } from "react";
import Calendar from "./Calendar";
import { Drawer, Button, Checkbox, Row, Col, Space, TimePicker } from "antd";
import moment from "moment";
import {
  MinusCircleOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { submitAvailability } from "../redux/doctorSlice";
import { useDispatch } from "react-redux";

const Appointment = () => {
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [availability, setAvailability] = useState({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const maxSlots = 5;
  const showDrawer = () => {
    setOpen(true);
  };
  const [refreshCalendar, setRefreshCalendar] = useState(0);
  const dispatch = useDispatch();
  const onClose = () => {
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
      disabledHours: () => Array.from({ length: startHour }, (_, i) => i), // Disable hours less than the start hour
      disabledMinutes: (selectedHour) =>
        selectedHour === startHour
          ? Array.from({ length: startMinute }, (_, i) => i)
          : [], // Disable minutes less than the start minute if the selected hour is the same
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
        <div className="col-lg-12 mb-4">
          {/* Header Row with Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "10px",
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
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 font-weight-bold">
                    Upcoming Appointment:
                  </label>
                </div>
                <span
                  type="button"
                  className="btn btn-user btn-block"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  Appointments
                </span>
              </form>
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
                                  value={
                                    slot.startTime
                                      ? moment(slot.startTime, "HH:mm")
                                      : null
                                  }
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
                                  value={
                                    slot.endTime
                                      ? moment(slot.endTime, "HH:mm")
                                      : null
                                  }
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
