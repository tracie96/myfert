import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import AddNoteForm from './AddNoteForm';

const NotesHeader = ({ onAddNote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNote = async (data) => {
    try {
      setIsLoading(true);
      // Format the data to match the expected note structure
      const newNote = {
        profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/03d8574713eae32df92c6306c07473dcda5418d6", // Default image
        name: "Current User", // This should be replaced with actual user data
        role: "Clinician", // This should be replaced with actual role
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        appointmentType: data.appointmentType,
        progressNotes: data.progressNotes.split('\n').filter(note => note.trim()),
        personalNotes: data.personalNotes,
        nameColor: "text-[#F2AA93]" // Default color
      };
      
      await onAddNote(newNote);
      message.success('Note added successfully');
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to add note');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" className="add-note-button mt-4" onClick={() => setIsModalOpen(true)}>
        + Add New Notes 
      </Button>
      <Modal
        title="Add New Note"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        <AddNoteForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddNote}
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
};

export default NotesHeader; 