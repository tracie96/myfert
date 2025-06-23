import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  patientList as fetchPatientList, 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './styles.css';
import { FaRegPaperPlane } from 'react-icons/fa';

const Intercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  // Get patient list and loading state from redux store
  const patients = useSelector((state) => state.doctor.patientList || []);
  const providers = useSelector((state) => state.doctor.careGivers || []);
  const isLoading = useSelector((state) => state.doctor.loading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatLoading = useSelector((state) => state.doctor.chatLoading);
  const chatError = useSelector((state) => state.doctor.chatError);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch patient list when component mounts or tab changes
    const loadUsers = async () => {
      try {
        const params = {
          page: 1,
          size: 100
        };
        
        if (activeTab === 'patient') {
          const response = await dispatch(fetchPatientList(params));
          if (!fetchPatientList.fulfilled.match(response)) {
            console.error('Failed to fetch patient list:', response.error);
          }
        } else {
          const response = await dispatch(fetchCareGivers(params));
          if (!fetchCareGivers.fulfilled.match(response)) {
            console.error('Failed to fetch providers list:', response.error);
          }
        }
      } catch (error) {
        console.error('Error fetching users list:', error);
      }
    };

    loadUsers();
  }, [dispatch, activeTab]);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser?.id) {
      console.log('Fetching messages for user:', selectedUser.id);
      dispatch(getMessages(selectedUser.id))
        .then(response => {
          console.log('Messages response:', response);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [dispatch, selectedUser]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserSelect = (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser?.id && chatRef) {
      console.log('Sending message:', {
        userRef: selectedUser.id,
        chat: message.trim(),
        chatRef: chatRef
      });
      try {
        const trimmedMessage = message.trim();
        setMessage(''); // Clear input immediately for better UX

        // Send the message
        const response = await dispatch(sendMessage({
          userRef: selectedUser.id,
          chat: trimmedMessage,
          chatRef: chatRef
        }));

        // Immediately fetch new messages to ensure everything is in sync
        if (sendMessage.fulfilled.match(response)) {
          await dispatch(getMessages(selectedUser.id));
        } else {
          console.error('Failed to send message:', response.error);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
    setSearchQuery(''); // Clear search when switching tabs
  };

  const renderMessages = () => {
    if (chatLoading) {
      return <div className="loading-messages">Loading messages...</div>;
    }

    if (chatError) {
      return <div className="error-messages">Error loading messages: {chatError.message}</div>;
    }

    if (!messages || messages.length === 0) {
      return <div className="no-messages">No messages yet</div>;
    }

    // Sort messages by date (oldest to newest)
    const sortedMessages = [...messages].sort((a, b) => {
      return new Date(a.createdOn) - new Date(b.createdOn);
    });

    return sortedMessages.map((msg, index) => {
      // isUser: true means the message is from us (current user) - show on right
      // isUser: false means the message is from the other person - show on left
      const messagePosition = msg.isUser ? 'sent' : 'received';
      
      return (
        <div 
          key={index} 
          className={`message-bubble ${messagePosition}`}
        >
          <div className="message-content">
            {msg.chat}
            <div className="message-timestamp">
              {new Date(msg.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      );
    });
  };

  // Move getCurrentUsers into useMemo to avoid the dependency issue
  const filteredUsers = useMemo(() => {
    const getCurrentUsers = () => {
      if (activeTab === 'patient') {
        return patients?.map(patient => ({
          id: patient.userRef,
          name: `${patient.firstname} ${patient.lastname}`,
          avatar: patient.picture,
          email: patient.email,
          phone: patient.phoneNumber
        })) || [];
      } else {
        const providersList = providers?.getRecord || providers || [];
        return providersList.map(provider => {
          return {
            id: provider.userRef || provider.id,
            name: `${provider.firstname || ''} ${provider.lastname || ''}`.trim() || 'Unknown Provider',
            avatar: provider.profilePicture || provider.picture,
            email: provider.email,
            role: provider.role || provider.userType
          };
        }) || [];
      }
    };

    const users = getCurrentUsers();
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      (user.email && user.email.toLowerCase().includes(query))
    );
  }, [searchQuery, patients, providers, activeTab]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="intercom-container">
      <div className={`messages-sidebar ${isMobileView && selectedUser ? 'hidden' : ''}`}>
        <div className="messages-header">
          <h2>MESSAGES</h2>
          <button className="new-message-btn">
            <i className="fas fa-sync-alt"></i> New Message
          </button>
        </div>
        
        <div className="search-container">
          <Input
            prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            bordered={false}
          />
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeTab === 'patient' ? 'active' : ''}`}
              onClick={() => {
                handleTabChange('patient');
                setSearchQuery('');
              }}
            >
              Patient
            </button>
            <button 
              className={`filter-btn ${activeTab === 'provider' ? 'active' : ''}`}
              onClick={() => {
                handleTabChange('provider');
                setSearchQuery('');
              }}
            >
              Provider
            </button>
          </div>
        </div>

        <div className="users-list">
          {isLoading ? (
            <div className="loading-state">Loading {activeTab === 'patient' ? 'patients' : 'providers'}...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  <Avatar 
                    size={40}
                    src={user.avatar}
                    icon={!user.avatar && <UserOutlined />}
                    style={{ 
                      backgroundColor: !user.avatar ? '#00ADEF' : 'transparent',
                      color: !user.avatar ? '#fff' : undefined
                    }}
                  >
                    {!user.avatar && user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
                <div className="user-info">
                  <div className="user-name-container">
                    <span className="user-name">{user.name}</span>
                    {user.role && (
                      <small className="user-role">{user.role}</small>
                    )}
                  </div>
                  {user.email && (
                    <div className="user-details">
                      <small className="text-muted">{user.email}</small>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No {activeTab === 'patient' ? 'patients' : 'providers'} found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className={`chat-window ${isMobileView && selectedUser ? 'active' : ''}`}>
        {selectedUser ? (
          <>
            <div className="chat-header">
              {isMobileView && (
                <button className="back-button" onClick={handleBackToList}>
                  <ArrowLeftOutlined />
                </button>
              )}
              <div className="selected-user">
                <Avatar 
                  size={40}
                  src={selectedUser.avatar}
                  icon={!selectedUser.avatar && <UserOutlined />}
                  style={{ 
                    backgroundColor: !selectedUser.avatar ? '#00ADEF' : 'transparent',
                    color: !selectedUser.avatar ? '#fff' : undefined
                  }}
                >
                  {!selectedUser.avatar && selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <div className="selected-user-info">
                  <span className="user-name">{selectedUser.name}</span>
                  {selectedUser.role ? (
                    <small className="text-muted">{selectedUser.role}</small>
                  ) : (
                    selectedUser.email && <small className="text-muted">{selectedUser.email}</small>
                  )}
                </div>
              </div>
            </div>
            <div className="chat-messages">
              {renderMessages()}
              <div ref={messagesEndRef} />
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
                    disabled={!message.trim() || chatLoading}
                  >
                   <FaRegPaperPlane/>
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