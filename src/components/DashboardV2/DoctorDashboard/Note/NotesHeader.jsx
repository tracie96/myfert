import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import AddNoteForm from './AddNoteForm';

const NotesHeader = ({ onAddNote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNote = async (data) => {
    try {
      setIsLoading(true);
      await onAddNote(data);
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
        width={800}
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