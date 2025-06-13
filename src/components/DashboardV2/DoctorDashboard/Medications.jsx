import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  Typography,
  message,
  Select,
  Tabs,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addPatientMed,
  getPatientMed,
  addPatientSupplement,
  getPatientSupplements,
  deletePatientBloodWork,
} from "../../redux/doctorSlice";

const { Text } = Typography;

const MedicationTable = () => {
  const patient = JSON.parse(localStorage.getItem("patient")) || {
    userRef: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddSupplementModalVisible, setIsAddSupplementModalVisible] =
    useState(false);
  const [medications, setMedications] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [activeTab, setActiveTab] = useState("medications");

  const [form] = Form.useForm();
  const [supplementForm] = Form.useForm();
  const med = useSelector((state) => state.doctor.medications);
  const supplementsList = useSelector((state) => state.doctor.supplements);

  useEffect(() => {
    if (!patient.userRef) {
      setIsModalVisible(true);
    } else {
      dispatch(getPatientMed(patient.userRef));
      dispatch(getPatientSupplements(patient.userRef));
    }
  }, [dispatch, patient.userRef]);

  useEffect(() => {
    if (med) {
      setMedications(med);
    }
  }, [med]);

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

  const showAddSupplementModal = () => {
    setIsAddSupplementModalVisible(true);
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
        dispatch(getPatientMed(patient.userRef));
        setIsAddModalVisible(false);
        form.resetFields();
      } catch (error) {
        message.error("Failed to add medication.");
      }
    });
  };

  const handleAddSupplement = () => {
    supplementForm.validateFields().then(async (values) => {
      try {
        await dispatch(
          addPatientSupplement({
            ...values,
            patientRef: patient.userRef,
          })
        ).unwrap();

        message.success("Supplement added successfully!");
        dispatch(getPatientSupplements(patient.userRef));
        setIsAddSupplementModalVisible(false);
        supplementForm.resetFields();
      } catch (error) {
        message.error("Failed to add supplement.");
      }
    });
  };

  const handleDelete = async (key) => {
    try {
      await dispatch(deletePatientBloodWork(patient.userRef)).unwrap();
      message.success("Medication deleted successfully!");
      dispatch(getPatientMed(patient.userRef));
    } catch (error) {
      message.error("Failed to delete medication.");
    }
  };

  const medicationColumns = [
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

  const supplementColumns = [
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
    // {
    //     title: "Actions",
    //     key: "actions",
    //     render: (_, record) => (
    //         <>
    //             <Button
    //                 type="link"
    //                 icon={<EditOutlined />}
    //                 onClick={() => console.log("Edit", record)}
    //             >
    //                 Edit
    //             </Button>
    //             <Button
    //                 type="link"
    //                 danger
    //                 icon={<DeleteOutlined />}
    //                 onClick={() => handleDelete(record.key)}
    //             >
    //                 Delete
    //             </Button>
    //         </>
    //     ),
    // },
  ];

  const items = [
    {
      key: "medications",
      label: "Medications",
      children: (
        <>
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
          <Table
            dataSource={medications}
            columns={medicationColumns}
            pagination={false}
          />
        </>
      ),
    },
    {
      key: "supplements",
      label: "Supplements",
      children: (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={showAddSupplementModal}
          >
            <PlusOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
            <Text strong>Add New Supplement</Text>
          </div>
          <Table
            dataSource={supplements}
            columns={supplementColumns}
            pagination={false}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      {patient ? (
        <Header />
      ) : (
        "Select a patient to view their medications and supplements"
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
        <p>
          Please select a patient to view their medications and supplements.
        </p>
      </Modal>

      <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
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

      {/* Modal for adding a new supplement */}
      <Modal
        title="Add New Supplement"
        visible={isAddSupplementModalVisible}
        onOk={handleAddSupplement}
        onCancel={() => setIsAddSupplementModalVisible(false)}
        okText="Add"
        width={500}
      >
        <div style={{ padding: "20px 0" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Supplement Name
            </div>
            <Input
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Dose</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Input
                placeholder="Enter"
                style={{
                  flex: 3,
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                }}
              />
              <Select
                defaultValue="mg"
                style={{
                  flex: 1,
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <Select.Option value="mg">mg</Select.Option>
                <Select.Option value="g">g</Select.Option>
                <Select.Option value="ml">ml</Select.Option>
              </Select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Amount
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Input
                placeholder="Enter"
                style={{
                  flex: 1,
                  height: "40px",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                }}
              />
              <Select
                placeholder="Select"
                style={{
                  flex: 3,
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <Select.Option value="tablets">tablets</Select.Option>
                <Select.Option value="capsules">capsules</Select.Option>
                <Select.Option value="drops">drops</Select.Option>
              </Select>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div style={{ marginBottom: "20px", flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Route
              </div>
              <Select
                placeholder="Select"
                className="w-full select-supplement"
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <Select.Option value="oral">Oral</Select.Option>
                <Select.Option value="topical">Topical</Select.Option>
                <Select.Option value="injection">Injection</Select.Option>
              </Select>
            </div>

            <div style={{ marginBottom: "20px", flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Frequency
              </div>
              <Select
                placeholder="Select"
                className="w-full select-supplement"
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="twice_daily">Twice Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
              </Select>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Notes</div>
            <Input.TextArea
              rows={4}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #d9d9d9",
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MedicationTable;
