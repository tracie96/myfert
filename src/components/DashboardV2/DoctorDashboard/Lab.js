import React, { useEffect, useState } from 'react';
import { Upload, List, Typography, message, Card, Modal, Button, Input } from 'antd';
import { InboxOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined, LeftOutlined, UploadOutlined } from '@ant-design/icons';
import Header from './Components/Header';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addPatientBloodWork, getPatientBloodWork, deletePatientBloodWork, downloadBloodWork } from '../../redux/doctorSlice';
import moment from 'moment';
const { Dragger } = Upload;
const { Text, Link } = Typography;

const LabsAndRequisitions = () => {
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const bloodWork = useSelector((state) => state.doctor.bloodWork);
    const status = useSelector((state) => state.doctor.status);
    const error = useSelector((state) => state.doctor.error);
    const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNewLabResultVisible, setIsNewLabResultVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newLabResultFile, setNewLabResultFile] = useState(null);
    const [newLabResultName, setNewLabResultName] = useState('');
    const navigate = useNavigate();

    // Generic function to open modals, closing others
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
                break;
            case 'editLabResult':
                setIsEditModalVisible(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!patient.userRef) {
            openModal('patientSelect');
        } else {
            dispatch(getPatientBloodWork(patient.userRef));
        }
    }, [dispatch, patient.userRef]);

    useEffect(() => {
        if (bloodWork) {
            setFiles(bloodWork.map(file => ({
                id: file.fileRef,
                name: file.filename,
                date: file.createdOn
            })));
        } else if (status === 'failed') {
            message.error(error || 'Failed to retrieve files.');
        }
    }, [bloodWork, status, error]);

    const handleModalClose = () => {
        navigate("/doctor");
        closeModal('patientSelect');
    };

    const handleDownload = async (fileRef) => {
        try {
            const resultAction = await dispatch(downloadBloodWork(fileRef));
            if (downloadBloodWork.fulfilled.match(resultAction)) {
                const blob = new Blob([resultAction.payload], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${fileRef}.pdf`;
                document.body.appendChild(a);
                a.click();
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
                }]
            };

            try {
                await dispatch(addPatientBloodWork(payload));
                setFiles((prev) => [...prev, { name: newLabResultName, date: new Date().toLocaleDateString() }]);
                message.success(`${newLabResultName} uploaded successfully.`);
                closeModal('newLabResult');
                setNewLabResultFile(null);
                setNewLabResultName('');
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
        multiple: true,
        beforeUpload: (file) => {
            if (files.length >= 20) {
                message.error('You can only upload a maximum of 2 files.');
                return Upload.LIST_IGNORE;
            }
            if (file.type !== 'application/pdf') {
                message.error('Only PDF files are allowed.');
                return Upload.LIST_IGNORE;
            }
            return false;
        },
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
                    <Button key="save" type="primary" onClick={handleAddLabResult} style={{            background: "#00ADEF",
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
                    showUploadList={true}
                    beforeUpload={(file) => {
                        if (file.type !== 'application/pdf') {
                            message.error('Only PDF files are allowed.');
                            return Upload.LIST_IGNORE;
                        }
                        setNewLabResultFile(file);
                        return false;
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and drop</p>
                    <p className="ant-upload-hint">- OR -</p>
                    <Button icon={<UploadOutlined />}>Browse Files</Button>
                </Dragger>
                {newLabResultFile && <Text>Selected File: {newLabResultFile.name}</Text>}
            </Modal>

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
                                <Link onClick={() => handleDownload(file.id)}>{file.filename || 'LabResults.pdf'}</Link>
                                <EditOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => openModal('editLabResult')} />
                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.id)} />
                            </div>
                        </List.Item>
                    )}
                />
                <Button type="primary" style={{ marginTop: 10, background: "#00ADEF",
 }} key={'new'} onClick={() => openModal('newLabResult')} >+ New Lab Result</Button>
            </Modal>

            <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
                <p style={{ fontWeight: 'bold', marginBottom: '30px' }}>LABS AND REQUISITIONS</p>

                <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                onClick={() => openModal('editLabResult')}
                            >
                                <EditOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                <Text strong>Edit Lab Result</Text>
                            </div>
                            <Text type="secondary">
                                Last updated: {files.length > 0 ? moment(files[files.length - 1].date).format('MMMM DD, YYYY') : 'N/A'}
                            </Text>                        </div>

                        <Card style={{ border: '1px solid #C2E6F8' }} className='mt-1'>
                            <List
                                dataSource={files}
                                renderItem={(file) => (
                                    <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, width: '100%' }}>
                                            <div style={{ width: '3px', height: '40px', backgroundColor: 'red' }}></div>

                                            <div style={{ flex: 1 }}>
                                                <Text style={{ fontWeight: 500 }}>{file.name}</Text>
                                                <br />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text style={{ fontWeight: 500 }}>
                                                    {file.date ? moment(file.date).format('MMMM DD, YYYY') : 'No date available'}
                                                </Text>
                                                <br />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FilePdfOutlined style={{ color: 'red', fontSize: 24 }} />
                                                <Link style={{ color: '#1890ff' }} onClick={() => handleDownload(file.id)}>
                                                    {file.filename || 'LabResults.pdf'}
                                                </Link>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10 }}>

                                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(file.id)} />
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />

                        </Card>
                    </div>

                    <Card style={{ border: '1px solid #C2E6F8', width: '35%' }} className='mt-4'>
                        <Text strong>Upload requisition (max 2)</Text>
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
        </>
    );
};

export default LabsAndRequisitions;
