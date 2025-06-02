import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

export default function Header() {
    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");

    return (
        <div>
            {userAuth?.userRef && (
                <Row style={{ padding: "0 1%" }}>
                    <Col span={24}>
                        <Card
                            style={{
                                borderRadius: 10,
                                maxWidth: "100%",
                                background: '#DDF5FE',
                            }}
                        >
                            <Row gutter={16} align="middle" justify="space-between">
                                {/* Left Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Patient:</Text> {userAuth.lastname || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Sex:</Text> {userAuth.sex || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Pronouns:</Text> {userAuth.pronouns || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>DOB:</Text> {userAuth.dob ? moment(userAuth.dob).format('MMMM DD, YYYY') : "N/A"}
                                    </p>
                                </Col>

                                {/* Middle Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Healthcare #:</Text> {userAuth.healthcare || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Status:</Text> {userAuth.status || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>LMP:</Text> {userAuth.lmp || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Past MC #:</Text> {userAuth.pastMc || "N/A"}
                                    </p>
                                </Col>

                                {/* Right Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Phone #:</Text> {userAuth.phoneNumber || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Email:</Text> {userAuth.email || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Partner:</Text> {userAuth.partner || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Partner's Sex:</Text> {userAuth.partnerSex || "N/A"}
                                    </p>
                                    <p>
                                        <Text strong>Partner's Pronouns:</Text> {userAuth.partnerPronouns || "N/A"}
                                    </p>
                                </Col>

                                {/* HCP Last Visits - Inline */}
                                <Col>
                                    <Text style={{ color: "#1890ff", cursor: "pointer" }}>
                                        <strong>HCP's Last Visits  <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
</strong>
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}
