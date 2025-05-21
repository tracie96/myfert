import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, List, message } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import Lab from "../../../../assets/images/lab.png";
import { downloadBloodWork, getPatientLabs } from "../../../redux/patientSlice";
import moment from 'moment';

const { Title, Text, Link } = Typography;

// const LabResults = () => {
//     const dispatch = useDispatch();  

//     const { bloodWork, lastUpdated } = useSelector((state) => state?.patient);

//     const handleDownload = async (fileRef) => {
//         try {
//             const resultAction = await dispatch(downloadBloodWork(fileRef));
//             if (downloadBloodWork.fulfilled.match(resultAction)) {
//                 const blob = new Blob([resultAction.payload], { type: "application/pdf" });
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = `${fileRef}.pdf`;
//                 document.body.appendChild(a);
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//             } else {
//                 message.error("Failed to download file.");
//             }
//         } catch (error) {
//             message.error("Download error.");
//         }
//     };

//     const columns = [
//         {
//             title: 'File Name',
//             dataIndex: 'filename',
//             key: 'filename',
//             render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
//         },
//         {
//             title: 'Title',
//             dataIndex: 'fileTitle',
//             key: 'fileTitle',
//         },
//         {
//             title: 'Created On',
//             dataIndex: 'createdOn',
//             key: 'createdOn',
//             render: (text) => new Date(text).toLocaleDateString(),
//         },
//         {
//             title: '',
//             dataIndex: 'fileRef',
//             key: 'fileRef',
//             render: (fileRef) => (
//                 <div className="file-container">
//                     <FontAwesomeIcon icon={faFilePdf} color="red" className="pdf-icon ml-4" style={{ fontSize: "20px", marginRight: "4px" }} />
//                     <Link onClick={() => handleDownload(fileRef)} style={{ color: "#1890ff", cursor: "pointer" }}>
//                         Download
//                     </Link>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <Card style={{ border: '1px solid #C2E6F8', borderRadius: 8, marginTop: "10px" }}>
//             <p style={{ fontStyle: 'italic', marginBottom: 16 }}>Last updated: {lastUpdated}</p>
//             <Table
//                 dataSource={bloodWork}
//                 columns={columns}
//                 pagination={false}
//                 rowKey="id"
//                 style={{ overflowX: 'auto' }}
//                 rowClassName={() => 'lab-result-row'}
//             />
//         </Card>
//     );
// };

const LabScreen = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.patient);
    const [labRequisitions, setLabRequisitions] = useState([]);
    const [labResults, setLabResults] = useState([]);

    useEffect(() => {
        // Fetch lab requisitions (type 1)
        dispatch(getPatientLabs(2)).then((result) => {
            if (getPatientLabs.fulfilled.match(result)) {
                setLabRequisitions(result.payload);
            }
        });

        // Fetch lab results (type 2)
        dispatch(getPatientLabs(1)).then((result) => {
            if (getPatientLabs.fulfilled.match(result)) {
                setLabResults(result.payload);
            }
        });
    }, [dispatch]);

    const handleDownload = async (fileRef) => {
        try {
            const resultAction = await dispatch(downloadBloodWork(fileRef));
            if (downloadBloodWork.fulfilled.match(resultAction)) {
                const blob = new Blob([resultAction.payload], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${fileRef}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                message.error("Failed to download file.");
            }
        } catch (error) {
            message.error("Download error.");
        }
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
            <Col xs={24} md={16}>
                <Title level={4} style={{ color: "#335CAD" }}>LABS</Title>
                <Text>
                    Just a quick reminder to print out your lab requisition form before
                    your bloodwork appointment. Having it ready will streamline the
                    process for you.
                </Text>
                <br />
                <Text>Thanks!</Text>
                <div style={{ borderRadius: 12 }}>
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#335CAD",
                            borderRadius: "12px 12px 0 0",
                            height: "61px",
                            marginTop: 40,
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
                            LAB REQUISITION
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
                            dataSource={labRequisitions}
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
                                            <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />
                                            <Link onClick={() => handleDownload(file.fileRef)} style={{ color: "#1890ff", cursor: "pointer" }}>
                                                {file.filename || 'LabResults.pdf'}
                                            </Link>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
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
                            LAB RESULTS
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
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 15, width: '100%' }}>
                                        <div style={{ width: '3px', height: '40px', backgroundColor: 'red' }}></div>

                                        <div style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: 500 }}>{file.filename}</Text>
                                            <br />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: 500 }}>
                                                {file.createdOn ? moment(file.createdOn).format('MMMM DD, YYYY') : 'No date available'}
                                            </Text>
                                            <br />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />
                                            <Link onClick={() => handleDownload(file.fileRef)} style={{ color: "#1890ff", cursor: "pointer" }}>
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

            <Col xs={24} md={8}>
                <img
                    src={Lab}
                    alt="lab"
                    style={{ width: "100%", marginBottom: "20px" }}
                />
                <Card
                    style={{
                        borderRadius: "8px",
                        backgroundColor: "#FFF6F0",
                        textAlign: "center",
                    }}
                >
                    <Text>
                        To learn more about:
                        <br />
                        <ul style={{ textAlign: "left" }}>
                            <li>Day 3 bloodwork</li>
                            <li>Peak + 7 bloodwork</li>
                        </ul>
                        Including how to properly identify and schedule it, please visit the{" "}
                        <Text strong>Learn</Text> section or click down below for further
                        details.
                    </Text>
                    <Button
                        type="primary"
                        style={{ marginTop: "20px", borderRadius: "5px", background: "#335CAD" }}
                    >
                        Learn More
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default LabScreen;
