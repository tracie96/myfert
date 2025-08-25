import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { fetchDocumo, downloadDocumo } from '../../redux/doctorSlice';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Fax = () => {
  const dispatch = useDispatch();
  const documoData = useSelector((state) => state.doctor.documoData);
  const documoLoading = useSelector((state) => state.doctor.documoLoading);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });

  useEffect(() => {
    dispatch(fetchDocumo());
  }, [dispatch]);

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
  };

  const handleDownload = async (messageNumber) => {
    try {
      const response = await dispatch(downloadDocumo(messageNumber)).unwrap();
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `documo_${messageNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('Document downloaded successfully');
    } catch (error) {
      message.error('Failed to download document');
      console.error('Download error:', error);
    }
  };

  const columns = [
    {
      title: 'Message Number',
      dataIndex: 'messageNumber',
      key: 'messageNumber',
      ellipsis: true,
    },
    {
      title: 'Pages',
      dataIndex: 'pageCount',
      key: 'pageCount',
      width: 100,
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Patient ULI Number',
      dataIndex: 'patientRef',
      key: 'patientRef',
    },
    {
      title: 'Received At',
      dataIndex: 'faxReceivedAt',
      key: 'faxReceivedAt',
      render: (date) => moment(date).format('MMMM DD, YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record.messageNumber)}
        >
        </Button>
      ),
    }
  ];

  // Ensure documoData is an array
  const tableData = Array.isArray(documoData) ? documoData : [];

  return (
    <div style={{ marginTop: 40 }}>
      <Card style={{ border: "1px solid #C2E6F8" }}>
        <div style={{ marginBottom: 20 }}>
          <Text strong>Document History</Text>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={documoLoading}
          rowKey="messageNumber"
          onChange={handleTableChange}
          pagination={{
            position: ['bottomRight'],
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: tableData.length,
            showSizeChanger: true
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default Fax; 