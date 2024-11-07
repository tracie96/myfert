import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingAppointments, getZohoClientID } from "../../redux/doctorSlice";

export default function AppointmentList() {
  const dispatch = useDispatch();

  const { upcomingAppointments = [] } = useSelector((state) => state.doctor); // default to empty array

  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");

  useEffect(() => {
    dispatch(getUpcomingAppointments());
  }, [dispatch]);

  console.log(setLoading,sortConfig)

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

  const handleSearch = useCallback((value) => {
    setSearchParam(value);
  }, []);

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
  const handleAccept = (appointId) => {
    message.success(`Appointment ${appointId} accepted.`);
  };

  const handleReject = (appointId) => {
    message.error(`Appointment ${appointId} rejected.`);
  };
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
          </Row>
        ),
      },
    ],
    []
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
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 150 }}
            />
          }
          items={[
            {
              label: "All Meetings",
              key: "1",
              children: (
                <Card>
                  <div style={{ marginBottom: 16 }}></div>
                  <Table
                    columns={columns}
                    dataSource={filteredAppointments} // Use filtered upcomingAppointments here
                    loading={loading}
                    scroll={{ x: "max-content" }}
                    pagination={{
                      pageSize: 10, // Change pageSize as needed
                      total: filteredAppointments.length,
                    }}
                    onChange={handleTableChange}
                    rowKey="id"
                  />
                </Card>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}
