import React, { useCallback, useEffect, useState } from "react";
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
  List,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { UploadOutlined } from "@ant-design/icons";
import { addPatientDocuments, getPatientBloodWork, downloadBloodWork } from "../../redux/doctorSlice";

import {
  getPatientMed,
  addPatientSupplement,
  getPatientSupplements,
  deletePatientMed,
  editPatientMed,
} from "../../redux/doctorSlice";
import moment from "moment";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./medication.css";
import { useRef } from 'react';
import fertilityLogo from '../../../assets/images/auth/fertilityImage.svg';
import { ROUTE_STRENGTH_MAP, MEDICATION_DATA_MAP, ALL_ROUTES, DEFAULT_STRENGTHS } from "../../../utils/medicationData";
const { Text, Link } = Typography;
const { Dragger } = Upload;

// Medication data is now imported from utils/medicationData.js
const MedicationTable = () => {
  const patient = JSON.parse(localStorage.getItem("patient")) || {
    userRef: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const breakpoints = {
  //   xs: 480,
  //   sm: 576,
  //   md: 768,
  //   lg: 992,
  //   xl: 1200,
  // };


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [newLabResultFile, setNewLabResultFile] = useState(null);
  const [newLabResultName, setNewLabResultName] = useState("");
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  //const [isNewLabResultVisible, setIsNewLabResultVisible] = useState(false);
  //const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAddSupplementModalVisible, setIsAddSupplementModalVisible] =
    useState(false);
  const [supplements, setSupplements] = useState([]);
  const [activeTab, setActiveTab] = useState("medications");
  // Add local state for medications
  const [localMedications, setLocalMedications] = useState([]);
  const [serverMedications, setServerMedications] = useState([]);
  // Add local state for editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // State for selected medication
  const [selectedMedication, setSelectedMedication] = useState(null);
  // Add state for selected strength
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [form] = Form.useForm();
  const [supplementForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const med = useSelector((state) => state.doctor.medications);
  const supplementsList = useSelector((state) => state.doctor.supplements);

  // Update server medications when Redux data changes
  useEffect(() => {
    if (med) {
      setServerMedications(med);
    }
  }, [med]);

  const getFileIcon = (filename) => {
    console.log(filename, "lll");

    if (!filename)
      return <FileOutlined style={{ color: "#1890ff", fontSize: 24 }} />;
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "red", fontSize: 24 }} />;
      case "png":
      case "jpg":
      case "jpeg":
        return <FileImageOutlined style={{ color: "#52c41a", fontSize: 24 }} />;
      default:
        return <FileOutlined style={{ color: "#1890ff", fontSize: 24 }} />;
    }
  };
  const openModal = (modalType) => {
    setIsModalVisible(modalType === "patientSelect");
    //setIsNewLabResultVisible(modalType === "newLabResult");
  };

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
  useEffect(() => {
    if (!patient.userRef) {
      setIsModalVisible(true);
    } else {
      dispatch(getPatientMed(patient.userRef));
      dispatch(getPatientSupplements(patient.userRef));
    }
  }, [dispatch, patient.userRef]);



  useEffect(() => {
    if (supplementsList) {
      setSupplements(supplementsList);
    }
  }, [supplementsList]);

  // Load medications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('localMedications');
    if (stored) {
      setLocalMedications(JSON.parse(stored));
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('localMedications', JSON.stringify(localMedications));
  }, [localMedications]);

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

  const fetchPatientBloodWork = useCallback(
    async () => {
      if (!patient.userRef) {
        console.log("Opening patient select modal");
        openModal("patientSelect");
        return;
      }

      console.log("Fetching prescription files (fileType 3)...");
      const resultAction = await dispatch(
        getPatientBloodWork({ patientId: patient.userRef, fileType: 3 })
      );

      if (getPatientBloodWork.fulfilled.match(resultAction)) {
        setPrescriptionFiles(resultAction.payload);
      } else {
        message.error("Failed to fetch prescription files.");
      }
    },
    [patient.userRef, dispatch]
  );
  useEffect(() => {
    fetchPatientBloodWork();
  }, [dispatch, patient.userRef, fetchPatientBloodWork]);

  const handleAdd = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingIndex !== null) {
          // Update existing medication
          setLocalMedications((prev) => prev.map((med, idx) => idx === editingIndex ? {
            drugName: values.drugName,
            strength: values.strength,
            route: values.route,
            dose: values.dose,
            frequency: values.frequency,
            duration: values.duration,
            quantity: values.quantity,
            refills: values.refills,
          } : med));
          setEditingIndex(null);
          message.success("Medication updated locally!");
        } else {
          // Add new medication
          setLocalMedications((prev) => [
            ...prev,
            {
              drugName: values.drugName,
              strength: values.strength,
              route: values.route,
              dose: values.dose,
              frequency: values.frequency,
              duration: values.duration,
              quantity: values.quantity,
              refills: values.refills,
            },
          ]);
          message.success("Medication added locally!");
        }
        setIsAddModalVisible(false);
        form.resetFields();
      } catch (error) {
        message.error("Failed to add medication.");
      }
    });
  };


  // Edit handler
  const handleEditLocal = (record, index) => {
    setEditingIndex(index);
    setIsAddModalVisible(true);
    setTimeout(() => {
      form.setFieldsValue(record);
    }, 0);
  };
  const getFileType = (filename) => {
    if (!filename) return "application/pdf"; // default to PDF
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      default:
        return "application/pdf";
    }
  };
  const handleAddSupplement = () => {
    console.log('Starting supplement add process...');
    supplementForm.validateFields().then(async (values) => {
      console.log('Form values:', values);
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
        console.log('Payload being sent:', payload);

        const result = await dispatch(addPatientSupplement(payload));
        
        if (addPatientSupplement.fulfilled.match(result)) {
          message.success("Supplement added successfully!");
          dispatch(getPatientSupplements(patient.userRef));
          setIsAddSupplementModalVisible(false);
          supplementForm.resetFields();
        } else if (addPatientSupplement.rejected.match(result)) {
          console.error('Supplement add rejected:', result.error);
          message.error("Failed to add supplement. Please try again.");
        } else {
          message.error("Failed to add supplement.");
        }
      } catch (error) {
        console.error('Error details:', error);
        message.error("Failed to add supplement. Please try again.");
      }
    }).catch((error) => {
      console.error('Form validation error:', error);
      message.error("Please check all required fields.");
    });
  };

  const handleDelete = async (record, localIndex) => {
    try {
      // Check if it's a server medication (has id) or local medication
      if (record.id) {
        // Server medication - delete from server
        await dispatch(deletePatientMed(record.id)).unwrap();
        message.success("Medication deleted successfully!");
        dispatch(getPatientMed(patient.userRef));
      } else {
        // Local medication - remove from local state
        setLocalMedications(prev => prev.filter((_, idx) => idx !== localIndex));
        message.success("Medication removed successfully!");
      }
    } catch (error) {
      message.error("Failed to delete medication.");
    }
  };

  const handleEdit = (record) => {
    setEditingMedication(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then(async (values) => {
      try {
        await dispatch(
          editPatientMed({
            ...values,
            id: editingMedication.id,
          })
        ).unwrap();

        message.success("Medication updated successfully!");
        dispatch(getPatientMed(patient.userRef));
        setIsEditModalVisible(false);
        editForm.resetFields();
      } catch (error) {
        console.error('Error details:', error);
        message.error("Failed to update medication.");
      }
    });
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const medicationColumns = [
    { title: 'Name', dataIndex: 'drugName', key: 'drugName', align: 'center' },
    { title: 'Strength', dataIndex: 'strength', key: 'strength', align: 'center' },
    { title: 'Route', dataIndex: 'route', key: 'route', align: 'center' },
    { title: 'Dose', dataIndex: 'dose', key: 'dose', align: 'center' },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', align: 'center' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', align: 'center' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    { title: 'Refills', dataIndex: 'refills', key: 'refills', align: 'center' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record, index) => {
        // Calculate if this is a server medication or local medication
        const isServerMedication = record.id;
        const localIndex = isServerMedication ? null : index - serverMedications.length;
        
        return (
          <>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => isServerMedication ? handleEdit(record) : handleEditLocal(record, localIndex)}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record, localIndex)}
            >
              Delete
            </Button>
          </>
        );
      },
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
            dataSource={[...serverMedications, ...localMedications]}
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
      key: "Prescriptions",
      label: "Prescriptions",
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
          <Card style={{ border: "1px solid #C2E6F8", marginBottom: "24px" }}>
            <Typography.Title level={5} style={{ marginBottom: "16px" }}>
              Prescriptions
            </Typography.Title>
            <List
              dataSource={prescriptionFiles || []}
              renderItem={(file) => (
                <List.Item style={{ padding: '16px 0' }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
                    <div style={{ width: "3px", height: "40px", backgroundColor: "#00ADEF", flexShrink: 0 }} />
                    <div style={{ flex: "1" }}>
                      <Text>{file.filename || file.fileTitle}</Text>
                    </div>
                    <div style={{ flex: "1" }}>
                      <Text>{moment(file.createdOn).format("MMMM DD, YYYY")}</Text>
                    </div>
                    <div style={{ flex: "1", display: "flex", alignItems: "center", gap: 8 }}>
                      {getFileIcon(file.filename)}
                      <Link onClick={() => handleDownload(file.fileRef, file.filename)} style={{ color: "#1890ff" }}>
                        Download
                      </Link>
                    </div>
                    <Link
                      style={{ color: "#1890ff" }}
                      onClick={() => handleDownload(file.fileRef, file.filename)}
                    >
                      Send By Fax
                    </Link>

                    {/* <DeleteOutlined
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDelete(file.fileRef)}
                    /> */}
                  </div>
                </List.Item>
              )}
            />
          </Card>


        </>
      ),
    },
  ];

  const FREQUENCY_TO_DOSES_PER_DAY = {
    'Once daily': 1,
    'Twice daily': 2,
    'Three times daily': 3,
    'Every 4 hours': 6,
    'Every 6 hours': 4,
    'Every 8 hours': 3,
    'Every 12 hours': 2,
    'Once weekly': 1/7,
    'Every other day': 0.5,
    'As needed (PRN)': 1, // default, can be overridden
    'One-time dose': 1,
    'Other': 1
  };

  // Helper to extract days from duration string
  function getDurationInDays(duration) {
    if (!duration) return 1;
    const lower = duration.toLowerCase();
    if (lower.includes('day')) return parseInt(lower);
    if (lower.includes('week')) return parseInt(lower) * 7;
    if (lower.includes('month')) return parseInt(lower) * 30;
    return parseInt(duration) || 1;
  }

  // State for PRN max per day
  const [prnMax, setPrnMax] = useState(1);

  // Helper to generate dose options based on strength and route
  function getDoseOptions(strength, route) {
    if (!strength) return [];
    
    // First check if we have predefined options for this route
    if (route && ROUTE_STRENGTH_MAP[route]) {
      return ROUTE_STRENGTH_MAP[route].map(dose => ({
        label: dose,
        value: dose
      }));
    }
    
    // Fallback to strength-based calculation
    const solidMatch = strength.match(/([\d.]+)\s*(mg|mcg|IU|g|mEq|unit|units|tablet|tab|capsule|cap|patch|suppository|spray|drop|chewable|lozenge|film|wafer|puff|mcg\/hr|mg\/hr|mg\/patch|mcg\/patch|mg\/tab|mg\/cap|mg\/suppository|mg\/spray|mg\/drop|mg\/chewable|mg\/lozenge|mg\/film|mg\/wafer|mg\/puff)?/i);
    const liquidMatch = strength.match(/([\d.]+)\s*(mg|mcg|IU|g|mEq|unit|units)\s*\/\s*([\d.]+)\s*(mL|ml)/i);
    const comboMatch = strength.match(/([\d.]+)\s*(mg|mcg|g|mEq|unit|units)\s*\/\s*([\d.]+)\s*(mg|mcg|g|mEq|unit|units)/i);
    const patchMatch = strength.match(/([\d.]+)\s*mcg\/hr\s*patch/i);
    const percentMatch = strength.match(/([\d.]+)%/);
    let options = [];
    if (liquidMatch) {
      // e.g., 100 mg/5 mL
      const mg = parseFloat(liquidMatch[1]);
      const perMl = parseFloat(liquidMatch[3]);
      for (let i = 0.5; i <= 5; i += 0.5) {
        const dose = (mg / perMl) * i;
        options.push({ label: `${i} mL (${dose} ${liquidMatch[2]})`, value: `${i} mL` });
      }
    } else if (patchMatch) {
      for (let i = 1; i <= 3; i++) {
        options.push({ label: `${i} patch${i > 1 ? 'es' : ''} (${patchMatch[1]} mcg/hr each)`, value: `${i} patch` });
      }
    } else if (percentMatch) {
      for (let i = 1; i <= 3; i++) {
        options.push({ label: `${i} application${i > 1 ? 's' : ''} (${percentMatch[1]}%)`, value: `${i} application` });
      }
    } else if (comboMatch) {
      for (let i = 0.25; i <= 3; i += 0.25) {
        options.push({ label: `${i} tablet${i !== 1 ? 's' : ''} (${i * parseFloat(comboMatch[1])} ${comboMatch[2]} / ${i * parseFloat(comboMatch[3])} ${comboMatch[4]})`, value: `${i} tablet` });
      }
    } else if (solidMatch) {
      const base = parseFloat(solidMatch[1]);
      const unit = solidMatch[2] || 'unit';
      for (let i = 0.25; i <= 3; i += 0.25) {
        options.push({ label: `${i} ${unit}${i !== 1 ? 's' : ''} (${i * base} ${unit})`, value: `${i} ${unit}` });
      }
    }
    return options;
  }

  // Add export and fax handler
  const pdfRef = useRef(null);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const patientInfo = JSON.parse(localStorage.getItem('patient')) || {};
      doc.setFontSize(16);
      doc.text('Prescription Summary', 14, 18);
      doc.setFontSize(12);
      doc.text(`Patient: ${patientInfo.name || 'N/A'}`, 14, 28);
      doc.text(`DOB: ${patientInfo.dob || 'N/A'}`, 14, 36);
      doc.text(`Pharmacy Fax: ${patientInfo.pharmacyFax || 'N/A'}`, 14, 44);
      const medRows = localMedications.map(med => [
        med.drugName,
        med.strength,
        med.dose,
        med.frequency,
        med.duration,
        med.quantity,
        med.refills || '',
        med.specialInstructions || ''
      ]);
      doc.autoTable({
        head: [[
          'Medication', 'Strength', 'Dose', 'Frequency', 'Duration', 'Quantity', 'Refills', 'Special Instructions'
        ]],
        body: medRows,
        startY: 54,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] }
      });
      doc.save('prescription.pdf');
      pdfRef.current = doc;
      message.success('PDF generated and downloaded.');
    } catch (err) {
      console.error('PDF Export Error:', err);
      message.error('Failed to generate PDF. See console for details.');
    }
  };

  const handleFaxToPharmacy = () => {
    try {
      if (!pdfRef.current) {
        message.error('Please export the PDF first.');
        return;
      }
      // Placeholder for faxing logic
      message.success('Faxing to pharmacy (placeholder)...');
      setTimeout(() => {
        message.success('Fax sent to pharmacy!');
        // To simulate error: message.error('Fax transmission failed.');
      }, 1500);
    } catch (err) {
      console.error('Fax Error:', err);
      message.error('Failed to send fax. See console for details.');
    }
  };

  const PrescriptionPreview = ({ patientInfo }) => {
    // Fallback to localStorage if prop not provided
    const info = patientInfo || JSON.parse(localStorage.getItem('patient')) || {};
    console.log('PrescriptionPreview patientInfo:', info);
    const patientName = info.firstname ? `${info.firstname} ${info.lastname || ''}` : (info.name || info.fullName || info.patientName || '');
    const phn = info.phn || info.uli || info.phnUli || '';
    const address = info.address || info.city || '';
    const phone = info.phone || info.patientPhone || info.phoneNumber || '';
    const sex = 'Female';
    let dob = info.dob || info.dateOfBirth || '';
    if (typeof dob === 'string' && dob.includes('T00:00:00')) {
      dob = dob.replace('T00:00:00', '').trim();
    }
    return (
      <div style={{ background: '#fff', padding: 32, width: 600, minHeight: 900, fontFamily: 'Arial, sans-serif', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <img src={fertilityLogo} alt="MyFertility Labs" style={{ height: 48 }} />
          <div style={{ textAlign: 'right', fontSize: 13 }}>
            <b>My Fertility Labs</b><br />
            Ph: 1-403-760-7017<br />
            Fx: 1-825-902-8022
          </div>
        </div>
        <div style={{ fontSize: 12, margin: '12px 0 0 0' }}>
          Edmonton: 11444 17 Ave SW, Edmonton, AB, T6W 2S5<br />
          Leduc: 6207 50 St #102, Leduc, AB T9E 7A9<br />
          Calgary: Suite 280, 7015 Macleod Trail SW, Calgary, Alberta, T2H 2K6
        </div>
        {/* Patient Info */}
        <div style={{ marginTop: 18, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #222', paddingBottom: 4 }}>
            <span><b>Patient Name:</b> {patientName}</span>
            <span><b>PHN (ULI):</b> {phn}</span>
          </div>
          <div style={{ borderBottom: '2px solid #222', padding: '4px 0' }}>
            <b>Address:</b> {address}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #222', padding: '4px 0' }}>
            <span><b>Patient Phone:</b> {phone}</span>
            <span><b>Sex:</b> {sex}</span>
            <span><b>DOB:</b> {dob}</span>
          </div>
        </div>
        {/* RX and Medications */}
        <div style={{ display: 'flex', marginTop: 32 }}>
          <div style={{ fontSize: 64, fontWeight: 'bold', color: '#1a3c6b', marginRight: 32, marginTop: -12 }}>RX</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Date Prescribed: {new Date().toLocaleDateString()}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#eaf6fa' }}>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Medication</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Strength</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Dose</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Frequency</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Duration</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Quantity</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>Refills</th>
                </tr>
              </thead>
              <tbody>
                {localMedications.map((med, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.drugName}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.strength}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.dose}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.frequency}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.duration}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.quantity}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{med.refills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Prescriber Info and Signature */}
        <div style={{ position: 'absolute', left: 0, bottom: 32, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 13 }}>
              <b>Prescriber's Name:</b><br />
              Designation:<br />
              License Number:<br />
              Phone:
            </div>
            <div style={{ textAlign: 'center', fontSize: 13 }}>
              <div style={{ borderBottom: '1px solid #222', width: 220, marginBottom: 4, marginLeft: 'auto' }}></div>
              Signature
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        open={isModalVisible}
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
        open={isAddModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Add"
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed, all) => {
            let freq = all.frequency;
            let dur = all.duration;
            let dosesPerDay = FREQUENCY_TO_DOSES_PER_DAY[freq] || 1;
            let days = 1;
            // Parse duration robustly
            days = getDurationInDays(dur);
            // Special handling for PRN
            if (freq === 'As needed (PRN)') {
              dosesPerDay = prnMax || 1;
            }
            // Once weekly
            if (freq === 'Once weekly') {
              days = Math.ceil(days / 7);
            }
            // Only auto-calc if both present
            if (freq && dur) {
              const quantity = Math.max(1, Math.ceil(dosesPerDay * days));
              form.setFieldsValue({ quantity });
            } else {
              form.setFieldsValue({ quantity: 1 });
            }
          }}
        >
                    <Form.Item
            label="Name"
            name="drugName"
            rules={[
              { required: true, message: "Please select medication name" },
            ]}
          >
            <div style={{maxWidth:"900px"}}>
            <Select
              placeholder="Search and select medication"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              style={{ 
                width: '100% !important', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
              onChange={(value) => {
                setSelectedMedication(value);
                form.setFieldsValue({ drugName: value });
              }}
              options={Object?.keys(MEDICATION_DATA_MAP)
                .sort((a, b) => a.localeCompare(b))
                .map(med => ({
                  label: med,
                  value: med
                }))}
            />
            </div>
          </Form.Item>
          {/* Show Route only after medication is selected */}
          {selectedMedication && (
            <Form.Item
              label="Route"
              name="route"
              rules={[{ required: true, message: "Please select route" }]}
            >
              <select
                placeholder="Select route"
                style={{ 
                  width: '100%', 
                  height: '40px', 
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  padding: '0 11px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
                onChange={(e) => form.setFieldsValue({ route: e.target.value })}
              >
                <option value="">Select route</option>
                {(MEDICATION_DATA_MAP[selectedMedication]?.routes || ALL_ROUTES).map(route => (
                  <option key={route} value={route}>{route}</option>
                ))}
              </select>
            </Form.Item>
          )}
          {/* Show Strength only after medication is selected */}
          {selectedMedication && (
            <Form.Item
              label="Strength"
              name="strength"
              rules={[{ required: true, message: "Please select strength" }]}
            >
              <select
                placeholder="Select strength"
                style={{ 
                  width: '100%', 
                  height: '40px', 
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  padding: '0 11px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
                onChange={(e) => {
                  setSelectedStrength(e.target.value);
                  form.setFieldsValue({ strength: e.target.value });
                }}
              >
                <option value="">Select strength</option>
                {(MEDICATION_DATA_MAP[selectedMedication]?.strengths || DEFAULT_STRENGTHS).map(strength => (
                  <option key={strength} value={strength}>{strength}</option>
                ))}
              </select>
            </Form.Item>
          )}
          {/* Dose field with dynamic options based on selected strength */}
          {selectedStrength && (
          <Form.Item
            label="Dose"
            name="dose"
              rules={[{ required: true, message: "Please select dose" }]}
          >
              <select
                placeholder="Select dose"
                style={{ 
                  width: '100%', 
                  height: '40px', 
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  padding: '0 11px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
                onChange={(e) => form.setFieldsValue({ dose: e.target.value })}
              >
                <option value="">Select dose</option>
                {getDoseOptions(selectedStrength, form.getFieldValue('route')).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
          </Form.Item>
          )}
          {/* Frequency field */}
          <Form.Item
            label="Frequency"
            name="frequency"
            rules={[{ required: true, message: "Please select frequency" }]}
          >
            <select
              placeholder="Select frequency"
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
              onChange={(e) => {
                form.setFieldsValue({ frequency: e.target.value });
                if (e.target.value !== 'As needed (PRN)') setPrnMax(1);
              }}
            >
              <option value="">Select frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Every 4 hours">Every 4 hours</option>
              <option value="Every 6 hours">Every 6 hours</option>
              <option value="Every 8 hours">Every 8 hours</option>
              <option value="Every 12 hours">Every 12 hours</option>
              <option value="Once weekly">Once weekly</option>
              <option value="Every other day">Every other day</option>
              <option value="As needed (PRN)">As needed (PRN)</option>
              <option value="One-time dose">One-time dose</option>
              <option value="Other">Other</option>
            </select>
          </Form.Item>
          {/* PRN max per day helper */}
          {form.getFieldValue('frequency') === 'As needed (PRN)' && (
            <Form.Item label="Max allowed per day?">
              <Input
                type="number"
                min={1}
                value={prnMax}
                onChange={e => setPrnMax(Number(e.target.value) || 1)}
                style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              />
            </Form.Item>
          )}

          {/* Duration field */}
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please enter or select duration" }]}
          >
            <select
              placeholder="Select or enter duration"
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
              onChange={(e) => form.setFieldsValue({ duration: e.target.value })}
            >
              <option value="">Select duration</option>
              <option value="3 days">3 days</option>
              <option value="5 days">5 days</option>
              <option value="7 days">7 days</option>
              <option value="10 days">10 days</option>
              <option value="14 days">14 days</option>
              <option value="21 days">21 days</option>
              <option value="28 days">28 days</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
            </select>
          </Form.Item>

          {/* Quantity field (auto-calculated, read-only) */}
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input
              type="number"
              min={1}
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              placeholder="Auto-calculated based on frequency and duration"
              disabled
            />
          </Form.Item>

          {/* Refills field */}
          <Form.Item
            label="Refills"
            name="refills"
            rules={[{ required: true, message: "Please select refills" }]}
          >
            <select
              placeholder="Select refills"
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
              onChange={(e) => form.setFieldsValue({ refills: e.target.value })}
            >
              <option value="">Select refills</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
            </select>
          </Form.Item>

       
        </Form>
      </Modal>

      {/* Modal for editing medication */}
      <Modal
        title="Edit Medication"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Update"
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="drugName"
            rules={[
              { required: true, message: "Please enter medication name" },
            ]}
          >
            <Input
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Route"
            name="route"
            rules={[{ required: true, message: "Please enter route" }]}
          >
            <Input
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Dose"
            name="dose"
            rules={[{ required: true, message: "Please enter dose" }]}
          >
            <Input
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Frequency"
            name="frequency"
            rules={[{ required: true, message: "Please enter frequency" }]}
          >
            <Input
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <Input
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input
              type="number"
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Refills"
            name="refills"
            rules={[{ required: true, message: "Please enter refills" }]}
          >
            <Input
              type="number"
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                padding: '0 11px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for adding a new supplement */}
      <Modal
        title="Add New Supplement"
        open={isAddSupplementModalVisible}
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
        open={isUploadModalVisible}
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
              await fetchPatientBloodWork();
              message.success("Prescription File uploaded successfully!");
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
          placeholder="Enter Prescription name"
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

      {/* At the bottom of the medication list UI */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: isMobile ? 12 : 24, 
        margin: '32px 0',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center'
      }}>
        <Button
          type="primary"
          size={isMobile ? "middle" : "large"}
          style={{ 
            borderRadius: 8, 
            fontWeight: 'bold', 
            backgroundColor: '#52c41a', 
            borderColor: '#52c41a',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '40px' : 'auto'
          }}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
        <Button
          type="default"
          size={isMobile ? "middle" : "large"}
          style={{ 
            borderRadius: 8, 
            fontWeight: 'bold', 
            border: '2px solid #00ADEF', 
            color: '#00ADEF',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '40px' : 'auto'
          }}
          onClick={handleFaxToPharmacy}
        >
          Fax to Pharmacy
        </Button>
        <Button
          type="dashed"
          size={isMobile ? "middle" : "large"}
          style={{ 
            borderRadius: 8, 
            fontWeight: 'bold', 
            border: '2px dashed #1a3c6b', 
            color: '#1a3c6b',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '40px' : 'auto'
          }}
          onClick={() => setPreviewVisible(true)}
        >
          Prescription Preview
        </Button>
      </div>
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
        style={{ top: 24 }}
        bodyStyle={{ padding: 0, background: '#f8f8f8' }}
        destroyOnClose
      >
        <PrescriptionPreview patientInfo={patient} />
      </Modal>

    </div>
  );
};

export default MedicationTable;