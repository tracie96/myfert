import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const MedicationTable = () => {
  const patient = JSON.parse(localStorage.getItem("patient")) || {
    userRef: "",
  };
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [medications, setMedications] = useState([
    {
      key: "1",
      name: "Metformin",
      dose: "500 mg",
      amount: "1 tablet",
      route: "PO",
      frequency: "Once a day",
    },
    {
      key: "2",
      name: "Lisinopril",
      dose: "10 mg",
      amount: "1 tablet",
      route: "PO",
      frequency: "Once a day",
    },
  ]);
  const [form] = Form.useForm();

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
    form.validateFields().then((values) => {
      const newMedication = { ...values, key: Date.now().toString() };
      setMedications([...medications, newMedication]);
      setIsAddModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (key) => {
    setMedications(medications.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
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
          <Button type="link" icon={<EditOutlined />} onClick={() => console.log("Edit", record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      {patient ? <Header /> : "Select a patient to view their labs and requisitions"}

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
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter medication name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Dose" name="dose" rules={[{ required: true, message: "Please enter dose" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Please enter amount" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Route" name="route" rules={[{ required: true, message: "Please enter route" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Frequency" name="frequency" rules={[{ required: true, message: "Please enter frequency" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicationTable;
