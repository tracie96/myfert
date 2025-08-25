import React, { useState } from "react";
import { List, Card, Avatar, Typography, Button, Divider, Row, Col, Modal, Form, Input, Dropdown, Menu, Space, Tag, Tabs, message } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { editPatientNote, fetchPatientNotes, deletePatientNote } from "../../../redux/doctorSlice";
import { useMediaQuery } from 'react-responsive';

const { Text } = Typography;
const { TextArea } = Input;

const getProgressNotes = (note) => {
  return note.progressNotes || ['No progress notes available'];
};

const noteTypeColors = {
  'Subjective': {
    border: '#4A90E2',
    bg: '#F0F7FF',
    text: '#2C5282'
  },
  'Objective': {
    border: '#48BB78', 
    bg: '#F0FFF4',
    text: '#2F855A'
  },
  'Assessment': {
    border: '#ED8936', 
    bg: '#FFFAF0',
    text: '#C05621'
  },
  'Plan': {
    border: '#9F7AEA', 
    bg: '#FAF5FF',
    text: '#6B46C1'
  }
};

/**
 * NotesList Component
 * 
 * Features:
 * - Displays notes in two tabs: Completed Notes and Drafts
 * - Shows accurate count of all notes (not just visible ones)
 * - Allows toggling between draft and completed status using editPatientNote
 * - Pagination within each tab for better performance
 * - Mobile-responsive with appropriate buttons for each action
 * - Loading states and user feedback for all actions
 */
