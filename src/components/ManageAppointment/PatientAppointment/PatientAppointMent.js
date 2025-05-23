import React, { useEffect, useState } from "react";
import PatientCalendar from "./PatientCalendar";
import { useMediaQuery } from "react-responsive";
import "./PatientCalendar.css";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Col, Modal, Row, Space, message } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  UpOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { getUpcomingAppointments, getPatientStatus } from "../../redux/patientSlice";
import { cancelPatientAppointment } from "../../redux/doctorSlice";
import { getAccessDetails } from "../../redux/AssessmentController";
import moment from "moment-timezone";

const PatientAppointment = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { appointmentList = [] } = useSelector((state) => state?.doctor);
  const [viewAll, setViewAll] = useState(false);
  const [patientStatus, setPatientStatus] = useState(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState({
    nurse: false,
    doctor: false,
    pharmacistClinician: false,
    nutritionalPractitioner: false,
    fertilitySupportPractitioner: false,
    fertilityEducator: false,
  });

  const [selectedDeliveryTypes, setSelectedDeliveryTypes] = useState({
    inPerson: false,
    virtual: false,
  });

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPatientStatus = async () => {
      try {
        const result = await dispatch(getPatientStatus());
        if (result.payload) {
          setPatientStatus(result.payload);
        }
      } catch (err) {
        console.error("Error fetching patient status:", err);
      }
    };

    fetchPatientStatus();
  }, [dispatch]);

  useEffect(() => {
    const filterAppointmentsByProvider = (appointments) => {
      if (!Object.values(selectedProviders).some(value => value)) {
        return appointments;
      }
      return appointments.filter(appointment => {
        const roleToProviderMap = {
          3: 'doctor',
          5: 'nurse',
          6: 'pharmacistClinician',
          7: 'nutritionalPractitioner',
          8: 'fertilitySupportPractitioner',
          9: 'fertilityEducator'
        };
        const providerType = roleToProviderMap[appointment.roleId];
        return providerType && selectedProviders[providerType];
      });
    };

    const filterAppointmentsByDeliveryType = (appointments) => {
      if (!Object.values(selectedDeliveryTypes).some(value => value)) {
        return appointments;
      }
      return appointments.filter(appointment => {
        const isVirtual = appointment.meetingLink ? true : false;
        return (selectedDeliveryTypes.inPerson && !isVirtual) || 
               (selectedDeliveryTypes.virtual && isVirtual);
      });
    };

    const filtered = filterAppointmentsByDeliveryType(
      filterAppointmentsByProvider(appointmentList.filter(
        (app) => {
          if (patientStatus === null || (patientStatus?.initialAssessment === null && patientStatus?.isPaymentComplete === null)) {
            return app.roleId === 9;
          }
          if (patientStatus?.initialAssessment && patientStatus?.isPaymentComplete) {
            return true;
          }
          return app.roleId === 9;
        }
      ))
    );
    setFilteredAppointments(filtered);
  }, [appointmentList, selectedProviders, selectedDeliveryTypes, patientStatus]);

  const handleDeliveryTypeChange = (type) => {
    setSelectedDeliveryTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleCheckboxChange = (provider) => {
    setSelectedProviders(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const visibleAppointments = viewAll
    ? filteredAppointments
    : filteredAppointments.slice(0, 2);
  const [calendar, setCalendar] = useState(localStorage.getItem("calendar"));
  console.log({ calendar })
  const showModal = () => {
    setIsFilterModalVisible(true);
  };
  const [moreVisible, setMoreVisible] = useState(filteredAppointments.map(() => true));
  const { upcomingPatientAppointment } = useSelector((state) => state.patient);
  console.log({ upcomingPatientAppointment })
  const toggleMore = (index) => {
    setMoreVisible(prevState =>
      prevState.map((visible, i) => (i === index ? !visible : visible))
    );
  };
  const handleOk = () => {
    setIsFilterModalVisible(false);
  };

  useEffect(() => {
    dispatch(getUpcomingAppointments());
    dispatch(getAccessDetails());
  }, [dispatch]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "calendar") {
        setCalendar(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  const handleViewAll = () => {
    setViewAll(!viewAll);
  };

  const handleJoinCall = (appointment) => {
    localStorage.setItem("currentStep", 3)
    console.log('join the call', appointment)
    const { meetingLink } = appointment
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      alert('Meeting link is not yet ready.')
    }
  }

  const handleCancelAppointment = (appointment) => {
    const { appointId } = appointment
    dispatch(cancelPatientAppointment(appointId)).then((response) => {
      if (cancelPatientAppointment.fulfilled.match(response)) {
        message.success("Meeting is cancelled successfully!");
        dispatch(getUpcomingAppointments());
      } else {
        console.error("Failed to cancel the meeting", response.error.message);
      }
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              {isMobile ? (
                <div
                  style={{
                    order: isMobile ? 2 : 1,
                  }}
                >
                  <Row
                    justify="space-between"
                    align="middle"
                    style={{ marginBottom: "20px" }}
                  >
                    <Col span={3}>
                      <Button type="primary" shape="round" onClick={showModal} >
                        Filters
                      </Button>
                    </Col>

                    <Col span={18}>
                      <Space
                        size={"small"}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          fontSize: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              background: "orange",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          Clinician
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              background: "#00800080",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          Nutritionist
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              background: "#B46DB8",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          Fertility Coach
                        </div>
                      </Space>
                    </Col>
                  </Row>

                  {filteredAppointments.length > 0 ? (
                    <div>
                      {visibleAppointments.map((appointment, index) => (
                        <div
                          key={index} // Add a unique key for each appointment
                          style={{
                            width: "100%",
                            height: '120px',
                            background: index % 2 === 0 ? "#F2AA9380" : "#B46DB8",
                            borderRadius: "10px",
                            marginBottom: "10px", // Added margin for better spacing
                          }}
                        >
                          <div
                            style={{
                              width: "95%",
                              background: "#fff",
                              height: '120px',
                              border: "2px solid #C2E6F8",
                              borderRadius: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "15px",
                              boxSizing: "border-box",
                              float: 'right',
                            }}
                          >
                            {/* Column 1 - Clinician Info */}
                            <Col style={{ fontSize: "8px" }} span={8}>
                              <div style={{ fontSize: "8px", display: "flex", alignItems: "center" }}>
                                <Avatar style={{ marginRight: "10px" }} icon={<UserOutlined />} />
                                <div style={{ fontWeight: "bold", color: "#F2AA93" }}>Doctor Doctor</div>
                              </div>
                              <div style={{ color: "#7D7D7D" }}>Ongoing Care Plan - Initial Care Team Appointment</div>
                            </Col>

                            {/* Column 2 - Date and Time Info */}
                            <Col style={{ flex: 1, textAlign: "left", fontSize: '10px' }} span={10}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                <CalendarOutlined style={{ marginRight: "8px" }} />
                                {new Date(appointment.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                <ClockCircleOutlined style={{ marginRight: "8px" }} /> 9:00 AM - 9:30 AM
                              </div>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <EnvironmentOutlined style={{ marginRight: "8px" }} /> Virtual or In-person
                              </div>
                            </Col>

                            <Col span={4} style={{ display: "flex", flexDirection: 'column', alignItems: "center", fontSize: '8px' }}>
                              <MoreOutlined style={{ fontSize: '10px' }} />
                              <Button type="primary" style={{ width: 60, marginTop: '10px', borderRadius: 5 }} icon={<VideoCameraOutlined />}>
                                <span style={{ fontSize: '8px' }}>JOIN</span>
                              </Button>
                            </Col>
                          </div>
                        </div>
                      ))}

                      {filteredAppointments.length > 2 && (
                        <div
                          onClick={handleViewAll}
                          style={{ color: "#1E90FF", cursor: "pointer" }} // Added cursor for better UX
                        >
                          {viewAll ? (
                            <UpOutlined style={{ marginRight: "10px" }} />
                          ) : (
                            <DownOutlined style={{ marginRight: "10px" }} />
                          )}
                          {viewAll ? "View Less" : "View All"}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>You have no upcoming appointments.</p>
                      <p>Earliest appointment you can schedule with your provider is:</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, order: isMobile ? 2 : 1 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        width: "90%",
                        backgroundColor: "#00ADEF",
                        borderRadius: "12px 12px 0 0",
                        height: "61px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        padding: "0 20px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        UPCOMING APPOINTMENT
                      </h3>
                    </div>

                    <div
                      style={{
                        padding: "16px 24px",
                        borderRadius: "12px",
                        borderWidth: "1px",
                        width: "90%",
                        backgroundColor: "#fff",
                        borderColor: "#C2E6F8",
                        borderStyle: "solid",
                        marginTop: "-10px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#fff",
                          marginTop: "-10px",
                        }}
                      >
                        {upcomingPatientAppointment?.length > 0 ? (
                          <div>
                            {(() => {
                              const filteredAppointments = upcomingPatientAppointment.filter((appointment) => {
                                const appointmentDateTime = moment(
                                  `${appointment.appointDate} ${appointment.startTime}`,
                                  "DD-MM-YYYY HH:mm"
                                );
                                return appointmentDateTime.isSameOrAfter(moment());
                              });

                              if (filteredAppointments.length === 0) {
                                return <p>You have no upcoming appointments.</p>;
                              }

                              return filteredAppointments.map((appointment, index) => {
                                const formattedStartTime = moment(
                                  appointment.startTime,
                                  "DD-MM-YYYY HH:mm"
                                ).format("h:mm A");
                                const formattedEndTime = moment(
                                  appointment.endTime,
                                  "DD-MM-YYYY HH:mm"
                                ).format("h:mm A");

                                return (
                                  <div
                                    key={index}
                                    style={{
                                      borderBottom: "1px solid #00000033",
                                      marginBottom: "15px",
                                      paddingBottom: "15px",
                                      fontSize: "14px",
                                      backgroundColor: "#f9f9f9",
                                      borderRadius: "8px",
                                      padding: "15px",
                                    }}
                                  >
                                    {moreVisible[index] ? (
                                      <MoreOutlined
                                        style={{ fontSize: "20px", float: "right", color: "#1E90FF" }}
                                        onClick={() => toggleMore(index)}
                                      />
                                    ) : (
                                      <DeleteOutlined
                                        style={{
                                          fontSize: "20px",
                                          color: "#ff4d4f",
                                          float: "right",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleCancelAppointment(appointment)}
                                      />
                                    )}

                                    <p style={{ fontSize: "12px", marginTop: "20px" }}>
                                      <Avatar
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        icon={<UserOutlined />}
                                      />
                                      <strong>{appointment.name}</strong>
                                    </p>

                                    <p style={{ fontSize: "12px" }}>
                                      <Avatar
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        icon={<CalendarOutlined />}
                                      />
                                      <strong>
                                        {moment(appointment.appointDate, "DD-MM-YYYY")
                                          .local()
                                          .format("dddd, MMMM Do YYYY")}
                                      </strong>
                                    </p>

                                    <p style={{ fontSize: "12px" }}>
                                      <Avatar
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        icon={<ClockCircleOutlined />}
                                      />
                                      <strong>{formattedStartTime}</strong> -{" "}
                                      <strong>{formattedEndTime}</strong>
                                    </p>

                                    <p style={{ fontSize: "12px" }}>
                                      <Avatar
                                        style={{
                                          marginRight: "8px",
                                        }}
                                        icon={<EnvironmentOutlined />}
                                      />
                                      <strong>Virtual or In-person</strong>
                                    </p>

                                    <div style={{ width: "90%", marginLeft: "10%", position: "relative" }}>
                                      <Button
                                        type="primary"
                                        icon={<VideoCameraOutlined />}
                                        disabled={!appointment.meetingLink}
                                        style={{
                                          marginBottom: "10px",
                                          backgroundColor: `${!appointment.meetingLink ? "#808080" : "#1E90FF"}`,
                                          borderRadius: "5px",
                                          padding: "10px 20px",
                                        }}
                                        onClick={() => handleJoinCall(appointment)}
                                      >
                                        Join
                                      </Button>

                                      <p style={{ fontSize: "12px", color: "#555" }}>
                                        Ongoing Care Plan - Initial Care Team Appointment
                                      </p>
                                    </div>
                                  </div>
                                );
                              });
                            })()}

                            {upcomingPatientAppointment.filter((appointment) => {
                              const appointmentDateTime = moment(
                                `${appointment.appointDate} ${appointment.startTime}`,
                                "DD-MM-YYYY HH:mm"
                              );
                              return appointmentDateTime.isSameOrAfter(moment());
                            }).length > 2 && (
                                <div
                                  onClick={handleViewAll}
                                  style={{
                                    color: "#1E90FF",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px 0",
                                  }}
                                >
                                  {viewAll ? (
                                    <UpOutlined style={{ marginRight: "10px" }} />
                                  ) : (
                                    <DownOutlined style={{ marginRight: "10px" }} />
                                  )}
                                  {viewAll ? "View Less" : "View All"}
                                </div>
                              )}
                          </div>
                        ) : (
                          <div>
                            <p>No appointments found.</p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        width: "90%",
                        backgroundColor: "#00ADEF",
                        borderRadius: "12px 12px 0 0",
                        height: "61px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        padding: "0 20px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        PROVIDER
                      </h3>
                    </div>

                    <div
                      style={{
                        padding: "16px 24px",
                        borderRadius: "12px",
                        borderWidth: "1px",
                        backgroundColor: "#fff",
                        width: "90%",
                        borderColor: "#C2E6F8",
                        borderStyle: "solid",
                        marginTop: "-10px",
                      }}
                    >
                      {['nurse', 'doctor', 'pharmacistClinician', 'nutritionalPractitioner', 'fertilitySupportPractitioner', 'fertilityEducator'].map((provider) => {
                        // Only show fertility coach if patient status is null
                        if (patientStatus === null || (patientStatus?.initialAssessment === null && patientStatus?.isPaymentComplete === null)) {
                          if (provider !== 'fertilitySupportPractitioner') {
                            return null;
                          }
                        }
                        // Show all providers if both initialAssessment and isPaymentComplete are true
                        if (patientStatus?.initialAssessment && patientStatus?.isPaymentComplete) {
                          return (
                            <div key={provider}>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox-antd"
                                  checked={selectedProviders[provider]}
                                  onChange={() => handleCheckboxChange(provider)}
                                />
                                {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/([A-Z])/g, ' $1')}
                              </label>
                            </div>
                          );
                        }
                        // Default case, only show fertility coach
                        if (provider === 'fertilitySupportPractitioner') {
                          return (
                            <div key={provider}>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox-antd"
                                  checked={selectedProviders[provider]}
                                  onChange={() => handleCheckboxChange(provider)}
                                />
                                {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/([A-Z])/g, ' $1')}
                              </label>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        width: "90%",
                        backgroundColor: "#00ADEF",
                        borderRadius: "12px 12px 0 0",
                        height: "61px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        padding: "0 20px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        DELIVERY TYPE
                      </h3>
                    </div>

                    <div
                      style={{
                        padding: "16px 24px",
                        borderRadius: "12px",
                        borderWidth: "1px",
                        backgroundColor: "#fff",
                        borderColor: "#C2E6F8",
                        borderStyle: "solid",
                        width: "90%",
                        marginTop: "-10px",
                      }}
                    >
                      <div style={{ marginBottom: "12px" }}>
                        <label>
                          <input 
                            type="checkbox" 
                            style={{ marginRight: "8px" }}
                            checked={selectedDeliveryTypes.inPerson}
                            onChange={() => handleDeliveryTypeChange('inPerson')}
                          />
                          In Person
                        </label>
                      </div>
                      <div>
                        <label>
                          <input 
                            type="checkbox" 
                            style={{ marginRight: "8px" }}
                            checked={selectedDeliveryTypes.virtual}
                            onChange={() => handleDeliveryTypeChange('virtual')}
                          />
                          Virtual
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ flex: 3, order: isMobile ? 1 : 2 }}>
                <PatientCalendar selectedProviders={selectedProviders} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Filters"
        visible={isFilterModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        width={600}
        footer={[
          <Button
            key="cancel"
            onClick={handleOk}
            style={{
              backgroundColor: '#f0f0f0',
              borderColor: '#d9d9d9',
              color: '#595959',
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{
              backgroundColor: '#00ADEF',
              borderColor: '#00ADEF',
            }}
          >
            OK
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  backgroundColor: "#00ADEF",
                  borderRadius: "12px 12px 0 0",
                  height: "61px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  padding: "0 20px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  PROVIDER
                </h3>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  backgroundColor: "#fff",
                  borderColor: "#C2E6F8",
                  borderStyle: "solid",
                  marginTop: "-10px",
                }}
              >
                {['nurse', 'doctor', 'pharmacistClinician', 'nutritionalPractitioner', 'fertilitySupportPractitioner', 'fertilityEducator'].map((provider) => {
                  // Only show fertility coach if patient status is null
                  if (patientStatus === null || (patientStatus?.initialAssessment === null && patientStatus?.isPaymentComplete === null)) {
                    if (provider !== 'fertilitySupportPractitioner') {
                      return null;
                    }
                  }
                  // Show all providers if both initialAssessment and isPaymentComplete are true
                  if (patientStatus?.initialAssessment && patientStatus?.isPaymentComplete) {
                    return (
                      <div key={provider}>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox-antd"
                            checked={selectedProviders[provider]}
                            onChange={() => handleCheckboxChange(provider)}
                          />
                          {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                      </div>
                    );
                  }
                  // Default case, only show fertility coach
                  if (provider === 'fertilitySupportPractitioner') {
                    return (
                      <div key={provider}>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox-antd"
                            checked={selectedProviders[provider]}
                            onChange={() => handleCheckboxChange(provider)}
                          />
                          {provider.charAt(0).toUpperCase() + provider.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  backgroundColor: "#00ADEF",
                  borderRadius: "12px 12px 0 0",
                  height: "61px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  padding: "0 20px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  DELIVERY TYPE
                </h3>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  backgroundColor: "#fff",
                  borderColor: "#C2E6F8",
                  borderStyle: "solid",
                  marginTop: "-10px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <label>
                    <input
                      type="checkbox"
                      style={{ marginRight: "8px" }}
                    />
                    In Person
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      style={{ marginRight: "8px" }}
                    />
                    Virtual
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default PatientAppointment;
