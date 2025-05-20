import React, { useState } from 'react';
import { Modal, Form, Input, Button, Avatar, Typography, Dropdown, Menu } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { editPatientNote } from '../../../../redux/doctorSlice';
import './NotesList.css';

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
  nameColor,
  hasMenu = false,
  menuIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/f9ab6930c2845a62780ec7d43446b11054cb8a18",
  noteId
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleEdit = () => {
    const values = {};
    progressNotes.forEach(note => {
      const [type, content] = note.split(': ');
      values[type.toLowerCase()] = content;
    });
    values.personalNote = personalNotes;
    form.setFieldsValue(values);
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    console.log(`Deleting note for ${name}`);
    // In a real app, this would show a confirmation dialog
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(editPatientNote({
        ...values,
        noteId
      })).unwrap();
      
      if (result) {
        setIsEditModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEdit}>
        Edit Note
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={handleDelete}>
        Delete Note
      </Menu.Item>
    </Menu>
  );

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
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )}

      <Modal
        title="Edit Note"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        ]}
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