import React from 'react';
import NoteMenu from './NoteMenu';

const NoteItem = ({
  profileImage,
  name,
  role,
  date,
  appointmentType,
  progressNotes,
  personalNotes,
  nameColor,
  hasMenu = false,
  menuIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/f9ab6930c2845a62780ec7d43446b11054cb8a18"
}) => {
  const handleEdit = () => {
    console.log(`Editing note for ${name}`);
    // In a real app, this would open an edit form
  };

  const handleDelete = () => {
    console.log(`Deleting note for ${name}`);
    // In a real app, this would show a confirmation dialog
  };

  return (
    <div className="note-row">
      <div className="note-col profile-col">
        <img
          src={profileImage}
          alt=""
          className="profile-image"
        />
        <div className={`name-text ${nameColor}`}>{name} <br />({role})</div>
        <div className="date-text">{date}</div>
      </div>
      <div className="note-col appt-col">{appointmentType}</div>
      <div className="note-col progress-col">
        {progressNotes.map((note, idx) => (
          <div key={idx}>{note}</div>
        ))}
      </div>
      <div className="note-col personal-col">{personalNotes}</div>
      <div className="note-col menu-col">
        {hasMenu && (
          <NoteMenu 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            triggerIcon={menuIcon} 
          />
        )}
      </div>
    </div>
  );
};

export default NoteItem; 