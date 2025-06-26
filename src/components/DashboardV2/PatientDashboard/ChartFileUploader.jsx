// ChartFileUploaderInline.jsx
import React, { useState } from "react";
import { Typography, Upload, Button, message, Select, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Dragger } = Upload;

const ChartFileUploader = ({
  onUpload,
  chartTypeOptions = ["Billings", "Creighton", "Femm", "Marquette", "SymptoThermal", "Justisse", "Unknown"],
  fileType = 3,
}) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState("");

  const handleUpload = () => {
    if (!file  || !chartType) {
      message.error("Please select chart type, file, and enter a title.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      onUpload({
        base64,
        filename: file.name,
        fileTitle: title.trim(),
        fileType,
        chartType,
      });
      setFile(null);
      setTitle("");
      setChartType("");
    };
  };

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3 style={{color: "#463caf",fontSize: "20px",fontWeight: "600"}}>Upload Chart File</h3>

      <Input
        placeholder="Enter chart title"
        style={{ marginBottom: "10px" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Text>If you are using FABM Charting With Read Your Body (RYB), Please Upload The Chart You Are using to monitor your cycle as a  CSV file.</Text>
      <Text>Please note that any additional</Text>
      <div class="form-group row" style={{marginLeft:"2px"}}>
        <label for="" class="col-sm-2 col-form-label" style={{padding:"10px 0px", color: "rgba(0, 0, 0, 0.88)", fontWeight: "600", fontSize: "14px"}}>FABM Chart</label>
        <div class="col-sm-10">
        <Select
        style={{ width: "100%", marginBottom: "15px", marginTop: 6 }}
        value={chartType}
        onChange={setChartType}
        placeholder="Select chart type"
      >
        {chartTypeOptions.map((type) => (
          <Select.Option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Select.Option>
        ))}
      </Select>
        </div>
      </div>
      <div><Text strong>Upload File</Text></div>
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
        <Button type="primary" icon={<UploadOutlined />}>Browse Files</Button>
      </Dragger>

      {file && (
        <div style={{ marginTop: "10px" }}>
          <Text>Selected File: {file.name}</Text>
        </div>
      )}

      <Button type="primary" onClick={handleUpload} style={{ marginTop: "16px" }}>
        Upload
      </Button>
    </div>
  );
};

export default ChartFileUploader;
