import React, { useEffect } from "react";
import { Typography, Row, Col, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Lab from "../../../../assets/images/meds.svg";
import Capsule from "../../../../assets/images/capsule.png";
import { getPatientMed } from "../../../redux/patientSlice";

const { Title, Text } = Typography;

const MedScreen = () => {
    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");
    const dispatch = useDispatch();

    const med = useSelector((state) => state.patient.medications); // Get medications from Redux store
    useEffect(() => {

        dispatch(getPatientMed(userAuth.userRef));

    }, [userAuth.userRef,dispatch]);


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
                        <List
                            dataSource={med}
                            renderItem={(medication) => (
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, width: '100%' }}>
                                        {/* Vertical Red Line */}
                                        <div style={{ width: '3px', height: '40px', backgroundColor: '#E26A4E' }}></div>

                                        {/* Icon + Name */}
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={Capsule} alt="pill" style={{ width: 24, height: 24 }} />
                                            <Text style={{ fontWeight: 600 }}>{medication.name || "Unknown Medication"}</Text>
                                        </div>

                                        {/* Dose */}
                                        <div style={{ flex: 1 }}>
                                            <Text>{medication.dose || '500 mg'}</Text>
                                        </div>

                                        {/* Amount */}
                                        <div style={{ flex: 1 }}>
                                            <Text>{medication.amount || '1 tablet'}</Text>
                                        </div>

                                        {/* Route */}
                                        <div style={{ flex: 1 }}>
                                            <Text>{medication.route || 'PO'}</Text>
                                        </div>

                                        {/* Frequency */}
                                        <div style={{ flex: 1 }}>
                                            <Text>{medication.frequency || 'Once a day'}</Text>
                                        </div>

                                        {/* Status */}
                                        <div style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: 500, color: medication.status === 'Active' ? '#52c41a' : '#d9d9d9' }}>
                                                {medication.status || 'Pending'}
                                            </Text>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default MedScreen;
