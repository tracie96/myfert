import React, { useEffect } from "react";
import { Typography, Row, Col, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Lab from "../../../../assets/images/meds.svg";
import Capsule from "../../../../assets/images/capsule.png";
import { getPatientMed } from "../../../redux/patientSlice";

const { Title, Text } = Typography;


const MedScreen = () => {
    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");
    const dispatch = useDispatch();

    const med = useSelector((state) => state.patient.medication); // Get medications from Redux store
    useEffect(() => {
        dispatch(getPatientMed(userAuth.userRef));
        console.log('Medications from Redux:', med);
    }, [userAuth.userRef, dispatch, med]);


    return (
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
            <Col xs={24} md={18}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                        <Title level={4} style={{ color: "#335CAD" }}>MEDICATION & PRESCRIPTION</Title>
                        <p style={{ color: '#000' }}>
                            You can print the e-prescription and present it to your pharmacy to obtain your medication.
                        </p>
                        <p style={{ marginTop: 10, color: "#000" }}>
                            If you have any questions or concerns about your medications, please contact your assigned clinician for assistance.
                        </p>
                        <br />
                        <Text>Thanks!</Text>
                    </Col>

                    <Col xs={24} md={8}>
                        <img src={Lab} alt="lab" style={{ width: "100%", marginBottom: "20px" }} />
                    </Col>
                </Row>

                <br />
                <div style={{ borderRadius: 5, marginTop: 30 }}>
                    {/* Debug output for Redux data */}
                    <div style={{ marginBottom: 16, color: 'red', fontSize: 12 }}>
                        {/* Redux medications: {JSON.stringify(med)} */}
                    </div>
                    <div
                        style={{
                            padding: "16px 24px",
                            borderRadius: 12,
                            borderWidth: "1px",
                            color: "#000",
                            backgroundColor: "#fff",
                            borderColor: "#C2E6F8",
                            borderStyle: "solid",
                            marginTop: -10,
                        }}
                    >
                        <Table
                          columns={[
                            {
                              title: "Name",
                              dataIndex: "drugName",
                              key: "name",
                              render: text => (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <img src={Capsule} alt="pill" style={{ width: 24, height: 24, marginRight: 6 }} />
                                  <b>{text || 'Unknown Medication'}</b>
                                </span>
                              )
                            },
                            { title: "Dose", dataIndex: "dose", key: "dose", render: text => text || 'N/A' },
                            { title: "Amount", dataIndex: "amount", key: "amount", render: text => text || 'N/A' },
                            { title: "Route", dataIndex: "route", key: "route", render: text => text || 'N/A' },
                            { title: "Frequency", dataIndex: "frequency", key: "frequency", render: text => text || 'N/A' },
                          ]}
                          dataSource={med}
                          rowKey={(record, idx) => idx}
                          pagination={false}
                          style={{ background: 'transparent' }}
                        />
                    </div>
                </div>
            </Col>
            <Col xs={24} md={6}>
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #C2E6F8",
                        borderRadius: 12,
                        padding: 24,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start"
                    }}
                >
                    <Title level={5} style={{ marginBottom: 16, fontWeight: 700 }}>Current Prescription</Title>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c4.svg" alt="PDF" style={{ width: 32, height: 32 }} />
                        <a href="/path/to/E-prescription.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#1890ff", fontWeight: 500 }}>
                            E-prescription.pdf
                        </a>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default MedScreen;
