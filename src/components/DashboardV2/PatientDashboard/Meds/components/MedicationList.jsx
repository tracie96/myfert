import React from 'react';
import MedicationCard from './MedicationCard';
import PrescriptionDownload from './PrescriptionDownload';
import '../styles/MedicationList.css';

const MedicationList = ({ medications, prescriptionFile }) => {
  return (
    <section className="medication-list">
      <div className="medication-list-content">
        <header className="medication-list-header">
          <h3 className="medication-list-header-title">
            Name Dose Amount Route Frequency
          </h3>
          <div className="medication-list-divider" />
        </header>
        
        <div className="medication-list-items">
          {medications.map((medication, index) => (
            <MedicationCard
              key={index}
              name={medication.drugName}
              dosage={`${medication.dose} ${medication.amount} ${medication.route} ${medication.frequency}`}
              iconUrl={medication.iconUrl || "https://cdn.builder.io/api/v1/image/assets/6ab570d2ba5f4a1e8f0614bf834ae119/18e0cbe5c51df1d7f545f4932ae24cf693d87ee1"}
              colorIndicator="#F2AA93"
            />
          ))}
        </div>
      </div>
      
      <div className="medication-list-separator" />
      
      {prescriptionFile && (
        <PrescriptionDownload
          fileName={prescriptionFile.fileName}
          downloadUrl={prescriptionFile.downloadUrl}
          iconUrl={prescriptionFile.iconUrl}
        />
      )}
    </section>
  );
};

export default MedicationList; 