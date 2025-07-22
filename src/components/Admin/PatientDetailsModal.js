import React, { useState, useEffect } from "react";
import { Modal, message, Spin } from "antd";
import axios from "axios";
import { baseUrl } from "../../utils/envAccess";

const PatientDetailsModal = ({ isOpen, setOpen, account }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen === 'Application' && account) {
      const fetchPatientDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${baseUrl}Admin/GetPatientDetails/${account}`);
          setPatientDetails(response.data);
        } catch (error) {
          console.error("Error fetching patient details:", error);
          message.error("Failed to fetch patient details.");
        } finally {
          setLoading(false);
        }
      };

      fetchPatientDetails();
    }
  }, [isOpen, account]);

  return (
    <Modal
      title="Patient Details"
      visible={isOpen === 'Application'}
      onCancel={() => setOpen('')}
      footer={null}
      width={600}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        patientDetails && (
          <div>
            <p><strong>Account #:</strong> {patientDetails.account}</p>
            <p><strong>First Name:</strong> {patientDetails.firstName}</p>
            <p><strong>Last Name:</strong> {patientDetails.lastName}</p>
            <p><strong>Age:</strong> {patientDetails.age}</p>
            <p><strong>Gender:</strong> {patientDetails.gender}</p>
            <p><strong>Email:</strong> {patientDetails.email}</p>
            <p><strong>Status:</strong> {patientDetails.status}</p>
            {/* Add any other fields you want to display */}
          </div>
        )
      )}
    </Modal>
  );
};

export default PatientDetailsModal;
