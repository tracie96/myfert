import React, { useState, useEffect } from 'react';
import NotesHeader from './NotesHeader';
import NotesList from './NotesList';
import ViewMoreButton from './ViewMoreButton';
import './note.css';
import Header from '../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { addPatientNotes, fetchPatientNotes } from '../../../../components/redux/doctorSlice';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
  const { patientNotes } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (!patient.userRef) {
      setIsModalVisible(true);
    } else {
      dispatch(fetchPatientNotes(patient.userRef));
    }
  }, [patient.userRef, dispatch]);

  console.log({patientNotes})
  useEffect(() => {
    if (patientNotes) {
      // Transform the API response to match our UI format
      const formattedNotes = patientNotes.map(note => {
        // Parse the date string
        const [datePart, timePart] = note.createdOn.split(' ');
        const [month, day, year] = datePart.split('/');
        const date = new Date(year, month - 1, day); // month is 0-based in JS Date

        return {
          profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/03d8574713eae32df92c6306c07473dcda5418d6", // Default image
          name: note.providerName || "Current User",
          role: note.providerRole || "Clinician",
          date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          appointmentType: getAppointmentTypeString(note.appointType),
          progressNotes: note.note ? note.note.split('\n').filter(note => note.trim()) : [],
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
        patientNote: newNote.progressNotes.join('\n'),
        personalNote: newNote.personalNotes || '',
        appointmentType: getAppointmentTypeValue(newNote.appointmentType),
        patientRef: patient.userRef
      })).unwrap();

      if (result) {
        // Refresh the notes list after adding a new note
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getAppointmentTypeValue = (appointmentType) => {
    switch (appointmentType) {
      case 'Follow-Up':
        return 0;
      case 'Initial Assessment - Initial Consult':
        return 1;
      case 'Initial Assessment - Second Consult':
        return 2;
      default:
        return 0;
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
    <div className="notes-container">
      <Header/>
      {patient.userRef ? (
        <>
          <NotesHeader onAddNote={addNote} />
          <div className="notes-card">
            <NotesList notes={notes.slice(0, visibleNotes)} />
            {visibleNotes < notes.length && (
              <div onClick={handleViewMore}>
                <ViewMoreButton />
              </div>
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