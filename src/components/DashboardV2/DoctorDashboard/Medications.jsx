import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, Typography, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPatientMed, getPatientMed } from "../../redux/doctorSlice";

const { Text } = Typography;

const MedicationTable = () => {
    const patient = JSON.parse(localStorage.getItem("patient")) || {
        userRef: "",
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [medications, setMedications] = useState([]);


    const [form] = Form.useForm();
    const med = useSelector((state) => state.doctor.medications);

    useEffect(() => {
        if (!patient.userRef) {
            setIsModalVisible(true);
        } else {
            dispatch(getPatientMed(patient.userRef));
        }
    }, [dispatch, patient.userRef]);


    useEffect(() => {
        if (med) {
            // Update medications state whenever med changes
            setMedications(med);
        }
    }, [med]);

    useEffect(() => {
        if (!patient.userRef) {
            setIsModalVisible(true);
        }
    }, [patient.userRef]);

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
                    addPatientMed({
                        ...values,
                        patientRef: patient.userRef,
                    })
                ).unwrap();

                message.success("Medication added successfully!");
                dispatch(getPatientMed(patient.userRef)); // Refresh the med list
            } catch (error) {
                message.error("Failed to add medication.");
            }

            setIsAddModalVisible(false);
            form.resetFields();
        });
    };

    const handleDelete = async (key) => {
        try {
            // Assuming you have an API endpoint to delete medication by ID
            // Replace 'deletePatientMed' with your actual API call
            // and adjust the parameter accordingly
            //await dispatch(deletePatientMed(key)).unwrap();
            const updatedMedications = medications.filter(item => item.key !== key);
            setMedications(updatedMedications);

            message.success("Medication deleted successfully!");
            dispatch(getPatientMed(patient.userRef))
        } catch (error) {
            message.error("Failed to delete medication.");
        }

    };

    const columns = [
        {
            title: "Name",
            dataIndex: "drugName",
            key: "name",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Dose",
            dataIndex: "dose",
            key: "dose",
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
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                    >
                        Delete
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
                "Select a patient to view their labs and requisitions"
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
                <p>Please select a patient to view their labs and requisitions.</p>
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
                    <Text strong>Add New Medication</Text>
                </div>

                <Table dataSource={medications} columns={columns} pagination={false} />
            </div>

            {/* Modal for adding a new medication */}
            <Modal
                title="Add New Medication"
                visible={isAddModalVisible}
                onOk={handleAdd}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Add"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name"
                        name="drugName"
                        rules={[
                            { required: true, message: "Please enter medication name" },
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
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: "Please enter amount" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Route"
                        name="route"
                        rules={[{ required: true, message: "Please enter route" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Frequency"
                        name="frequency"
                        rules={[{ required: true, message: "Please enter frequency" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MedicationTable;
