import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar, Segmented } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  patientList as fetchPatientList, 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
  getChatHeads,
  markMessagesAsRead,
  getUnreadMessageCount,
  markChatAsReadOptimistically
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './styles.css';
import SendButton from '../../../../assets/images/telegram.png';
import * as signalR from '@microsoft/signalr';

const Intercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const [signalRConnection, setSignalRConnection] = useState(null);
  const [autoReadStatus, setAutoReadStatus] = useState('');
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const patients = useSelector((state) => state.doctor.patientList || []);
  const providers = useSelector((state) => state.doctor.careGivers || []);
  const chatHeads = useSelector((state) => state.doctor.chatHeads || []);
  const isLoading = useSelector((state) => state.doctor.chatHeadsLoading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatError = useSelector((state) => state.doctor.chatError);
  const authToken = useSelector((state) => state.authentication?.userAuth?.obj?.token);

  // Initialize SignalR connection
  useEffect(() => {
    if (authToken) {
      console.log('Setting up SignalR connection');
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
          accessTokenFactory: () => authToken,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) 
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.onclose((error) => {
        console.log('SignalR connection closed', error);
      });

      connection.onreconnecting((error) => {
        console.log('SignalR reconnecting', error);
      });

      connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected', connectionId);
        if (selectedUser && chatRef) {
          connection.invoke("JoinChat", chatRef)
            .catch(err => console.error('Error rejoining chat:', err));
        }
      });

      connection.on("ReceiveMessage", async (user, message) => {
        console.log('SignalR: Received message from user:', user);
        
        if (selectedUser?.userRef === user) {
          // If user is actively viewing this chat, automatically mark messages as read
          try {
            setAutoReadStatus('Marking as read...');
            await dispatch(markMessagesAsRead(user));
            // Refresh unread count after marking as read
            await dispatch(getUnreadMessageCount());
            setAutoReadStatus('Marked as read');
            // Clear status after 2 seconds
            setTimeout(() => setAutoReadStatus(''), 2000);
          } catch (error) {
            console.error('Error auto-marking messages as read:', error);
            setAutoReadStatus('Error marking as read');
            setTimeout(() => setAutoReadStatus(''), 3000);
          }
          // Refresh messages for the current chat
          dispatch(getMessages(user));
        } else {
          // If message is from a different user, refresh unread count
          dispatch(getUnreadMessageCount());
        }
        
        // Always refresh chat heads when receiving a message to show new message indicators
        console.log('SignalR: Refreshing chat heads after receiving message');
        dispatch(getChatHeads()).then(() => {
          console.log('SignalR: Chat heads refreshed successfully');
        }).catch(error => {
          console.error('SignalR: Error refreshing chat heads:', error);
        });
      });

      connection.start()
        .then(() => {
          console.log('SignalR connection started successfully');
          setSignalRConnection(connection);
          // Refresh chat heads when connection is established
          dispatch(getChatHeads()).then(() => {
            console.log('SignalR: Initial chat heads refresh completed');
          });
          if (selectedUser && chatRef) {
            connection.invoke("JoinChat", chatRef)
              .then(() => {
                console.log('Joined chat:', chatRef);
                dispatch(getMessages(selectedUser.userRef || selectedUser.id));
              })
              .catch(err => console.error('Error joining chat:', err));
          }
        })
        .catch(err => {
          console.error('SignalR Connection Error:', err);
          // Try to fall back to long polling if WebSocket fails
          const longPollingConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
              accessTokenFactory: () => authToken,
              transport: signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();
          
          return longPollingConnection.start()
            .then(() => {
              console.log('SignalR fallback to long polling successful');
              setSignalRConnection(longPollingConnection);
            })
            .catch(err => console.error('SignalR long polling fallback failed:', err));
        });

      return () => {
        console.log('Cleaning up SignalR connection');
        connection.stop()
          .catch(err => console.error('Error stopping SignalR connection:', err));
      };
    }
  }, [authToken, selectedUser, chatRef, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          await dispatch(fetchPatientList(params));
        } else if (activeTab === 'providers') {
          await dispatch(fetchCareGivers(params));
        }
      } catch (error) {
        console.error('Error fetching users list:', error);
      }
    };

    if (activeTab !== 'active') {
      loadUsers();
    }

    // Set up polling interval for chat heads to ensure they stay updated
    const chatHeadsInterval = setInterval(() => {
      dispatch(getChatHeads());
    }, 15000); // Increased to 15 seconds to reduce frequency

    // Cleanup interval on unmount
    return () => clearInterval(chatHeadsInterval);
  }, [dispatch, activeTab]);

  // Filter users based on search query and active tab - optimized to reduce re-renders
  const filteredUsers = useMemo(() => {
    let users = [];
    
    switch(activeTab) {
      case 'active':
        users = chatHeads || [];
        break;
      case 'patients':
        users = (patients || []).map(patient => ({
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
      (user.userRole && user.userRole.toLowerCase().includes(query))
    );
  }, [searchQuery, activeTab, chatHeads, patients, providers]); // Include full arrays to satisfy React Hook rules

  // Modified handleSendMessage to use SignalR
  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.log('Message is empty, not sending');
      return;
    }

    if (!selectedUser) {
      console.error('No user selected');
      return;
    }

    const userId = selectedUser.userRef || selectedUser.id;
    const trimmedMessage = message.trim();

    try {
      // Clear input immediately for better UX
      setMessage('');

      // Send through API first
      const response = await dispatch(sendMessage({
        userRef: userId,
        chat: trimmedMessage,
        chatRef: chatRef
      })).unwrap();

      console.log('Send message response:', response);

      // Immediately update messages to show the sent message
      // Don't set initialLoad here since we're just updating
      await dispatch(getMessages(userId));
      dispatch(getChatHeads());

      // Try SignalR if available
      if (signalRConnection?.connectionStarted) {
        try {
          await signalRConnection.invoke("SendMessageToUser", userId, trimmedMessage, chatRef);
          console.log('Message sent via SignalR successfully');
        } catch (signalRError) {
          console.error('SignalR send error:', signalRError);
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      // Restore the message if sending failed
      setMessage(trimmedMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter pressed, attempting to send message');
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

  const handleUserSelect = async (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    
    // Mark messages as read when user is selected (iMessage-like behavior)
    if (user?.userRef || user?.id) {
      const userId = user.userRef || user.id;
      
      // Immediately mark as read optimistically (iMessage-like instant feedback)
      console.log('iMessage-like: Immediately marking chat as read optimistically');
      dispatch(markChatAsReadOptimistically(userId));
      
      try {
        // Mark messages as read via API
        await dispatch(markMessagesAsRead(userId));
        
        // Refresh unread count and chat heads to ensure consistency
        await Promise.all([
          dispatch(getUnreadMessageCount()),
          dispatch(getChatHeads())
        ]);
        
        console.log('iMessage-like: Messages marked as read successfully');
      } catch (error) {
        console.error('Error marking messages as read:', error);
        // Even if API fails, we still want to refresh chat heads
        dispatch(getChatHeads());
      }
    }
    
    // Get messages for the selected user to establish chat reference
    try {
      const userId = user.userRef || user.id;
      console.log('Fetching messages for user:', userId);
      
      const response = await dispatch(getMessages(userId));
      if (getMessages.fulfilled.match(response)) {
        console.log('Messages fetched successfully:', response.payload);
      } else {
        console.error('Failed to fetch messages:', response.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Add effect to handle chat reference updates
  useEffect(() => {
    if (selectedUser && !chatRef) {
      console.log('No chat reference, fetching messages...');
      const userId = selectedUser.userRef || selectedUser.id;
      dispatch(getMessages(userId))
        .catch(error => console.error('Error fetching messages:', error));
    }
  }, [selectedUser, chatRef, dispatch]);

  // Combined auto-scroll effect to reduce re-renders
  useEffect(() => {
    if (messagesEndRef.current && messages && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Include full messages array to satisfy React Hook rules

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const renderMessages = () => {
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

    // Group messages by date
    const groupedMessages = [];
    let currentDate = null;

    sortedMessages.forEach((msg, index) => {
      const messageDate = new Date(msg.createdOn);
      const dateString = messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Add date header if it's a new date
      if (currentDate !== dateString) {
        currentDate = dateString;
        groupedMessages.push({
          type: 'date-header',
          date: dateString,
          key: `date-${index}`
        });
      }

      // Add message
      groupedMessages.push({
        type: 'message',
        message: msg,
        key: `msg-${index}`
      });
    });

    return groupedMessages.map((item) => {
      if (item.type === 'date-header') {
        return (
          <div key={item.key} className="date-header">
            <span className="date-text">{item.date}</span>
          </div>
        );
      }

      const msg = item.message;
      // Message is from current user if isUser is true (since we're the doctor)
      const messagePosition = msg.isUser ? 'sent' : 'received';
      
      return (
        <div 
          key={item.key} 
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
          {filteredUsers.length > 0 ? (
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
                  {user.newMessage === true && <div className="new-message-indicator" />}
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
              {isLoading ? `Loading ${activeTab === 'active' ? 'chats' : activeTab === 'patients' ? 'patients' : 'providers'}...` : `No ${activeTab === 'active' ? 'active chats' : activeTab === 'patients' ? 'patients' : 'providers'} found matching "${searchQuery}"`}
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
                  {autoReadStatus && (
                    <small style={{ 
                      color: autoReadStatus.includes('Error') ? '#ff4d4f' : '#52c41a',
                      fontSize: '11px',
                      marginTop: '2px'
                    }}>
                      {autoReadStatus}
                    </small>
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
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Send button clicked');
                      handleSendMessage();
                    }}
                    style={{ 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px'
                    }}
                  >
                    <img 
                      src={SendButton} 
                      alt="send" 
                      width={40} 
                      height={40} 
                      style={{
                        objectFit: 'contain'
                      }}
                    />
                  </div>
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