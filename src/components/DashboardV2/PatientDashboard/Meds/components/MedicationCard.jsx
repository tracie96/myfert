import React from 'react';
import '../styles/MedicationCard.css';

const MedicationCard = ({ name, dosage, iconUrl, colorIndicator = "#F2AA93" }) => {
  return (
    <article className="medication-card">
      <div className="medication-card-info">
        <div 
          className="medication-card-indicator"
          style={{ 
            backgroundColor: colorIndicator,
            borderColor: colorIndicator
          }}
        />
        <img
          src={iconUrl}
          alt={`${name} medication icon`}
          className="medication-card-icon"
        />
        <h3 className="medication-card-name">
          {name}
        </h3>
      </div>
      <div className="medication-card-dosage">
        {dosage}
      </div>
    </article>
  );
};

export default MedicationCard; 