// ChartFileUploaderInline.jsx
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
  Select
} from "antd";
import {
  FilePdfOutlined,
  LeftOutlined,
  UploadOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  downloadBloodWork,
} from "../../redux/doctorSlice";
import { getPatientLabs } from "../../redux/patientSlice";

import moment from "moment";
const { Dragger } = Upload;
const { Text, Link } = Typography;

const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const ChartFileUploader = ({
  onUpload,
  chartTypeOptions = ["Billings", "Creighton", "Femm", "Marquette", "SymptoThermal", "Justisse", "Unknown"],
  fileType = 4,
}) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState("");
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const [isNewLabResultVisible, setIsNewLabResultVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isMobile = windowWidth <= breakpoints.sm;


  const openModal = (modalType) => {
    setIsNewLabResultVisible(false);

    switch (modalType) {
      case "newLabResult":
        setIsNewLabResultVisible(true);
        break;
      default:
        break;
    }
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
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeModal = (modalType) => {
    switch (modalType) {
      case "newLabResult":
        setIsNewLabResultVisible(false);
        setFile(null);
        setTitle("");
        setChartType("");
        break;
      default:
        break;
    }
  };
  const fetchChartFiles = useCallback(() => {
    dispatch(getPatientLabs(4)).then((result) => {
      if (getPatientLabs.fulfilled.match(result)) {
        const formatted = result.payload.map((file) => ({
          id: file.fileRef,
          name: file.filename,
          date: file.createdOn,
          title: file.fileTitle,
        }));
        setFiles(formatted);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    fetchChartFiles();
  }, [fetchChartFiles]);

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

  const handleUpload = async () => {
  if (!file || !chartType) {
    message.error("Please select chart type, file, and enter a title.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    try {
      await onUpload({
        base64,
        filename: file.name,
        fileTitle: title.trim(),
        fileType,
        chartType,
      });

      // Only fetch after upload completes
      await fetchChartFiles();
      message.success("Chart uploaded successfully.");

      // Reset modal & fields
      closeModal("newLabResult");
    } catch (err) {
      message.error("Upload failed. Please try again.");
    }
  };
};


  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3 style={{ color: "#463caf", fontSize: "20px", fontWeight: "600" }}>UPLOAD CHART</h3>
      <div className="p-6 mt-4" style={{ padding: "24px" }}>

        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Modal
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <LeftOutlined onClick={() => closeModal("newLabResult")} style={{ cursor: "pointer" }} />
                  <Text strong>NEW CHART FILE</Text>
                </div>
              }
              open={isNewLabResultVisible}
              onCancel={() => closeModal("newLabResult")}
              footer={[
                <Button key="cancel" onClick={() => closeModal("newLabResult")}>Cancel</Button>,
                <Button key="save" type="primary" onClick={handleUpload}>Upload</Button>,
              ]}
            >
              <Input
                placeholder="Enter chart title"
                style={{ marginBottom: "10px" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Select
                style={{ width: "100%", marginBottom: "15px" }}
                value={chartType}
                onChange={setChartType}
                placeholder="Select chart type"
              >
                {chartTypeOptions.map((type) => (
                  <Select.Option key={type} value={type}>{type}</Select.Option>
                ))}
              </Select>
              <Dragger
                multiple={false}
                showUploadList={false}
                beforeUpload={(file) => {
                  const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
                  if (!allowed.includes(file.type)) {
                    message.error("Only PDF, JPG, and PNG files are allowed.");
                    return Upload.LIST_IGNORE;
                  }
                  setFile(file);
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                <p className="ant-upload-text">Drag and drop file</p>
                <p className="ant-upload-hint">- OR -</p>
                <Button icon={<UploadOutlined />}>Browse Files</Button>
              </Dragger>
              {file && <div style={{ marginTop: "10px" }}><Text>Selected File: {file.name}</Text></div>}
            </Modal>

            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="primary"
                style={{
                  background: "#00ADEF",
                  maxWidth: "200px",
                }}
                onClick={() => openModal("newLabResult")}
              >
                + New Chart File Add
              </Button>
            </div>

            <Card style={{ border: "1px solid #C2E6F8", marginBottom: "24px" }}>
              <Typography.Title level={5} style={{ marginBottom: "16px" }}>
                Chart Results
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
                            ? file.name.slice(0, 6) + (file.name.length > 6 ? '...' : '')
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
                          {isMobile ? "" : file.title}
                        </Link>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChartFileUploader;
