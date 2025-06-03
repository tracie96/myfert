import React from 'react';
import { Card, Table, Typography } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Text } = Typography;

const Fax = () => {
  const documoData = useSelector((state) => state.doctor.documoData);
  const documoLoading = useSelector((state) => state.doctor.documoLoading);

  const columns = [
    {
      title: 'Message ID',
      dataIndex: 'messageId',
      key: 'messageId',
      ellipsis: true,
    },
    {
      title: 'Pages',
      dataIndex: 'pageCount',
      key: 'pageCount',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Text style={{ 
          color: status === 'success' ? '#52c41a' : '#ff4d4f',
          textTransform: 'capitalize'
        }}>
          {status}
        </Text>
      ),
    },
    {
      title: 'Classification',
      dataIndex: 'classificationLabel',
      key: 'classificationLabel',
      render: (label) => (
        <Text style={{ textTransform: 'capitalize' }}>
          {label}
        </Text>
      ),
    },
    {
      title: 'Received At',
      dataIndex: 'faxReceivedAt',
      key: 'faxReceivedAt',
      render: (date) => moment(date).format('MMMM DD, YYYY HH:mm'),
    }
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <Card style={{ border: "1px solid #C2E6F8" }}>
        <div style={{ marginBottom: 20 }}>
          <Text strong>Document History</Text>
        </div>
        <Table
          columns={columns}
          dataSource={documoData}
          loading={documoLoading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default Fax; 