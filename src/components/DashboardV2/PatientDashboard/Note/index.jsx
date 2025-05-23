import React, { useState, useEffect } from 'react';
import NotesList from './NotesList';
import ViewMoreButton from './ViewMoreButton';
import '../../DoctorDashboard/Note/note.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientNotes } from '../../../redux/patientSlice';
import { Card } from 'antd';
import { useMediaQuery } from 'react-responsive';

const PatientNote = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState(3);
  const dispatch = useDispatch();
  const { notes: patientNotes, status, error } = useSelector((state) => state.patient);

  // Add responsive breakpoints
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  useEffect(() => {
    dispatch(getPatientNotes());
  }, [dispatch]);

  useEffect(() => {
    if (patientNotes) {
      const formattedNotes = patientNotes.map(note => {
        const [datePart] = note.createdOn.split(' ');
        const [month, day, year] = datePart.split('/');
        const date = new Date(year, month - 1, day);

        return {
          profileImage: note.doctorPicture || "https://cdn.builder.io/api/v1/image/assets/TEMP/03d8574713eae32df92c6306c07473dcda5418d6",
          name: note.providerName || "Current User",
          role: note.providerRole || "Clinician",
          date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          appointmentType: note.appointType,
          patientPlan: note.patientPlan,
          progressNotes: [
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

  if (status === 'loading') {
    return (
      <div className="notes-container">
        <Card loading bordered={false} />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="notes-container">
        <Card bordered={false}>
          <div style={{ color: '#ff4d4f', textAlign: 'center', padding: '20px' }}>
            Error: {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="notes-container" style={{ 
      padding: isMobile ? '8px' : '16px',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <div className="notes-card" style={{
        margin: isMobile ? '0' : '0 auto',
        width: '100%'
      }}>
        <NotesList 
          notes={notes.slice(0, visibleNotes)} 
          isMobile={isMobile}
          isTablet={isTablet}
        />
        {visibleNotes < notes.length && (
          <div onClick={handleViewMore} style={{ 
            textAlign: 'center', 
            marginTop: isMobile ? '12px' : '16px',
            padding: isMobile ? '8px' : '16px'
          }}>
            <ViewMoreButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNote;