import React, { useState } from "react";
import { List, Card, Avatar, Typography, Button, Divider, Row, Col, Modal, Form, Input, Space } from "antd";

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

const NotesList = ({ notes, onViewMore, isMobile, isTablet }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getResponsiveColumns = () => {
    if (isMobile) {
      return {
        profile: 24,
        apptType: 24,
        progressNotes: 24,
        actions: 24
      };
    } else if (isTablet) {
      return {
        profile: 7,
        apptType: 7,
        progressNotes: 8,
        actions: 2
      };
    }
    return {
      profile: 6,
      apptType: 6,
      progressNotes: 11,
      actions: 1
    };
  };

  const columns = getResponsiveColumns();



  return (
    <Card bordered={false} style={{ width: '100%' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} className="header-row">
        <Col xs={24} sm={columns.profile}><Text strong>Profile</Text></Col>
        <Col xs={24} sm={columns.apptType}><Text strong>Appt Type</Text></Col>
        <Col xs={24} sm={columns.progressNotes}><Text strong>Progress Notes</Text></Col>
        <Col xs={24} sm={columns.actions}></Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />
      <List
        itemLayout="vertical"
        dataSource={notes}
        style={{ width: '100%' }}
        renderItem={item => (
          <List.Item
            key={item.name + item.date}
            style={{ 
              padding: "24px 0", 
              borderBottom: "1px solid #f0f0f0",
              width: '100%'
            }}
          >
            <Row gutter={[16, 16]} align="top" style={{ width: '100%' }}>
              <Col xs={24} sm={columns.profile}>
                <Space align="start" style={{ width: '100%' }}>
                  <Avatar 
                    src={item.profileImage} 
                    size={48} 
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ color: "#335cad" }}>{item.name}</Text>
                    <br />
                    <Text type="secondary">{item.role}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.date}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={columns.apptType}>
                <Text style={{ fontSize: '14px' }}>{item.appointmentType || 'No Appointment Type'}</Text>
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
                          marginBottom: isMobile ? '4px' : 0,
                          whiteSpace: 'nowrap'
                        }}>
                          {type}:
                        </Text>
                        <Text style={{ 
                          fontSize: '14px',
                          color: '#262626',
                          lineHeight: '1.5',
                          wordBreak: 'break-word',
                          flex: 1
                        }}>
                          {content}
                        </Text>
                      </li>
                    );
                  })}
                </ul>
              </Col>
             
            </Row>
          </List.Item>
        )}
      />

      <Modal
        title="Note Details"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsEditModalVisible(false)}>
            Close
          </Button>
        ]}
        width={isMobile ? '100%' : 800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="patientPlan"
            label="Plan"
          >
            <TextArea 
              rows={4} 
              readOnly
            />
          </Form.Item>

          <Form.Item
            name="personalNote"
            label="Personal Notes"
          >
            <TextArea 
              rows={4} 
              readOnly
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
          </Button>
        ]}
        width={isMobile ? '100%' : 520}
      >
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
      </Modal>
    </Card>
  );
};

export default NotesList; 