import React from 'react';
import '../styles/MedicationHeader.css';

const MedicationHeader = ({ title, description, imageUrl, lastUpdated }) => {
  return (
    <header className="medication-header" role="banner">
      <div className="medication-header-container">
        <div className="medication-header-left">
          <div className="medication-header-content">
            <h1 className="medication-header-title">
              {title}
            </h1>
            <p className="medication-header-description">
              {description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < description.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <h2 className="medication-header-subtitle">
              Medications
            </h2>
          </div>
        </div>
        <div className="medication-header-right">
          <div className="medication-header-image-container">
            <img
              src={imageUrl}
              alt="Medical prescription header"
              className="medication-header-image"
            />
            <time className="medication-header-timestamp">
              Last updated: {lastUpdated}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicationHeader; 