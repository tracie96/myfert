import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const NoteMenu = ({ onEdit, onDelete, triggerIcon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="menu-trigger">
        {triggerIcon ? (
          <img src={triggerIcon} alt="menu" style={{ cursor: 'pointer' }} />
        ) : (
          <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        )}
      </div>
    </Dropdown>
  );
};

export default NoteMenu; 