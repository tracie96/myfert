import React, { useCallback, useEffect, useState } from 'react';
import { Upload, List, Typography, message, Card, Modal, Button, Input } from 'antd';
import { InboxOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined, LeftOutlined, UploadOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';
import Header from './Components/Header';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientBloodWork, deletePatientBloodWork, downloadBloodWork, addPatientDocuments } from '../../redux/doctorSlice';
import moment from 'moment';
const { Dragger } = Upload;
const { Text, Link } = Typography;

const LabsAndRequisitions = () => {
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const [bloodWorkFile1, setBloodWorkFile1] = useState(null);
    const [bloodWorkFile2, setBloodWorkFile2] = useState(null);
    const status = useSelector((state) => state.doctor.status);
    const error = useSelector((state) => state.doctor.error);
    const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNewLabResultVisible, setIsNewLabResultVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newLabResultFile, setNewLabResultFile] = useState(null);
    const [newLabResultName, setNewLabResultName] = useState('');
    const navigate = useNavigate();

    console.log({ bloodWorkFile1, bloodWorkFile2 })
    const openModal = (modalType) => {
        setIsModalVisible(false);
        setIsNewLabResultVisible(false);
        setIsEditModalVisible(false);

        switch (modalType) {
            case 'patientSelect':
                setIsModalVisible(true);
                break;
            case 'newLabResult':
                setIsNewLabResultVisible(true);
                break;
            case 'editLabResult':
                setIsEditModalVisible(true);
                break;
            default:
                break;
        }
    };

    const closeModal = (modalType) => {
        switch (modalType) {
            case 'patientSelect':
                setIsModalVisible(false);
                break;
            case 'newLabResult':
                setIsNewLabResultVisible(false);
                setNewLabResultFile(null);
                setNewLabResultName('');
                break;
            case 'editLabResult':
                setIsEditModalVisible(false);
                break;
            default:
                break;
        }
    };
    const fetchPatientBloodWork = useCallback(async (fileType) => {
        if (!patient.userRef) {
            console.log("Opening patient select modal");
            openModal('patientSelect');
        } else {
            console.log(`Fetching patient blood work for fileType ${fileType}...`);
            const resultAction = await dispatch(getPatientBloodWork({ patientId: patient.userRef, fileType }));
    
            if (getPatientBloodWork.fulfilled.match(resultAction)) {
                if (fileType === 1) {
                    setBloodWorkFile1(resultAction.payload);
                } else if (fileType === 2) {
                    setBloodWorkFile2(resultAction.payload);
                }
            }
        }
    }, [patient.userRef, dispatch]);

    useEffect(() => {
        fetchPatientBloodWork(1);
    }, [dispatch, patient.userRef, fetchPatientBloodWork]);

    useEffect(() => {
        fetchPatientBloodWork(2);
    }, [dispatch, patient.userRef, fetchPatientBloodWork]);



    useEffect(() => {
        if (bloodWorkFile1) {
            setFiles(bloodWorkFile1.map(file => ({
                id: file.fileRef,
                name: file.filename,
                date: file.createdOn,
                title:file.fileTitle	
            })));
        } else if (status === 'failed') {
            message.error(error || 'Failed to retrieve files.');
        }
    }, [bloodWorkFile1, status, error]);

    const handleModalClose = () => {
        navigate("/doctor");
        closeModal('patientSelect');
    };

    const getFileType = (filename) => {
        if (!filename) return 'application/pdf'; // default to PDF
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'png':
                return 'image/png';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            default:
                return 'application/pdf';
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
          message.error('Please upload a lab result file.');
          return;
        }
        if (!newLabResultName.trim()) {
          message.error('Please enter a lab result name.');
          return;
        }
      
        const reader = new FileReader();
        reader.readAsDataURL(newLabResultFile);
        reader.onload = async () => {
          const base64String = reader.result.split(',')[1];
          const payload = {
            patientRef: patient.userRef,
            bloodWork: [{
              base64: base64String,
              filename: newLabResultFile.name,
              fileTitle: newLabResultName.trim(),
              fileType: 1 // lab report file type
            }]
          };
      
          try {
            const resultAction = await dispatch(addPatientDocuments(payload));
            if (addPatientDocuments.fulfilled.match(resultAction)) {
              // Fetch updated blood work to refresh the list
              await fetchPatientBloodWork(1);
              message.success(`${newLabResultName} uploaded successfully.`);
              closeModal('newLabResult');
              setNewLabResultFile(null);
              setNewLabResultName('');
            }
          } catch (error) {
            message.error(`Error uploading ${newLabResultName}: ${error.message}`);
          }
        };
      };

    const handleDelete = async (fileId) => {
        try {
            await dispatch(deletePatientBloodWork(fileId)).unwrap();
            setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
            message.success('File deleted successfully.');
        } catch (error) {
            message.error('Failed to delete file.');
        }
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            if (bloodWorkFile2.length >= 2) { // Enforce max 2 files
                message.error('You can only upload a maximum of 2 files.');
                return Upload.LIST_IGNORE;
            }
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                message.error('Only PDF, JPG, and PNG files are allowed.');
                return Upload.LIST_IGNORE;
            }
    
            const reader = new FileReader();
            reader.onload = async () => {
                const base64String = reader.result.split(',')[1];
                const payload = {
                    patientRef: patient.userRef,
                    bloodWork: [{
                        base64: base64String,
                        filename: file.name,
                        fileTitle: newLabResultName.trim(),
                        fileType: 2,
                    }],
                };
    
                try {
                    await dispatch(addPatientDocuments(payload));
                    await fetchPatientBloodWork(2); // Refresh the list after upload
                    message.success(`${file.name} uploaded successfully.`);
                } catch (error) {
                    message.error(`Error uploading ${file.name}: ${error.message}`);
                }
            };
    
            reader.readAsDataURL(file);
            return false; // Prevent automatic upload
        },
        fileList: [], // Keep fileList empty to hide files
    };
    

    const getFileIcon = (filename) => {
        console.log(filename,'lll')

        if (!filename) return <FileOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <FileImageOutlined style={{ color: '#52c41a', fontSize: 24 }} />;
            default:
                return <FileOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
        }
    };

    return (
        <>
            {patient ? <Header /> : "Select a patient to view their labs and requisitions"}
            <Modal
                title="No Patient Selected"
                open={isModalVisible}
                footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose}>
                        Select Patient
                    </Button>
                ]}
                closable={false}
                maskClosable={false}
            >
                <p>Please select a patient to view their labs and requisitions.</p>
            </Modal>

            <Modal
                title={<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <LeftOutlined onClick={() => closeModal('newLabResult')} style={{ cursor: "pointer" }} />
                    <Text strong>NEW LAB RESULT</Text>
                </div>}
                open={isNewLabResultVisible}
                onCancel={() => closeModal('newLabResult')}
                footer={[
                    <Button key="cancel" onClick={() => closeModal('newLabResult')}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={handleAddLabResult} style={{
                        background: "#00ADEF",
                    }}>Add Lab Result</Button>,
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
                        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                        if (!allowedTypes.includes(file.type)) {
                            message.error('Only PDF, JPG, and PNG files are allowed.');
                            return Upload.LIST_IGNORE;
                        }
                        setNewLabResultFile(file);
                        return false;
                    }}
                    fileList={newLabResultFile ? [newLabResultFile] : []}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and drop</p>
                    <p className="ant-upload-hint">- OR -</p>
                    <Button icon={<UploadOutlined />}>Browse Files</Button>
                </Dragger>
                {newLabResultFile && (
                    <div style={{ marginTop: '10px' }}>
                        <Text>Selected File: {newLabResultFile.name}</Text>
                    </div>
                )}
            </Modal>

            <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
                <p style={{ fontWeight: 'bold', marginBottom: '30px' }}>LABS AND REQUISITIONS</p>

                <div className="labCard" style={{ 
                    display: 'flex', 
                    gap: 20,
                    flexDirection: window.innerWidth <= 768 ? 'column' : 'row' 
                }}>
                    <div className="childCard" style={{ flex: 1 }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                            gap: window.innerWidth <= 480 ? '10px' : '0'
                        }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                onClick={() => openModal('editLabResult')}
                            >
                                <EditOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                <Text strong>Edit Lab Result</Text>
                            </div>
                            <Text type="secondary" style={{ textAlign: window.innerWidth <= 480 ? 'center' : 'right' }}>
                                Last updated: {files.length > 0 ? moment(files[files.length - 1].date).format('MMMM DD, YYYY') : 'N/A'}
                            </Text>
                        </div>

                        <Button type="primary" style={{
                            marginTop: 10, 
                            marginBottom: 10,
                            background: "#00ADEF",
                        }} onClick={() => openModal('newLabResult')}>+ New Lab Result</Button>

                        <Card style={{ border: '1px solid #C2E6F8' }} className='mt-1'>
                            <List
                                dataSource={files}
                                renderItem={(file) => (
                                    <List.Item style={{ 
                                        borderBottom: '1px solid #f0f0f0', 
                                        padding: '12px 16px',
                                        flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                                        gap: window.innerWidth <= 480 ? '10px' : '0'
                                    }}>
                                        <div className="listCard" style={{ 
                                            display: 'flex', 
                                            alignItems: window.innerWidth <= 480 ? 'flex-start' : 'center',
                                            gap: 15, 
                                            width: '100%',
                                            flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
                                        }}>
                                            <div className="listCardSideBorder" style={{ 
                                                width: window.innerWidth <= 480 ? '100%' : '3px',
                                                height: window.innerWidth <= 480 ? '3px' : '40px',
                                                backgroundColor: 'red' 
                                            }}></div>

                                            <div className="listCardContent" style={{ 
                                                flex: 1,
                                                width: window.innerWidth <= 480 ? '100%' : 'auto'
                                            }}>
                                                <Text style={{ fontWeight: 500 }}>{file.name}</Text>
                                                <br />
                                            </div>
                                            <div className="listCardContent" style={{ 
                                                flex: 1,
                                                width: window.innerWidth <= 480 ? '100%' : 'auto'
                                            }}>
                                                <Text style={{ fontWeight: 500 }}>
                                                    {file.date ? moment(file.date).format('MMMM DD, YYYY') : 'No date available'}
                                                </Text>
                                                <br />
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 8,
                                                width: window.innerWidth <= 480 ? '100%' : 'auto'
                                            }}>
                                                {getFileIcon(file?.filename || file?.name)}
                                                <Link style={{ color: '#1890ff' }} onClick={() => handleDownload(file.id, file?.filename || file?.name)}>
                                                    {file.title}
                                                </Link>
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: 10,
                                                width: window.innerWidth <= 480 ? '100%' : 'auto',
                                                justifyContent: window.innerWidth <= 480 ? 'flex-end' : 'flex-start'
                                            }}>
                                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.id)} />
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>

                    <Card className="bloodWorkFileStyle mt-4" style={{ 
                        border: '1px solid #C2E6F8', 
                        width: window.innerWidth <= 768 ? '100%' : '35%'
                    }}>
                        {bloodWorkFile2?.map((file, index) => (
                            <Card key={index} style={{border: 'none', boxShadow: 'none' }}>
                                <Text strong>{index === 0 ? 'Day 1 Requisition' : 'Day 2 Requisition'}</Text>
                                <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}>
                                    <div className="labCard" style={{ display: 'flex', alignItems: 'center', gap: 15, width: '100%' }}>
                                        <div className="listCardSideBorder" style={{ width: '3px', height: '40px', backgroundColor: 'red' }}></div>

                                      
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {getFileIcon(file?.filename || file?.name)}
                                            <Link style={{ color: '#1890ff' }} onClick={() => handleDownload(file.id, file?.filename || file?.name)}>
                                                {file.filename || file.name || 'LabResults.pdf'}
                                            </Link>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.id)} />
                                        </div>
                                    </div>
                                </List.Item>
                            </Card>
                        ))}

                        <Dragger {...uploadProps} style={{ marginTop: 10 }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Drag and drop</p>
                            <p className="ant-upload-hint">- OR -</p>
                            <p className="ant-upload-text">Browse Files</p>
                        </Dragger>
                    </Card>

                </div>

            </div>

            <Modal
                title="LAB RESULTS"
                open={isEditModalVisible}
                width={800}
                onCancel={() => closeModal('editLabResult')}
                footer={[
                    <Button key="cancel" onClick={() => closeModal('editLabResult')}>
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
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 15 }}>
                                <div style={{ width: '3px', height: '40px', backgroundColor: 'red' }}></div>
                                <Text>{file.name}</Text>
                                <Text>{moment(file.date).format('MMMM DD, YYYY')}</Text>
                                <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />
                                <Link onClick={() => handleDownload(file.id, file?.filename || file?.name)}>{file.filename || 'LabResults.pdf'}</Link>
                                <EditOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => openModal('editLabResult')} />
                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.id)} />
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default LabsAndRequisitions;
