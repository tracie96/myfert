import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const Header = () => {
    const userAuth = JSON.parse(localStorage.getItem("patient") || "{}");

    return (
        <div>
            {userAuth?.userRef && (
                <Row style={{marginBottom: "20px" }}>
                    <Col span={24}>
                        <Card
                           style={{
                            border: "1px solid #DAA520",
                            borderRadius: 10,
                            maxWidth: "100%",
                          }}
                        >
                            <Row gutter={16} align="middle" justify="space-between">
                                {/* Left Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Patient:</Text> {`${userAuth?.firstname || 'N/A'} ${userAuth?.lastname || ''}`}
                                    </p>
                                    <p>
                                        <Text strong>Sex:</Text> {userAuth?.partnerGender || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Pronouns:</Text> {userAuth?.pronoun || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>DOB:</Text> {userAuth?.dob ? moment(userAuth.dob).format('MMMM DD, YYYY') : 'N/A'}
                                    </p>
                                </Col>

                                {/* Middle Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Age:</Text> {userAuth?.age || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Status:</Text> {userAuth?.patientStat?.statRemark || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>City:</Text> {userAuth?.city || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Province:</Text> {userAuth?.stateOrProvince || 'N/A'}
                                    </p>
                                </Col>

                                {/* Right Column */}
                                <Col span={12} md={6}>
                                    <p>
                                        <Text strong>Phone #:</Text> {userAuth?.phoneNumber || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Email:</Text> {userAuth?.email || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Partner:</Text> {userAuth?.partner || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Partner's Gender:</Text> {userAuth?.gender || 'N/A'}
                                    </p>
                                    <p>
                                        <Text strong>Partner's Pronouns:</Text> {userAuth?.parterPronoun || 'N/A'}
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
};

export default Header;