const NotesList = ({ notes, onViewMore }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [visibleNotes, setVisibleNotes] = useState(3);
  const [togglingDraftStatus, setTogglingDraftStatus] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  // Separate notes into drafts and completed
  const draftNotes = notes.filter(note => note.isDraft);
  const completedNotes = notes.filter(note => !note.isDraft);

  // Paginate the notes for display - show only a subset initially for better performance
  const visibleDraftNotes = draftNotes.slice(0, visibleNotes);
  const visibleCompletedNotes = completedNotes.slice(0, visibleNotes);

  const handleViewMore = () => {
    setVisibleNotes(prev => prev + 3);
  };

  // Reset pagination when switching between tabs
  const handleTabChange = () => {
    setVisibleNotes(3);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    const values = {};
    note.progressNotes.forEach(noteText => {
      const [type, content] = noteText.split(': ');
      switch(type) {
        case 'Subjective':
          values.subjective = content;
          break;
        case 'Objective':
          values.objective = content;
          break;
        case 'Assessment':
          values.assessment = content;
          break;
        case 'Plan':
          values.patientPlan = content;
          break;
        default:
          break;
      }
    });
    values.personalNote = note.personalNotes;
    form.setFieldsValue(values);
    setIsEditModalVisible(true);
  };

  const handleDelete = (note) => {
    console.log('Deleting note:', note);
    setSelectedNote(note);
    setIsDeleteModalVisible(true);
  };

  const handleMarkAsDraft = async (note) => {
    if (togglingDraftStatus) return; // Prevent multiple clicks
    
    try {
      setTogglingDraftStatus(true);
      
      // Extract the note content from progressNotes
      const subjective = note.progressNotes.find(n => n.startsWith('Subjective: '))?.replace('Subjective: ', '') || '';
      const objective = note.progressNotes.find(n => n.startsWith('Objective: '))?.replace('Objective: ', '') || '';
      const assessment = note.progressNotes.find(n => n.startsWith('Assessment: '))?.replace('Assessment: ', '') || '';
      const patientPlan = note.progressNotes.find(n => n.startsWith('Plan: '))?.replace('Plan: ', '') || '';
      
      // Use editPatientNote with isDraft: true
      const result = await dispatch(editPatientNote({
        personalNote: note.personalNotes,
        subjective,
        objective,
        assessment,
        patientPlan,
        noteId: note.noteId,
        isDraft: true // Mark as draft
      })).unwrap();
      
      if (result) {
        message.success('Note marked as draft successfully');
        // Refresh the notes list
        const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to mark note as draft:', error);
      message.error('Failed to mark note as draft');
    } finally {
      setTogglingDraftStatus(false);
    }
  };

  const handleMarkAsCompleted = async (note) => {
    if (togglingDraftStatus) return; // Prevent multiple clicks
    
    try {
      setTogglingDraftStatus(true);
      
      // Extract the note content from progressNotes
      const subjective = note.progressNotes.find(n => n.startsWith('Subjective: '))?.replace('Subjective: ', '') || '';
      const objective = note.progressNotes.find(n => n.startsWith('Objective: '))?.replace('Objective: ', '') || '';
      const assessment = note.progressNotes.find(n => n.startsWith('Assessment: '))?.replace('Assessment: ', '') || '';
      const patientPlan = note.progressNotes.find(n => n.startsWith('Plan: '))?.replace('Plan: ', '') || '';
      
      // Use editPatientNote with isDraft: false
      const result = await dispatch(editPatientNote({
        personalNote: note.personalNotes,
        subjective,
        objective,
        assessment,
        patientPlan,
        noteId: note.noteId,
        isDraft: false // Mark as completed
      })).unwrap();
      
      if (result) {
        message.success('Note marked as completed successfully');
        // Refresh the notes list
        const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to mark note as completed:', error);
      message.error('Failed to mark note as completed');
    } finally {
      setTogglingDraftStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Selected note for deletion:', selectedNote);
      if (!selectedNote || !selectedNote.noteId) {
        console.error('No note selected or missing noteId');
        return;
      }
      
      const result = await dispatch(deletePatientNote(selectedNote.noteId)).unwrap();
      if (result) {
        setIsDeleteModalVisible(false);
        // Refresh the notes list
        const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(editPatientNote({
        personalNote: values.personalNote,
        subjective: values.subjective,
        objective: values.objective,
        assessment: values.assessment,
        patientPlan: values.patientPlan,
        noteId: selectedNote.noteId,
        isDraft: selectedNote.isDraft // Preserve the current draft status
      })).unwrap();
      
      if (result) {
        setIsEditModalVisible(false);
        form.resetFields();
        // Refresh the notes list
        const patient = JSON.parse(localStorage.getItem("patient")) || { userRef: "" };
        dispatch(fetchPatientNotes(patient.userRef));
      }
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const menu = (note) => (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(note)}>
        Edit Note
      </Menu.Item>
      {!note.isDraft && (
        <Menu.Item 
          key="markAsDraft" 
          icon={<FileTextOutlined />} 
          onClick={() => handleMarkAsDraft(note)}
          disabled={togglingDraftStatus}
        >
          {togglingDraftStatus ? 'Marking as Draft...' : 'Mark as Draft'}
        </Menu.Item>
      )}
      {note.isDraft && (
        <Menu.Item 
          key="markAsCompleted" 
          icon={<FileTextOutlined />} 
          onClick={() => handleMarkAsCompleted(note)}
          disabled={togglingDraftStatus}
        >
          {togglingDraftStatus ? 'Marking as Completed...' : 'Mark as Completed'}
        </Menu.Item>
      )}
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(note)}>
        Delete Note
      </Menu.Item>
    </Menu>
  );

  const getResponsiveColumns = () => {
    if (isMobile) {
      return {
        profile: 24,
        apptType: 24,
        progressNotes: 24,
        personalNotes: 24,
        actions: 24
      };
    } else if (isTablet) {
      return {
        profile: 8,
        apptType: 8,
        progressNotes: 16,
        personalNotes: 16,
        actions: 2
      };
    }
    return {
      profile: 5,
      apptType: 5,
      progressNotes: 9,
      personalNotes: 4,
      actions: 1
    };
  };

  const columns = getResponsiveColumns();

  const NotesListContent = ({ notesData, noteType }) => (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} className="header-row">
        <Col xs={24} sm={columns.profile}><b>Profile</b></Col>
        <Col xs={24} sm={columns.apptType}><b>Appt Type</b></Col>
        <Col xs={24} sm={columns.progressNotes}><b>Progress Notes</b></Col>
        <Col xs={24} sm={columns.personalNotes}><b>Personal Notes</b></Col>
        <Col xs={24} sm={columns.actions}></Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <List
        itemLayout="vertical"
        dataSource={notesData}
        renderItem={item => (
          <List.Item
            key={item.name + item.date}
            style={{ padding: "24px 0", borderBottom: "1px solid #f0f0f0" }}
          >
            <Row gutter={[16, 16]} align="top">
              <Col xs={24} sm={columns.profile}>
                <Space align="start">
                  <Avatar 
                    src={item.profileImage} 
                    size={48} 
                  />
                  <div>
                    <Space>
                      <Text strong style={{ color: "#335cad" }}>{item.name}</Text>
                      {item.isDraft && <Tag color="warning">Draft</Tag>}
                    </Space>
                    <br />
                    <Text type="secondary">{item.role}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {(item.date)}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={columns.apptType}>
                <Text>{item.appointmentType || 'No Appointment Type'}</Text>
              </Col>
              <Col xs={24} sm={columns.progressNotes}>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 0,
                  listStyleType: 'none',
                  width: '100%'
                }}>
                  {getProgressNotes(item).map((note, idx) => {
                    const [type, content] = note.split(': ');
                    const colors = noteTypeColors[type] || {
                      border: '#335cad',
                      bg: '#f8f9fa',
                      text: '#335cad'
                    };
                    
                    return (
                      <li key={idx} style={{ 
                        marginBottom: '12px',
                        padding: '8px 12px',
                        backgroundColor: colors.bg,
                        borderRadius: '6px',
                        borderLeft: `4px solid ${colors.border}`,
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        width: '100%'
                      }}>
                        <Text style={{ 
                          fontSize: '13px',
                          fontWeight: 600,
                          color: colors.text,
                          marginRight: '8px',
                          marginBottom: isMobile ? '4px' : 0
                        }}>
                          {type}:
                        </Text>
                        <Text style={{ 
                          fontSize: '14px',
                          color: '#262626',
                          lineHeight: '1.5',
                          wordBreak: 'break-word'
                        }}>
                          {content}
                        </Text>
                      </li>
                    );
                  })}
                </ul>
              </Col>
            <Col xs={24} sm={columns.personalNotes}>
                <Text style={{ wordBreak: 'break-word' }}>{item.personalNotes || 'No personal notes'}</Text>
              </Col>
              <Col xs={24} sm={columns.actions} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                {isMobile && (
                  <Space>
                    <Button type="primary" onClick={() => handleEdit(item)}>Edit</Button>
                    {item.isDraft && (
                      <Button 
                        type="default" 
                        onClick={() => handleMarkAsCompleted(item)}
                        loading={togglingDraftStatus}
                        disabled={togglingDraftStatus}
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {!item.isDraft && (
                      <Button 
                        type="default" 
                        onClick={() => handleMarkAsDraft(item)}
                        loading={togglingDraftStatus}
                        disabled={togglingDraftStatus}
                      >
                        Mark as Draft
                      </Button>
                    )}
                  </Space>
                )}
                {!isMobile && <Dropdown overlay={menu(item)} trigger={['click']}>
                  <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown> }
              </Col>
            </Row>
          </List.Item>
        )}
      />
      {noteType === 'drafts' && visibleNotes < draftNotes.length && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="dashed" onClick={handleViewMore}>
            View More Drafts
          </Button>
        </div>
      )}
      {noteType === 'completed' && visibleNotes < completedNotes.length && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="dashed" onClick={handleViewMore}>
            View More Completed Notes
          </Button>
        </div>
      )}
    </>
  );

  const items = [
    {
      key: '1',
      label: `Completed Notes (${completedNotes.length})`,
      children: <NotesListContent notesData={visibleCompletedNotes} noteType="completed" />,
    },
    {
      key: '2',
      label: `Drafts (${draftNotes.length})`,
      children: <NotesListContent notesData={visibleDraftNotes} noteType="drafts" />,
    },
  ];

  return (
    <>
    <Tabs 
    defaultActiveKey="1" 
    items={items}
    style={{ marginBottom: 16 }}
    onTabChange={handleTabChange}
  />
  {/* Removed the single View More Drafts/Completed Notes button */}
    <Card bordered={false}>
     
      
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
        width={800}
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
            <TextArea 
              rows={4} 
              placeholder="Enter patient's reported symptoms and concerns"
            />
          </Form.Item>

          <Form.Item
            name="objective"
            label="Objective"
            rules={[{ required: true, message: 'Please enter objective findings' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter measurable observations and test results"
            />
          </Form.Item>

          <Form.Item
            name="assessment"
            label="Assessment"
            rules={[{ required: true, message: 'Please enter assessment' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter your professional assessment and diagnosis"
            />
          </Form.Item>

          <Form.Item
            name="patientPlan"
            label="Plan"
            rules={[{ required: true, message: 'Please enter treatment plan' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter treatment plan and next steps"
            />
          </Form.Item>

          <Form.Item
            name="personalNote"
            label="Personal Notes"
            rules={[{ required: true, message: 'Please enter personal notes' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter personal notes"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Note"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteConfirm}>
            Delete
          </Button>
        ]}
      >
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
      </Modal>
    </Card>
    </>
  );
};

export default NotesList; 