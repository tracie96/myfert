import React, { useState, useEffect } from 'react';
import NotesList from './NotesList';
import ViewMoreButton from './ViewMoreButton';
import '../../DoctorDashboard/Note/note.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientNotes } from '../../../redux/patientSlice';

const PatientNote = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState(3);
  const dispatch = useDispatch();
  const { notes: patientNotes, status, error } = useSelector((state) => state.patient);

  useEffect(() => {
   
      dispatch(getPatientNotes());
    
  }, [dispatch]);

  useEffect(() => {
    if (patientNotes) {
      const formattedNotes = patientNotes.map(note => {
        // Parse the date string
        const [datePart] = note.createdOn.split(' ');
        const [month, day, year] = datePart.split('/');
        const date = new Date(year, month - 1, day); // month is 0-based in JS Date

        return {
          profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/03d8574713eae32df92c6306c07473dcda5418d6", // Default image
          name: note.providerName || "Current User",
          role: note.providerRole || "Clinician",
          date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          appointmentType: getAppointmentTypeString(note.appointType),
          progressNotes: [
            `Subjective: ${note.subjective || ''}`,
            `Objective: ${note.objective || ''}`,
            `Assessment: ${note.assessment || ''}`,
            `Plan: ${note.patientPlan || ''}`
          ],
          personalNotes: note.personalNote || '',
          nameColor: "text-[#F2AA93]" 
        };
      });
      setNotes(formattedNotes);
    }
  }, [patientNotes]);


  const handleViewMore = () => {
    setVisibleNotes(prev => prev + 3);
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

  if (status === 'loading') {
    return <div>Loading notes...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="notes-container">
        <>
          <div className="notes-card">
            <NotesList notes={notes.slice(0, visibleNotes)} />
            {visibleNotes < notes.length && (
              <div onClick={handleViewMore}>
                <ViewMoreButton />
              </div>
            )}
          </div>
        </>
      
    </div>
  );
};

export default PatientNote;