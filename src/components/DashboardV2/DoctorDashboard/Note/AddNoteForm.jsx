import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import './note.css';
const { TextArea } = Input;
const { Option } = Select;

const AddNoteForm = ({ onClose, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Load drafts when component mounts
    const loadDrafts = () => {
      const fields = ['appointmentType', 'subjective', 'objective', 'assessment', 'patientPlan', 'personalNote'];
      const drafts = {};
      
      fields.forEach(field => {
        const draft = localStorage.getItem(`note_draft_${field}`);
        if (draft) {
          drafts[field] = JSON.parse(draft);
        }
      });

      form.setFieldsValue(drafts);
    };

    loadDrafts();
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await onSubmit({
        ...values,
        status: 'SUBMITTED',  // Mark as officially submitted
        lastUpdated: new Date().toISOString()
      });
      
      // Clear drafts after successful submission
      ['appointmentType', 'subjective', 'objective', 'assessment', 'patientPlan', 'personalNote'].forEach(field => {
        localStorage.removeItem(`note_draft_${field}`);
      });
      
      form.resetFields();
      message.success('Note submitted successfully');
      onClose();
    } catch (error) {
      message.error('Failed to submit note. Please try again.');
    }
  };

  const saveDraft = (fieldName) => {
    const value = form.getFieldValue(fieldName);
    
    // Save the current field and its timestamp
    localStorage.setItem(`note_draft_${fieldName}`, JSON.stringify({
      value,
      lastSaved: new Date().toISOString()
    }));

    // Save the draft status
    localStorage.setItem('note_draft_status', JSON.stringify({
      status: 'DRAFT',
      lastUpdated: new Date().toISOString()
    }));

    message.success(`${fieldName} saved as draft`);
    onClose(); // Close the modal after saving draft
  };

  const saveAllAsDraft = () => {
    const values = form.getFieldsValue();
    Object.keys(values).forEach(field => {
      if (values[field]) {
        localStorage.setItem(`note_draft_${field}`, JSON.stringify({
          value: values[field],
          lastSaved: new Date().toISOString()
        }));
      }
    });

    localStorage.setItem('note_draft_status', JSON.stringify({
      status: 'DRAFT',
      lastUpdated: new Date().toISOString()
    }));

    message.success('All sections saved as draft');
    onClose();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="appointmentType"
        label="Appointment Type"
        rules={[{ required: true, message: 'Please select appointment type' }]}
      >
        <Select placeholder="Select appointment type">
          <Option value={1}>Follow-Up</Option>
          <Option value={2}>Initial Assessment - Initial Consult</Option>
          <Option value={3}>Initial Assessment - Second Consult</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="subjective"
        label="Subjective"
        rules={[{ required: true, message: 'Please enter subjective notes' }]}
      >
        <div>
          <TextArea 
            rows={4} 
            placeholder="Enter patient's reported symptoms and concerns"
          />
          <Button size="small" onClick={() => saveDraft('subjective')} style={{ marginTop: '8px' }}>
            Save as Draft
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        name="objective"
        label="Objective"
        rules={[{ required: true, message: 'Please enter objective findings' }]}
      >
        <div>
          <TextArea 
            rows={4} 
            placeholder="Enter measurable observations and test results"
          />
          <Button size="small" onClick={() => saveDraft('objective')} style={{ marginTop: '8px' }}>
            Save as Draft
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        name="assessment"
        label="Assessment"
        rules={[{ required: true, message: 'Please enter assessment' }]}
      >
        <div>
          <TextArea 
            rows={4} 
            placeholder="Enter your professional assessment and diagnosis"
          />
          <Button size="small" onClick={() => saveDraft('assessment')} style={{ marginTop: '8px' }}>
            Save as Draft
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        name="patientPlan"
        label="Plan (Visible to Patient)"
        rules={[{ required: true, message: 'Please enter treatment plan' }]}
        extra="This section will be visible to the patient after submission"
      >
        <div>
          <TextArea 
            rows={4} 
            placeholder="Enter treatment plan and next steps"
          />
          <Button size="small" onClick={() => saveDraft('patientPlan')} style={{ marginTop: '8px' }}>
            Save as Draft
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        name="personalNote"
        label="Personal Notes"
        rules={[{ required: true, message: 'Please enter personal notes' }]}
      >
        <div>
          <TextArea 
            rows={4} 
            placeholder="Enter personal notes"
          />
          <Button size="small" onClick={() => saveDraft('personalNote')} style={{ marginTop: '8px' }}>
            Save as Draft
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={saveAllAsDraft}>
            Save All as Draft
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit Note
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddNoteForm; 