import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const AddNoteForm = ({ onClose, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
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
          <Option value="Follow-Up">Follow-Up</Option>
          <Option value="Initial Assessment - Initial Consult">Initial Assessment - Initial Consult</Option>
          <Option value="Initial Assessment - Second Consult">Initial Assessment - Second Consult</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="progressNotes"
        label="Progress Notes"
        rules={[{ required: true, message: 'Please enter progress notes' }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Enter progress notes (S: Subjective, O: Objective, A: Assessment, P: Plan)"
        />
      </Form.Item>

      <Form.Item
        name="personalNotes"
        label="Personal Notes"
      >
        <TextArea 
          rows={4} 
          placeholder="Enter personal notes (optional)"
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add Note
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddNoteForm; 