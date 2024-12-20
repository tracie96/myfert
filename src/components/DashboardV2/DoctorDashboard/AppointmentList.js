import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { acceptAppointment, getUpcomingAppointments, getZohoClientID } from "../../redux/doctorSlice";

export default function AppointmentList() {
  const dispatch = useDispatch();

  const { upcomingAppointments = [] } = useSelector((state) => state.doctor); 

  const [loading] = useState(false);
  const [setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");

  useEffect(() => {
    dispatch(getUpcomingAppointments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getZohoClientID()).then((response) => {
      if (getZohoClientID.fulfilled.match(response)) {
        console.log("Zoho Client Id-", response.payload);
      } else {
        console.error("Failed to fetch the Zoho client Id-", response.error.message);
      }
    });
  }, [dispatch]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig({
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  }, [setSortConfig]);

  const handleAccept = useCallback((appointId) => {
    dispatch(acceptAppointment({ appointmentId: appointId, status: 1 }))
      .then((result) => {
        if (acceptAppointment.fulfilled.match(result)) {
          message.success(`Appointment ${appointId} accepted.`);
        } else {
          message.error(result.error.message || "Failed to accept the appointment");
        }
      })
      .catch((error) => {
        message.error("An error occurred while accepting the appointment");
      });
  }, [dispatch]);

  const handleReject = useCallback((appointId) => {
    dispatch(acceptAppointment({ appointmentId: appointId, status: 0 }))
      .then((result) => {
        if (acceptAppointment.fulfilled.match(result)) {
          message.success(`Appointment ${appointId} rejected.`);
        } else {
          message.error(result.error.message || "Failed to reject the appointment");
        }
      })
      .catch((error) => {
        message.error("An error occurred while rejecting the appointment");
      });
  }, [dispatch]);
  const columns = useMemo(
    () => [
      {
        title: "Patient Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Date",
        dataIndex: "appointDate",
        key: "appointDate",
      },
      {
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
      },
      {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Row gutter={16}>
            {record.approved ? (
              // If the appointment is accepted, show the "Join" button
              <Col span={24}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#007bff", // Blue color for "Join"
                    border: "none",
                    width: "100%",
                  }}
                  onClick={() => window.open(record.meetingLink, "_blank")}
                >
                  Join
                </Button>
              </Col>
            ) : (
              // If the appointment is not accepted, show "Accept" and "Reject" buttons
              <>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => handleAccept(record.appointId)}
                    style={{
                      backgroundColor: "#28a745", 
                      border: "none",
                      width: "100%",
                      marginBottom: "8px",
                    }}
                  >
                    Accept
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => handleReject(record.appointId)}
                    style={{
                      backgroundColor: "#dc3545", 
                      border: "none",
                      width: "100%",
                    }}
                  >
                    Reject
                  </Button>
                </Col>
              </>
            )}
          </Row>
        ),
      },
    ],
    [handleAccept, handleReject]
  );
  
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(upcomingAppointments)) {
      console.error("upcomingAppointments is not an array");
      return []; 
    }

    if (!searchParam) return upcomingAppointments;

    return upcomingAppointments.filter(
      (item) =>
        item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        item.appointDate.toLowerCase().includes(searchParam.toLowerCase())
    );
  }, [searchParam, upcomingAppointments]);

  const acceptedAppointments = filteredAppointments.filter(
    (item) => item.approved === true
  );

  const rejectedAppointments = filteredAppointments.filter(
    (item) => item.approved === false
  );

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} md={24} style={{ paddingBottom: "16px" }}>
        <p style={{ color: "#335CAD", fontWeight: "bold", fontSize: "16px" }}>
          Meeting List
        </p>
        <Tabs
          tabBarExtraContent={
            <Input
              placeholder="Search by Name or Date"
              value={searchParam}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchParam(e.target.value)}
              style={{ width: 150 }}
            />
          }
        >
          <Tabs.TabPane tab="All Meetings" key="1">
            <Card>
              <Table
                columns={columns}
                dataSource={filteredAppointments}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                  pageSize: 10,
                  total: filteredAppointments.length,
                }}
                onChange={handleTableChange}
                rowKey="id"
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Accepted Meetings" key="2">
            <Card>
              <Table
                columns={columns}
                dataSource={acceptedAppointments}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                  pageSize: 10,
                  total: acceptedAppointments.length,
                }}
                onChange={handleTableChange}
                rowKey="id"
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Rejected Meetings" key="3">
            <Card>
              <Table
                columns={columns}
                dataSource={rejectedAppointments}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                  pageSize: 10,
                  total: rejectedAppointments.length,
                }}
                onChange={handleTableChange}
                rowKey="id"
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
}
