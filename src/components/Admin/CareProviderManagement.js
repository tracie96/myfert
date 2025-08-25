// CareProviderManagement.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const CareProviderManagement = ({ isOpen, setOpen, account, providerList }) => {
  const provider = providerList.find(user => user.account === account);

  return (
    <Modal
      open={isOpen === 'Application'}
      onCancel={() => setOpen('')}
      footer={null}
      title="Care Provider Application Details"
      width={600}
    >
      {provider ? (
        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{ fontWeight: 600, width: '200px' }}
          contentStyle={{ backgroundColor: '#f9f9f9' }}
        >
          <Descriptions.Item label="Account #">{provider.account}</Descriptions.Item>
          <Descriptions.Item label="First Name">{provider.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{provider.lastName}</Descriptions.Item>
          <Descriptions.Item label="Role">{provider.role}</Descriptions.Item>
          <Descriptions.Item label="Status">{provider.activated}</Descriptions.Item>
          <Descriptions.Item label="Accepting Patients?">{provider.acceptingPatients}</Descriptions.Item>
          {/* Add more fields here as needed */}
        </Descriptions>
      ) : (
        <p>No provider data found.</p>
      )}
    </Modal>
  );
};

export default CareProviderManagement;
