import React from 'react';
import '../styles/PrescriptionDownload.css';

const PrescriptionDownload = ({ fileName, downloadUrl, iconUrl }) => {
  const handleDownload = () => {
    // In a real application, this would trigger the actual download
    window.open(downloadUrl, '_blank');
  };

  return (
    <aside className="prescription-download">
      <h3 className="prescription-download-title">
        Current Prescription
      </h3>
      <button
        onClick={handleDownload}
        className="prescription-download-button"
        aria-label={`Download ${fileName}`}
      >
        <img
          src={iconUrl}
          alt="PDF download icon"
          className="prescription-download-icon"
        />
        <span className="prescription-download-filename">
          {fileName}
        </span>
      </button>
    </aside>
  );
};

export default PrescriptionDownload; 