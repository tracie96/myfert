import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar, Segmented } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
  getChatHeads
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../../DoctorDashboard/Intercoms/styles.css';
import SendButton from '../../../../assets/images/telegram.png';
import * as signalR from '@microsoft/signalr';

const PatientIntercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [initialLoad, setInitialLoad] = useState(true);
  const [signalRConnection, setSignalRConnection] = useState(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const providers = useSelector((state) => state.doctor.careGivers || []);
  const chatHeads = useSelector((state) => state.doctor.chatHeads || []);
  const isLoading = useSelector((state) => state.doctor.loading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatError = useSelector((state) => state.doctor.chatError);
  const authToken = useSelector((state) => state.authentication?.userAuth?.obj?.token);

  // Initialize SignalR connection
  useEffect(() => {
    if (authToken) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
          accessTokenFactory: () => authToken,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (user, message) => {
        if (selectedUser?.userRef === user) {
          dispatch(getMessages(user));
          dispatch(getChatHeads());
        }
      });

      connection.start()
        .then(() => {
          setSignalRConnection(connection);
          if (selectedUser && chatRef) {
            connection.invoke("JoinChat", chatRef);
          }
        })
        .catch(err => console.error('SignalR Connection Error:', err));

      return () => connection.stop();
    }
  }, [authToken, selectedUser, chatRef, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // useEffect(() => {
  //   // Initial fetch
  //   dispatch(getChatHeads());

  //   const interval = setInterval(() => {
  //     dispatch(getChatHeads());
  //   }, 2000); // 2 seconds

    // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [dispatch]);


  useEffect(() => {
    // Load chat heads first
    dispatch(getChatHeads());

    // Then load all providers for the new message option
    const loadProviders = async () => {
      try {
        const params = {
          page: 1,
          size: 100
        };
        
        const response = await dispatch(fetchCareGivers(params));
        if (!fetchCareGivers.fulfilled.match(response)) {
          console.error('Failed to fetch providers list:', response.error);
        }
      } catch (error) {
        console.error('Error fetching providers list:', error);
      }
    };

    loadProviders();
  }, [dispatch]);

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
      const trimmedMessage = message.trim();
      
      try {
        setMessage(''); // Clear input immediately for better UX

        // Send through SignalR if connected
        if (signalRConnection) {
          await signalRConnection.invoke("SendMessageToUser", userId, trimmedMessage, chatRef);
        }

        // Also send through API for persistence
        const response = await dispatch(sendMessage({
          userRef: userId,
          chat: trimmedMessage,
          chatRef: chatRef
        }));

        if (sendMessage.fulfilled.match(response)) {
          await dispatch(getMessages(userId));
          dispatch(getChatHeads());
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessage(trimmedMessage); // Restore message if failed
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderMessages = () => {
    if (initialLoad && !messages) {
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
      // Message is from current user if isUser is false (since we're the patient)
      const messagePosition = !msg.isUser ? 'sent' : 'received';
      
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

  // Filter providers based on search query
  const filteredProviders = useMemo(() => {
    let users = [];
    
    if (activeTab === 'active') {
      users = chatHeads;
    } else {
      // Show all providers
      const providersList = providers?.getRecord || providers || [];
      users = providersList.map(provider => ({
        userRef: provider.userRef || provider.id,
        username: `${provider.firstname || ''} ${provider.lastname || ''}`.trim() || 'Unknown Provider',
        userRole: provider.role || provider.userType,
        userPicture: provider.profilePicture || provider.picture
      }));
    }

    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.userRole.toLowerCase().includes(query)
    );
  }, [searchQuery, activeTab, chatHeads, providers]);

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
            placeholder="Search Providers"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            bordered={false}
          />
        </div>

        <div className="filter-buttons">
          <Segmented
            value={activeTab}
            onChange={setActiveTab}
            options={[
              {
                label: 'Active ',
                value: 'active'
              },
              {
                label: 'Providers',
                value: 'providers'
              }
            ]}
            block
          />
        </div>

        <div className="users-list">
          {isLoading ? (
            <div className="loading-state">Loading providers...</div>
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <div
                key={provider.userRef}
                className={`user-item ${selectedUser?.userRef === provider.userRef ? 'selected' : ''}`}
                onClick={() => handleUserSelect(provider)}
              >
                <div className="user-avatar">
                  <Avatar 
                    size={40}
                    src={provider.userPicture}
                    icon={!provider.userPicture && <UserOutlined />}
                    style={{ 
                      backgroundColor: !provider.userPicture ? '#00ADEF' : 'transparent',
                      color: !provider.userPicture ? '#fff' : undefined
                    }}
                  >
                    {!provider.userPicture && provider.username.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
                <div className="user-info">
                  <div className="user-name-container">
                    <span className="user-name">{provider.username}</span>
                    {provider.userRole && (
                      <small className="user-role">{provider.userRole}</small>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No providers found matching "{searchQuery}"
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
                  // <button 
                  //   onClick={handleSendMessage}
                  //   disabled={!message.trim() || chatLoading}
                  //   style={{border: 'none', background: '#fff', borderRadius: '50%'}}
                  // >
                   <img src={SendButton} alt="send" width={50} height={50} onClick={handleSendMessage}/>
                  // </button>
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

export default PatientIntercom;