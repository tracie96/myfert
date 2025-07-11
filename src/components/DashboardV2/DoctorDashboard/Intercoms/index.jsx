import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar, Segmented } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  patientList as fetchPatientList, 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
  getChatHeads
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './styles.css';
import SendButton from '../../../../assets/images/telegram.png';
const Intercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const patients = useSelector((state) => state.doctor.patientList || []);
  const providers = useSelector((state) => state.doctor.careGivers || []);
  const chatHeads = useSelector((state) => state.doctor.chatHeads || []);
  const isLoading = useSelector((state) => state.doctor.loading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatLoading = useSelector((state) => state.doctor.chatLoading);
  const chatError = useSelector((state) => state.doctor.chatError);

  // This could come from your data source - number of days/files
  
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add polling for chat heads
  // useEffect(() => {
  //   // Initial fetch
  //   dispatch(getChatHeads());

  //   // Set up polling interval
  //   const interval = setInterval(() => {
  //     dispatch(getChatHeads());
  //   }, 2000); // 2 seconds

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [dispatch]);

  useEffect(() => {
    // Load chat heads first
    dispatch(getChatHeads());

    const loadUsers = async () => {
      try {
        const params = {
          page: 0,
          size: 500
        };
        
        if (activeTab === 'patients') {
          const response = await dispatch(fetchPatientList(params));
          if (!fetchPatientList.fulfilled.match(response)) {
            console.error('Failed to fetch patient list:', response.error);
          }
        } else if (activeTab === 'providers') {
          const response = await dispatch(fetchCareGivers(params));
          if (!fetchCareGivers.fulfilled.match(response)) {
            console.error('Failed to fetch providers list:', response.error);
          }
        }
      } catch (error) {
        console.error('Error fetching users list:', error);
      }
    };

    if (activeTab !== 'active') {
      loadUsers();
    }
  }, [dispatch, activeTab]);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser?.userRef || selectedUser?.id) {
      const userId = selectedUser.userRef || selectedUser.id;
      setInitialLoad(true); // Reset initial load when user changes
      console.log('Fetching messages for user:', userId);
      dispatch(getMessages(userId))
        .then(response => {
          console.log('Messages response:', response);
          setInitialLoad(false);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
          setInitialLoad(false);
        });

      // Set up polling interval for messages
      const messageInterval = setInterval(() => {
        dispatch(getMessages(userId))
          .catch(error => {
            console.error('Error polling messages:', error);
          });
      }, 5000); // Poll every 5 seconds

      // Cleanup interval on unmount or when user changes
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, selectedUser]);

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
    if (message.trim() && selectedUser && chatRef) {
      const userId = selectedUser.userRef || selectedUser.id;
      console.log('Sending message:', {
        userRef: userId,
        chat: message.trim(),
        chatRef: chatRef
      });
      try {
        const trimmedMessage = message.trim();
        setMessage(''); // Clear input immediately for better UX

        // Send the message
        const response = await dispatch(sendMessage({
          userRef: userId,
          chat: trimmedMessage,
          chatRef: chatRef
        }));

        if (sendMessage.fulfilled.match(response)) {
          await dispatch(getMessages(userId));
          dispatch(getChatHeads());
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderMessages = () => {
    if (initialLoad && chatLoading) {
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

  // Update the filtering logic to handle different tabs
  const filteredUsers = useMemo(() => {
    let users = [];
    
    switch(activeTab) {
      case 'active':
        users = chatHeads;
        break;
      case 'patients':
        users = patients.map(patient => ({
          userRef: patient.userRef,
          username: `${patient.firstname} ${patient.lastname}`,
          userPicture: patient.picture,
          userRole: 'Patient'
        }));
        break;
      case 'providers':
        const providersList = providers?.getRecord || providers || [];
        users = providersList.map(provider => ({
          userRef: provider.userRef || provider.id,
          username: `${provider.firstname || ''} ${provider.lastname || ''}`.trim() || 'Unknown Provider',
          userRole: provider.role || provider.userType,
          userPicture: provider.profilePicture || provider.picture
        }));
        break;
      default:
        users = [];
    }

    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.userRole.toLowerCase().includes(query)
    );
  }, [searchQuery, activeTab, chatHeads, patients, providers]);

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
            placeholder="Search chats"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            bordered={false}
          />
          <div className="filter-buttons">
            <Segmented
              value={activeTab}
              onChange={handleTabChange}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Patients', value: 'patients' },
                { label: 'Providers', value: 'providers' }
              ]}
              block
            />
          </div>
        </div>

        <div className="users-list">
          {isLoading ? (
            <div className="loading-state">Loading {activeTab === 'active' ? 'chats' : activeTab === 'patients' ? 'patients' : 'providers'}...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.userRef}
                className={`user-item ${selectedUser?.userRef === user.userRef ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  <Avatar 
                    size={40}
                    src={user.userPicture}
                    icon={!user.userPicture && <UserOutlined />}
                    style={{ 
                      backgroundColor: !user.userPicture ? '#00ADEF' : 'transparent',
                      color: !user.userPicture ? '#fff' : undefined
                    }}
                  >
                    {!user.userPicture && user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
                <div className="user-info">
                  <div className="user-name-container">
                    <span className="user-name">{user.username}</span>
                    {user.userRole && (
                      <small className="user-role">{user.userRole}</small>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No {activeTab === 'active' ? 'active chats' : activeTab === 'patients' ? 'patients' : 'providers'} found matching "{searchQuery}"
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
                  src={selectedUser.userPicture}
                  icon={!selectedUser.userPicture && <UserOutlined />}
                  style={{ 
                    backgroundColor: !selectedUser.userPicture ? '#00ADEF' : 'transparent',
                    color: !selectedUser.userPicture ? '#fff' : undefined
                  }}
                >
                  {!selectedUser.userPicture && selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <div className="selected-user-info">
                  <span className="user-name">{selectedUser.username}</span>
                  {selectedUser.userRole && (
                    <small className="text-muted">{selectedUser.userRole}</small>
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
             <img src={SendButton} alt="send" width={50} height={50} onClick={handleSendMessage}/>

                }
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>Select a chat to start messaging</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intercom;