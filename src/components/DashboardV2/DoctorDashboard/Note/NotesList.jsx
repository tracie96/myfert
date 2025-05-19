import React from 'react';
import NoteItem from './NoteItem';

const NotesList = ({ notes }) => {
  return (
    <div className="notes-list">
      <div className="note-row note-header">
        <div className="note-col profile-col"></div>
        <div className="note-col appt-col"><b>Appt Type</b></div>
        <div className="note-col progress-col"><b>Progress Notes</b></div>
        <div className="note-col personal-col"><b>Personal Notes</b></div>
        <div className="note-col menu-col"></div>
      </div>
      {notes.map((note, index) => (
        <NoteItem key={index} {...note} />
      ))}
    </div>
  );
};

export default NotesList; 