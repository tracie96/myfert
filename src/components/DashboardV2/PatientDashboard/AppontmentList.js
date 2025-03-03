import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {  getUpcomingAppointments} from "../../redux/patientSlice";

export default function PatientAppointmentList() {
  const dispatch = useDispatch();

  const {
  upcomingPatientAppointment
  } = useSelector((state) => state?.patient);; 

  const [loading] = useState(false);
  const [setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");
  useEffect(() => {
    dispatch(getUpcomingAppointments());
  }, [dispatch]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig({
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  }, [setSortConfig]);



  const columns = useMemo(
    () => [
      {
        title: "Doctors Name",
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
            {record.approved && (
              <Col span={24}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#007bff", 
                    border: "none",
                    width: "100%",
                  }}
                  onClick={() => window.open(record.meetingLink, "_blank")}
                >
                  Join
                </Button>
              </Col>
            )}
          </Row>
        ),
      },
    ],
    []
  );
  
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(upcomingPatientAppointment)) {
      console.error("upcomingPatientAppointment is not an array");
      return []; 
    }

    if (!searchParam) return upcomingPatientAppointment;

    return upcomingPatientAppointment.filter(
      (item) =>
        item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        item.appointDate.toLowerCase().includes(searchParam.toLowerCase())
    );
  }, [searchParam, upcomingPatientAppointment]);

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
