import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Table, Card, message, Switch, Input } from "antd";
import {
  ExperimentOutlined,
  FlagTwoTone,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getZohoClientID, patientList } from "../../redux/doctorSlice";
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
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const loggedInUserId = useSelector(
    (state) => state?.authentication?.userAuth?.obj?.id,
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });

  const fetchPatientList = useCallback(async () => {
    setLoading(true);
    const params = {
      page: 1,
      size: 100,
      sortColumn: sortConfig.sortField,
      sortDirection: sortConfig.sortOrder,
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
    sortConfig.sortField,
    sortConfig.sortOrder,
    loggedInUserId,
  ]);

  useEffect(() => {
    fetchPatientList();
  }, [fetchPatientList]);

  useEffect(() => {
    dispatch(getZohoClientID()).then((response) => {
      if (getZohoClientID.fulfilled.match(response)) {
        console.log("Zoho Client Id-", response.payload);
        localStorage.setItem("zohoClientId", JSON.stringify(response.payload));
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
    setSearchQuery(value); // Update searchQuery when the user types
  }, []);

  const handleSwitch = (checked, record, e) => {
    e.stopPropagation();
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

  // Filter the data based on the search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return dataWithIds;
    return dataWithIds.filter((item) =>
      item.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.flag && item.flag.toString().toLowerCase().includes(searchQuery.toLowerCase())) // Check if flag exists before calling toString()
    );
  }, [searchQuery, dataWithIds]);

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
            <FlagTwoTone fill="red" twoToneColor={"red"} style={{ color: "red" }} />
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
        title: "Action",
        key: "action",
        render: (_, record) => (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <SwitchWrapper
              onChange={(checked, e) => handleSwitch(checked, record, e)}
            />
          
          </div>
        ),
      },
      {
        title: "Second Step",
        key: "action1",
        render: (_, record) => (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          
            {/* Second Plan Switch */}
            <Switch
              onChange={(checked) => handleSecondPlanSwitch(checked, record)}
           
            />
           
          </div>
        ),
      },
      {
        title: "Third Step",
        key: "action2",
        render: (_, record) => (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        
            {/* Third Plan Switch */}
            <Switch
              onChange={(checked) => handleThirdPlanSwitch(checked, record)}
           
            />
          </div>
        ),
      },
    ],
    []
  );
  
  // Handlers for the additional switches
  const handleSecondPlanSwitch = (checked, record) => {
    console.log(
      `Second Plan switch ${checked ? "enabled" : "disabled"} for record:`,
      record
    );
  };
  
  const handleThirdPlanSwitch = (checked, record) => {
    console.log(
      `Third Plan switch ${checked ? "enabled" : "disabled"} for record:`,
      record
    );
  };
  
  
  
  const PatientList = React.memo(
    () => (
      <Card>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: "max-content" }}
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
    [columns, filteredData, loading, handleTableChange, navigate],
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
        <Tabs items={items}
          tabBarExtraContent={<div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>} />
      </Col>
    </Row>
  );
}