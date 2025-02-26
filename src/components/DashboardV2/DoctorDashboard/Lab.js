import React, { useEffect, useState } from 'react';
import { Upload, List, Typography, message, Card, Modal, Button } from 'antd';
import { InboxOutlined, FilePdfOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from './Components/Header';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addPatientBloodWork, getPatientBloodWork } from '../../redux/doctorSlice';
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
    const navigate = useNavigate();

    useEffect(() => {
        if (!patient.userRef) {
            setIsModalVisible(true);
        } else {
            dispatch(getPatientBloodWork(patient.userRef));
        }
    }, [dispatch, patient.userRef]);

    useEffect(() => {
        if (status === 'succeeded') {
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

    };

    const uploadFileToAPI = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64String = reader.result.split(',')[1];
            const payload = {
                patientRef: "202410J48ZMR4E",
                bloodWork: [{
                    base64: base64String,
                    filename: file.name,
                    fileTitle: file.name.split('.')[0],
                }]
            };

            try {
                await dispatch(addPatientBloodWork(payload));
                setFiles((prev) => [...prev, { name: file.name, date: new Date().toLocaleDateString() }]);
                message.success(`${file.name} uploaded successfully.`);
            } catch (error) {
                message.error(`Error uploading ${file.name}: ${error.message}`);
            }
        };
    };    
    
    const handleDelete = async (fileId) => {
        try {
            // await dispatch(deletePatientBloodWork(fileId));
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
            if (files.length >= 2) {
                message.error('You can only upload a maximum of 2 files.');
                return Upload.LIST_IGNORE;
            }
            if (file.type !== 'application/pdf') {
                message.error('Only PDF files are allowed.');
                return Upload.LIST_IGNORE;
            }

            uploadFileToAPI(file);
            return false;
        },
    };

    return (
        <>
            {patient ? <Header /> : "Select a patient to view their labs and requisitions"}
            <Modal
                title="No Patient Selected"
                visible={isModalVisible}
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
            <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
                <p style={{ fontWeight: 'bold', marginBottom: '30px' }}>LABS AND REQUISITIONS</p>

                <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ flex: 1 }}> {/* Reduced from flex: 1 to 0.7 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
                                                <Link href={file.url || '#'} target="_blank" style={{ color: '#1890ff' }}>
                                                    {file.filename || 'LabResults.pdf'}
                                                </Link>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                               
                                                <EditOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => console.log('Edit', file.id)} />
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
