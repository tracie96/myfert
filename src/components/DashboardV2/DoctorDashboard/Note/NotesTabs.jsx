import React, { useState } from 'react';

const NotesTabs = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Appt Type' },
    { id: 'progress', label: 'Progress Notes' },
    { id: 'personal', label: 'Personal Notes' }
  ];

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default NotesTabs; 