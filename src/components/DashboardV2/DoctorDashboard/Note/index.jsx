import React, { useState, useEffect } from 'react';
import NotesHeader from './NotesHeader';
import NotesList from './NotesList';
import ViewMoreButton from './ViewMoreButton';
import './note.css';
import Header from '../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { addPatientNotes, fetchPatientNotes } from '../../../../components/redux/doctorSlice';
import { Modal, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => (
  <div className="empty-state-container">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="empty-state-text">
          No notes have been added yet. Click the "Add New Notes" button to create your first note.
        </span>
      }
    />
  </div>
);

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
  const { patientNotes, loadingNotes } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (!patient.userRef) {
      setIsModalVisible(true);
    } else {
      dispatch(fetchPatientNotes(patient.userRef));
    }
  }, [patient.userRef, dispatch]);

  useEffect(() => {
    if (patientNotes) {
      const formattedNotes = patientNotes.map(note => {
        const [datePart] = note.createdOn.split(' ');
        const [month, day, year] = datePart.split('/');
        const date = new Date(year, month - 1, day);

        return {
          profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/03d8574713eae32df92c6306c07473dcda5418d6",
          name: note.providerName || "Current User",
          role: note.providerRole || "Clinician",
          date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          appointmentType: getAppointmentTypeString(note.appointType),
          progressNotes: [
            `Subjective: ${note.subjective}`,
            `Objective: ${note.objective}`,
            `Assessment: ${note.assessment}`,
            `Plan: ${note.patientPlan}`
          ],
          personalNotes: note.personalNote || '',
          nameColor: "text-[#F2AA93]"
        };
      });
      setNotes(formattedNotes);
    }
  }, [patientNotes]);

  const handleModalClose = () => {
    navigate("/doctor");
  };

  const handleViewMore = () => {
    setVisibleNotes(prev => prev + 3);
  };

  const addNote = async (newNote) => {
    try {
      const result = await dispatch(addPatientNotes({
        ...newNote,
        patientRef: patient.userRef
      })).unwrap();

      if (result) {
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getAppointmentTypeString = (type) => {
    switch (type) {
      case 0:
        return 'Follow-Up';
      case 1:
        return 'Initial Assessment - Initial Consult';
      case 2:
        return 'Initial Assessment - Second Consult';
      default:
        return 'Follow-Up';
    }
  };

  return (
    <div className="notes-contaciner">
      <Header/>
      {patient.userRef ? (
        <>
          <NotesHeader onAddNote={addNote} />
          <div className="notes-card">
            {loadingNotes ? (
              <div className="loading-state">Loading notes...</div>
            ) : notes.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <NotesList notes={notes.slice(0, visibleNotes)} />
                {visibleNotes < notes.length && (
                  <div onClick={handleViewMore}>
                    <ViewMoreButton />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <Modal
          title="No Patient Selected"
          open={isModalVisible}
          footer={[
            <Button key="ok" type="primary" onClick={handleModalClose}>
              Select Patient
            </Button>
          ]}
          closable={false}
          maskClosable={false}
        >
          <p>Please select a patient to view their notes.</p>
        </Modal>
      )}
    </div>
  );
};

export default Note;