import React from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import './note.css';
const { TextArea } = Input;
const { Option } = Select;

const AddNoteForm = ({ onClose, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values, isDraft = false) => {
    try {
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
        label="Plan (Visible to Patient)"
        rules={[{ required: true, message: 'Please enter treatment plan' }]}
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
        rules={[{ required: true, message: 'Please enter personal notes' }]}
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
            form.validateFields()
              .then(values => handleSubmit(values, true))
              .catch(err => console.error('Validation failed:', err));
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