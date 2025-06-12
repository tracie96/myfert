import React, { useEffect } from "react";
import { Typography, Row, Col, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Lab from "../../../../assets/images/meds.svg";
import Capsule from "../../../../assets/images/capsule.png";
import { getPatientSupplements } from "../../../redux/patientSlice";

const { Title, Text } = Typography;

const SupplementScreen = () => {
    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");
    const dispatch = useDispatch();

    const supplements = useSelector((state) => state.patient.supplements); 
    useEffect(() => {
        dispatch(getPatientSupplements(userAuth.userRef));
    }, [dispatch, userAuth.userRef]);

    console.log('Supplements from Redux:', supplements);

    return (
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
            <Col xs={24} md={18}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={16}>
                        <Title level={4} style={{ color: "#335CAD" }}>SUPPLEMENTS & VITAMINS</Title>
                        <p style={{ color: '#000' }}>
                            Here you can find all your prescribed supplements and vitamins.
                        </p>
                        <p style={{ marginTop: 10, color: "#000" }}>
                            If you have any questions or concerns about your supplements, please contact your assigned clinician for assistance.
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
                              dataIndex: "supplementName",
                              key: "name",
                              render: text => (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <img src={Capsule} alt="pill" style={{ width: 24, height: 24, marginRight: 6 }} />
                                  <b>{text || 'Unknown Supplement'}</b>
                                </span>
                              )
                            },
                            { title: "Dose", dataIndex: "dose", key: "dose", render: text => text || 'N/A' },
                            { title: "Metric", dataIndex: "metric", key: "metric", render: text => text || 'N/A' },
                            { title: "Amount", dataIndex: "amount", key: "amount", render: text => text || 'N/A' },
                            { title: "Route", dataIndex: "route", key: "route", render: text => text || 'N/A' },
                            { title: "Frequency", dataIndex: "frequency", key: "frequency", render: text => text || 'N/A' },
                            { title: "Doctor", dataIndex: "doctorName", key: "doctorName", render: text => text || 'N/A' },
                          ]}
                          dataSource={supplements}
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
                    <Title level={5} style={{ marginBottom: 16, fontWeight: 700 }}>Notes</Title>
                    <div style={{ color: "#666" }}>
                        {supplements?.length > 0 && supplements[0]?.notes ? (
                            <p>{supplements[0].notes}</p>
                        ) : (
                            <p>No additional notes available for your supplements.</p>
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default SupplementScreen;
