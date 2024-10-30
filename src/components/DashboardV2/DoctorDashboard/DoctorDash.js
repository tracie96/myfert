import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, message, Switch } from "antd";
import {
  ExperimentOutlined,
  FlagTwoTone,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { patientList } from "../../redux/doctorSlice";
import { useNavigate } from "react-router-dom";

const SwitchWrapper = ({ onChange, ...props }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick}>
      <Switch {...props} onChange={onChange} />
    </div>
  );
};

export default function DoctorDash() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUserId = useSelector(
    (state) => state?.authentication?.userAuth?.obj?.id,
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");

  const fetchPatientList = useCallback(async () => {
    setLoading(true);
    const params = {
      page: 1,
      size: 100,
      sortColumn: sortConfig.sortField,
      sortDirection: sortConfig.sortOrder,
      searchParam,
    };

    try {
      const response = await dispatch(patientList(params));
      if (patientList.fulfilled.match(response)) {
        const updatedList = response?.payload?.data?.map((item) => {
          if (item && item.createdById === loggedInUserId) {
            item.createdBy = "You";
          }
          return item;
        });
        setData(updatedList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Error fetching user list.");
    } finally {
      setLoading(false);
    }
  }, [
    dispatch,
    searchParam,
    sortConfig.sortField,
    sortConfig.sortOrder,
    loggedInUserId,
  ]);

  useEffect(() => {
    fetchPatientList();
  }, [fetchPatientList]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig({
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchParam(value);
  }, []);

  const handleSwitch = (checked, record, e) => {
    e.stopPropagation(); // This is important to prevent row navigation
    localStorage.setItem("calendar", checked ? "auto" : "manual");
  };

  const dataWithIds = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        id: item.id,
      })),
    [data],
  );

  const columns = useMemo(
    () => [
      {
        title: "First Name",
        dataIndex: "firstname",
        key: "firstname",
        sorter: true,
        
      },
      {
        title: "Last Name",
        dataIndex: "lastname",
        key: "lastname",
        sorter: true,
      },
      {
        title: "Flag",
        dataIndex: "flag",
        key: "flag",
        render: (flag) =>
          flag ? (
            <FlagTwoTone style={{ color: "red" }} twoToneColor={"red"} />
          ) : (
            <FlagTwoTone
              fill="red"
              twoToneColor={"red"}
              style={{ color: "red" }}
            />
          ),
      },
      {
        title: "Lab",
        dataIndex: "lab",
        key: "lab",
        render: (lab) =>
          lab ? (
            <ExperimentOutlined style={{ color: "blue" }} />
          ) : (
            <QuestionCircleOutlined style={{ color: "gray" }} />
          ),
      },
      {
        title: "Group",
        dataIndex: "groups",
        key: "groups",
        render: () => <p> Individual Screen - M</p>,
      },
      {
        title: "Clinician",
        dataIndex: "clinician",
        key: "clinician",
        render: () => <p> Clinician Bama Bish</p>,
      },
      {
        title: "Action", // Title for the new column
        key: "action", // Key for the new column
        render: (_, record) => (
          <SwitchWrapper
            onChange={(checked, e) => handleSwitch(checked, record, e)}
          />
        ),
      },
    ],
    [],
  );

  const PatientList = React.memo(
    () => (
      <Card>
        <div style={{ marginBottom: 16 }}></div>
        <Table
          columns={columns}
          dataSource={dataWithIds}
          loading={loading}
          scroll={{ x: 'max-content' }} 
          pagination={false} 
          onChange={handleTableChange}
          rowKey="id"
          onRow={(record) => ({
            onClick: (e) => {
              if (!e.target.closest(".ant-switch")) {
                navigate(`/doctor/user/${record.id}`, {
                  state: { user: record },
                });
              }
            },
          })}
        />
      </Card>
    ),
    [columns, dataWithIds, loading, handleTableChange, handleSearch, navigate],
  );

  const items = [
    {
      label: "All Patients",
      key: "1",
      children: <PatientList />,
    },
    {
      label: "Assigned to me",
      key: "2",
      children: <PatientList />,
    },
  ];

  return (
    <Row gutter={16} style={{ padding: "0 5%" }}>
      <Col xs={24} md={24} style={{ paddingBottom: "16px" }}>
        <p style={{ color: "#335CAD", fontWeight: "bold", fontSize: "16px" }}>
          Patient List
        </p>
        <Tabs
          tabBarExtraContent={<Button>Search Section</Button>}
          items={items}
        />
      </Col>
    </Row>
  );
}
