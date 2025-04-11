import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, Input, DatePicker, Checkbox, message } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingAppointments, getZohoClientID } from "../../redux/doctorSlice";
import moment from "moment";
import axios from "axios";

export default function AppointmentList() {
  const dispatch = useDispatch();

  const { upcomingAppointments = [] } = useSelector((state) => state.doctor); 

  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
console.log({dateFilter})
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
  }, []);

  const handleMarkAsDone = async (appointId) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const token = userInfo.obj.token || "";
      const response = await axios.get(
        `https://myfertilitydevapi.azurewebsites.net/api/Doctor/MarkAppointmentDone/${appointId}`,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
            Authorization: `${token}`,
    
          },
        }
      );
      
      if (response.status === 200) {
        message.success('Appointment marked as done successfully');
        // Refresh the appointments list
        dispatch(getUpcomingAppointments());
      }
    } catch (error) {
      message.error('Failed to mark appointment as done');
      console.error('Error marking appointment as done:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (date) => {
    setDateFilter(date);
  };

  const columns = useMemo(
    () => [
      {
        title: "Done",
        key: "done",
        width: 80,
        render: (_, record) => (
          <Checkbox
            checked={record.approved}
            onChange={() => handleMarkAsDone(record.appointId)}
            disabled={loading}
          />
        ),
      },
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
        sorter: true,
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
                {/* <Col span={12}>
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
                </Col> */}
              </>
            )}
          </Row>
        ),
      },
    ],
    []
  );
  
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(upcomingAppointments)) {
      console.error("upcomingAppointments is not an array");
      return []; 
    }

    let filtered = upcomingAppointments;

    // Filter by search text
    if (searchParam) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          item.appointDate.toLowerCase().includes(searchParam.toLowerCase())
      );
    }

    // Filter to only show current month's appointments
    const currentMonth = moment().startOf('month');
    const nextMonth = moment().endOf('month');
    
    filtered = filtered.filter((item) => {
      // Parse the date in DD-MM-YYYY format
      const appointmentDate = moment(item.appointDate, 'DD-MM-YYYY');
      return appointmentDate.isBetween(currentMonth, nextMonth, 'day', '[]');
    });

    // Apply sorting if sortField and sortOrder are defined
    if (sortConfig.sortField && sortConfig.sortOrder) {
      const { sortField, sortOrder } = sortConfig;
      
      filtered = [...filtered].sort((a, b) => {
        // For date field, use moment to compare
        if (sortField === 'appointDate') {
          const dateA = moment(a[sortField], 'DD-MM-YYYY');
          const dateB = moment(b[sortField], 'DD-MM-YYYY');
          
          if (sortOrder === 'ascend') {
            return dateA.isBefore(dateB) ? -1 : 1;
          } else {
            return dateA.isAfter(dateB) ? -1 : 1;
          }
        }
        
        // For other fields, use string comparison
        if (sortOrder === 'ascend') {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [searchParam, upcomingAppointments, sortConfig]);

  // const acceptedAppointments = filteredAppointments.filter(
  //   (item) => item.approved === true
  // );


  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} md={24} style={{ paddingBottom: "16px" }}>
        <p style={{ color: "#335CAD", fontWeight: "bold", fontSize: "16px" }}>
          Meeting List
        </p>
        <Tabs
          tabBarExtraContent={
            <Row gutter={16} align="middle">
              <Col>
                <DatePicker 
                  onChange={handleDateFilter} 
                  placeholder="Filter by date"
                  style={{ marginRight: 8 }}
                  allowClear
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined />}
                />
              </Col>
              <Col>
                <Input
                  placeholder="Search by Name or Date"
                  value={searchParam}
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchParam(e.target.value)}
                  style={{ width: 150 }}
                />
              </Col>
            </Row>
          }
        >
          <Tabs.TabPane tab="My Meetings" key="1">
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
          {/* <Tabs.TabPane tab="Accepted Meetings" key="2">
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
          </Tabs.TabPane> */}
        
        </Tabs>
      </Col>
    </Row>
  );
}
