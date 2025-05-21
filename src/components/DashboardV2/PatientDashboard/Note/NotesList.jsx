import React, { useState } from "react";
import { List, Card, Avatar, Typography, Button, Divider, Row, Col, Modal, Form, Input, Dropdown, Menu } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

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

const NotesList = ({ notes, onViewMore }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const handleEdit = (note) => {
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
    setIsDeleteModalVisible(true);
  };





  const menu = (note) => (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(note)}>
        Edit Note
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(note)}>
        Delete Note
      </Menu.Item>
    </Menu>
  );

  return (
    <Card bordered={false}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={5}><b>Profile</b></Col>
        <Col span={5}><b>Appt Type</b></Col>
        <Col span={9}><b>Progress Notes</b></Col>
        <Col span={4}><b>Personal Notes</b></Col>
        <Col span={1}></Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <List
        itemLayout="vertical"
        dataSource={notes}
        renderItem={item => (
          <List.Item
            key={item.name + item.date}
            style={{ padding: "24px 0", borderBottom: "1px solid #f0f0f0" }}
          >
            <Row gutter={16} align="middle">
              <Col span={5}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar 
                    src={item.profileImage} 
                    size={48} 
                  />
                  <div>
                    <Text strong style={{ color: "#335cad" }}>{item.name}</Text>
                    <br />
                    <Text type="secondary">{item.role}</Text>
                    <br />
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: 12, marginTop: '8px', marginLeft: '60px' }}>
                  {(item.date)}
                </Text>
              </Col>
              <Col span={5}>
                <Text>{item.appointmentType || 'No Appointment Type'}</Text>
              </Col>
              <Col span={9}>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 0,
                  listStyleType: 'none'
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
                        alignItems: 'center'
                      }}>
                        <Text style={{ 
                          fontSize: '13px',
                          fontWeight: 600,
                          color: colors.text,
                          marginRight: '8px'
                        }}>
                          {type}:
                        </Text>
                        <Text style={{ 
                          fontSize: '14px',
                          color: '#262626',
                          lineHeight: '1.5'
                        }}>
                          {content}
                        </Text>
                      </li>
                    );
                  })}
                </ul>
              </Col>
              <Col span={4}>
                <Text>{item.personalNotes || 'No personal notes'}</Text>
              </Col>
              <Col span={1}>
                <Dropdown overlay={menu(item)} trigger={['click']}>
                  <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button type="link" onClick={onViewMore}>View More</Button>
      </div>

      <Modal
        title="Edit Note"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
      
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
      
        ]}
      >
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default NotesList; 