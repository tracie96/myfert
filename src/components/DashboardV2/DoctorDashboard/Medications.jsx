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
  Upload,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { addPatientDocuments } from "../../redux/doctorSlice";

import {
  addPatientMed,
  getPatientMed,
  addPatientSupplement,
  getPatientSupplements,
  deletePatientBloodWork,
} from "../../redux/doctorSlice";

const { Text } = Typography;
const { Dragger } = Upload;
const MedicationTable = () => {
  const patient = JSON.parse(localStorage.getItem("patient")) || {
    userRef: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [newLabResultFile, setNewLabResultFile] = useState(null);
  const [newLabResultName, setNewLabResultName] = useState("");
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
  const showAddPrecriptionModal = () => {
   // setIsAddPrecriptionModalVisible(true);
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
        // Check if all required fields are filled
        const requiredFields = [
          'SupplementName',
          'Dose',
          'Metric',
          'Amount',
          'AmountExtra',
          'Route',
          'Frequency',
          'Notes'
        ];

        const missingFields = requiredFields.filter(field => !values[field]);
        
        if (missingFields.length > 0) {
          message.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
          return;
        }

        // Convert PascalCase to camelCase for API
        const payload = {
          supplementName: values.SupplementName,
          dose: values.Dose,
          metric: values.Metric,
          amount: values.Amount,
          amountExtra: values.AmountExtra,
          route: values.Route,
          frequency: values.Frequency,
          notes: values.Notes,
          patientRef: patient.userRef
        };

        await dispatch(
          addPatientSupplement(payload)
        ).unwrap();

        message.success("Supplement added successfully!");
        dispatch(getPatientSupplements(patient.userRef));
        setIsAddSupplementModalVisible(false);
        supplementForm.resetFields();
      } catch (error) {
        console.error('Error details:', error);
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
  // const precriptionsColumns = [
  //   {
  //     title: "Name",
  //     dataIndex: "supplementName",
  //     key: "name",
  //     render: (text) => <strong>{text}</strong>,
  //   },
  //   {
  //     title: "Dose",
  //     dataIndex: "dose",
  //     key: "dose",
  //   },
  //   {
  //     title: "Metric",
  //     dataIndex: "metric",
  //     key: "metric",
  //   },
  //   {
  //     title: "Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //   },
  //   {
  //     title: "Route",
  //     dataIndex: "route",
  //     key: "route",
  //   },
  //   {
  //     title: "Frequency",
  //     dataIndex: "frequency",
  //     key: "frequency",
  //   },
  //   {
  //     title: "Notes",
  //     dataIndex: "notes",
  //     key: "notes",
  //   },
  //   // {
  //   //     title: "Actions",
  //   //     key: "actions",
  //   //     render: (_, record) => (
  //   //         <>
  //   //             <Button
  //   //                 type="link"
  //   //                 icon={<EditOutlined />}
  //   //                 onClick={() => console.log("Edit", record)}
  //   //             >
  //   //                 Edit
  //   //             </Button>
  //   //             <Button
  //   //                 type="link"
  //   //                 danger
  //   //                 icon={<DeleteOutlined />}
  //   //                 onClick={() => handleDelete(record.key)}
  //   //             >
  //   //                 Delete
  //   //             </Button>
  //   //         </>
  //   //     ),
  //   // },
  // ];

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
    {
      key: "Precriptions",
      label: "Precriptions",
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
            onClick={showAddPrecriptionModal}
          > 
            <Button
              type="primary"
              style={{ background: "#00ADEF", maxWidth: "200px" }}
              onClick={() => setIsUploadModalVisible(true)}
            >
              + Add New Prescription
            </Button>

          </div>
          {/* <Table
            dataSource={precriptions}
            columns={precriptionsColumns}
            pagination={false}
          /> */}
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
        <Form 
          form={supplementForm} 
          layout="vertical"
          initialValues={{
            Metric: 'mg',
            AmountExtra: 'tablets',
            Route: 'oral',
            Frequency: 'daily'
          }}
        >
          <div style={{ padding: "20px 0" }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Supplement Name
              </div>
              <Form.Item name="SupplementName" noStyle rules={[{ required: true, message: 'Please enter supplement name' }]}>
                <Input
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Form.Item>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Dose</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Item name="Dose" noStyle rules={[{ required: true, message: 'Please enter dose' }]}>
                  <Input
                    placeholder="Enter"
                    style={{
                      flex: 3,
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                </Form.Item>
                <Form.Item name="Metric" noStyle rules={[{ required: true, message: 'Please select metric' }]}>
                  <Select
                    placeholder="Select"
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
                </Form.Item>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Amount
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Item name="Amount" noStyle rules={[{ required: true, message: 'Please enter amount' }]}>
                  <Input
                    placeholder="Enter"
                    style={{
                      flex: 1,
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                </Form.Item>
                <Form.Item name="AmountExtra" noStyle rules={[{ required: true, message: 'Please select amount type' }]}>
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
                </Form.Item>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div style={{ marginBottom: "20px", flex: 1 }}>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Route
                </div>
                <Form.Item name="Route" noStyle rules={[{ required: true, message: 'Please select route' }]}>
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
                </Form.Item>
              </div>

              <div style={{ marginBottom: "20px", flex: 1 }}>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Frequency
                </div>
                <Form.Item name="Frequency" noStyle rules={[{ required: true, message: 'Please select frequency' }]}>
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
                </Form.Item>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Notes</div>
              <Form.Item name="Notes" noStyle rules={[{ required: true, message: 'Please enter notes' }]}>
                <Input.TextArea
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Upload New Prescription"
        visible={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setNewLabResultFile(null);
          setNewLabResultName("");
        }}
        onOk={async () => {
          if (!newLabResultFile || !newLabResultName.trim()) {
            message.error("Please select a file and enter a name.");
            return;
          }

          const reader = new FileReader();
          reader.readAsDataURL(newLabResultFile);
          reader.onload = async () => {
            const base64String = reader.result.split(",")[1];
            const payload = {
              patientRef: patient.userRef,
              bloodWork: [
                {
                  base64: base64String,
                  filename: newLabResultFile.name,
                  fileTitle: newLabResultName.trim(),
                  fileType: 3,
                },
              ],
            };

            try {
              await dispatch(addPatientDocuments(payload)).unwrap();
              message.success("Lab result uploaded successfully!");
              setIsUploadModalVisible(false);
              setNewLabResultFile(null);
              setNewLabResultName("");
            } catch (error) {
              message.error("Upload failed.");
            }
          };
        }}
        okText="Upload"
      >
        <Input
          placeholder="Enter lab result name"
          style={{ marginBottom: "15px" }}
          value={newLabResultName}
          onChange={(e) => setNewLabResultName(e.target.value)}
        />
        <Text strong>Upload File</Text>
        <Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          beforeUpload={(file) => {
            const allowedTypes = [
              "application/pdf",
              "image/jpeg",
              "image/jpg",
              "image/png",
            ];
            if (!allowedTypes.includes(file.type)) {
              message.error("Only PDF, JPG, and PNG files are allowed.");
              return Upload.LIST_IGNORE;
            }
            setNewLabResultFile(file);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Drag and drop file</p>
          <p className="ant-upload-hint">- OR -</p>
          <Button icon={<UploadOutlined />}>Browse Files</Button>
        </Dragger>
        {newLabResultFile && (
          <div style={{ marginTop: "10px" }}>
            <Text>Selected File: {newLabResultFile.name}</Text>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MedicationTable;
