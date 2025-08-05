import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import ReproductiveImage from "../../../../../assets/images/reproductive-image.png";

const CervicalMucusModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined style={{ color: '#333' }} />}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <img 
          src={ReproductiveImage} 
          alt="Cervical Mucus Types"
          style={{ 
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }} 
        />
      </div>
    </Modal>
  );
};

export default CervicalMucusModal; 