import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Table, List, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FilePdfOutlined, FileImageOutlined, FileOutlined } from "@ant-design/icons";
import { downloadBloodWork } from "../../../redux/patientSlice";
import Lab from "../../../../assets/images/meds.svg";
import Capsule from "../../../../assets/images/capsule.png";
import { getPatientMed, getPatientLabs } from "../../../redux/patientSlice";
import moment from 'moment';
const { Title, Text, Link} = Typography;

const getFileIcon = (filename) => {
    if (!filename) return <FileOutlined style={{ color: '#1890ff', fontSize: 24 }} />;

    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />;
        case 'png':
        case 'jpg':
        case 'jpeg':
            return <FileImageOutlined style={{ color: '#52c41a', fontSize: 24 }} />;
        default:
            return <FileOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
    }
};

const MedScreen = () => {

    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");
    const dispatch = useDispatch();
    const [labResults, setLabResults] = useState([]);

    const getFileType = (filename) => {
        if (!filename) return 'application/pdf';
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'png':
                return 'image/png';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            default:
                return 'application/pdf';
        }
    };

    const med = useSelector((state) => state.patient.medication); // Get medications from Redux store
    useEffect(() => {
        dispatch(getPatientMed(userAuth.userRef));
    }, [userAuth.userRef, dispatch]);

    // Separate useEffect for logging med changes
    useEffect(() => {
        console.log('Medications from Redux:', med);
    }, [med]);

    useEffect(() => {

        dispatch(getPatientLabs(3)).then((result) => {
            if (getPatientLabs.fulfilled.match(result)) {
                setLabResults(result.payload);
            }
        });
    }, [dispatch]);

    const handleDownload = async (fileRef, filename) => {
        try {
            const resultAction = await dispatch(downloadBloodWork(fileRef));
            if (downloadBloodWork.fulfilled.match(resultAction)) {
                const mimeType = getFileType(filename);
                const blob = new Blob([resultAction.payload], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename || `${fileRef}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                message.error("Failed to download file.");
            }
        } catch (error) {
            message.error("Download error.");
        }
    };

    return (
        <Row style={{ padding: "20px" }}>
            <Col xs={24} md={24}>
                <Row align="middle">
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
                <div style={{ marginTop: 40, borderRadius: 12 }}>
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#335CAD",
                            borderRadius: "12px 12px 0 0",
                            height: "61px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            paddingLeft: 24,
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                color: "#fff",
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}
                        >
                            PRESCRIPTION RESULT
                        </h3>
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
                        <List
                            dataSource={labResults}
                            renderItem={(file) => (
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '40px 1.5fr 1fr 1.5fr',
                                            alignItems: 'center',
                                            width: '100%',
                                            gap: 15,
                                        }}
                                    >
                                        <div style={{ width: '3px', height: '40px', backgroundColor: 'red' }}></div>
                                        <div>
                                            <Text style={{ fontWeight: 500 }}>{file.filename}</Text>
                                        </div>
                                        <div>
                                            <Text style={{ fontWeight: 500 }}>
                                                {file.createdOn ? moment(file.createdOn).format('MMMM DD, YYYY') : 'No date available'}
                                            </Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {getFileIcon(file.filename)}
                                            <Link onClick={() => handleDownload(file.fileRef, file.filename)} style={{ color: "#1890ff", cursor: "pointer" }}>
                                                {file.filename || 'LabResults.pdf'}
                                            </Link>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </Col>
            {/* <Col xs={24} md={6}>
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
                  
                </div>
            </Col> */}
        </Row>
    );
};

export default MedScreen;
