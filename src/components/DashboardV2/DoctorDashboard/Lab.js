import React, { useState } from 'react';
import { Upload, List, Typography, message, Card } from 'antd';
import { InboxOutlined, FilePdfOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons';
import Header from './Components/Header';

const { Dragger } = Upload;
const { Text, Link } = Typography;

const LabsAndRequisitions = () => {
    const [files, setFiles] = useState([
        { name: 'LabRequisition_1.pdf', date: 'Feb 1, 2024' },
        { name: 'LabRequisition_2.pdf', date: 'Feb 1, 2024' },
    ]);

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
            setFiles((prev) => [...prev, { name: file.name, date: new Date().toLocaleDateString() }]);
            message.success(`${file.name} uploaded successfully.`);
            return false;
        },
    };

    return (
        <>
            <Header />
            <div className="p-6 mt-4" style={{ padding: "0 1%" }}>
                <p style={{ fontWeight: 'bold' }}>LABS AND REQUISITIONS</p>

                <div style={{ display: 'flex', gap: 20 }}>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <EditOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                <Text strong>Edit Lab Result</Text>
                            </div>
                            <Text type="secondary">Last updated: April 1, 2024</Text>
                        </div>
                        <Card>
                            <List
                                dataSource={[1, 2, 3, 4]}
                                renderItem={() => (
                                    <List.Item>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <FilePdfOutlined style={{ color: 'red', fontSize: 20 }} />
                                            <Text>Day 3</Text>
                                            <Text type="secondary">February 1, 2024</Text>
                                            <Link href="#">LabResults.pdf</Link>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>

                  
                    <Card className='mt-3'>
                        
                        <Text strong>Current Requisitions (max 2)</Text>
                        <List
                            dataSource={files}
                            renderItem={(file) => (
                                <List.Item>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <FilePdfOutlined style={{ color: 'red', fontSize: 20 }} />
                                        <Link href="#">{file.name}</Link>
                                        <Text type="secondary">Uploaded on: {file.date}</Text>
                                        <MoreOutlined style={{ cursor: 'pointer' }} />
                                    </div>
                                </List.Item>
                            )}
                        />

                        {/* Upload Section */}
                        <div style={{ marginTop: 20 }}>
                            <Text strong>Upload requisition</Text>
                            <Dragger {...uploadProps} style={{ marginTop: 10 }}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Drag and drop</p>
                                <p className="ant-upload-hint">- OR -</p>
                                <p className="ant-upload-text">Browse Files</p>
                            </Dragger>
                        </div>
                    </Card>
                    </div>

            </div>
        </>

    );
};

export default LabsAndRequisitions;
