import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Tabs, Button, Table, Card, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cancelAppointment, createMeeting, getUpcomingAppointments, getZohoClientID } from "../../redux/doctorSlice";

export default function AppointmentList() {
  const dispatch = useDispatch();

  const { upcomingAppointments = [] } = useSelector((state) => state.doctor); // default to empty array

  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [searchParam, setSearchParam] = useState("");
  // let [searchParams] = useSearchParams();
  // const grantAuthCode = searchParams.get('code')
  const zohoClientId = JSON.parse(localStorage.getItem("zohoClientId"));
  const baseURL_Grant_Auth = 'https://accounts.zoho.com/oauth/v2/auth';
  const grantAuthScope = 'ZohoMeeting.meeting.CREATE';
  const grantAuthRedirectURI = 'http://localhost:3001/doctor/appointments';
  // const appointmentData = useSelector((state) => state.doctor.appointmentForDoctor?.records);

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


  // useEffect(()=>{
  //   if(!appointmentData || appointmentData.length === 0 ) {
  //     dispatch(getUpcomingAppointmentForDoctor()).then((res)=>{
  //       if(getUpcomingAppointmentForDoctor.fulfilled.match(res)) {
  //         localStorage.setItem("DoctorAppointmentData", JSON.stringify(res.payload.records));
  //       }
  //     })
  //   }
  // },[dispatch, appointmentData])

  // const handleAcceptAppointment = () => {
  //   let doctorAppointments = appointmentData || JSON.parse(localStorage.getItem("DoctorAppointmentData"));
  //   if (doctorAppointments?.length > 0) {
  //     const appointmentID = doctorAppointments?.[0]?.appointId;
  //     localStorage.setItem('meetingAppointmentID', appointmentID);
  //     window.location.href=`${baseURL_Grant_Auth}?scope=${grantAuthScope}&client_id=${zohoClientId}&response_type=code&redirect_uri=${grantAuthRedirectURI}&access_type=offline&state=opaque&prompt=consent`
  //     // handleCreateMeeting(appointmentID)
  //   } else {
  //     console.log('Appointment data is not yet available.');
  //   }
  // }
  // const handleCreateMeeting = async(appointmentID) => {
  //   if(!grantAuthCode) return;
  //     // const retrievedId = localStorage.getItem('meetingAppointmentID');
  //     await dispatch(createMeeting({appointmentId: appointmentID, code: grantAuthCode})).then((result)=>{
  //       console.log('create meeting response',result)
  //       if(createMeeting.fulfilled.match(result)) {
  //         message.success("Meeting is scheduled successfully!");
  //       } else {
  //         message.error(result.error.message || "failed to set appointment")
  //       }
  //     })
  // }

  const handleCreateMeeting = useCallback(async (appointmentID, grantAuthCode) => {
    if (!grantAuthCode || !appointmentID) {
      console.error('Missing authorization code or appointment ID');
      return;
    }
    
    // Call your create meeting action
    await dispatch(createMeeting({ appointmentId: appointmentID, code: grantAuthCode }))
      .then((result) => {
        console.log('create meeting response', result);
        if (createMeeting.fulfilled.match(result)) {
          message.success("Meeting is scheduled successfully!");
        } else {
          message.error(result.error.message || "Failed to set appointment");
        }
      });
  }, [dispatch]); 

  useEffect(() => {
    // Check if the page has returned from the redirect with an authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const grantAuthCode = urlParams.get('code'); // Get authorization code from the URL
    if (grantAuthCode) {
      // Once redirected back and the code is available, call handleCreateMeeting
      const appointmentID = localStorage.getItem('meetingAppID');
      handleCreateMeeting(appointmentID, window.location.search);
    }
  }, [handleCreateMeeting]);  // Empty dependency array ensures this effect runs only once when the component mounts (or when the URL changes)

 
  // useEffect(()=>{
  //   if(!grantAuthCode) return;
  //   async function sendGrantCode () {
  //   let doctorAppointments = appointmentData || JSON.parse(localStorage.getItem("DoctorAppointmentData"));
  //   const appointmentID = doctorAppointments?.[0]?.appointId;
  //     // const retrievedId = localStorage.getItem('meetingAppointmentID');
  //     await dispatch(createMeeting({appointmentId: appointmentID, code: grantAuthCode})).then((result)=>{
  //       if(createMeeting.fulfilled.match(result)) {
  //         message.success("Meeting is scheduled successfully!");
  //         const currentDate = new Date(selectedDate);
  //         const startMonth = currentDate.getMonth() + 1;
  //         const startYear = currentDate.getFullYear();
  //         fetchAndSetAvailability(startYear, startMonth);
  //         // ToDo: joinMeeting()
  //         // joinMeeting();
  //       } else {
  //         message.error(result.error.message || "failed to set appointment")
  //       }
  //     })
     
  //   }
  //   sendGrantCode();
  // },[grantAuthCode, dispatch,fetchAndSetAvailability,selectedDate])

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
  const handleAccept = useCallback((appointId) => {
    message.success(`Appointment ${appointId} accepted.`);
    localStorage.setItem('meetingAppID', appointId);
    window.location.href = `${baseURL_Grant_Auth}?scope=${grantAuthScope}&client_id=${zohoClientId}&response_type=code&redirect_uri=${grantAuthRedirectURI}&access_type=offline&state=opaque&prompt=consent`;
  }, [baseURL_Grant_Auth, grantAuthScope, zohoClientId, grantAuthRedirectURI]);
  
  

  const handleReject = useCallback(
    (appointId) => {
      message.error(`Appointment ${appointId} rejected.`);
      dispatch(cancelAppointment(appointId)).then((result) => {
        if (cancelAppointment.fulfilled.match(result)) {
          message.success("Meeting is canceled successfully!");
          dispatch(getUpcomingAppointments());
        } else {
          message.error(result.error.message || "Failed to cancel the appointment");
        }
      });
    },
    [dispatch] 
  );

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
      // {
      //   title: "Accept Meeting",
      //   key: "accept",
      //   render: (_,record) => (
      //     <Button
      //     type="primary"
      //     onClick={handleAcceptAppointment}
      //     style={{
      //       backgroundColor: "#1E90FF",
      //       border: "none",
      //       width: "100%",
      //       marginBottom: "8px",
      //     }}
      //     >
      //       Accept
      //     </Button>
      //   ),
      // },
    ],
    [handleAccept,handleReject]
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
