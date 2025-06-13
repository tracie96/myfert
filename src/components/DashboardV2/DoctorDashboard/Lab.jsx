import React, { useCallback, useEffect, useState } from "react";
import {
  Upload,
  List,
  Typography,
  message,
  Card,
  Modal,
  Button,
  Input,
  Row,
  Col,
} from "antd";
import {
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  UploadOutlined,
  FileImageOutlined,
  FileOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientBloodWork,
  deletePatientBloodWork,
  downloadBloodWork,
  addPatientDocuments,
  fetchDocumo,
  downloadDocumo,
} from "../../redux/doctorSlice";
import moment from "moment";
const { Dragger } = Upload;
const { Text, Link } = Typography;

// Add responsive breakpoints
const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const LabsAndRequisitions = () => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const [bloodWorkFile1, setBloodWorkFile1] = useState(null);
  const [bloodWorkFile2, setBloodWorkFile2] = useState(null);
  const status = useSelector((state) => state.doctor.status);
  const error = useSelector((state) => state.doctor.error);
  const patient = JSON.parse(localStorage.getItem("patient")) || {
    userRef: "",
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewLabResultVisible, setIsNewLabResultVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditRequisitionModalVisible, setIsEditRequisitionModalVisible] =
    useState(false);
  const [newLabResultFile, setNewLabResultFile] = useState(null);
  const [newLabResultName, setNewLabResultName] = useState("");
  const [isNewRequisitionVisible, setIsNewRequisitionVisible] = useState(false);
  const [newRequisitionFile, setNewRequisitionFile] = useState(null);
  const [newRequisitionName, setNewRequisitionName] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const documoData = useSelector((state) => state.doctor.documoData);
  const documoLoading = useSelector((state) => state.doctor.documoLoading);

  // Filter documoData for current patient
  const filteredDocumoData =
    documoData?.filter((doc) => doc.patientRef === patient.userRef) || [];

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add useEffect to fetch Documo data
  useEffect(() => {
    if (patient.userRef) {
      dispatch(fetchDocumo());
      console.log("Fetching Documo data for patient:", patient.userRef);
    }
  }, [dispatch, patient.userRef]);

  const isMobile = windowWidth <= breakpoints.sm;

  console.log({
    bloodWorkFile1,
    bloodWorkFile2,
    documoData,
    documoLoading,
    filteredDocumoData,
  });
  const openModal = (modalType) => {
    setIsModalVisible(false);
    setIsNewLabResultVisible(false);
    setIsEditModalVisible(false);
    setIsNewRequisitionVisible(false);
    setIsEditRequisitionModalVisible(false);

    switch (modalType) {
      case "patientSelect":
        setIsModalVisible(true);
        break;
      case "newLabResult":
        setIsNewLabResultVisible(true);
        break;
      case "editLabResult":
        setIsEditModalVisible(true);
        break;
      case "newRequisition":
        setIsNewRequisitionVisible(true);
        break;
      case "editRequisition":
        setIsEditRequisitionModalVisible(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (modalType) => {
    switch (modalType) {
      case "patientSelect":
        setIsModalVisible(false);
        break;
      case "newLabResult":
        setIsNewLabResultVisible(false);
        setNewLabResultFile(null);
        setNewLabResultName("");
        break;
      case "editLabResult":
        setIsEditModalVisible(false);
        break;
      case "newRequisition":
        setIsNewRequisitionVisible(false);
        setNewRequisitionFile(null);
        setNewRequisitionName("");
        break;
      case "editRequisition":
        setIsEditRequisitionModalVisible(false);
        break;
      default:
        break;
    }
  };
  const fetchPatientBloodWork = useCallback(
    async (fileType) => {
      if (!patient.userRef) {
        console.log("Opening patient select modal");
        openModal("patientSelect");
      } else {
        console.log(`Fetching patient blood work for fileType ${fileType}...`);
        const resultAction = await dispatch(
          getPatientBloodWork({ patientId: patient.userRef, fileType })
        );

        if (getPatientBloodWork.fulfilled.match(resultAction)) {
          if (fileType === 1) {
            setBloodWorkFile1(resultAction.payload);
          } else if (fileType === 2) {
            setBloodWorkFile2(resultAction.payload);
          }
        }
      }
    },
    [patient.userRef, dispatch]
  );

  useEffect(() => {
    fetchPatientBloodWork(1);
  }, [dispatch, patient.userRef, fetchPatientBloodWork]);

  useEffect(() => {
    fetchPatientBloodWork(2);
  }, [dispatch, patient.userRef, fetchPatientBloodWork]);

  useEffect(() => {
    if (patient.userRef) {
      dispatch(fetchDocumo());
    }
  }, [dispatch, patient.userRef]);

  useEffect(() => {
    if (bloodWorkFile1) {
      setFiles(
        bloodWorkFile1.map((file) => ({
          id: file.fileRef,
          name: file.filename,
          date: file.createdOn,
          title: file.fileTitle,
        }))
      );
    } else if (status === "failed") {
      message.error(error || "Failed to retrieve files.");
    }
  }, [bloodWorkFile1, status, error]);

  const handleModalClose = () => {
    navigate("/doctor");
    closeModal("patientSelect");
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

  // const handleNewLabResultUpload = (info) => {
  //     if (info.file.type !== 'application/pdf') {
  //         message.error('Only PDF files are allowed.');
  //         setNewLabResultFile(null);
  //         return;
  //     }
  //     setNewLabResultFile(info.file);
  // };

  const handleNewLabResultNameChange = (e) => {
    setNewLabResultName(e.target.value);
  };

  const handleAddLabResult = async () => {
    if (!newLabResultFile) {
      message.error("Please upload a lab result file.");
      return;
    }
    if (!newLabResultName.trim()) {
      message.error("Please enter a lab result name.");
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
            fileType: 1, // lab report file type
          },
        ],
      };

      try {
        const resultAction = await dispatch(addPatientDocuments(payload));
        if (addPatientDocuments.fulfilled.match(resultAction)) {
          // Fetch updated blood work to refresh the list
          await fetchPatientBloodWork(1);
          message.success(`${newLabResultName} uploaded successfully.`);
          closeModal("newLabResult");
          setNewLabResultFile(null);
          setNewLabResultName("");
        }
      } catch (error) {
        message.error(`Error uploading ${newLabResultName}: ${error.message}`);
      }
    };
  };

  const handleDelete = async (fileId) => {
    console.log(fileId, "fila");
    try {
      await dispatch(deletePatientBloodWork(fileId)).unwrap();
      // Update both files and bloodWorkFile2 states
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      setBloodWorkFile2((prevFiles) =>
        prevFiles.filter((file) => file.fileRef !== fileId)
      );
      message.success("File deleted successfully.");
    } catch (error) {
      message.error("Failed to delete file.");
    }
  };

  // const uploadProps = {
  //   name: "file",
  //   multiple: false,
  //   showUploadList: false,
  //   beforeUpload: (file) => {
  //     if (bloodWorkFile2.length >= 2) {
  //       // Enforce max 2 files
  //       message.error("You can only upload a maximum of 2 files.");
  //       return Upload.LIST_IGNORE;
  //     }
  //     const allowedTypes = [
  //       "application/pdf",
  //       "image/jpeg",
  //       "image/jpg",
  //       "image/png",
  //     ];
  //     if (!allowedTypes.includes(file.type)) {
  //       message.error("Only PDF, JPG, and PNG files are allowed.");
  //       return Upload.LIST_IGNORE;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       const base64String = reader.result.split(",")[1];
  //       const payload = {
  //         patientRef: patient.userRef,
  //         bloodWork: [
  //           {
  //             base64: base64String,
  //             filename: file.name,
  //             fileTitle: newLabResultName.trim(),
  //             fileType: 2,
  //           },
  //         ],
  //       };

  //       try {
  //         await dispatch(addPatientDocuments(payload));
  //         await fetchPatientBloodWork(2); // Refresh the list after upload
  //         message.success(`${file.name} uploaded successfully.`);
  //       } catch (error) {
  //         message.error(`Error uploading ${file.name}: ${error.message}`);
  //       }
  //     };

  //     reader.readAsDataURL(file);
  //     return false; // Prevent automatic upload
  //   },
  //   fileList: [], // Keep fileList empty to hide files
  // };

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

  const handleNewRequisitionNameChange = (e) => {
    setNewRequisitionName(e.target.value);
  };

  const handleAddRequisition = async () => {
    if (!newRequisitionFile) {
      message.error("Please upload a requisition file.");
      return;
    }
    if (!newRequisitionName.trim()) {
      message.error("Please enter a requisition name.");
      return;
    }

    if ((bloodWorkFile2 || []).length >= 2) {
      message.error("You can only upload a maximum of 2 files.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(newRequisitionFile);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];
      const payload = {
        patientRef: patient.userRef,
        bloodWork: [
          {
            base64: base64String,
            filename: newRequisitionFile.name,
            fileTitle: newRequisitionName.trim(),
            fileType: 2, // requisition file type
          },
        ],
      };

      try {
        const resultAction = await dispatch(addPatientDocuments(payload));
        if (addPatientDocuments.fulfilled.match(resultAction)) {
          await fetchPatientBloodWork(2);
          message.success(`${newRequisitionName} uploaded successfully.`);
          closeModal("newRequisition");
          setNewRequisitionFile(null);
          setNewRequisitionName("");
        }
      } catch (error) {
        message.error(
          `Error uploading ${newRequisitionName}: ${error.message}`
        );
      }
    };
  };

  // Add handleDownloadDocumo function
  const handleDownloadDocumo = async (messageNumber) => {
    try {
      const response = await dispatch(downloadDocumo(messageNumber)).unwrap();
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `documo_${messageNumber}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success("Document downloaded successfully");
    } catch (error) {
      message.error("Failed to download document");
      console.error("Download error:", error);
    }
  };

  return (
    <>
      {patient ? (
        <Header />
      ) : (
        "Select a patient to view their labs and requisitions"
      )}
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
        <p>Please select a patient to view their labs and requisitions.</p>
      </Modal>
  

      <div className="p-6 mt-4" style={{ padding: "24px" }}>
        <Typography.Title level={4} style={{ marginBottom: "30px" }}>
          LABS AND REQUISITIONS
        </Typography.Title>

        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text type="secondary">
                Last updated:{" "}
                {(files || []).length > 0
                  ? moment(files[files.length - 1].date).format("MMMM DD, YYYY")
                  : "N/A"}
              </Text>
              <Button
                type="primary"
                style={{
                  background: "#00ADEF",
                  maxWidth: "200px",
                }}
                onClick={() => openModal("newLabResult")}
              >
                + New Lab Result
              </Button>
            </div>

            <Card style={{ border: "1px solid #C2E6F8", marginBottom: "24px" }}>
              <Typography.Title level={5} style={{ marginBottom: "16px" }}>
                Lab Results
              </Typography.Title>
              <List
                dataSource={files || []}
                renderItem={(file) => (
                  <List.Item style={{ padding: '16px 0' }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
                      <div style={{ width: "3px", height: "40px", backgroundColor: "red", flexShrink: 0 }} />
                      <div style={{ flex: "1" }}>
                        <Text>
                          {isMobile 
                            ? file.name.split(' ').slice(0, 6).join(' ') + (file.name.split(' ').length > 6 ? '...' : '')
                            : file.name
                          }
                        </Text>
                      </div>
                      <div style={{ flex: "1" }}>
                        <Text>{moment(file.date).format("MMMM DD, YYYY")}</Text>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1" }}>
                        {getFileIcon(file?.filename || file?.name)}
                        <Link
                          style={{ color: "#1890ff" }}
                          onClick={() => handleDownload(file.id, file?.filename || file?.name)}
                        >
                          {file.title}
                        </Link>
                      </div>
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer", flexShrink: 0 }}
                        onClick={() => handleDelete(file.id)}
                      />
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                type="secondary"
                style={{ fontStyle: "italic", fontSize: "14px" }}
              >
                (max 2 requisitions)
              </Text>
              <Button
                type="primary"
                style={{
                  background: "#00ADEF",
                  maxWidth: "200px",
                }}
                onClick={() => {
                  if ((bloodWorkFile2 || []).length >= 2) {
                    message.error("You can only upload a maximum of 2 files.");
                    return;
                  }
                  openModal("newRequisition");
                }}
              >
                + Add Requisition
              </Button>
            </div>

            <Card style={{ border: "1px solid #C2E6F8", marginBottom: "24px" }}>
              <Typography.Title level={5} style={{ marginBottom: "16px" }}>
                Requisitions
              </Typography.Title>
              <List
                dataSource={bloodWorkFile2 || []}
                renderItem={(file, index) => (
                  <List.Item style={{ padding: '16px 0' }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "16px" }}>
                      <div style={{ width: "3px", height: "40px", backgroundColor: "red", flexShrink: 0 }} />
                      <div style={{ flex: "1" }}>
                        <Text>{index === 0 ? "Day 1 " : "Day 2 "}</Text>
                      </div>
                      {/* <div style={{ flex: "1" }}>
                        <Text>{file.fileTitle || file.filename || "Requisition.pdf"}</Text>
                      </div> */}
                      <div style={{ flex: "1" }}>
                        <Text>{moment(file.createdOn).format("MMMM DD, YYYY")}</Text>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1" }}>
                        {getFileIcon(file?.filename)}
                        <Link
                          style={{ color: "#1890ff" }}
                          onClick={() => handleDownload(file.fileRef, file.filename)}
                        >
                          new
                        </Link>
                      </div>
                      <DeleteOutlined
                        style={{ color: "red", cursor: "pointer", flexShrink: 0 }}
                        onClick={() => handleDelete(file.fileRef)}
                      />
                    </div>
                  </List.Item>
                )}
              />
            </Card>
            <Typography.Title level={4} style={{ marginBottom: "30px" }}>
        FAX DOCUMENTS
      </Typography.Title>
      <Card style={{ border: "1px solid #C2E6F8" }}>
        <Typography.Title level={5} style={{ marginBottom: "16px" }}>
          {documoLoading && <Text type="secondary"> (Loading...)</Text>}
        </Typography.Title>

        {documoLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Loading Documo data...
          </div>
        ) : filteredDocumoData.length > 0 ? (
          <List
            dataSource={filteredDocumoData}
            renderItem={(doc) => (
              <List.Item style={{ padding: '16px 0' }}>
                <div style={{ display: "flex", alignItems: "flex-start", width: "100%", gap: "16px" }}>
                  <div style={{ width: "3px", height: "100%", minHeight: isMobile ? "300px" : "40px", backgroundColor: "#00ADEF", flexShrink: 0 }} />
                  {isMobile ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <Text type="secondary">Patient Name</Text>
                        <div>
                          <Text>{doc.patientName}</Text>
                        </div>
                      </div>
                      
                      <div>
                        <Text type="secondary">Date Received</Text>
                        <div>
                          <Text>{moment(doc.faxReceivedAt).format("MMMM DD, YYYY")}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Message Number</Text>
                        <div>
                          <Text>{doc.messageNumber}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Pages</Text>
                        <div>
                          <Text>{doc.pageCount}</Text>
                        </div>
                      </div>

                      <div>
                        <Text type="secondary">Patient Ref</Text>
                        <div>
                          <Text>{doc.patientRef}</Text>
                        </div>
                      </div>

                      <Button
                        type="link"
                        style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                        onClick={() => handleDownloadDocumo(doc.messageNumber)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <DownloadOutlined />
                          <span>Download</span>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", flex: 1, gap: "16px" }}>
                      <div style={{ flex: "1" }}>
                        <Text>{doc.patientName}</Text>
                      </div>
                      <div style={{ flex: "1" }}>
                        <Text>{moment(doc.faxReceivedAt).format("MMM DD, YYYY")}</Text>
                      </div>
                      <div style={{ flex: "1" }}>
                        <Text>{doc.messageNumber}</Text>
                      </div>
                      <div style={{ flex: "0 0 50px" }}>
                        <Text>{doc.pageCount}</Text>
                      </div>
                      <div style={{ flex: "1" }}>
                        <Text>{doc.patientRef}</Text>
                      </div>
                      <Button
                        type="link"
                        style={{ flexShrink: 0 }}
                        onClick={() => handleDownloadDocumo(doc.messageNumber)}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Text type="secondary">
              {patient.userRef
                ? "No fax documents found for this patient"
                : "Please select a patient to view their fax documents"}
            </Text>
            <div style={{ marginTop: "10px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Debug info: Patient userRef: {patient.userRef || "none"}, Documo
                data count: {documoData?.length || 0}
              </Text>
            </div>
          </div>
        )}
      </Card>
          </Col>

          
        </Row>
      </div>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: isMobile ? "16px" : "20px",
            }}
          >
            <LeftOutlined
              onClick={() => closeModal("newLabResult")}
              style={{ cursor: "pointer" }}
            />
            <Text strong>NEW LAB RESULT</Text>
          </div>
        }
        open={isNewLabResultVisible}
        onCancel={() => closeModal("newLabResult")}
        width={isMobile ? "100%" : 520}
        style={{ top: isMobile ? 0 : 100 }}
        footer={[
          <Button key="cancel" onClick={() => closeModal("newLabResult")}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleAddLabResult}
            style={{
              background: "#00ADEF",
            }}
          >
            Add Lab Result
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter lab result name"
          style={{ marginBottom: "15px" }}
          value={newLabResultName}
          onChange={handleNewLabResultNameChange}
        />
        <Text strong>Upload lab result</Text>
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
          style={{ padding: isMobile ? "12px" : "24px" }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Drag and drop</p>
          <p className="ant-upload-hint">- OR -</p>
          <Button icon={<UploadOutlined />}>Browse Files</Button>
        </Dragger>
        {newLabResultFile && (
          <div style={{ marginTop: "10px" }}>
            <Text>Selected File: {newLabResultFile.name}</Text>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: isMobile ? "16px" : "20px",
            }}
          >
            <LeftOutlined
              onClick={() => closeModal("newRequisition")}
              style={{ cursor: "pointer" }}
            />
            <Text strong>NEW REQUISITION</Text>
          </div>
        }
        open={isNewRequisitionVisible}
        onCancel={() => closeModal("newRequisition")}
        width={isMobile ? "100%" : 520}
        style={{ top: isMobile ? 0 : 100 }}
        footer={[
          <Button key="cancel" onClick={() => closeModal("newRequisition")}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleAddRequisition}
            style={{
              background: "#00ADEF",
            }}
          >
            Add Requisition
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter requisition name"
          style={{ marginBottom: "15px" }}
          value={newRequisitionName}
          onChange={handleNewRequisitionNameChange}
        />
        <Text strong>Upload requisition</Text>
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
            setNewRequisitionFile(file);
            return false;
          }}
          style={{ padding: isMobile ? "12px" : "24px" }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Drag and drop</p>
          <p className="ant-upload-hint">- OR -</p>
          <Button icon={<UploadOutlined />}>Browse Files</Button>
        </Dragger>
        {newRequisitionFile && (
          <div style={{ marginTop: "10px" }}>
            <Text>Selected File: {newRequisitionFile.name}</Text>
          </div>
        )}
      </Modal>

      <Modal
        title="LAB RESULTS"
        open={isEditModalVisible}
        width={800}
        onCancel={() => closeModal("editLabResult")}
        footer={[
          <Button key="cancel" onClick={() => closeModal("editLabResult")}>
            Cancel
          </Button>,
          <Button key="save" type="primary" style={{ background: "green" }}>
            Save Changes
          </Button>,
        ]}
      >
        <List
          dataSource={files}
          renderItem={(file) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: "3px",
                    height: "40px",
                    backgroundColor: "red",
                  }}
                ></div>
                <Text>{file.name}</Text>
                <Text>{moment(file.date).format("MMMM DD, YYYY")}</Text>
                <FilePdfOutlined style={{ color: "red", fontSize: 24 }} />
                <Link
                  onClick={() =>
                    handleDownload(file.id, file?.filename || file?.name)
                  }
                >
                  {file.filename || "LabResults.pdf"}
                </Link>
                <EditOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => openModal("editLabResult")}
                />
                <DeleteOutlined
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleDelete(file.id)}
                />
              </div>
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title="REQUISITIONS"
        open={isEditRequisitionModalVisible}
        width={800}
        onCancel={() => closeModal("editRequisition")}
        footer={[
          <Button key="cancel" onClick={() => closeModal("editRequisition")}>
            Cancel
          </Button>,
          <Button key="save" type="primary" style={{ background: "green" }}>
            Save Changes
          </Button>,
        ]}
      >
        <List
          dataSource={bloodWorkFile2}
          renderItem={(file) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: "3px",
                    height: "40px",
                    backgroundColor: "red",
                  }}
                ></div>
                <Text>{file.fileTitle || file.filename || "Requisition"}</Text>
                <Text>{moment(file.createdOn).format("MMMM DD, YYYY")}</Text>
                {getFileIcon(file?.filename)}
                <Link
                  onClick={() => handleDownload(file.fileRef, file.filename)}
                >
                  {file.fileTitle || file.filename || "Requisition.pdf"}
                </Link>
                <DeleteOutlined
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleDelete(file.fileRef)}
                />
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default LabsAndRequisitions;
