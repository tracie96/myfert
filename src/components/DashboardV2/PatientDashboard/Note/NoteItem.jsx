import React, { useState } from 'react';
import { Modal, Form, Input, Button, Avatar, Typography, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import '../../DoctorDashboard/Note/NotesList.css'
const { Text } = Typography;
const { TextArea } = Input;

const NoteItem = ({
  profileImage,
  name,
  role,
  date,
  appointmentType,
  progressNotes,
  personalNotes,
  hasMenu = false,

}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
 console.log({progressNotes})
  return (
    <div className="note-row">
      <div className="note-col profile-col">
        <div className="note-profile">
          <Avatar src={profileImage} size={48} />
          <div className="note-profile-info">
            <Text strong style={{ color: "#335cad" }}>{name}</Text>
            <Text type="secondary">{role}</Text>
            <Text className="note-date">{date}</Text>
          </div>
        </div>
      </div>
      
      <div className="note-col appt-col">
        <Text>{appointmentType || 'No Appointment Type'}</Text>
      </div>
      
      <div className="note-col progress-col">
        <div className="progress-notes">
          {progressNotes.map((note, idx) => {
            const [type, content] = note.split(': ');
            const colors = {
              'Subjective': { border: '#4A90E2', bg: '#F0F7FF', text: '#2C5282' },
              'Objective': { border: '#48BB78', bg: '#F0FFF4', text: '#2F855A' },
              'Assessment': { border: '#ED8936', bg: '#FFFAF0', text: '#C05621' },
              'Plan': { border: '#9F7AEA', bg: '#FAF5FF', text: '#6B46C1' }
            }[type] || { border: '#335cad', bg: '#f8f9fa', text: '#335cad' };
            
            return (
              <div 
                key={idx} 
                className="progress-note-item"
                style={{ 
                  backgroundColor: colors.bg,
                  borderLeftColor: colors.border
                }}
              >
                <Text className="progress-note-label" style={{ color: colors.text }}>
                  {type}:
                </Text>
                <Text className="progress-note-content">
                  {content}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="note-col personal-col">
        <Text className="personal-note">{personalNotes || 'No personal notes'}</Text>
      </div>
      
      {hasMenu && (
        <div className="note-col menu-col">
          <Dropdown trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )}

      <Modal
        title="Edit Note"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
     
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="subjective"
            label="Subjective"
            rules={[{ required: true, message: 'Please enter subjective notes' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="objective"
            label="Objective"
            rules={[{ required: true, message: 'Please enter objective notes' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="assessment"
            label="Assessment"
            rules={[{ required: true, message: 'Please enter assessment notes' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="patientPlan"
            label="Plan"
            rules={[{ required: true, message: 'Please enter plan notes' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="personalNote"
            label="Personal Notes"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoteItem; 