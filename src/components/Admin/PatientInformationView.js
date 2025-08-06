import React, { useEffect, useState } from 'react';
import { Modal, Descriptions } from 'antd';

const PatientInformationView = ({ isOpen, setOpen, account, patientList }) => {
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!account || !Array.isArray(patientList)) return;

    const selected = patientList.find(p => p.account === account);
    setPatientData(selected);
  }, [account, patientList]);

  return (
    <Modal
      title="Patient Application Details"
      open={isOpen === 'Application'}
      onCancel={() => setOpen('')}
      footer={null}
      width={700}
    >
      {!patientData ? (
        <p>Patient not found.</p>
      ) : (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="First Name">{patientData.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{patientData.lastName}</Descriptions.Item>
          <Descriptions.Item label="Account #">{patientData.account}</Descriptions.Item>
          <Descriptions.Item label="DOB">{patientData.dob}</Descriptions.Item>
          <Descriptions.Item label="Email ">{patientData.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{patientData.role}</Descriptions.Item>
          <Descriptions.Item label="Activated Status">{patientData.activated}</Descriptions.Item>
          <Descriptions.Item label="Accepting Patients">{patientData.acceptingPatients}</Descriptions.Item>
          {/* Add more fields if your API gives more data */}
        </Descriptions>
      )}
    </Modal>
  );
};

export default PatientInformationView;
