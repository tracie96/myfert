import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, Typography, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPatientSupplement, getPatientSupplements } from "../../redux/doctorSlice";

const { Text } = Typography;

const SupplementTable = () => {
    const patient = JSON.parse(localStorage.getItem("patient")) || {
        userRef: "",
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [supplements, setSupplements] = useState([]);

    const [form] = Form.useForm();
    const supplementsList = useSelector((state) => state.doctor.supplements);

    useEffect(() => {
        if (!patient.userRef) {
            setIsModalVisible(true);
        } else {
            dispatch(getPatientSupplements(patient.userRef));
        }
    }, [dispatch, patient.userRef]);

    useEffect(() => {
        if (supplementsList) {
            setSupplements(supplementsList);
        }
    }, [supplementsList]);

    const handleModalClose = () => {
        navigate("/doctor");
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleAdd = () => {
        form.validateFields().then(async (values) => {
            try {
                await dispatch(
                    addPatientSupplement({
                        ...values,
                        patientRef: patient.userRef,
                    })
                ).unwrap();

                message.success("Supplement added successfully!");
                dispatch(getPatientSupplements(patient.userRef));
                setIsAddModalVisible(false);
                form.resetFields();
            } catch (error) {
                message.error("Failed to add supplement.");
            }
        });
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "supplementName",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Dose",
            dataIndex: "dose",
            key: "dose",
        },
        {
            title: "Metric",
            dataIndex: "metric",
            key: "metric",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Route",
            dataIndex: "route",
            key: "route",
        },
        {
            title: "Frequency",
            dataIndex: "frequency",
            key: "frequency",
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => console.log("Edit", record)}
                    >
                        Edit
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            {patient ? (
                <Header />
            ) : (
                "Select a patient to view their supplements"
            )}

            {/* Modal for selecting a patient */}
            <Modal
                title="No Patient Selected"
                visible={isModalVisible}
                footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose}>
                        Select Patient
                    </Button>,
                ]}
                closable={false}
                maskClosable={false}
            >
                <p>Please select a patient to view their supplements.</p>
            </Modal>

            <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "20px",
                        cursor: "pointer",
                    }}
                    onClick={showAddModal}
                >
                    <PlusOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
                    <Text strong>Add New Supplement</Text>
                </div>

                <Table dataSource={supplements} columns={columns} pagination={false} />
            </div>

            {/* Modal for adding a new supplement */}
            <Modal
                title="Add New Supplement"
                visible={isAddModalVisible}
                onOk={handleAdd}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Add"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="supplementName"
                        rules={[
                            { required: true, message: "Please enter supplement name" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Dose"
                        name="dose"
                        rules={[{ required: true, message: "Please enter dose" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Metric"
                        name="metric"
                        rules={[{ required: true, message: "Please select metric" }]}
                    >
                        <Select>
                            <Select.Option value="mg">mg</Select.Option>
                            <Select.Option value="g">g</Select.Option>
                            <Select.Option value="ml">ml</Select.Option>
                            <Select.Option value="oz">oz</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: "Please enter amount" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Additional Amount"
                        name="amountExtra"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Route"
                        name="route"
                        rules={[{ required: true, message: "Please select route" }]}
                    >
                        <Select>
                            <Select.Option value="oral">Oral</Select.Option>
                            <Select.Option value="topical">Topical</Select.Option>
                            <Select.Option value="injection">Injection</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Frequency"
                        name="frequency"
                        rules={[{ required: true, message: "Please select frequency" }]}
                    >
                        <Select>
                            <Select.Option value="daily">Daily</Select.Option>
                            <Select.Option value="twice_daily">Twice Daily</Select.Option>
                            <Select.Option value="weekly">Weekly</Select.Option>
                            <Select.Option value="monthly">Monthly</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SupplementTable; 