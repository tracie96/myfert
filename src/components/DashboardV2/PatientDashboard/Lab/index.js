import React from "react";
import { Card, Typography, Button, Row, Col, List, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import Lab from "../../../../assets/images/lab.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const { Title, Text, Link } = Typography;

const LabResults = ({ lastUpdated, results }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '',
            dataIndex: 'file',
            key: 'file',
            render: file => (
                <div className="file-container">
                    <FontAwesomeIcon icon={faFilePdf} color="red" className="pdf-icon ml-4" style={{fontSize:"20px", marginRight:"4px"}} />
                    <a href={file} target="_blank" rel="noopener noreferrer">LabResults.pdf</a>
                </div>
            )
        }
    ];

    return (
        <Card style={{ border: '1px solid #C2E6F8', borderRadius: 8 , marginTop:"10px"}}>
            <p style={{ fontStyle: 'italic', marginBottom: 16 }}>Last updated: {lastUpdated}</p>
            <Table
                dataSource={results}
                columns={columns}
                pagination={false}
                rowKey="id"
                style={{ overflowX: 'auto' }}
                rowClassName={() => 'lab-result-row'}
            />
        </Card>
    );
};

const LabScreen = () => {
    const bloodworkData = [
        {
            title: "Day 3 Bloodwork",
            fileName: "LabRequisition.pdf",
            uploadedDate: "Feb 1, 2024",
        },
        {
            title: "Peak + 7 Bloodwork",
            fileName: "LabRequisition.pdf",
            uploadedDate: "Feb 1, 2024",
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
            {/* Left Panel */}
            <Col xs={24} md={16}>
                <Title level={4} style={{color:"#335CAD"}}>LABS</Title>
                <Text>
                    Just a quick reminder to print out your lab requisition form before
                    your bloodwork appointment. Having it ready will streamline the
                    process for you.
                </Text>
                <br />
                <Text>Thanks!</Text>
                <div style={{ borderRadius: 12 }}>
                    {/* Section Header */}
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
                            BLOODWORK REQUISITION
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
                            dataSource={bloodworkData}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <FilePdfOutlined style={{ fontSize: "24px", color: "#e74c3c" }} />
                                        }
                                        title={
                                            <Link href="#" style={{ color: "#357EC7" }}>
                                                {item.fileName}
                                            </Link>
                                        }
                                        description={
                                            <>
                                                <Text strong>{item.title}</Text>
                                                <br />
                                                <Text type="secondary">
                                                    Uploaded on: {item.uploadedDate}
                                                </Text>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>

                </div>
                <LabResults
                    lastUpdated="April 1, 2024"
                    results={[
                        { id: 1, name: 'Day 3', date: 'February 1, 2024', file: { name: 'LabResults.pdf', url: '/path-to-file.pdf' } },
                        { id: 2, name: 'Day 3', date: 'February 1, 2024', file: { name: 'LabResults.pdf', url: '/path-to-file.pdf' } },
                    ]}
                />

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
