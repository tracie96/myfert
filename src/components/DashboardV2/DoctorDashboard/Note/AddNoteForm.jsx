import React from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import './note.css';
const { TextArea } = Input;
const { Option } = Select;

const AddNoteForm = ({ onClose, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const validateFields = (values) => {
    const requiredFields = [
      'appointmentType',
      'subjective',
      'objective',
      'assessment',
      'patientPlan',
      'personalNote'
    ];
    
    const missingFields = requiredFields.filter(field => !values[field]);
    return missingFields;
  };

  const handleSubmit = async (values, isDraft) => {
    try {
      if (!isDraft) {
        // Only validate all fields for final submission
        const missingFields = validateFields(values);
        if (missingFields.length > 0) {
          message.error('Please fill in all required fields before submitting');
          return;
        }
      } else {
        // For drafts, set empty strings for any unfilled fields
        const requiredFields = [
          'appointmentType',
          'subjective',
          'objective',
          'assessment',
          'patientPlan',
          'personalNote'
        ];
        
        requiredFields.forEach(field => {
          if (!values[field]) {
            values[field] = field === 'appointmentType' ? 1 : ''; // Default appointmentType to 1 if not selected
          }
        });
      }

      await onSubmit({
        ...values,
        isDraft
      });
      
      form.resetFields();
      message.success(isDraft ? 'Note saved as draft' : 'Note submitted successfully');
      onClose();
    } catch (error) {
      message.error(isDraft ? 'Failed to save draft' : 'Failed to submit note. Please try again.');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => handleSubmit(values, false)}
    >
      <Form.Item
        name="appointmentType"
        label="Appointment Type"
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
      >
        <TextArea 
          rows={4} 
          placeholder="Enter patient's reported symptoms and concerns"
        />
      </Form.Item>

      <Form.Item
        name="objective"
        label="Objective"
      >
        <TextArea 
          rows={4} 
          placeholder="Enter measurable observations and test results"
        />
      </Form.Item>

      <Form.Item
        name="assessment"
        label="Assessment"
      >
        <TextArea 
          rows={4} 
          placeholder="Enter your professional assessment and diagnosis"
        />
      </Form.Item>

      <Form.Item
        name="patientPlan"
        label="Plan (Visible to Patient)"
        extra="This section will be visible to the patient after submission"
      >
        <TextArea 
          rows={4} 
          placeholder="Enter treatment plan and next steps"
        />
      </Form.Item>

      <Form.Item
        name="personalNote"
        label="Personal Notes"
      >
        <TextArea 
          rows={4} 
          placeholder="Enter personal notes"
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button onClick={() => {
            const values = form.getFieldsValue();
            handleSubmit(values, true);
          }}>
            Save as Draft
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