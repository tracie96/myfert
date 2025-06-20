import React, { useState, useEffect } from 'react';
import { Input, Spin } from 'antd';
import axios from 'axios';
import './styles.css';

const Intercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('patient');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for messages
  const mockMessages = [
    {
      id: 1,
      sender: 'doctor',
      text: 'Hello!',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      sender: 'patient',
      text: 'I have questions on how to book an appointment.',
      timestamp: new Date().toISOString(),
    }
  ];

  const patients = [
    { id: 1, name: 'Jan Smith', avatar: '/path/to/avatar1' },
    { id: 2, name: 'Crisia Tabacaru', avatar: '/path/to/avatar2' },
    { id: 3, name: 'Bob Teller', avatar: '/path/to/avatar3' },
    { id: 4, name: 'Claire Holmes', avatar: '/path/to/avatar4' },
    { id: 5, name: 'Stacey Dimock', avatar: '/path/to/avatar5' },
    { id: 6, name: 'Esther Flin', avatar: '/path/to/avatar6' },
  ];

  useEffect(() => {
    if (activeTab === 'provider') {
      fetchProviders();
    }
  }, [activeTab]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://myfertilitydevapi-prod.azurewebsites.net/api/Chat/GetCareGiverList/1/100');
      setProviders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implement message sending logic here
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUser(null);
  };

  const renderMessages = () => {
    return mockMessages.map((msg) => (
      <div 
        key={msg.id} 
        className={`message-bubble ${msg.sender === 'doctor' ? 'sent' : 'received'}`}
      >
        <div className="message-content">
          {msg.text}
        </div>
      </div>
    ));
  };

  const getCurrentUsers = () => {
    return activeTab === 'patient' ? patients : providers;
  };

  return (
    <div className="intercom-container">
      <div className="messages-sidebar">
        <div className="messages-header">
          <h2>MESSAGES</h2>
          <button className="new-message-btn">
            <i className="fas fa-sync-alt"></i> New Message
          </button>
        </div>
        
        <div className="search-container">
          <Input
            prefix={<i className="fas fa-search"></i>}
            placeholder="Search"
            className="search-input"
          />
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeTab === 'patient' ? 'active' : ''}`}
              onClick={() => handleTabChange('patient')}
            >
              Patient
            </button>
            <button 
              className={`filter-btn ${activeTab === 'provider' ? 'active' : ''}`}
              onClick={() => handleTabChange('provider')}
            >
              Provider
            </button>
          </div>
        </div>

        <div className="users-list">
          {loading ? (
            <div className="loading-container">
              <Spin />
            </div>
          ) : (
            getCurrentUsers().map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  <img 
                    src={user.avatar || user.profileImage || '/default-avatar.png'} 
                    alt={user.name || user.firstName + ' ' + user.lastName} 
                  />
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user.name || `${user.firstName} ${user.lastName}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="selected-user">
                <img 
                  src={selectedUser.avatar || selectedUser.profileImage || '/default-avatar.png'} 
                  alt={selectedUser.name || selectedUser.firstName + ' ' + selectedUser.lastName} 
                  className="user-avatar" 
                />
                <span className="user-name">
                  {selectedUser.name || `${selectedUser.firstName} ${selectedUser.lastName}`}
                </span>
              </div>
            </div>
            <div className="chat-messages">
              {renderMessages()}
            </div>
            <div className="message-input-container">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter message"
                suffix={
                  <button 
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                }
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>How can I help?</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intercom;
